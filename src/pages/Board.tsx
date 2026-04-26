import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { FireButton } from '../components/FireButton';

const TIERS = [
  { tier: 'Ember',  color: '#800000', sub: 'The starting line.',
    req: ['Join the Vault', 'Host your first event', 'Get one rating'],
    body: "Where every host begins. The fire is lit. The reputation is yours to build." },
  { tier: 'Iron',   color: '#6B7280', sub: 'Reliable. Repeatable.',
    req: ['5+ events hosted', '4.5★ average rating', 'No event cancelled'],
    body: "Iron means the brotherhood can count on you. Hosts here run consistent events." },
  { tier: 'Gold',   color: '#B8860B', sub: 'Sought after.',
    req: ['20+ events hosted', '4.8★ average rating', 'Vault contributor', 'Mentor an Ember'],
    body: "Gold hosts attract a regional crowd. Their events fill in hours, not days." },
  { tier: 'Legend', color: '#DAA520', sub: 'Top 1% globally.',
    req: ['By invitation', 'Sustained excellence', 'Annual Summit speaker', 'Council eligible'],
    body: "Legend is earned across years, not events. Your name carries weight in 40 countries." },
];

export function Board() {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: '140px', paddingBottom: '60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.20) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>The Board</motion.p>
          <span className="maroon-rule" />
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff', lineHeight: 1.06, marginBottom: '24px' }}
          >
            Rank earned.<br />
            <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>Not bought.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: '#A0A0A0', fontSize: '18px', lineHeight: '1.7', maxWidth: '640px' }}
          >
            The Board is Ember's host certification system. Four tiers — each
            earned through real events, real ratings, real craft. No shortcuts,
            no gamification, no buying your way up. Your rank means something
            because it can't be faked.
          </motion.p>
        </div>
      </section>

      <section style={{ padding: '40px 0 100px' }}>
        <div className="page-container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {TIERS.map(({ tier, color, sub, req, body }, i) => (
              <motion.div key={tier}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.08 }}
                className="card-glow"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '32px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '32px', alignItems: 'center' }}
              >
                <div style={{ width: '64px', height: '64px', borderRadius: '14px', background: `${color}22`, border: `1px solid ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: color, boxShadow: `0 0 20px ${color}88` }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '28px', color: '#fff', marginBottom: '4px' }}>{tier}</p>
                  <p style={{ color: 'var(--beige)', fontStyle: 'italic', fontSize: '15px', marginBottom: '12px' }}>{sub}</p>
                  <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: '1.7', maxWidth: '520px' }}>{body}</p>
                </div>
                <div style={{ minWidth: '200px' }}>
                  <p className="mono" style={{ color: '#5A5A5A', marginBottom: '10px' }}>Requirements</p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {req.map(r => (
                      <li key={r} style={{ color: '#A0A0A0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '4px', height: '4px', background: color, borderRadius: '50%' }} /> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ marginTop: '60px', textAlign: 'center' }}>
            <FireButton variant="primary" size="lg" onClick={() => navigate('/hosts')}>
              Start hosting · Earn your rank
            </FireButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
