import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { FireButton } from '../components/FireButton';

const PAST = [
  { year: '2024', city: 'Lisbon',     country: 'Portugal',  attendees: 240, theme: 'Fire & Salt' },
  { year: '2025', city: 'Tokyo',      country: 'Japan',     attendees: 320, theme: 'Smoke & Steel' },
];

const PROGRAM = [
  { d: 'Day 1 · Friday',  t: 'Arrival & opening fire', b: 'Welcome dinner. 40 fires lit at sundown. Brotherhood roll-call.' },
  { d: 'Day 2 · Saturday',t: 'Masterclasses & council', b: 'Six tracks: fire, smoke, blade, salt, time, fermentation. Council vote at noon.' },
  { d: 'Day 3 · Sunday',  t: 'The grand grill',         b: 'One field. 40 grills. Every Legend cooks. Every member eats.' },
];

export function Summit() {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: '140px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '900px', height: '500px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.28) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>Annual Summit</motion.p>
          <span className="maroon-rule" style={{ margin: '0 auto 16px' }} />
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(44px, 7vw, 96px)', color: '#fff', lineHeight: 1.04, marginBottom: '24px' }}
          >
            One city.<br />
            One weekend.<br />
            <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>The whole brotherhood.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: '#A0A0A0', fontSize: '18px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.7' }}
          >
            Every year, a different city. Pitmasters from 40+ countries. Three
            days. Forty fires. Knowledge that doesn't exist anywhere else.
          </motion.p>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', padding: '24px 48px', background: 'rgba(128,0,0,0.10)', border: '1px solid rgba(128,0,0,0.30)', borderRadius: '16px' }}>
            <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '10px' }}>2026 SUMMIT — REVEAL</p>
            <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '32px', color: '#fff', marginBottom: '4px' }}>September · TBD</p>
            <p style={{ color: '#A0A0A0', fontSize: '14px' }}>Location revealed exclusively to Vault members</p>
          </div>
        </div>
      </section>

      {/* program */}
      <section style={{ padding: '80px 0', background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="page-container">
          <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>Three days</p>
          <span className="maroon-rule" />
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(32px, 4vw, 52px)', color: '#fff', marginBottom: '48px' }}>The program.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PROGRAM.map(({ d, t, b }, i) => (
              <motion.div key={d}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.1 }}
                className="card-glow"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}
              >
                <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '12px' }}>{d}</p>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: 'var(--beige)', marginBottom: '12px' }}>{t}</h3>
                <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: '1.7' }}>{b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* past summits */}
      <section style={{ padding: '100px 0' }}>
        <div className="page-container">
          <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>Past summits</p>
          <span className="maroon-rule" />
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(32px, 4vw, 52px)', color: '#fff', marginBottom: '48px' }}>The road so far.</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {PAST.map(({ year, city, country, attendees, theme }, i) => (
              <motion.div key={year}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-glow"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '32px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '40px', color: 'var(--beige)', lineHeight: 1 }}>{year}</p>
                  <span className="mono" style={{ color: '#5A5A5A' }}>{attendees} attendees</span>
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', color: '#fff', marginBottom: '4px' }}>{city}, {country}</h3>
                <p style={{ color: 'var(--beige)', fontStyle: 'italic', fontSize: '15px' }}>"{theme}"</p>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <FireButton variant="primary" size="lg" onClick={() => navigate('/vault')}>
              Join the Vault · Get Summit access
            </FireButton>
            <p className="mono" style={{ color: '#5A5A5A', marginTop: '16px' }}>Your subscription is your ticket</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
