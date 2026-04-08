import type { SessionStatus } from '../types';

interface Props {
  status: SessionStatus;
  isMuted: boolean;
  isOraPlaying: boolean;
  onStart: () => void;
  onEnd: () => void;
  onToggleMute: () => void;
}

const MicIcon = ({ muted }: { muted: boolean }) =>
  muted ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );

const StatusDot = ({ status, isOraPlaying }: { status: SessionStatus; isOraPlaying: boolean }) => {
  let cls = 'status-dot';
  if (status === 'listening') cls += isOraPlaying ? ' status-dot--ora' : ' status-dot--listening';
  if (status === 'responding') cls += ' status-dot--responding';
  if (status === 'connecting') cls += ' status-dot--connecting';
  if (status === 'error') cls += ' status-dot--error';
  return <span className={cls} />;
};

function statusLabel(status: SessionStatus, isOraPlaying: boolean, isMuted: boolean): string {
  if (status === 'idle') return 'Ready';
  if (status === 'connecting') return 'Connecting…';
  if (status === 'error') return 'Error — check console';
  if (isMuted) return 'Muted';
  if (isOraPlaying) return 'Ora is speaking';
  if (status === 'responding') return 'Thinking…';
  return 'Listening…';
}

export default function Controls({ status, isMuted, isOraPlaying, onStart, onEnd, onToggleMute }: Props) {
  const isActive = status === 'listening' || status === 'responding';
  const isConnecting = status === 'connecting';

  return (
    <div className="controls">
      <div className="controls-status">
        <StatusDot status={status} isOraPlaying={isOraPlaying} />
        <span className="controls-status-label">
          {statusLabel(status, isOraPlaying, isMuted)}
        </span>
      </div>

      <div className="controls-buttons">
        {isActive && (
          <button
            className={`btn btn-mute ${isMuted ? 'btn-mute--active' : ''}`}
            onClick={onToggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            <MicIcon muted={isMuted} />
          </button>
        )}

        {!isActive ? (
          <button
            className="btn btn-start"
            onClick={onStart}
            disabled={isConnecting}
            aria-label="Start session"
          >
            {isConnecting ? 'Connecting…' : 'Start Session'}
          </button>
        ) : (
          <button className="btn btn-end" onClick={onEnd} aria-label="End session">
            End Session
          </button>
        )}
      </div>
    </div>
  );
}
