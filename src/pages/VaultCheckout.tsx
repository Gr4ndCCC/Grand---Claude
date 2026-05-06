import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Flame, Shield, Lock, CreditCard } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useAuth } from '../lib/auth';
import { getCheckoutUrl } from '../config/checkout';

declare global {
  interface Window {
    LemonSqueezy?: { Url: { Open: (url: string) => void } };
    createLemonSqueezy?: () => void;
  }
}

const PERKS: { title: string; desc: string }[] = [
  { title: 'The full recipe vault',          desc: 'Every pitmaster recipe. Unlocked. Forever.' },
  { title: 'Live masterclasses, on demand',  desc: 'Train with world-class pitmasters in real time.' },
  { title: 'The Brotherhood Network',        desc: 'Verified badge. Direct line to 40+ countries of grillers.' },
  { title: 'Board certification path',       desc: 'Earn the title. Become a certified Ember pitmaster.' },
  { title: 'Partner discounts & early drops',desc: 'Exclusive gear, rubs, and tools — before anyone else.' },
  { title: 'Council voting rights',          desc: 'Shape the future of Ember. Your voice. Your fire.' },
  { title: 'Annual Summit access',           desc: 'The yearly gathering. Smoke, steel, brotherhood.' },
  { title: 'Priority event discovery',       desc: 'See the best gatherings first. Lock your seat.' },
];

function buildCheckoutUrl(base: string, name: string, email: string) {
  const url = new URL(base);
  url.searchParams.set('embed', '1');
  url.searchParams.set('checkout[email]', email);
  url.searchParams.set('checkout[name]', name);
  const successUrl = `${window.location.origin}/account?vault=success`;
  url.searchParams.set('checkout[success_url]', successUrl);
  return url.toString();
}

function openOverlay(url: string) {
  if (window.LemonSqueezy?.Url?.Open) {
    window.LemonSqueezy.Url.Open(url);
  } else {
    window.open(url, '_blank', 'noopener');
  }
}

function FlameMark() {
  return (
    <svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 1C14 1 5 9.5 5 17C5 21.97 9.03 26 14 26C18.97 26 23 21.97 23 17C23 13 18.5 9 18.5 9C18.5 9 20 14 16.5 17C16.5 17 17.5 11 14 7C14 7 12 11 10 14C8.2 11 14 1 14 1Z" fill="#800000"/>
      <path d="M14 26C9.03 26 5 21.97 5 17C5 15.2 5.4 13.5 6.1 12C5.4 13.5 5 15.2 5 17C5 21.97 9.03 26 14 26Z" fill="rgba(228,207,179,0.25)"/>
      <ellipse cx="14" cy="30" rx="5" ry="1.8" fill="rgba(128,0,0,0.2)"/>
    </svg>
  );
}

function formatCardNumber(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  return digits;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.035)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  padding: '11px 14px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: '#4A4A4A',
  fontSize: '10px',
  fontFamily: 'JetBrains Mono, monospace',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  marginBottom: '6px',
};

export function VaultCheckout() {
  const { user, openAuth } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialPlan = (params.get('plan') === 'monthly' ? 'monthly' : 'annual') as 'monthly' | 'annual';

  const [selected, setSelected]     = useState<'monthly' | 'annual'>(initialPlan);
  const [paymentTab, setPaymentTab] = useState<'card' | 'apple' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc]       = useState('');
  const [cardName, setCardName]     = useState('');
  const [country, setCountry]       = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overlayOpen, setOverlayOpen]   = useState(false);

  useEffect(() => {
    const p = params.get('plan');
    if (p === 'monthly' || p === 'annual') setSelected(p);
  }, [params]);

  useEffect(() => {
    if (user) setCardName(user.name);
  }, [user]);

  if (!user) {
    return (
      <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
        <Nav />
        <div style={{ padding: '160px 24px', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
            <FlameMark />
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 400, marginBottom: '14px' }}>
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

  const checkoutBase = getCheckoutUrl(selected);
  const isConfigured = !!checkoutBase && /^https?:\/\//.test(checkoutBase);

  const price        = selected === 'annual' ? '€99' : '€15';
  const priceNum     = selected === 'annual' ? '€99.00' : '€15.00';
  const billingLabel = selected === 'annual' ? 'Billed annually' : 'Billed monthly';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured || !checkoutBase) return;
    setIsSubmitting(true);
    sessionStorage.setItem('ember_pending_plan', selected);
    const url = buildCheckoutUrl(checkoutBase, user.name, user.email);
    setOverlayOpen(true);
    openOverlay(url);
    setTimeout(() => setIsSubmitting(false), 1600);
  };

  const retryCheckout = () => {
    if (!checkoutBase) return;
    const url = buildCheckoutUrl(checkoutBase, user.name, user.email);
    openOverlay(url);
  };

  const initials = user.name
    .split(' ')
    .map((p: string) => p[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
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
                <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(30px, 4vw, 50px)', fontWeight: 400, lineHeight: 1.06, color: '#fff', marginBottom: '8px' }}>
                  Join the Vault.
                </h1>
                <p style={{ color: '#6A6A6A', fontStyle: 'italic', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '15px' }}>
                  Full access. Lifetime brotherhood.
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
                    <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '26px', color: '#fff', lineHeight: 1 }}>€99</p>
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
                    <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '26px', color: '#fff', lineHeight: 1 }}>€15</p>
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
                <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '26px', fontWeight: 400, lineHeight: 1.15, color: '#fff', marginBottom: '6px' }}>
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
                    color: '#E4CFB3', fontFamily: 'Playfair Display, Georgia, serif',
                    fontStyle: 'italic', fontSize: '17px', lineHeight: 1.4,
                  }}>
                    "The world grills. The Vault is where the brotherhood keeps the fire."
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
                          <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', lineHeight: 1 }}>{price}</p>
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
                      <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '18px', color: '#fff' }}>{priceNum}</span>
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

                {/* Payment form */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px 24px' }}>
                  <p className="mono" style={{ color: '#333', marginBottom: '14px', fontSize: '10px' }}>Payment details</p>

                  {/* Payment method tabs */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '3px' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentTab('card')}
                      style={{ flex: 1, padding: '8px 6px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '11.5px', fontFamily: 'inherit', fontWeight: 500, transition: 'all 0.2s', background: paymentTab === 'card' ? '#1C1C1C' : 'transparent', color: paymentTab === 'card' ? '#fff' : '#4A4A4A', boxShadow: paymentTab === 'card' ? '0 1px 4px rgba(0,0,0,0.5)' : 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                    >
                      <CreditCard size={12} /> Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentTab('apple')}
                      style={{ flex: 1, padding: '8px 6px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '11.5px', fontFamily: 'inherit', fontWeight: 600, transition: 'all 0.2s', background: paymentTab === 'apple' ? '#1C1C1C' : 'transparent', color: paymentTab === 'apple' ? '#fff' : '#4A4A4A', boxShadow: paymentTab === 'apple' ? '0 1px 4px rgba(0,0,0,0.5)' : 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <svg width="11" height="13" viewBox="0 0 13 16" fill="currentColor" aria-hidden="true">
                        <path d="M10.83 8.5c-.02-2.04 1.66-3.02 1.74-3.07-.95-1.39-2.43-1.58-2.95-1.6-1.25-.13-2.45.74-3.08.74-.65 0-1.62-.72-2.67-.7-1.37.02-2.65.8-3.36 2.03-1.43 2.49-.36 6.16 1.03 8.18.68.99 1.49 2.1 2.55 2.06 1.03-.04 1.42-.66 2.66-.66 1.24 0 1.59.66 2.67.64 1.1-.02 1.8-1.01 2.47-2 .78-1.15 1.1-2.27 1.12-2.32-.02-.01-2.16-.83-2.18-3.3zM8.83 2.55C9.4 1.86 9.78.91 9.68 0c-.78.03-1.74.52-2.32 1.2-.52.6-.97 1.57-.85 2.46.87.07 1.76-.44 2.32-1.11z"/>
                      </svg>
                      Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentTab('paypal')}
                      style={{ flex: 1, padding: '8px 6px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '11.5px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, letterSpacing: '0.04em', transition: 'all 0.2s', background: paymentTab === 'paypal' ? '#1C1C1C' : 'transparent', color: paymentTab === 'paypal' ? '#009cde' : '#4A4A4A', boxShadow: paymentTab === 'paypal' ? '0 1px 4px rgba(0,0,0,0.5)' : 'none' }}
                    >
                      PayPal
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                      {paymentTab === 'card' ? (
                        <motion.div key="card" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }} transition={{ duration: 0.15 }}>

                          {/* Card number */}
                          <div style={{ marginBottom: '10px' }}>
                            <label style={labelStyle}>Card number</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                              maxLength={19}
                              style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace' }}
                              onFocus={e => { e.target.style.borderColor = 'rgba(128,0,0,0.45)'; }}
                              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                            />
                          </div>

                          {/* Name on card */}
                          <div style={{ marginBottom: '10px' }}>
                            <label style={labelStyle}>Name on card</label>
                            <input
                              type="text"
                              placeholder="Full name"
                              value={cardName}
                              onChange={e => setCardName(e.target.value)}
                              style={{ ...inputStyle, fontFamily: 'inherit' }}
                              onFocus={e => { e.target.style.borderColor = 'rgba(128,0,0,0.45)'; }}
                              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                            />
                          </div>

                          {/* Expiry + CVC */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                            <div>
                              <label style={labelStyle}>Expiry</label>
                              <input
                                type="text"
                                inputMode="numeric"
                                placeholder="MM / YY"
                                value={cardExpiry}
                                onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                                maxLength={7}
                                style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace' }}
                                onFocus={e => { e.target.style.borderColor = 'rgba(128,0,0,0.45)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                              />
                            </div>
                            <div>
                              <label style={labelStyle}>CVC</label>
                              <input
                                type="text"
                                inputMode="numeric"
                                placeholder="•••"
                                value={cardCvc}
                                onChange={e => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                maxLength={4}
                                style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace' }}
                                onFocus={e => { e.target.style.borderColor = 'rgba(128,0,0,0.45)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                              />
                            </div>
                          </div>

                          {/* Country */}
                          <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Country</label>
                            <select
                              value={country}
                              onChange={e => setCountry(e.target.value)}
                              style={{ ...inputStyle, background: 'rgba(20,20,20,0.96)', color: country ? '#fff' : '#4A4A4A', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit' }}
                              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(128,0,0,0.45)'; }}
                              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                            >
                              <option value="" style={{ background: '#141414' }}>Select country…</option>
                              <option value="US" style={{ background: '#141414' }}>United States</option>
                              <option value="GB" style={{ background: '#141414' }}>United Kingdom</option>
                              <option value="DE" style={{ background: '#141414' }}>Germany</option>
                              <option value="FR" style={{ background: '#141414' }}>France</option>
                              <option value="IT" style={{ background: '#141414' }}>Italy</option>
                              <option value="ES" style={{ background: '#141414' }}>Spain</option>
                              <option value="PT" style={{ background: '#141414' }}>Portugal</option>
                              <option value="NL" style={{ background: '#141414' }}>Netherlands</option>
                              <option value="GR" style={{ background: '#141414' }}>Greece</option>
                              <option value="AU" style={{ background: '#141414' }}>Australia</option>
                              <option value="CA" style={{ background: '#141414' }}>Canada</option>
                              <option value="BR" style={{ background: '#141414' }}>Brazil</option>
                              <option value="AR" style={{ background: '#141414' }}>Argentina</option>
                              <option value="ZA" style={{ background: '#141414' }}>South Africa</option>
                              <option value="JP" style={{ background: '#141414' }}>Japan</option>
                              <option value="SG" style={{ background: '#141414' }}>Singapore</option>
                              <option value="AE" style={{ background: '#141414' }}>UAE</option>
                              <option value="OTHER" style={{ background: '#141414' }}>Other</option>
                            </select>
                          </div>
                        </motion.div>
                      ) : paymentTab === 'apple' ? (
                        <motion.div key="apple" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.15 }}
                          style={{ padding: '24px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '12px', marginBottom: '16px', textAlign: 'center' }}
                        >
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                            <svg width="22" height="26" viewBox="0 0 13 16" fill="#fff" aria-hidden="true">
                              <path d="M10.83 8.5c-.02-2.04 1.66-3.02 1.74-3.07-.95-1.39-2.43-1.58-2.95-1.6-1.25-.13-2.45.74-3.08.74-.65 0-1.62-.72-2.67-.7-1.37.02-2.65.8-3.36 2.03-1.43 2.49-.36 6.16 1.03 8.18.68.99 1.49 2.1 2.55 2.06 1.03-.04 1.42-.66 2.66-.66 1.24 0 1.59.66 2.67.64 1.1-.02 1.8-1.01 2.47-2 .78-1.15 1.1-2.27 1.12-2.32-.02-.01-2.16-.83-2.18-3.3zM8.83 2.55C9.4 1.86 9.78.91 9.68 0c-.78.03-1.74.52-2.32 1.2-.52.6-.97 1.57-.85 2.46.87.07 1.76-.44 2.32-1.11z"/>
                            </svg>
                            <span style={{ color: '#fff', fontSize: '17px', fontWeight: 600, letterSpacing: '-0.01em' }}>Pay</span>
                          </div>
                          <p style={{ color: '#7A7A7A', fontSize: '12px', lineHeight: 1.6 }}>
                            Confirm with Face ID or Touch ID at checkout. No card details to enter.
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div key="paypal" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.15 }}
                          style={{ padding: '20px', background: 'rgba(0,156,222,0.04)', border: '1px solid rgba(0,156,222,0.14)', borderRadius: '12px', marginBottom: '16px', textAlign: 'center' }}
                        >
                          <p style={{ color: '#009cde', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px' }}>PayPal</p>
                          <p style={{ color: '#4A4A4A', fontSize: '12px', lineHeight: 1.6 }}>
                            You'll be redirected to PayPal to complete your purchase securely.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Warning: checkout not configured */}
                    {!isConfigured && (
                      <div style={{ background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.22)', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px' }}>
                        <p style={{ color: '#ca9a06', fontSize: '11px', lineHeight: 1.5 }}>
                          Paste your Lemon Squeezy URL into{' '}
                          <code style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '3px', padding: '1px 4px', fontFamily: 'JetBrains Mono, monospace' }}>
                            src/config/checkout.ts
                          </code>
                        </p>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !isConfigured}
                      className="vault-submit-btn"
                      style={{
                        width: '100%', position: 'relative', overflow: 'hidden',
                        background: isConfigured ? 'var(--maroon)' : '#1E1E1E',
                        color: isConfigured ? '#fff' : '#3A3A3A',
                        border: 'none', borderRadius: '12px', padding: '15px 20px',
                        cursor: isSubmitting ? 'wait' : (isConfigured ? 'pointer' : 'not-allowed'),
                        fontSize: '14px', fontWeight: 700, fontFamily: 'inherit', letterSpacing: '0.02em',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        transition: 'background 0.25s, transform 0.15s, box-shadow 0.25s',
                        boxShadow: isConfigured ? '0 4px 20px rgba(128,0,0,0.30)' : 'none',
                        transform: isSubmitting ? 'scale(0.99)' : 'scale(1)',
                      }}
                      onMouseEnter={e => { if (isConfigured && !isSubmitting) { e.currentTarget.style.background = '#990000'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(128,0,0,0.42)'; } }}
                      onMouseLeave={e => { if (isConfigured) { e.currentTarget.style.background = 'var(--maroon)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(128,0,0,0.30)'; } }}
                    >
                      {isSubmitting && (
                        <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)', backgroundSize: '200% 100%', animation: 'vault-shimmer 1s linear infinite', borderRadius: '12px' }} />
                      )}
                      {!isSubmitting && <Lock size={13} />}
                      {isSubmitting
                        ? 'Opening checkout…'
                        : paymentTab === 'card'   ? 'Complete Secure Checkout'
                        : paymentTab === 'apple'  ? 'Pay with  Pay'
                        : 'Continue with PayPal'}
                    </button>
                  </form>

                  {/* Overlay open hint */}
                  <AnimatePresence>
                    {overlayOpen && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                        style={{ marginTop: '10px', background: 'rgba(128,0,0,0.07)', border: '1px solid rgba(128,0,0,0.22)', borderRadius: '10px', padding: '11px 14px' }}
                      >
                        <p style={{ color: '#A08070', fontSize: '11px', lineHeight: 1.6, textAlign: 'center' }}>
                          Complete your payment in the secure overlay.{' '}
                          <button
                            type="button"
                            onClick={retryCheckout}
                            style={{ background: 'none', border: 'none', color: 'var(--maroon)', cursor: 'pointer', fontSize: '11px', fontFamily: 'inherit', padding: 0, textDecoration: 'underline' }}
                          >
                            Didn't open? Try again.
                          </button>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

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
