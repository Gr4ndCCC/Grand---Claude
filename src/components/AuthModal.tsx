import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { FireButton } from './FireButton';

function isOver18(dob: string) {
  const d = new Date(dob);
  const limit = new Date();
  limit.setFullYear(limit.getFullYear() - 18);
  return d <= limit;
}

export function AuthModal() {
  const { isOpen, closeAuth, pendingReason, signIn } = useAuth();
  const [mode, setMode] = useState<'signin' | 'join'>('join');
  const [form, setForm] = useState({ email: '', name: '', dob: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = 'Enter a valid email';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    if (mode === 'join') {
      if (!form.name.trim()) e.name = 'Enter your name';
      if (!form.dob) e.dob = 'Enter your date of birth';
      else if (!isOver18(form.dob)) e.dob = 'You must be 18 or older to join Ember';
    }
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    signIn({ email: form.email, name: form.name || form.email.split('@')[0], dob: form.dob, joinedAt: Date.now() });
    setLoading(false);
  };

  const inputStyle = (err?: string): React.CSSProperties => ({
    width: '100%', background: '#0E0E0E',
    border: `1px solid ${err ? '#cc3333' : 'rgba(255,255,255,0.10)'}`,
    borderRadius: '10px', padding: '13px 16px',
    color: '#fff', fontSize: '15px', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => { if (e.target === overlayRef.current) closeAuth(); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '440px',
              position: 'relative',
            }}
          >
            {/* close */}
            <button onClick={closeAuth} style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(255,255,255,0.06)', border: 'none',
              borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#888',
            }}><X size={18} /></button>

            {/* header */}
            <div style={{ marginBottom: '32px' }}>
              <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '12px', color: 'var(--maroon)', letterSpacing: '0.14em', marginBottom: '8px', textTransform: 'uppercase' }}>
                EMBER
              </p>
              <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '28px', color: '#fff', lineHeight: 1.2, marginBottom: '8px' }}>
                {mode === 'join' ? 'Join the brotherhood.' : 'Welcome back.'}
              </h2>
              {pendingReason && (
                <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: '1.5' }}>
                  {pendingReason}
                </p>
              )}
            </div>

            {/* tab toggle */}
            <div style={{
              display: 'flex', background: '#111', borderRadius: '10px',
              padding: '4px', marginBottom: '28px', gap: '4px',
            }}>
              {(['join', 'signin'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  style={{
                    flex: 1, padding: '9px', borderRadius: '8px', border: 'none',
                    cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit',
                    background: mode === m ? 'var(--maroon)' : 'transparent',
                    color: mode === m ? '#fff' : '#888',
                    transition: 'all 0.2s',
                  }}
                >{m === 'join' ? 'Join Ember' : 'Sign in'}</button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {mode === 'join' && (
                <div>
                  <input
                    placeholder="Full name"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    style={inputStyle(errors.name)}
                  />
                  {errors.name && <p style={{ color: '#cc3333', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
                </div>
              )}

              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  style={inputStyle(errors.email)}
                />
                {errors.email && <p style={{ color: '#cc3333', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  style={{ ...inputStyle(errors.password), paddingRight: '48px' }}
                  onKeyDown={e => { if (e.key === 'Enter') submit(); }}
                />
                <button onClick={() => setShowPw(s => !s)} style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '2px',
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {errors.password && <p style={{ color: '#cc3333', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
              </div>

              {mode === 'join' && (
                <div>
                  <label style={{ display: 'block', color: '#888', fontSize: '12px', marginBottom: '6px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em' }}>
                    DATE OF BIRTH (18+ only)
                  </label>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={e => set('dob', e.target.value)}
                    max={new Date(Date.now() - 18 * 365.25 * 86400000).toISOString().split('T')[0]}
                    style={{ ...inputStyle(errors.dob), colorScheme: 'dark' }}
                  />
                  {errors.dob && <p style={{ color: '#cc3333', fontSize: '12px', marginTop: '4px' }}>{errors.dob}</p>}
                </div>
              )}

              <div style={{ marginTop: '4px' }}>
                <FireButton
                  variant="primary" size="lg" fullWidth
                  onClick={submit}
                >
                  {loading ? '…' : mode === 'join' ? 'Create account' : 'Sign in'}
                </FireButton>
              </div>

              {mode === 'join' && (
                <p style={{ color: '#555', fontSize: '12px', lineHeight: '1.6', textAlign: 'center' }}>
                  By joining you agree to the{' '}
                  <a href="/terms" target="_blank" style={{ color: 'var(--beige)', textDecoration: 'none' }}>Terms</a>
                  {' & '}
                  <a href="/privacy" target="_blank" style={{ color: 'var(--beige)', textDecoration: 'none' }}>Privacy Policy</a>.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
