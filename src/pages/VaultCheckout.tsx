import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Flame, Shield, Lock } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useAuth } from '../lib/auth';
import { getCheckoutUrl } from '../config/checkout';

declare global {
  interface Window {
    LemonSqueezy?: { Url: { Open: (url: string) => void }; Setup?: (opts: Record<string, unknown>) => void };
    createLemonSqueezy?: () => void;
  }
}

const PERKS: { title: string; desc: string }[] = [
  { title: 'The full recipe vault',          desc: 'Every pitmaster recipe. Unlocked. Forever.' },
  { title: 'Live masterclasses, on demand',  desc: 'Train with world-class pitmasters in real time.' },
  { title: 'The Ember Network',        desc: 'Verified badge. Direct line to 40+ countries of grillers.' },
  { title: 'Board certification path',       desc: 'Earn the title. Become a certified Ember pitmaster.' },
  { title: 'Partner discounts & early drops',desc: 'Exclusive gear, rubs, and tools — before anyone else.' },
  { title: 'Council voting rights',          desc: 'Shape the future of Ember. Your voice. Your fire.' },
  { title: 'Annual Summit access',           desc: 'The yearly gathering. Smoke, steel, fire.' },
  { title: 'Priority event discovery',       desc: 'See the best gatherings first. Lock your seat.' },
];

function FlameMark() {
  return (
    <svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 1C14 1 5 9.5 5 17C5 21.97 9.03 26 14 26C18.97 26 23 21.97 23 17C23 13 18.5 9 18.5 9C18.5 9 20 14 16.5 17C16.5 17 17.5 11 14 7C14 7 12 11 10 14C8.2 11 14 1 14 1Z" fill="#800000"/>
      <path d="M14 26C9.03 26 5 21.97 5 17C5 15.2 5.4 13.5 6.1 12C5.4 13.5 5 15.2 5 17C5 21.97 9.03 26 14 26Z" fill="rgba(228,207,179,0.25)"/>
      <ellipse cx="14" cy="30" rx="5" ry="1.8" fill="rgba(128,0,0,0.2)"/>
    </svg>
  );
}

export function VaultCheckout() {
  const { user, openAuth } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialPlan = (params.get('plan') === 'monthly' ? 'monthly' : 'annual') as 'monthly' | 'annual';

  const [selected, setSelected]     = useState<'monthly' | 'annual'>(initialPlan);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg]     = useState('');

  const checkoutUrl   = getCheckoutUrl(selected);
  const checkoutReady = !!checkoutUrl;

  // Boot the Lemon Squeezy overlay SDK (loaded from index.html) on mount so the
  // checkout opens as a modal over this page instead of navigating away.
  useEffect(() => {
    if (typeof window.createLemonSqueezy === 'function') window.createLemonSqueezy();
  }, []);

  useEffect(() => {
    const p = params.get('plan');
    if (p === 'monthly' || p === 'annual') setSelected(p);
  }, [params]);

  if (!user) {
    return (
      <div style={{ color: 'var(--bone-100)', minHeight: '100vh' }}>
        <Nav />
        <div style={{ padding: '160px 24px', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
            <FlameMark />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 400, marginBottom: '14px' }}>
            Sign in to join the Vault.
          </h1>
          <p style={{ color: '#6A6A6A', marginBottom: '28px', fontSize: '15px', lineHeight: 1.6 }}>
            Create a free account, then choose your membership.
          </p>
          <button
            onClick={() => openAuth('Create your account to join the Vault.')}
            style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 32px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '15px', fontWeight: 600 }}
          >
            Sign in / Create account
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const price        = selected === 'annual' ? '€99' : '€15';
  const priceNum     = selected === 'annual' ? '€99.00' : '€15.00';
  const billingLabel = selected === 'annual' ? 'Billed annually' : 'Billed monthly';
  const canPay       = checkoutReady && !isSubmitting;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutUrl || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Pre-fill the buyer and attach the Supabase user id so the webhook can
      // unlock the right account server-side. success_url returns the buyer to
      // their account, where membership (set by the webhook) is picked up.
      const url = new URL(checkoutUrl);
      url.searchParams.set('embed', '1');
      url.searchParams.set('checkout[email]', user.email);
      url.searchParams.set('checkout[name]', user.name);
      url.searchParams.set('checkout[custom][user_id]', user.id);
      url.searchParams.set('checkout[custom][plan]', selected);
      url.searchParams.set('checkout[success_url]', `${window.location.origin}/account?checkout=success&plan=${selected}`);
      const finalUrl = url.toString();

      if (window.LemonSqueezy?.Url?.Open) {
        window.LemonSqueezy.Url.Open(finalUrl);
        // The overlay stays open; reset the button so they can retry if they close it.
        setTimeout(() => setIsSubmitting(false), 1200);
      } else {
        // SDK not ready yet — open the hosted checkout as a graceful fallback.
        window.open(finalUrl, '_blank', 'noopener');
        setIsSubmitting(false);
      }
    } catch {
      setErrorMsg('Could not open checkout. Please try again.');
      setIsSubmitting(false);
    }
  };

  const initials = user.name.split(' ').map((p: string) => p[0] ?? '').slice(0, 2).join('').toUpperCase();

  return (
    <div style={{ color: 'var(--bone-100)', minHeight: '100vh' }}>
      <Nav />

      {/* Ambient radial glow */}
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '900px', height: '600px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.10) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      <main style={{ position: 'relative', zIndex: 1, paddingTop: '96px', paddingBottom: '80px' }}>
        <div className="page-container">

          {/* Back link */}
          <button
            onClick={() => navigate('/vault')}
            style={{ background: 'transparent', border: 'none', color: '#4A4A4A', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', marginBottom: '36px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', padding: 0, transition: 'color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#A0A0A0'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4A4A4A'; }}
          >
            <ArrowLeft size={12} /> Back to Vault
          </button>

          {/* Two-column grid */}
          <div className="vault-co-grid">

            {/* ── LEFT PANEL ─────────────────────────────────── */}
            <div>
              {/* Header */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '36px' }}>
                <div style={{ marginBottom: '14px' }}>
                  <FlameMark />
                </div>
                <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '10px' }}>Vault Membership</p>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 50px)', fontWeight: 400, lineHeight: 1.06, color: '#fff', marginBottom: '8px' }}>
                  Join the Vault.
                </h1>
                <p style={{ color: '#6A6A6A', fontStyle: 'italic', fontFamily: 'var(--font-display)', fontSize: '15px' }}>
                  Full access. For life.
                </p>
              </motion.div>

              {/* Plan cards */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>

                {/* Annual */}
                <button
                  onClick={() => setSelected('annual')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 22px', textAlign: 'left', width: '100%',
                    background: selected === 'annual' ? 'rgba(128,0,0,0.09)' : 'rgba(255,255,255,0.02)',
                    border: selected === 'annual' ? '1.5px solid rgba(128,0,0,0.55)' : '1.5px solid rgba(255,255,255,0.07)',
                    borderRadius: '16px', cursor: 'pointer',
                    boxShadow: selected === 'annual' ? '0 0 0 1px rgba(128,0,0,0.12), 0 4px 24px rgba(128,0,0,0.10)' : 'none',
                    transition: 'all 0.25s var(--ease-spark)',
                  }}
                >
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, border: selected === 'annual' ? '2px solid var(--maroon)' : '2px solid rgba(255,255,255,0.15)', background: selected === 'annual' ? 'var(--maroon)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                    {selected === 'annual' && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>Annual</span>
                      <span style={{ color: '#E4CFB3', background: 'rgba(228,207,179,0.10)', border: '1px solid rgba(228,207,179,0.18)', borderRadius: '4px', padding: '1px 7px', fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.10em' }}>
                        BEST VALUE · SAVE 45%
                      </span>
                    </div>
                    <p style={{ color: '#4A4A4A', fontSize: '12px' }}>€8.25/month · billed €99/year</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: '#fff', lineHeight: 1 }}>€99</p>
                    <p style={{ color: '#383838', fontSize: '11px', textDecoration: 'line-through', marginTop: '2px' }}>€180</p>
                  </div>
                </button>

                {/* Monthly */}
                <button
                  onClick={() => setSelected('monthly')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 22px', textAlign: 'left', width: '100%',
                    background: selected === 'monthly' ? 'rgba(128,0,0,0.09)' : 'rgba(255,255,255,0.02)',
                    border: selected === 'monthly' ? '1.5px solid rgba(128,0,0,0.55)' : '1.5px solid rgba(255,255,255,0.07)',
                    borderRadius: '16px', cursor: 'pointer',
                    boxShadow: selected === 'monthly' ? '0 0 0 1px rgba(128,0,0,0.12), 0 4px 24px rgba(128,0,0,0.10)' : 'none',
                    transition: 'all 0.25s var(--ease-spark)',
                  }}
                >
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, border: selected === 'monthly' ? '2px solid var(--maroon)' : '2px solid rgba(255,255,255,0.15)', background: selected === 'monthly' ? 'var(--maroon)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                    {selected === 'monthly' && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px', display: 'block', marginBottom: '3px' }}>Monthly</span>
                    <p style={{ color: '#4A4A4A', fontSize: '12px' }}>Flexible · cancel anytime</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: '#fff', lineHeight: 1 }}>€15</p>
                    <p style={{ color: '#4A4A4A', fontSize: '11px', marginTop: '2px' }}>per month</p>
                  </div>
                </button>
              </motion.div>

              {/* What you're actually buying */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }}
                style={{
                  background: 'linear-gradient(180deg, rgba(128,0,0,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(228,207,179,0.10)',
                  borderRadius: '20px',
                  padding: '28px 28px 30px',
                  boxShadow: '0 4px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '6px', fontSize: '11px', letterSpacing: '0.18em' }}>
                  WHAT YOU GET
                </p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 400, lineHeight: 1.15, color: '#fff', marginBottom: '6px' }}>
                  Everything Ember has to offer.<br />
                  <span style={{ color: '#E4CFB3', fontStyle: 'italic' }}>One membership. No gates.</span>
                </h2>
                <p style={{ color: '#8A8A8A', fontSize: '14px', lineHeight: 1.55, marginBottom: '24px' }}>
                  Both plans unlock the full Vault. Cancel anytime — but nobody does.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }} className="vault-perks-grid">
                  {PERKS.map(({ title, desc }) => (
                    <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%',
                        background: 'rgba(128,0,0,0.18)',
                        border: '1px solid rgba(128,0,0,0.40)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: '1px',
                      }}>
                        <Check size={12} style={{ color: '#E4CFB3' }} strokeWidth={2.5} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 600, marginBottom: '2px', lineHeight: 1.3 }}>
                          {title}
                        </p>
                        <p style={{ color: '#9A9A9A', fontSize: '12.5px', lineHeight: 1.45 }}>
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Closing line */}
                <div style={{ marginTop: '26px', paddingTop: '20px', borderTop: '1px solid rgba(228,207,179,0.10)', textAlign: 'center' }}>
                  <p style={{
                    color: '#E4CFB3', fontFamily: 'var(--font-display)',
                    fontStyle: 'italic', fontSize: '17px', lineHeight: 1.4,
                  }}>
                    "The world grills. The Vault is where the community keeps the fire."
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT PANEL ────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }}
              style={{ position: 'sticky', top: '88px' }}
            >
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden' }}>

                {/* Order summary */}
                <div style={{ padding: '24px 24px 20px' }}>
                  <p className="mono" style={{ color: '#333', marginBottom: '16px', fontSize: '10px' }}>Order summary</p>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selected}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', background: 'rgba(128,0,0,0.12)', border: '1px solid rgba(128,0,0,0.22)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Flame size={14} style={{ color: 'var(--maroon)' }} />
                          </div>
                          <div>
                            <p style={{ color: '#D0D0D0', fontSize: '13px', fontWeight: 600 }}>
                              Vault {selected === 'annual' ? 'Annual' : 'Monthly'}
                            </p>
                            <p style={{ color: '#404040', fontSize: '11px', marginTop: '1px' }}>{billingLabel}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#fff', lineHeight: 1 }}>{price}</p>
                          {selected === 'annual' && (
                            <p style={{ color: '#383838', fontSize: '10px', textDecoration: 'line-through', marginTop: '2px' }}>€180</p>
                          )}
                        </div>
                      </div>

                      {selected === 'annual' && (
                        <div style={{ background: 'rgba(228,207,179,0.05)', border: '1px solid rgba(228,207,179,0.10)', borderRadius: '8px', padding: '7px 12px', marginBottom: '14px' }}>
                          <p style={{ color: '#A09070', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em' }}>
                            ✦ You save €81 vs. monthly billing
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Totals */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#4A4A4A', fontSize: '12px' }}>Subtotal</span>
                      <span style={{ color: '#8A8A8A', fontSize: '12px' }}>{priceNum}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: '#4A4A4A', fontSize: '12px' }}>VAT</span>
                      <span style={{ color: '#3A3A3A', fontSize: '12px', fontStyle: 'italic' }}>Calculated at checkout</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                      <span style={{ color: '#C0C0C0', fontSize: '14px', fontWeight: 600 }}>Total today</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#fff' }}>{priceNum}</span>
                    </div>
                  </div>

                  {/* Signed-in user pill */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '16px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}>{initials}</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: '#C0C0C0', fontSize: '12px', fontWeight: 500 }}>{user.name}</p>
                      <p style={{ color: '#404040', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Checkout — opens the secure Lemon Squeezy modal on this page */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px 24px' }}>
                  <form onSubmit={handleCheckout}>
                    <p style={{ color: '#8A8A8A', fontSize: '12.5px', lineHeight: 1.55, marginBottom: '14px' }}>
                      You'll complete payment in a secure window right here — card, Apple&nbsp;Pay, Google&nbsp;Pay and PayPal supported. No account leaves Ember.
                    </p>

                    {/* Not configured warning (only if no checkout URL is set) */}
                    {!checkoutReady && (
                      <div style={{ background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.22)', borderRadius: '8px', padding: '12px 14px', marginBottom: '12px' }}>
                        <p style={{ color: '#ca9a06', fontSize: '11px', lineHeight: 1.6 }}>
                          Checkout isn't configured yet. Add your Lemon Squeezy checkout URL in
                          <code style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '3px', padding: '1px 4px', fontFamily: 'JetBrains Mono, monospace', margin: '0 3px' }}>
                            src/config/checkout.ts
                          </code>.
                        </p>
                      </div>
                    )}

                    {/* Error */}
                    <AnimatePresence>
                      {errorMsg && (
                        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px' }}
                        >
                          <p style={{ color: '#f87171', fontSize: '12px', lineHeight: 1.5 }}>{errorMsg}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!canPay}
                      className="vault-submit-btn"
                      style={{
                        width: '100%', position: 'relative', overflow: 'hidden',
                        background: canPay ? 'var(--maroon)' : '#1E1E1E',
                        color: canPay ? '#fff' : '#3A3A3A',
                        border: 'none', borderRadius: '12px', padding: '15px 20px',
                        cursor: isSubmitting ? 'wait' : (canPay ? 'pointer' : 'not-allowed'),
                        fontSize: '14px', fontWeight: 700, fontFamily: 'inherit', letterSpacing: '0.02em',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        transition: 'background 0.25s, transform 0.15s, box-shadow 0.25s',
                        boxShadow: canPay ? '0 4px 20px rgba(128,0,0,0.30)' : 'none',
                        transform: isSubmitting ? 'scale(0.99)' : 'scale(1)',
                      }}
                      onMouseEnter={e => { if (canPay) { e.currentTarget.style.background = '#990000'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(128,0,0,0.42)'; } }}
                      onMouseLeave={e => { if (canPay) { e.currentTarget.style.background = 'var(--maroon)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(128,0,0,0.30)'; } }}
                    >
                      {isSubmitting && (
                        <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)', backgroundSize: '200% 100%', animation: 'vault-shimmer 1s linear infinite', borderRadius: '12px' }} />
                      )}
                      {!isSubmitting && <Lock size={13} />}
                      {isSubmitting ? 'Opening secure checkout…' : `Pay ${priceNum} — Join the Vault`}
                    </button>
                  </form>

                  {/* Security badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
                    <Shield size={10} style={{ color: '#2E2E2E' }} />
                    <p style={{ color: '#2E2E2E', fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                      256-bit SSL · Powered by Lemon Squeezy
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        .vault-co-grid {
          display: grid;
          grid-template-columns: 1fr minmax(0, 420px);
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 860px) {
          .vault-co-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .vault-co-grid > div:last-child {
            position: static !important;
          }
        }
        @media (max-width: 540px) {
          .vault-perks-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes vault-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .vault-submit-btn:focus-visible {
          outline: 2px solid rgba(128,0,0,0.6);
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .vault-co-grid * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
