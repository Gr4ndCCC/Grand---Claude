import { useState } from 'react';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { FireButton } from '../components/FireButton';

const TOPICS = ['General', 'Vault & Membership', 'Events', 'Partnership', 'Privacy & Data', 'Report a user', 'Other'];

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: 'General', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Enter your name';
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = 'Enter a valid email';
    if (!form.message.trim() || form.message.length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSent(true);
  };

  const inputStyle = (err?: string): React.CSSProperties => ({
    width: '100%', background: '#0E0E0E',
    border: `1px solid ${err ? '#cc3333' : 'rgba(255,255,255,0.10)'}`,
    borderRadius: '10px', padding: '13px 16px',
    color: '#fff', fontSize: '15px', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  });

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: '140px', paddingBottom: '60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.16) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>Contact</motion.p>
          <span className="maroon-rule" />
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff', lineHeight: 1.06, marginBottom: '20px' }}
          >
            Talk to us.<br />
            <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>We read everything.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: '#A0A0A0', fontSize: '17px', lineHeight: '1.7', maxWidth: '540px' }}
          >
            No bots. No form letters. Every message is read by a person who gives a damn about Ember.
          </motion.p>
        </div>
      </section>

      <section style={{ padding: '20px 0 120px' }}>
        <div className="page-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', maxWidth: '1100px' }}>

          {/* form */}
          <div>
            {sent ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'rgba(128,0,0,0.12)', border: '1px solid rgba(128,0,0,0.30)', borderRadius: '16px', padding: '40px', textAlign: 'center' }}
              >
                <p style={{ fontSize: '32px', marginBottom: '16px' }}>🔥</p>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', color: '#fff', marginBottom: '12px' }}>Message received.</h3>
                <p style={{ color: '#A0A0A0', fontSize: '15px', lineHeight: '1.7' }}>We'll reply to {form.email} within 48 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <input placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle(errors.name)} />
                    {errors.name && <p style={{ color: '#cc3333', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
                  </div>
                  <div>
                    <input type="email" placeholder="Email address" value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle(errors.email)} />
                    {errors.email && <p style={{ color: '#cc3333', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <select value={form.topic} onChange={e => set('topic', e.target.value)}
                    style={{ ...inputStyle(), appearance: 'none', cursor: 'pointer', colorScheme: 'dark' }}
                  >
                    {TOPICS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <textarea
                    placeholder="Your message…"
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    rows={6}
                    style={{ ...inputStyle(errors.message), resize: 'vertical', minHeight: '140px' }}
                  />
                  {errors.message && <p style={{ color: '#cc3333', fontSize: '12px', marginTop: '4px' }}>{errors.message}</p>}
                </div>

                <FireButton variant="primary" size="lg" onClick={() => submit({ preventDefault: () => {} } as React.FormEvent)}>
                  Send message
                </FireButton>
              </form>
            )}
          </div>

          {/* contact info */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {[
                { label: 'General', email: 'support@ember.community', desc: 'Questions about events, membership, or the platform.' },
                { label: 'Privacy & Data', email: 'privacy@ember.community', desc: 'Data requests, GDPR, deletion, and ID verification.' },
                { label: 'Partnerships', email: 'partners@ember.community', desc: 'Supplier and brand partnership enquiries.' },
                { label: 'Legal', email: 'legal@ember.community', desc: 'Terms, copyright, and legal notices.' },
              ].map(({ label, email, desc }) => (
                <div key={label} style={{ paddingBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '6px' }}>{label}</p>
                  <p style={{ fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--beige)', fontSize: '17px', marginBottom: '6px' }}>{email}</p>
                  <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
