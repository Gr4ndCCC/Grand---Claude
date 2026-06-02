import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { FireButton } from '../components/FireButton';

const MILESTONES = [
  {
    n: '01',
    t: 'Forge the community',
    b: 'Verified members in 40+ countries. Every host earns a rank on The Board. The first Vault founders are being onboarded now.',
  },
  {
    n: '02',
    t: 'The first vote',
    b: 'Founding Vault members shortlist the host city. One member, one vote. The Council decides where the fire is lit.',
  },
  {
    n: '03',
    t: 'Build the program',
    b: 'Top Legends draft six tracks — fire, smoke, blade, salt, time, fermentation. Founding members vote on the lineup.',
  },
  {
    n: '04',
    t: 'Reveal',
    b: 'Location announced to Vault members only. Your subscription is your ticket — no scalping, no resale, no list.',
  },
  {
    n: '05',
    t: 'The first fire',
    b: 'One city. One weekend. The whole community. The first ever Ember Summit is born. You were there from the start.',
  },
];

const PROGRAM = [
  { d: 'Day 1 · Friday',  t: 'Arrival & opening fire', b: 'Welcome dinner. 40 fires lit at sundown. Community roll-call.' },
  { d: 'Day 2 · Saturday',t: 'Masterclasses & council', b: 'Six tracks: fire, smoke, blade, salt, time, fermentation. Council vote at noon.' },
  { d: 'Day 3 · Sunday',  t: 'The grand grill',         b: 'One field. 40 grills. Every Legend cooks. Every member eats.' },
];

export function Summit() {
  const navigate = useNavigate();
  return (
    <div style={{ color: 'var(--bone-100)', minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: '140px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '900px', height: '500px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.28) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>Annual Summit</motion.p>
          <span className="maroon-rule" style={{ margin: '0 auto 16px' }} />
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 7vw, 96px)', color: '#fff', lineHeight: 1.04, marginBottom: '24px' }}
          >
            One city.<br />
            One weekend.<br />
            <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>The whole community.</span>
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
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#fff', marginBottom: '4px' }}>Coming Soon</p>
            <p style={{ color: '#A0A0A0', fontSize: '14px' }}>Location revealed exclusively to Vault members</p>
          </div>
        </div>
      </section>

      {/* program */}
      <section style={{ padding: '80px 0', background: 'rgba(13,10,12,0.5)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="page-container">
          <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>Three days</p>
          <span className="maroon-rule" />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 52px)', color: '#fff', marginBottom: '48px' }}>The program.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PROGRAM.map(({ d, t, b }, i) => (
              <motion.div key={d}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.1 }}
                className="card-glow"
                style={{ background: 'rgba(26,23,20,0.7)', border: '1px solid rgba(245,237,224,0.07)', borderRadius: '14px', padding: '28px' }}
              >
                <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '12px' }}>{d}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--beige)', marginBottom: '12px' }}>{t}</h3>
                <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: '1.7' }}>{b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* milestones — building the first summit */}
      <section style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            background: 'radial-gradient(ellipse 50% 60% at 50% 30%, rgba(128,0,0,0.18) 0%, transparent 65%)',
          }}
        />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>The road ahead</p>
          <span className="maroon-rule" />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4.5vw, 56px)', color: '#fff', marginBottom: '20px', lineHeight: 1.05 }}>
            Build the first Summit <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>with us.</span>
          </h2>
          <p style={{ color: '#A0A0A0', fontSize: '17px', lineHeight: '1.7', maxWidth: '680px', marginBottom: '56px' }}>
            The Summit doesn't exist yet — it's being forged. Founding Vault members vote on the city,
            shape the program, and lock their seat at the first fire. Be one of the first in the world
            to play a role in what Ember becomes.
          </p>

          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '64px' }}>
            {/* vertical connector line */}
            <div
              aria-hidden
              style={{
                position: 'absolute', left: '32px', top: '40px', bottom: '40px',
                width: '1px',
                background: 'linear-gradient(180deg, rgba(128,0,0,0.6) 0%, rgba(184,146,74,0.35) 60%, rgba(245,237,224,0.08) 100%)',
              }}
            />
            {MILESTONES.map(({ n, t, b }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.08, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                className="card-glow"
                style={{
                  background: 'rgba(26,23,20,0.7)',
                  border: '1px solid rgba(245,237,224,0.07)',
                  borderRadius: '14px',
                  padding: '24px 28px 24px 88px',
                  position: 'relative',
                }}
              >
                <div style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(128,0,0,0.30)',
                  border: '1px solid rgba(128,0,0,0.55)',
                  boxShadow: '0 0 18px rgba(128,0,0,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--beige)',
                  letterSpacing: '0.05em',
                }}>{n}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '21px', color: '#fff', marginBottom: '6px' }}>{t}</h3>
                <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: '1.7' }}>{b}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <FireButton variant="primary" size="lg" onClick={() => navigate('/vault')}>
              Join the Vault · Become a founder
            </FireButton>
            <p className="mono" style={{ color: '#5A5A5A', marginTop: '16px' }}>Founding members shape the first fire</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
