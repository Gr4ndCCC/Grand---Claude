import { useEffect, useRef } from 'react';
import type { TranscriptEntry } from '../types';

interface Props {
  entries: TranscriptEntry[];
}

export default function TranscriptPanel({ entries }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest entry
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="transcript-panel transcript-empty">
        <span>Transcript will appear here…</span>
      </div>
    );
  }

  return (
    <div className="transcript-panel">
      {entries
        .filter(e => e.text.trim())
        .map(entry => (
          <div
            key={entry.id}
            className={`transcript-entry transcript-${entry.role} ${!entry.final ? 'transcript-interim' : ''}`}
          >
            <span className="transcript-label">
              {entry.role === 'user' ? 'You' : 'Ora'}
            </span>
            <p className="transcript-text">{entry.text}</p>
          </div>
        ))}
      <div ref={bottomRef} />
    </div>
  );
}
