import { useState, useRef, useCallback, useEffect } from 'react';
import type { SessionStatus, TranscriptEntry, ServerMessage, OraError } from '../types';
import { useAudioPlayer } from './useAudioPlayer';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://127.0.0.1:3001';

// Silence threshold for interruption detection (0–1 RMS)
const INTERRUPT_THRESHOLD = 0.06;
// Consecutive frames above threshold before we call it speech
const INTERRUPT_FRAMES = 4;

export function useOraSession() {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [error, setError] = useState<OraError | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isOraPlaying, setIsOraPlaying] = useState(false);
  const [micAnalyser, setMicAnalyser] = useState<AnalyserNode | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const captureIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const interruptCountRef = useRef(0);

  const player = useAudioPlayer();

  // ── helpers ────────────────────────────────────────────────────────────────

  const sendJson = useCallback((payload: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  const appendTranscript = useCallback((entry: TranscriptEntry) => {
    setTranscript(prev => {
      if (!entry.final && entry.role === 'user') {
        // Replace existing interim entry
        const without = prev.filter(e => !(e.role === 'user' && !e.final));
        return [...without, entry];
      }
      if (entry.final && entry.role === 'user') {
        // Remove interim, add final
        const without = prev.filter(e => !(e.role === 'user' && !e.final));
        return [...without, entry];
      }
      if (entry.role === 'assistant' && !entry.final) {
        // Append text to last assistant entry if it's still streaming
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && !last.final) {
          return [
            ...prev.slice(0, -1),
            { ...last, text: last.text + entry.text },
          ];
        }
      }
      return [...prev, entry];
    });
  }, []);

  // ── screen capture ─────────────────────────────────────────────────────────

  const captureFrame = useCallback(() => {
    const video = screenVideoRef.current;
    const canvas = captureCanvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    const maxW = 1280;
    const w = Math.min(video.videoWidth, maxW);
    const h = Math.round((w * video.videoHeight) / video.videoWidth);

    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d')!.drawImage(video, 0, 0, w, h);

    const frame = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
    sendJson({ type: 'screen_frame', data: frame });
  }, [sendJson]);

  // ── session lifecycle ──────────────────────────────────────────────────────

  const startSession = useCallback(async () => {
    try {
      setError(null);
      setStatus('connecting');

      // Mic access
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
          channelCount: 1,
        },
      });
      micStreamRef.current = micStream;

      // AudioContext + analyser for waveform + interruption detection
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      micAnalyserRef.current = analyser;
      setMicAnalyser(analyser);

      const micSrc = ctx.createMediaStreamSource(micStream);
      micSrc.connect(analyser);
      // NOT connecting analyser → destination (no mic echo)

      // Optional screen share
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 5 },
          audio: false,
        });
        screenStreamRef.current = screenStream;

        const video = document.createElement('video');
        video.srcObject = screenStream;
        video.muted = true;
        video.play().catch(() => undefined);
        screenVideoRef.current = video;

        captureCanvasRef.current = document.createElement('canvas');
        captureIntervalRef.current = setInterval(captureFrame, 2000);

        screenStream.getVideoTracks()[0].addEventListener('ended', () => {
          if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
          screenStreamRef.current = null;
        });
      } catch {
        console.info('[Ora] Screen share declined — continuing without it.');
      }

      // WebSocket
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'start_session' }));
      };

      ws.onmessage = async (event: MessageEvent) => {
        // Binary frame → audio chunk (byte 0 = 0x01 marker)
        if (event.data instanceof Blob) {
          const buf = await event.data.arrayBuffer();
          const view = new Uint8Array(buf);
          if (view[0] === 0x01) {
            player.addChunk(view.slice(1));
          }
          return;
        }

        const msg = JSON.parse(event.data as string) as ServerMessage;

        switch (msg.type) {
          case 'ready':
            setStatus('listening');
            startRecorder(micStream, ws);
            break;

          case 'transcript':
            appendTranscript({
              id: msg.is_final ? `u-${Date.now()}` : 'u-interim',
              role: 'user',
              text: msg.text ?? '',
              final: msg.is_final ?? false,
            });
            break;

          case 'response_start':
            player.stop();
            setIsOraPlaying(false);
            // Remove any trailing interim entries and open a new assistant entry
            setTranscript(prev => {
              const clean = prev.filter(e => e.final || e.role !== 'user');
              return [
                ...clean,
                { id: `a-${Date.now()}`, role: 'assistant', text: '', final: false },
              ];
            });
            setStatus('responding');
            break;

          case 'response_text':
            appendTranscript({
              id: `a-streaming`,
              role: 'assistant',
              text: msg.text ?? '',
              final: false,
            });
            break;

          case 'response_end':
            // Mark last assistant entry as final
            setTranscript(prev => {
              if (!prev.length) return prev;
              const last = prev[prev.length - 1];
              if (last.role === 'assistant') {
                return [...prev.slice(0, -1), { ...last, final: true }];
              }
              return prev;
            });
            // Decode and play accumulated audio
            setIsOraPlaying(true);
            player.play(() => setIsOraPlaying(false));
            setStatus('listening');
            break;

          case 'interrupt':
            player.stop();
            setIsOraPlaying(false);
            setStatus('listening');
            break;

          case 'error':
            console.error('[Server error]', msg.message);
            setError({ kind: 'server', msg: msg.message ?? 'Unknown server error' });
            setStatus('error');
            break;
        }
      };

      ws.onclose = (ev) => {
        if (ev.code !== 1000 && status !== 'idle') {
          setError({ kind: 'ws_connect', msg: `WebSocket closed (code ${ev.code}). Is the server running?` });
          setStatus('error');
        } else {
          setStatus('idle');
        }
        setIsOraPlaying(false);
      };

      ws.onerror = () => {
        setError({ kind: 'ws_connect', msg: `Cannot connect to ws://127.0.0.1:3001 — make sure the server is running in Window 1.` });
        setStatus('error');
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Ora] startSession error:', err);
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('notallowed')) {
        setError({ kind: 'mic', msg: 'Microphone permission denied. Allow mic access and try again.' });
      } else {
        setError({ kind: 'unknown', msg });
      }
      setStatus('error');
    }
  }, [player, captureFrame, appendTranscript]);

  const endSession = useCallback(() => {
    sendJson({ type: 'end_session' });
    wsRef.current?.close();
    recorderRef.current?.stop();
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    screenStreamRef.current?.getTracks().forEach(t => t.stop());
    if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
    player.stop();
    audioCtxRef.current?.close().catch(() => undefined);

    // Reset refs
    wsRef.current = null;
    recorderRef.current = null;
    micStreamRef.current = null;
    screenStreamRef.current = null;
    audioCtxRef.current = null;
    micAnalyserRef.current = null;

    setStatus('idle');
    setIsOraPlaying(false);
    setMicAnalyser(null);
    setTranscript([]);
  }, [sendJson, player]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      const recorder = recorderRef.current;
      if (recorder) {
        if (next) {
          if (recorder.state === 'recording') recorder.pause();
        } else {
          if (recorder.state === 'paused') recorder.resume();
        }
      }
      // Also mute mic tracks so Deepgram gets silence
      micStreamRef.current?.getAudioTracks().forEach(t => {
        t.enabled = !next;
      });
      return next;
    });
  }, []);

  // ── MediaRecorder ──────────────────────────────────────────────────────────

  function startRecorder(stream: MediaStream, ws: WebSocket) {
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : '';

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
    recorderRef.current = recorder;

    recorder.ondataavailable = (e: BlobEvent) => {
      if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
        ws.send(e.data);
      }
    };

    recorder.start(100); // 100 ms chunks for low latency
  }

  // ── Interruption detection ─────────────────────────────────────────────────
  // If the user's mic RMS exceeds threshold while Ora is playing, fire interrupt

  useEffect(() => {
    if (status !== 'listening' && status !== 'responding') return;

    const analyser = micAnalyserRef.current;
    if (!analyser) return;

    const buf = new Uint8Array(analyser.frequencyBinCount);
    let rafId: number;

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      if (!player.isPlaying()) {
        interruptCountRef.current = 0;
        return;
      }

      analyser.getByteTimeDomainData(buf);

      // RMS of the time-domain signal
      let sum = 0;
      for (const v of buf) {
        const n = (v - 128) / 128;
        sum += n * n;
      }
      const rms = Math.sqrt(sum / buf.length);

      if (rms > INTERRUPT_THRESHOLD) {
        interruptCountRef.current += 1;
        if (interruptCountRef.current >= INTERRUPT_FRAMES) {
          interruptCountRef.current = 0;
          player.stop();
          setIsOraPlaying(false);
          sendJson({ type: 'interrupt' });
        }
      } else {
        interruptCountRef.current = 0;
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [status, player, sendJson]);

  return {
    status,
    error,
    transcript,
    isMuted,
    isOraPlaying,
    micAnalyser,
    startSession,
    endSession,
    toggleMute,
  };
}
