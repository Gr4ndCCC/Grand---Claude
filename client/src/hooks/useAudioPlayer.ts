import { useRef, useCallback } from 'react';

/**
 * Manages audio playback for Ora's TTS output.
 *
 * Protocol: the server sends binary WebSocket frames where the first byte
 * is 0x01 (audio marker) and the remaining bytes are MP3 data.  Callers
 * push chunks via addChunk(), then call play() when the server signals
 * audio_end (response_end).  stop() cancels playback immediately — used
 * for interruptions.
 */
export function useAudioPlayer() {
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const chunksRef = useRef<Uint8Array[]>([]);
  const isPlayingRef = useRef(false);
  const outputAnalyserRef = useRef<AnalyserNode | null>(null);

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume().catch(() => undefined);
    }
    return ctxRef.current;
  }, []);

  const addChunk = useCallback((chunk: Uint8Array) => {
    chunksRef.current.push(chunk);
  }, []);

  const stop = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.onended = null;
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      } catch {
        // Already stopped
      }
      sourceRef.current = null;
    }
    chunksRef.current = [];
    isPlayingRef.current = false;
  }, []);

  const play = useCallback(
    async (onEnd?: () => void): Promise<void> => {
      const chunks = chunksRef.current;
      if (chunks.length === 0) {
        onEnd?.();
        return;
      }
      chunksRef.current = [];

      const ctx = getCtx();

      // Concatenate all MP3 chunks into a single ArrayBuffer
      const totalLen = chunks.reduce((s, c) => s + c.length, 0);
      const merged = new Uint8Array(totalLen);
      let offset = 0;
      for (const c of chunks) {
        merged.set(c, offset);
        offset += c.length;
      }

      try {
        // Copy before decode — decodeAudioData detaches the buffer
        const decoded = await ctx.decodeAudioData(merged.buffer.slice(0));

        // Stop anything currently playing before we start the new clip
        stop();

        const source = ctx.createBufferSource();
        source.buffer = decoded;

        // Route through an analyser so the waveform visualizer can show
        // Ora's voice when she's speaking
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        outputAnalyserRef.current = analyser;

        source.connect(analyser);
        analyser.connect(ctx.destination);

        isPlayingRef.current = true;
        sourceRef.current = source;

        source.onended = () => {
          isPlayingRef.current = false;
          sourceRef.current = null;
          outputAnalyserRef.current = null;
          onEnd?.();
        };

        source.start();
      } catch (err) {
        console.error('[AudioPlayer] decode error:', err);
        onEnd?.();
      }
    },
    [getCtx, stop],
  );

  const isPlaying = () => isPlayingRef.current;
  const getOutputAnalyser = () => outputAnalyserRef.current;

  return { addChunk, play, stop, isPlaying, getOutputAnalyser };
}
