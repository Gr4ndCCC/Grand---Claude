import { useOraSession } from './hooks/useOraSession';
import WaveformVisualizer from './components/WaveformVisualizer';
import TranscriptPanel from './components/TranscriptPanel';
import Controls from './components/Controls';

export default function App() {
  const {
    status,
    transcript,
    isMuted,
    isOraPlaying,
    micAnalyser,
    startSession,
    endSession,
    toggleMute,
  } = useOraSession();

  const isActive = status === 'listening' || status === 'responding';

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-orb" aria-hidden="true" />
          <h1 className="logo-name">Ora</h1>
        </div>
        <p className="logo-tagline">Real-time AI voice assistant</p>
      </header>

      {/* Main */}
      <main className="main">
        {/* Visualizer card */}
        <section className={`card visualizer-card ${isActive ? 'card--active' : ''} ${isOraPlaying ? 'card--ora-speaking' : ''}`}>
          <WaveformVisualizer
            analyserNode={micAnalyser}
            status={status}
            isOraPlaying={isOraPlaying}
          />
        </section>

        {/* Controls */}
        <Controls
          status={status}
          isMuted={isMuted}
          isOraPlaying={isOraPlaying}
          onStart={startSession}
          onEnd={endSession}
          onToggleMute={toggleMute}
        />

        {/* Transcript */}
        <section className="card transcript-card">
          <TranscriptPanel entries={transcript} />
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <span>Powered by Deepgram · Claude · ElevenLabs</span>
      </footer>
    </div>
  );
}
