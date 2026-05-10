import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const TIERS = [
  { tier: 'Ember',  color: '#800000', sub: 'The starting line.',
    req: ['Join the Vault', 'Host your first event', 'Get one rating'],
    body: "Where every host begins. The fire is lit. The reputation is yours to build." },
  { tier: 'Iron',   color: '#6B7280', sub: 'Reliable. Repeatable.',
    req: ['5+ events hosted', '4.5★ average rating', 'No event cancelled'],
    body: "Iron means the brotherhood can count on you. Hosts here run consistent events." },
  { tier: 'Gold',   color: '#B8924A', sub: 'Sought after.',
    req: ['20+ events hosted', '4.8★ average rating', 'Vault contributor', 'Mentor an Ember'],
    body: "Gold hosts attract a regional crowd. Their events fill in hours, not days." },
  { tier: 'Legend', color: '#DAA520', sub: 'Top 1% globally.',
    req: ['By invitation', 'Sustained excellence', 'Annual Summit speaker', 'Council eligible'],
    body: "Legend is earned across years, not events. Your name carries weight in 40 countries." },
];

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.4, 0, 0.2, 1] }}
    >{children}</motion.div>
  );
}

export function Board() {
  const navigate = useNavigate();
  return (
    <div style={{ color: 'var(--bone-100)', minHeight: '100vh' }}>
      <Nav />

      <section className="v3-section" style={{ paddingTop: '140px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="section-label">§ The Board</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 80px)', color: 'var(--bone-100)', lineHeight: 1.05, marginBottom: '24px' }}
          >
            Rank earned.<br />
            <span className="accent-italic">Not bought.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: 'var(--bone-400)', fontSize: '18px', lineHeight: 1.7, maxWidth: '640px' }}
          >
            The Board is Ember's host certification system. Four tiers — each
            earned through real events, real ratings, real craft. No shortcuts,
            no gamification, no buying your way up. Your rank means something
            because it can't be faked.
          </motion.p>
        </div>
      </section>

      <section style={{ padding: '40px 0 120px' }}>
        <div className="page-container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {TIERS.map(({ tier, color, sub, req, body }, i) => (
              <FadeUp key={tier} delay={i * 0.08}>
                <div
                  className="rank-card-v3"
                  style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '32px', alignItems: 'center', minHeight: 'unset', padding: '32px' }}
                >
                  <div style={{ width: '64px', height: '64px', borderRadius: '14px', background: `${color}22`, border: `1px solid ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: color, boxShadow: `0 0 16px ${color}88` }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '30px', color: 'var(--bone-100)', marginBottom: '4px' }}>{tier}</p>
                    <p style={{ color: 'var(--beige)', fontStyle: 'italic', fontFamily: 'var(--font-display)', fontSize: '15px', marginBottom: '12px' }}>{sub}</p>
                    <p style={{ color: 'var(--bone-400)', fontSize: '15px', lineHeight: 1.7, maxWidth: '520px' }}>{body}</p>
                  </div>
                  <div style={{ minWidth: '200px' }}>
                    <p className="mono" style={{ color: 'var(--bone-500)', marginBottom: '10px' }}>Requirements</p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {req.map(r => (
                        <li key={r} style={{ color: 'var(--bone-400)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '4px', height: '4px', background: color, borderRadius: '50%', flexShrink: 0 }} /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <div style={{ marginTop: '60px', textAlign: 'center' }}>
            <button className="btn-v3 primary lg" onClick={() => navigate('/hosts')}>
              Start hosting · Earn your rank
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
