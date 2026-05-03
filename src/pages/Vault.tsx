import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { FireButton } from '../components/FireButton';
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

function VaultPricing() {
  const { user, openAuth } = useAuth();
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!user) return openAuth('Create your Ember account to join the Vault.');
    navigate('/vault/checkout');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', maxWidth: '680px', margin: '0 auto' }}>
      {/* Monthly */}
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '36px' }}>
        <p className="mono" style={{ color: '#5A5A5A', marginBottom: '12px' }}>Monthly</p>
        <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '44px', color: '#fff', marginBottom: '4px' }}>€15</p>
        <p style={{ color: '#5A5A5A', marginBottom: '28px', fontSize: '14px' }}>per month · cancel anytime</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {INCLUDED.slice(0, 6).map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#A0A0A0', fontSize: '13px' }}>
              <Check size={12} style={{ color: 'var(--maroon)', flexShrink: 0, marginTop: '2px' }} />{f}
            </li>
          ))}
        </ul>
        <button onClick={handleJoin}
          style={{ width: '100%', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '13px', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
        >Start monthly</button>
      </div>

      {/* Annual */}
      <div style={{ background: 'rgba(128,0,0,0.12)', border: '1px solid rgba(128,0,0,0.35)', borderRadius: '16px', padding: '36px', position: 'relative' }}>
        <span className="mono" style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--maroon)', background: 'rgba(128,0,0,0.15)', borderRadius: '6px', padding: '4px 10px', fontSize: '10px' }}>
          Best value
        </span>
        <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '12px' }}>Annual</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
          <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '44px', color: '#fff' }}>€99</p>
          <p style={{ color: '#5A5A5A', textDecoration: 'line-through', fontSize: '14px' }}>€180</p>
        </div>
        <p style={{ color: '#5A5A5A', marginBottom: '28px', fontSize: '14px' }}>per year · save 45%</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {INCLUDED.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#A0A0A0', fontSize: '13px' }}>
              <Check size={12} style={{ color: 'var(--maroon)', flexShrink: 0, marginTop: '2px' }} />{f}
            </li>
          ))}
        </ul>
        <button onClick={handleJoin}
          style={{ width: '100%', background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--maroon-light)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--maroon)')}
        >Start annual</button>
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
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      {/* hero */}
      <section style={{ paddingTop: '140px', paddingBottom: '100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />
        {/* gradient bleed into next section */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, transparent, #0D0D0D)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>The Vault</motion.p>
          <span className="maroon-rule" style={{ margin: '0 auto 16px' }} />
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(40px, 6vw, 80px)', color: '#fff', lineHeight: 1.06, marginBottom: '24px' }}
          >
            The inner circle.<br />
            <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>Everything the grill deserves.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ color: '#A0A0A0', fontSize: '18px', maxWidth: '540px', margin: '0 auto 48px', lineHeight: '1.7' }}
          >
            Exclusive recipes. Live masterclasses. The Board. Brotherhood Network.
            The Council. Annual Summit. One membership. Everything.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            role="tablist" aria-label="Choose billing plan"
            style={{ display: 'inline-flex', gap: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '8px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '48px', flexWrap: 'wrap' }}
          >
            <button
              type="button"
              role="tab"
              aria-selected={plan === 'monthly'}
              onClick={() => setPlan('monthly')}
              style={{
                padding: '14px 28px', borderRadius: '10px',
                background: plan === 'monthly' ? 'var(--maroon)' : 'transparent',
                color: plan === 'monthly' ? '#fff' : '#C8B8A2',
                fontSize: '16px',
                fontWeight: plan === 'monthly' ? 700 : 500,
                fontFamily: 'inherit',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: plan === 'monthly' ? '0 4px 16px rgba(128,0,0,0.4)' : 'none',
              }}
            >Monthly · €15</button>
            <button
              type="button"
              role="tab"
              aria-selected={plan === 'annual'}
              onClick={() => setPlan('annual')}
              style={{
                padding: '14px 28px', borderRadius: '10px',
                background: plan === 'annual' ? 'var(--maroon)' : 'transparent',
                color: plan === 'annual' ? '#fff' : '#C8B8A2',
                fontSize: '16px',
                fontWeight: plan === 'annual' ? 700 : 500,
                fontFamily: 'inherit',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: plan === 'annual' ? '0 4px 16px rgba(128,0,0,0.4)' : 'none',
              }}
            >Annual · €99 · Save 45%</button>
          </motion.div>
          <br />
          <button onClick={handleJoin}
            style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '12px', padding: '16px 32px', cursor: 'pointer', fontSize: '16px', fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--maroon-light)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--maroon)'; e.currentTarget.style.transform = 'none'; }}
          >Join the Vault</button>
          <p className="mono" style={{ color: '#5A5A5A', marginTop: '16px' }}>Cancel anytime · No contracts · Instant access</p>
        </div>
      </section>

      {/* features grid */}
      <section style={{ padding: '80px 0 100px', background: '#0D0D0D', position: 'relative' }}>
        {/* top fade from hero */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to bottom, #0A0A0A, transparent)', pointerEvents: 'none' }} />
        {/* bottom fade into pricing */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to bottom, transparent, #0A0A0A)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
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
              <motion.div key={title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.08 }}
                className="card-glow"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}
              >
                <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '18px', color: 'var(--beige)', marginBottom: '12px' }}>{title}</p>
                <p style={{ color: '#A0A0A0', lineHeight: '1.7', fontSize: '14px' }}>{body}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginTop: '48px' }}
          >
            <FireButton variant="primary" size="lg">Join the Vault for more</FireButton>
            <p className="mono" style={{ color: '#5A5A5A', marginTop: '12px' }}>Cancel anytime · Instant access</p>
          </motion.div>
        </div>
      </section>

      {/* pricing */}
      <section style={{ padding: '100px 0', position: 'relative' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>Membership</p>
            <span className="maroon-rule" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(28px, 4vw, 48px)', color: '#fff', marginBottom: '8px' }}>
              Choose your tier.
            </h2>
            <p style={{ color: '#A0A0A0', fontSize: '16px' }}>Every plan unlocks the full Vault.</p>
          </div>
          <VaultPricing />
        </div>
      </section>

      <Footer />
    </div>
  );
}
