import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { FireButton } from '../components/FireButton';

const VOTES = [
  { status: 'OPEN',    title: '2026 Annual Summit · Host city',           desc: 'Three finalists. Members vote until June 1.', n: '1,847 votes', color: 'var(--maroon)' },
  { status: 'OPEN',    title: 'New rank between Iron and Gold?',           desc: 'Proposal from the Council. 30-day vote.',     n: '623 votes',   color: 'var(--maroon)' },
  { status: 'CLOSED',  title: 'Allow co-hosted events on Ember',           desc: 'Passed 81% / 19%. Ships in v2.4.',           n: '2,104 votes', color: '#6B7280' },
  { status: 'CLOSED',  title: '€89 → €99 annual price for new members',    desc: 'Rejected 67% / 33%. Pricing held.',           n: '1,956 votes', color: '#6B7280' },
];

export function Council() {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: '140px', paddingBottom: '60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.20) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>The Council</motion.p>
          <span className="maroon-rule" />
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff', lineHeight: 1.06, marginBottom: '24px' }}
          >
            Your membership<br />
            <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>shapes Ember.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: '#A0A0A0', fontSize: '18px', lineHeight: '1.7', maxWidth: '640px' }}
          >
            The Council is how the brotherhood votes on platform direction.
            New features. Event formats. Pricing. Annual Summit location.
            One member, one vote. Every voice counts the same.
          </motion.p>
        </div>
      </section>

      <section style={{ padding: '40px 0 60px' }}>
        <div className="page-container">
          <p className="mono" style={{ color: '#5A5A5A', marginBottom: '20px' }}>Active votes</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {VOTES.map(({ status, title, desc, n, color }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="card-glow"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '24px', alignItems: 'center' }}
              >
                <span className="mono" style={{
                  background: `${color}22`, color, padding: '4px 10px', borderRadius: '6px',
                  fontSize: '10px', border: `1px solid ${color}55`,
                }}>{status}</span>
                <div>
                  <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '17px', color: '#fff', marginBottom: '4px' }}>{title}</p>
                  <p style={{ color: '#A0A0A0', fontSize: '13px' }}>{desc}</p>
                </div>
                <p className="mono" style={{ color: '#5A5A5A' }}>{n}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 0 100px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="page-container" style={{ maxWidth: '720px' }}>
          <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>How voting works</p>
          <span className="maroon-rule" />
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '36px', color: '#fff', marginBottom: '32px' }}>One member. One vote.</h2>
          {[
            { n: '01', t: 'Proposals come from anywhere',  b: 'Vault members, the Ember team, or the Council itself can put a question forward.' },
            { n: '02', t: '30-day window',                  b: 'Every vote runs for 30 days. Open and transparent. Real-time tally visible to all members.' },
            { n: '03', t: 'Result is binding',              b: 'If it passes, it ships. If it fails, it stays the way it was. The brotherhood decides.' },
          ].map(({ n, t, b }) => (
            <div key={n} style={{ paddingBottom: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
                <p className="mono" style={{ color: 'var(--maroon)' }}>{n}</p>
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: 'var(--beige)', marginBottom: '8px' }}>{t}</h3>
                  <p style={{ color: '#A0A0A0', fontSize: '15px', lineHeight: '1.7' }}>{b}</p>
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <FireButton variant="primary" size="lg" onClick={() => navigate('/vault')}>
              Get a vote · Join the Vault
            </FireButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
