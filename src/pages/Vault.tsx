import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useAuth } from '../lib/auth';

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

function VaultPricing() {
  const { user, openAuth } = useAuth();
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!user) return openAuth('Create your Ember account to join the Vault.');
    navigate('/vault/checkout');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', maxWidth: '720px', margin: '0 auto', alignItems: 'stretch' }}>
      {/* Monthly */}
      <div className="price-card-v3">
        <p className="mono" style={{ color: 'var(--bone-500)', marginBottom: '12px' }}>Monthly</p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '52px', color: 'var(--bone-100)', marginBottom: '4px', lineHeight: 1, letterSpacing: '-0.025em' }}>€15</p>
        <p style={{ color: 'var(--bone-500)', marginBottom: '28px', fontSize: '14px' }}>per month · cancel anytime</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {INCLUDED.slice(0, 6).map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--bone-400)', fontSize: '13px' }}>
              <Check size={12} style={{ color: 'var(--burgundy)', flexShrink: 0, marginTop: '2px' }} />{f}
            </li>
          ))}
        </ul>
        <button onClick={handleJoin} className="btn-v3 ghost" style={{ width: '100%' }}>Start monthly</button>
      </div>

      {/* Annual */}
      <div className="price-card-v3 featured" style={{ position: 'relative', transform: 'scale(1.02)' }}>
        <span className="mono" style={{ position: 'absolute', top: '-1px', right: '20px', transform: 'translateY(-50%)', color: 'var(--bone-100)', background: 'var(--burgundy)', borderRadius: '999px', padding: '5px 12px', fontSize: '10px', boxShadow: '0 4px 16px rgba(128,0,0,0.5)' }}>
          ★ Best value
        </span>
        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--ember-hi)', boxShadow: '0 0 10px var(--ember-hi)', marginBottom: '14px', animation: 'pulse-dot 2s var(--ease-coal) infinite' }} />
        <p className="mono" style={{ color: 'var(--beige)', marginBottom: '12px' }}>Annual · Inner Circle</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--bone-100)', lineHeight: 1, letterSpacing: '-0.025em' }}>€99</p>
          <p style={{ color: 'var(--bone-500)', textDecoration: 'line-through', fontSize: '15px' }}>€180</p>
        </div>
        <p className="mono" style={{ color: 'var(--beige)', marginBottom: '28px' }}>SAVE 45% · €8.25/month</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {INCLUDED.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--bone-300)', fontSize: '13px' }}>
              <Check size={12} style={{ color: 'var(--beige)', flexShrink: 0, marginTop: '2px' }} />{f}
            </li>
          ))}
        </ul>
        <button onClick={handleJoin} className="btn-v3 primary" style={{ width: '100%' }}>Claim your seat →</button>
      </div>
    </div>
  );
}

export function Vault() {
  const { user, openAuth } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');

  const handleJoin = () => {
    if (!user) return openAuth('Create your Ember account to join the Vault.');
    navigate(`/vault/checkout?plan=${plan}`);
  };

  return (
    <div style={{ color: 'var(--bone-100)', minHeight: '100vh' }}>
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="v3-section" style={{ paddingTop: '140px', paddingBottom: '100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(128,0,0,0.28) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="section-label" style={{ display: 'inline-block' }}>The Vault</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 88px)', color: 'var(--bone-100)', lineHeight: 1.05, marginBottom: '24px' }}
          >
            The inner circle.<br />
            <span className="accent-italic">Everything the grill deserves.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ color: 'var(--bone-400)', fontSize: '18px', maxWidth: '540px', margin: '0 auto 48px', lineHeight: 1.7 }}
          >
            Exclusive recipes. Live masterclasses. The Board. Brotherhood Network.
            The Council. Annual Summit. One membership. Everything.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            role="tablist" aria-label="Choose billing plan"
            style={{ display: 'inline-flex', gap: '4px', background: 'rgba(26,23,20,0.7)', borderRadius: '999px', padding: '4px', border: '1px solid rgba(245,237,224,0.08)', marginBottom: '40px' }}
          >
            <button type="button" role="tab" aria-selected={plan === 'monthly'} onClick={() => setPlan('monthly')}
              style={{
                padding: '12px 24px', borderRadius: '999px',
                background: plan === 'monthly' ? 'linear-gradient(135deg, var(--burgundy), var(--burgundy-d))' : 'transparent',
                color: plan === 'monthly' ? 'var(--bone-100)' : 'var(--bone-300)',
                fontFamily: 'var(--font-display)', fontSize: '15px', border: 'none', cursor: 'pointer',
                transition: 'all 0.25s var(--ease-coal)',
                boxShadow: plan === 'monthly' ? '0 4px 16px rgba(128,0,0,0.4)' : 'none',
              }}
            >Monthly · €15</button>
            <button type="button" role="tab" aria-selected={plan === 'annual'} onClick={() => setPlan('annual')}
              style={{
                padding: '12px 24px', borderRadius: '999px',
                background: plan === 'annual' ? 'linear-gradient(135deg, var(--burgundy), var(--burgundy-d))' : 'transparent',
                color: plan === 'annual' ? 'var(--bone-100)' : 'var(--bone-300)',
                fontFamily: 'var(--font-display)', fontSize: '15px', border: 'none', cursor: 'pointer',
                transition: 'all 0.25s var(--ease-coal)',
                boxShadow: plan === 'annual' ? '0 4px 16px rgba(128,0,0,0.4)' : 'none',
              }}
            >Annual · €99 · Save 45%</button>
          </motion.div>
          <br />
          <button onClick={handleJoin} className="btn-v3 primary lg">Join the Vault</button>
          <p className="mono" style={{ color: 'var(--bone-500)', marginTop: '16px' }}>Cancel anytime · No contracts · Instant access</p>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="v3-section" style={{ padding: '80px 0 100px', borderTop: '1px solid rgba(245,237,224,0.06)', background: 'rgba(13,10,12,0.4)' }}>
        <div className="page-container">
          <FadeUp>
            <div className="section-label">What's inside</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4.5vw, 56px)', color: 'var(--bone-100)', marginBottom: '20px', lineHeight: 1.05 }}>
              Behind the door.<br />
              <span className="accent-italic">Six things you can't get anywhere else.</span>
            </h2>
            <p style={{ color: 'var(--bone-400)', maxWidth: '520px', marginBottom: '48px', fontSize: '17px', lineHeight: 1.7 }}>
              Recipes that don't exist on any blog. Live masterclasses from real
              gatherings. Verified members worldwide. The Board, The Council, and
              the Annual Summit. One membership. Everything.
            </p>
          </FadeUp>
          <div className="v3-three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {VAULT_FEATURES.map(({ title, body }, i) => (
              <FadeUp key={title} delay={i * 0.08}>
                <div className="vault-feature-v3">
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--beige)', marginBottom: '12px', position: 'relative', zIndex: 1 }}>{title}</p>
                  <p style={{ color: 'var(--bone-500)', lineHeight: 1.7, fontSize: '14px', position: 'relative', zIndex: 1 }}>{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp>
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <button className="btn-v3 primary lg" onClick={handleJoin}>Join the Vault for more</button>
              <p className="mono" style={{ color: 'var(--bone-500)', marginTop: '12px' }}>Cancel anytime · Instant access</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section className="v3-section" style={{ padding: '120px 0' }}>
        <div className="page-container">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div className="section-label" style={{ display: 'inline-block' }}>Membership</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 56px)', color: 'var(--bone-100)', marginBottom: '8px' }}>
                Choose your tier.
              </h2>
              <p style={{ color: 'var(--bone-400)', fontSize: '16px' }}>Every plan unlocks the full Vault.</p>
            </div>
          </FadeUp>
          <VaultPricing />
        </div>
      </section>

      <Footer />
    </div>
  );
}
