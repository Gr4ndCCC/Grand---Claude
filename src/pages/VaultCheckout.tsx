import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Flame, Shield, CreditCard } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useAuth } from '../lib/auth';

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

export function VaultCheckout() {
  const { user, openAuth, updateUser } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<'monthly' | 'annual'>('annual');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
        <Nav />
        <div style={{ padding: '160px 24px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '40px', marginBottom: '16px' }}>
            Sign in first
          </h1>
          <p style={{ color: '#A0A0A0', marginBottom: '24px' }}>Create a free account, then choose your plan.</p>
          <button onClick={() => openAuth('Create your account to join the Vault.')}
            style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 28px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '15px', fontWeight: 600 }}
          >Sign in / Join</button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCheckout = async () => {
    setIsCreating(true);
    setError('');

    try {
      const response = await fetch('/api/lemonsqueezy/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selected,
          email: user.email,
          name: user.name,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Checkout could not be created.');
      }
      sessionStorage.setItem('ember_pending_plan', selected);
      window.location.href = data.url;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout could not be created.');
      updateUser({ subPlan: null, subActive: false });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: '120px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <button onClick={() => navigate('/vault')}
            style={{ background: 'transparent', border: 'none', color: '#A0A0A0', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '24px', fontFamily: 'inherit' }}
          ><ArrowLeft size={14} /> Back to Vault</button>

          <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '6px' }}>Membership</p>
          <span className="maroon-rule" />
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(36px, 5vw, 60px)', color: '#fff', lineHeight: 1.06, marginBottom: '8px' }}
          >Choose your plan.</motion.h1>
          <p style={{ color: '#A0A0A0', fontSize: '16px', marginBottom: '40px' }}>
            Both plans unlock everything. Cancel anytime.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,380px)', gap: '32px', alignItems: 'start' }} className="checkout-grid">
            {/* Plan selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Annual */}
              <button onClick={() => setSelected('annual')}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: selected === 'annual' ? 'rgba(128,0,0,0.12)' : '#111', border: selected === 'annual' ? '1px solid var(--maroon)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%' }}
              >
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: selected === 'annual' ? '2px solid var(--maroon)' : '2px solid rgba(255,255,255,0.2)', background: selected === 'annual' ? 'var(--maroon)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                  {selected === 'annual' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '16px' }}>Annual</span>
                    <span style={{ color: 'var(--maroon)', background: 'rgba(128,0,0,0.15)', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}>BEST VALUE · SAVE 45%</span>
                  </div>
                  <p style={{ color: '#A0A0A0', fontSize: '13px' }}>Full Vault access for 12 months</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '28px', color: '#fff' }}>€99</p>
                  <p style={{ color: '#5A5A5A', fontSize: '11px', textDecoration: 'line-through' }}>€180</p>
                </div>
              </button>

              {/* Monthly */}
              <button onClick={() => setSelected('monthly')}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: selected === 'monthly' ? 'rgba(128,0,0,0.12)' : '#111', border: selected === 'monthly' ? '1px solid var(--maroon)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%' }}
              >
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: selected === 'monthly' ? '2px solid var(--maroon)' : '2px solid rgba(255,255,255,0.2)', background: selected === 'monthly' ? 'var(--maroon)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                  {selected === 'monthly' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>Monthly</p>
                  <p style={{ color: '#A0A0A0', fontSize: '13px' }}>Pay month-to-month, cancel anytime</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '28px', color: '#fff' }}>€15</p>
                  <p style={{ color: '#5A5A5A', fontSize: '11px' }}>per month</p>
                </div>
              </button>

              {/* What's included */}
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px', marginTop: '8px' }}>
                <p className="mono" style={{ color: '#5A5A5A', marginBottom: '14px', fontSize: '11px' }}>Everything included in both plans</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {INCLUDED.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <Check size={12} style={{ color: 'var(--maroon)', marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ color: '#A0A0A0', fontSize: '12px', lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px', position: 'sticky', top: '90px' }}>
              <p className="mono" style={{ color: '#5A5A5A', marginBottom: '16px', fontSize: '11px' }}>Order summary</p>

              <div style={{ padding: '16px', background: 'rgba(128,0,0,0.08)', border: '1px solid rgba(128,0,0,0.20)', borderRadius: '10px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Flame size={16} style={{ color: 'var(--maroon)' }} />
                    <div>
                      <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>
                        Vault {selected === 'annual' ? 'Annual' : 'Monthly'}
                      </p>
                      <p style={{ color: '#666', fontSize: '11px' }}>
                        {selected === 'annual' ? 'Billed yearly' : 'Billed monthly'}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff' }}>
                    {selected === 'annual' ? '€99' : '€15'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#A0A0A0', fontSize: '13px' }}>Subtotal</span>
                <span style={{ color: '#fff', fontSize: '13px' }}>{selected === 'annual' ? '€99.00' : '€15.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginBottom: '20px' }}>
                <span style={{ color: '#A0A0A0', fontSize: '13px' }}>VAT</span>
                <span style={{ color: '#A0A0A0', fontSize: '13px' }}>Calculated at checkout</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '11px' }}>
                    {user.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p style={{ color: '#fff', fontSize: '12px' }}>{user.name}</p>
                  <p style={{ color: '#666', fontSize: '11px' }}>{user.email}</p>
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px' }}>
                  <p style={{ color: '#fca5a5', fontSize: '12px', lineHeight: 1.5 }}>{error}</p>
                </div>
              )}

              <button onClick={handleCheckout} disabled={isCreating}
                style={{ width: '100%', background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '12px', padding: '16px', cursor: isCreating ? 'wait' : 'pointer', opacity: isCreating ? 0.8 : 1, fontSize: '15px', fontWeight: 700, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--maroon-light)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--maroon)')}
              >
                <CreditCard size={16} /> {isCreating ? 'Creating checkout...' : 'Proceed to Payment'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
                <Shield size={11} style={{ color: '#5A5A5A' }} />
                <p style={{ color: '#5A5A5A', fontSize: '11px', textAlign: 'center' }}>
                  Secure checkout via Lemon Squeezy. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <style>{`@media(max-width:900px){.checkout-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
