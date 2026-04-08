import { WebSocket, type RawData } from 'ws';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are Ora, a real-time AI assistant on a live call. You are helpful, concise, and conversational. Keep responses short — 1 to 3 sentences unless asked to elaborate. You can see the user's screen when they share it. If you see a screen, briefly acknowledge what you're looking at before helping. Never start with 'Certainly' or 'Sure'. Sound like a smart colleague, not a chatbot.`;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

type JsonMsg = { type: string; data?: string };

export function handleSession(clientWs: WebSocket): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dgConn: any = null;
  let dgReady = false;
  let pendingFrame: string | null = null;
  let responding = false;
  let abortCtrl: AbortController | null = null;
  const history: Anthropic.MessageParam[] = [];

  // ── helpers ────────────────────────────────────────────────────────────────

  const sendJson = (payload: Record<string, unknown>) => {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify(payload));
    }
  };

  /** Audio chunks are prefixed with 0x01 so the client can distinguish them
   *  from JSON text frames. */
  const sendAudio = (chunk: Buffer) => {
    if (clientWs.readyState !== WebSocket.OPEN) return;
    const msg = Buffer.allocUnsafe(1 + chunk.length);
    msg[0] = 0x01;
    chunk.copy(msg, 1);
    clientWs.send(msg);
  };

  // ── Deepgram ───────────────────────────────────────────────────────────────

  const initDeepgram = () => {
    const dg = createClient(process.env.DEEPGRAM_API_KEY!);
    dgConn = dg.listen.live({
      model: 'nova-2',
      language: 'en-US',
      smart_format: true,
      interim_results: true,
      endpointing: 300,
      utterance_end_ms: 1000,
    });

    dgConn.on(LiveTranscriptionEvents.Open, () => {
      dgReady = true;
      console.log('[DG] Connected');
      sendJson({ type: 'ready' });
    });

    dgConn.on(LiveTranscriptionEvents.Transcript, (data: any) => {
      const alt = data?.channel?.alternatives?.[0];
      if (!alt?.transcript) return;

      const transcript: string = alt.transcript;
      const isFinal: boolean = data.is_final;

      sendJson({ type: 'transcript', text: transcript, is_final: isFinal });

      if (isFinal && transcript.trim()) {
        onFinalTranscript(transcript.trim()).catch(console.error);
      }
    });

    dgConn.on(LiveTranscriptionEvents.Error, (err: unknown) => {
      console.error('[DG] Error:', err);
      sendJson({ type: 'error', message: 'Speech recognition error — check DEEPGRAM_API_KEY.' });
    });

    dgConn.on(LiveTranscriptionEvents.Close, () => {
      dgReady = false;
      console.log('[DG] Disconnected');
    });
  };

  // ── Response pipeline ──────────────────────────────────────────────────────

  const onFinalTranscript = async (transcript: string) => {
    // Interrupt any in-progress response
    if (responding && abortCtrl) {
      abortCtrl.abort();
      // Short yield so async cleanup can run
      await new Promise(r => setTimeout(r, 30));
    }

    responding = true;
    const ctrl = new AbortController();
    abortCtrl = ctrl;
    const { signal } = ctrl;

    try {
      // Build user message (optionally with screen frame)
      const content: Anthropic.ContentBlockParam[] = [];

      if (pendingFrame) {
        content.push({
          type: 'image',
          source: { type: 'base64', media_type: 'image/jpeg', data: pendingFrame },
        });
        pendingFrame = null;
      }

      content.push({ type: 'text', text: transcript });
      history.push({ role: 'user', content });

      sendJson({ type: 'response_start' });

      let fullText = '';

      // ── ElevenLabs WebSocket (streaming TTS input) ───────────────────────
      const elVoiceId = process.env.ELEVENLABS_VOICE_ID!;
      const elApiKey = process.env.ELEVENLABS_API_KEY!;
      const elUrl =
        `wss://api.elevenlabs.io/v1/text-to-speech/${elVoiceId}/stream-input` +
        `?model_id=eleven_turbo_v2&output_format=mp3_44100_128&optimize_streaming_latency=3`;

      let elWsReady = false;
      let claudeDone = false;
      let elEndSent = false;
      const textQueue: string[] = [];
      let elResolve!: () => void;
      const elDonePromise = new Promise<void>(res => { elResolve = res; });

      const elWs = new WebSocket(elUrl, { headers: { 'xi-api-key': elApiKey } });

      const flushTextQueue = () => {
        while (textQueue.length > 0) {
          elWs.send(JSON.stringify({ text: textQueue.shift()! }));
        }
      };

      const sendElEOS = () => {
        if (elEndSent || !elWsReady) return;
        elEndSent = true;
        flushTextQueue();
        elWs.send(JSON.stringify({ text: '' }));
      };

      elWs.on('open', () => {
        elWsReady = true;
        // BOS with voice settings
        elWs.send(JSON.stringify({
          text: ' ',
          voice_settings: { stability: 0.5, similarity_boost: 0.75, use_speaker_boost: true },
        }));
        flushTextQueue();
        if (claudeDone) sendElEOS();
      });

      elWs.on('message', (raw: RawData) => {
        if (signal.aborted) { elWs.terminate(); elResolve(); return; }
        try {
          const msg = JSON.parse(raw.toString());
          if (msg.audio) sendAudio(Buffer.from(msg.audio, 'base64'));
          if (msg.isFinal) { elResolve(); elWs.close(); }
        } catch {
          // ignore malformed frames
        }
      });

      elWs.on('error', (err) => {
        console.error('[EL] WebSocket error:', err);
        elResolve(); // don't block the pipeline on TTS failure
      });

      elWs.on('close', () => elResolve());

      // ── Claude streaming ────────────────────────────────────────────────
      const claudeStream = anthropic.messages.stream({
        model: process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-6',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: history,
      });

      for await (const event of claudeStream) {
        if (signal.aborted) break;

        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          const text = event.delta.text;
          fullText += text;
          sendJson({ type: 'response_text', text });

          if (elWsReady) {
            elWs.send(JSON.stringify({ text }));
          } else {
            textQueue.push(text);
          }
        }
      }

      // Signal end-of-stream to ElevenLabs
      if (signal.aborted) {
        elWs.terminate();
        elResolve();
      } else {
        claudeDone = true;
        sendElEOS(); // no-op if elWs isn't open yet — open handler will fire it
      }

      await elDonePromise;

      if (fullText) {
        history.push({ role: 'assistant', content: [{ type: 'text', text: fullText }] });
      }
    } catch (err: unknown) {
      if (!ctrl.signal.aborted) {
        console.error('[Session]', err);
        sendJson({ type: 'error', message: 'Response pipeline failed.' });
      }
    } finally {
      responding = false;
      if (abortCtrl === ctrl) abortCtrl = null;
      sendJson({ type: 'response_end' });
    }
  };

  // ── Incoming client messages ───────────────────────────────────────────────

  clientWs.on('message', (data: RawData, isBinary: boolean) => {
    if (isBinary) {
      // Raw mic audio → Deepgram
      if (dgReady && dgConn) dgConn.send(data);
      return;
    }

    try {
      const msg = JSON.parse(data.toString()) as JsonMsg;

      switch (msg.type) {
        case 'start_session':
          initDeepgram();
          break;

        case 'screen_frame':
          if (msg.data) pendingFrame = msg.data;
          break;

        case 'interrupt':
          if (responding && abortCtrl) abortCtrl.abort();
          break;

        case 'end_session':
          try { dgConn?.finish(); } catch { /* no-op */ }
          break;
      }
    } catch (e) {
      console.error('[WS] Invalid message:', e);
    }
  });

  clientWs.on('close', () => {
    console.log('[WS] Client disconnected');
    try { dgConn?.finish(); } catch { /* no-op */ }
    abortCtrl?.abort();
  });
}
