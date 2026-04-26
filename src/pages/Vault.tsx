import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { FireButton } from '../components/FireButton';

const VAULT_FEATURES = [
  { title: 'Recipes',            body: "Member-only. Not on any food blog. Submitted by the brotherhood — pitmasters from 40 countries who've earned their stripes." },
  { title: 'Knowledge',          body: 'Live masterclasses filmed at real gatherings. Fire science. Wood & smoke theory. Dry-aging at home. Knowledge that has no Wikipedia page.' },
  { title: 'Brotherhood Network',body: 'Verified members worldwide. Show up as a stranger in any city. Leave as a brother. The network is the feature.' },
  { title: 'The Board',          body: 'Four tiers — Ember, Iron, Gold, Legend — each earned through real events and real ratings. Your rank means something.' },
  { title: 'Partners',           body: 'Premium butchers, charcoal suppliers, and knife makers vetted by the community. No ads. Only the best. Members get exclusive deals.' },
  { title: 'The Council',        body: "Vote on platform direction. New features. Event formats. Annual Summit location. Your membership shapes Ember." },
];

const INCLUDED = [
  'Unlimited recipe access',
  'Live & recorded masterclasses',
  'Brotherhood Network badge',
  'Board certification eligibility',
  'Partner discounts & early access',
  'Council voting rights',
  'Annual Summit access',
  'Priority event discovery',
];

export function Vault() {
  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      {/* hero */}
      <section style={{ paddingTop: '140px', paddingBottom: '100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>
            The Vault
          </motion.p>
          <span className="maroon-rule" style={{ margin: '0 auto 16px' }} />
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(40px, 6vw, 80px)', color: '#fff', lineHeight: 1.06, marginBottom: '24px' }}
          >
            The inner circle.<br />
            <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>Everything the grill deserves.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ color: '#A0A0A0', fontSize: '18px', maxWidth: '540px', margin: '0 auto 48px', lineHeight: '1.7' }}
          >
            Exclusive recipes. Live masterclasses. The Board. Brotherhood Network.
            The Council. Annual Summit. One membership. Everything.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            style={{ display: 'inline-flex', gap: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '6px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '48px' }}
          >
            {['Monthly · €12', 'Annual · €89 · Save 38%'].map((l, i) => (
              <div key={l} style={{ padding: '10px 20px', borderRadius: '8px', background: i === 1 ? 'var(--maroon)' : 'transparent', color: i === 1 ? '#fff' : '#A0A0A0', fontSize: '14px', fontWeight: i === 1 ? 600 : 400 }}>{l}</div>
            ))}
          </motion.div>
          <br />
          <FireButton variant="primary" size="lg">Join the Vault</FireButton>
          <p className="mono" style={{ color: '#5A5A5A', marginTop: '16px' }}>Cancel anytime · No contracts · Instant access</p>
        </div>
      </section>

      {/* features grid */}
      <section style={{ padding: '80px 0', background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="page-container">
          <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>What's inside</p>
          <span className="maroon-rule" />
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(36px, 5vw, 56px)', color: '#fff', marginBottom: '20px', lineHeight: 1.06 }}>
            Behind the door.<br />
            <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>Six things you can't get anywhere else.</span>
          </h2>
          <p style={{ color: '#A0A0A0', maxWidth: '520px', marginBottom: '48px', fontSize: '17px', lineHeight: '1.7' }}>
            Recipes that don't exist on any blog. Live masterclasses from real
            gatherings. Verified members worldwide. The Board, The Council, and
            the Annual Summit. One membership. Everything.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VAULT_FEATURES.map(({ title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08 }}
                className="card-glow"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}
              >
                <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '18px', color: 'var(--beige)', marginBottom: '12px' }}>{title}</p>
                <p style={{ color: '#A0A0A0', lineHeight: '1.7', fontSize: '14px' }}>{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* pricing */}
      <section style={{ padding: '100px 0' }}>
        <div className="page-container">
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* monthly */}
            <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '36px' }}>
              <p className="mono" style={{ color: '#5A5A5A', marginBottom: '12px' }}>Monthly</p>
              <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '48px', color: '#fff', marginBottom: '4px' }}>€12</p>
              <p style={{ color: '#5A5A5A', marginBottom: '32px' }}>per month, cancel anytime</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {INCLUDED.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#A0A0A0', fontSize: '14px' }}>
                    <Check size={14} style={{ color: 'var(--maroon)', flexShrink: 0 }} />{f}
                  </li>
                ))}
              </ul>
              <button style={{ width: '100%', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '14px', cursor: 'pointer', fontSize: '15px', fontFamily: 'inherit', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              >Start monthly</button>
            </div>

            {/* annual */}
            <div style={{ background: 'rgba(128,0,0,0.12)', border: '1px solid rgba(128,0,0,0.35)', borderRadius: '16px', padding: '36px', position: 'relative' }}>
              <span className="mono" style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--maroon)', background: 'rgba(128,0,0,0.15)', borderRadius: '6px', padding: '4px 10px', fontSize: '10px' }}>
                Best value
              </span>
              <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '12px' }}>Annual</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '48px', color: '#fff' }}>€89</p>
                <p style={{ color: '#5A5A5A', textDecoration: 'line-through' }}>€144</p>
              </div>
              <p style={{ color: '#5A5A5A', marginBottom: '32px' }}>per year · save 38%</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {INCLUDED.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#A0A0A0', fontSize: '14px' }}>
                    <Check size={14} style={{ color: 'var(--maroon)', flexShrink: 0 }} />{f}
                  </li>
                ))}
              </ul>
              <button
                style={{ width: '100%', background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', fontFamily: 'inherit', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--maroon-light)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--maroon)'}
              >Start annual</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
