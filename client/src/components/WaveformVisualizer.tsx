import { useRef, useEffect } from 'react';
import type { SessionStatus } from '../types';

interface Props {
  analyserNode: AnalyserNode | null;
  status: SessionStatus;
  isOraPlaying: boolean;
}

const INACTIVE_COLOR = '#1e1e2e';
const MIC_COLOR_START = '#6366f1';
const MIC_COLOR_END = '#a78bfa';
const ORA_COLOR_START = '#ec4899';
const ORA_COLOR_END = '#f472b6';

export default function WaveformVisualizer({ analyserNode, status, isOraPlaying }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);

      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = '#0d0d1a';
      ctx.fillRect(0, 0, W, H);

      const isActive = status === 'listening' || status === 'responding';

      if (!analyserNode || !isActive) {
        // Flat idle line
        ctx.beginPath();
        ctx.strokeStyle = INACTIVE_COLOR;
        ctx.lineWidth = 2;
        ctx.moveTo(0, H / 2);
        ctx.lineTo(W, H / 2);
        ctx.stroke();
        return;
      }

      const bufLen = analyserNode.frequencyBinCount;
      const data = new Uint8Array(bufLen);
      analyserNode.getByteTimeDomainData(data);

      // Choose colours based on who is "speaking"
      const colorStart = isOraPlaying ? ORA_COLOR_START : MIC_COLOR_START;
      const colorEnd = isOraPlaying ? ORA_COLOR_END : MIC_COLOR_END;

      const gradient = ctx.createLinearGradient(0, 0, W, 0);
      gradient.addColorStop(0, colorStart);
      gradient.addColorStop(0.5, colorEnd);
      gradient.addColorStop(1, colorStart);

      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';

      const sliceW = W / bufLen;

      for (let i = 0; i < bufLen; i++) {
        // Normalise to -1 … +1, then map to canvas y
        const v = (data[i] - 128) / 128;
        const y = H / 2 + v * (H / 2) * 0.85;
        const x = i * sliceW;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();

      // Subtle glow under the line
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = colorEnd;
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.restore();
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyserNode, status, isOraPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={96}
      style={{ width: '100%', height: '96px', borderRadius: '12px' }}
    />
  );
}
