import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const SUBJECTS = ['Events', 'Vault', 'Membership', 'Payment', 'Account', 'Other'] as const;
type Subject = typeof SUBJECTS[number];

interface FormState {
  firstName: string;
  lastName:  string;
  email:     string;
  subject:   Subject;
  message:   string;
}

export function Contact() {
  const [form, setForm] = useState<FormState>({
    firstName: '', lastName: '', email: '', subject: 'Events', message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Enter your first name';
    if (!form.lastName.trim())  e.lastName  = 'Enter your last name';
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) e.email = 'Enter a valid email';
    if (!form.message.trim() || form.message.length < 10) e.message = 'Tell us a little more (10+ characters)';
    return e;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSending(true);
    try {
      const response = await fetch('/api/email/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Message could not be sent');
      setSent(true);
    } catch {
      setErrors({ message: 'Message could not be sent. Please email support@emberworld.co directly.' });
    } finally {
      setSending(false);
    }
  };

  const baseInput = (err?: string): React.CSSProperties => ({
    width: '100%',
    background: 'rgba(26,23,20,0.7)',
    border: `1px solid ${err ? 'rgba(204,51,51,0.6)' : 'rgba(245,237,224,0.08)'}`,
    borderRadius: '12px',
    padding: '14px 18px',
    color: 'var(--bone-100)',
    fontSize: '15px',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color 0.25s cubic-bezier(0.4,0,0.2,1), background 0.25s cubic-bezier(0.4,0,0.2,1)',
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '0.16em',
    color: 'var(--bone-500)',
    textTransform: 'uppercase',
    marginBottom: '8px',
    display: 'block',
  };

  return (
    <div style={{ color: 'var(--bone-100)', minHeight: '100vh' }}>
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="v3-section"
        style={{ paddingTop: '140px', paddingBottom: '48px', position: 'relative', overflow: 'hidden' }}
      >
        <div aria-hidden style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '400px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="section-label">Contact</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 6vw, 80px)',
              color: 'var(--bone-100)',
              lineHeight: 1.05,
              marginBottom: '24px',
            }}
          >
            Talk to us.<br />
            <span className="accent-italic">We read everything.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: 'var(--bone-400)', fontSize: '17px', lineHeight: 1.7, maxWidth: '560px' }}
          >
            No bots. No form letters. Every message is read by a person who gives a
            damn about Ember. Drop your question below and we'll reply within 48 hours.
          </motion.p>
        </div>
      </section>

      {/* ── FORM ─────────────────────────────────────────────── */}
      <section style={{ padding: '20px 0 120px', position: 'relative' }}>
        <div className="page-container" style={{ maxWidth: '760px' }}>
          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              className="rank-card-v3"
              style={{
                padding: '56px 40px', textAlign: 'center',
                background: 'rgba(85,0,0,0.18)',
                border: '1px solid rgba(128,0,0,0.35)',
              }}
            >
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(128,0,0,0.3)',
                border: '1px solid rgba(128,0,0,0.5)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '28px',
                boxShadow: '0 0 30px rgba(128,0,0,0.4)',
              }}>
                <Check size={26} style={{ color: 'var(--beige)' }} />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '34px', color: 'var(--bone-100)',
                marginBottom: '14px', letterSpacing: '-0.02em',
              }}>
                Message received.
              </h3>
              <p style={{ color: 'var(--bone-400)', fontSize: '16px', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto' }}>
                We'll reply to <span style={{ color: 'var(--beige)' }}>{form.email}</span> within 48 hours.
              </p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={submit} noValidate
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="rank-card-v3"
              style={{
                padding: '40px',
                display: 'flex', flexDirection: 'column', gap: '24px',
              }}
            >
              {/* Name row */}
              <div className="contact-name-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle} htmlFor="firstName">First name</label>
                  <input
                    id="firstName"
                    placeholder="Marcus"
                    value={form.firstName}
                    onChange={e => set('firstName', e.target.value)}
                    style={baseInput(errors.firstName)}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(128,0,0,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = errors.firstName ? 'rgba(204,51,51,0.6)' : 'rgba(245,237,224,0.08)')}
                  />
                  {errors.firstName && <p style={{ color: '#cc6666', fontSize: '12px', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>{errors.firstName}</p>}
                </div>
                <div>
                  <label style={labelStyle} htmlFor="lastName">Last name</label>
                  <input
                    id="lastName"
                    placeholder="Brennan"
                    value={form.lastName}
                    onChange={e => set('lastName', e.target.value)}
                    style={baseInput(errors.lastName)}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(128,0,0,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = errors.lastName ? 'rgba(204,51,51,0.6)' : 'rgba(245,237,224,0.08)')}
                  />
                  {errors.lastName && <p style={{ color: '#cc6666', fontSize: '12px', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle} htmlFor="email">Email</label>
                <input
                  id="email" type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  style={baseInput(errors.email)}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(128,0,0,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.email ? 'rgba(204,51,51,0.6)' : 'rgba(245,237,224,0.08)')}
                />
                {errors.email && <p style={{ color: '#cc6666', fontSize: '12px', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>{errors.email}</p>}
              </div>

              {/* Subject — custom styled native select */}
              <div>
                <label style={labelStyle} htmlFor="subject">Subject</label>
                <div style={{ position: 'relative' }}>
                  <select
                    id="subject"
                    value={form.subject}
                    onChange={e => set('subject', e.target.value as Subject)}
                    style={{
                      ...baseInput(),
                      appearance: 'none',
                      cursor: 'pointer',
                      colorScheme: 'dark',
                      paddingRight: '46px',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(128,0,0,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(245,237,224,0.08)')}
                  >
                    {SUBJECTS.map(s => (
                      <option key={s} value={s} style={{ background: '#1a1714', color: 'var(--bone-100)' }}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    style={{
                      position: 'absolute', right: '18px', top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--bone-500)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle} htmlFor="message">Your message</label>
                <textarea
                  id="message"
                  placeholder="Tell us what's on your mind…"
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  rows={7}
                  style={{
                    ...baseInput(errors.message),
                    resize: 'vertical',
                    minHeight: '160px',
                    lineHeight: 1.65,
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(128,0,0,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = errors.message ? 'rgba(204,51,51,0.6)' : 'rgba(245,237,224,0.08)')}
                />
                {errors.message && <p style={{ color: '#cc6666', fontSize: '12px', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-v3 primary lg"
                style={{ marginTop: '8px', width: '100%', opacity: sending ? 0.6 : 1, cursor: sending ? 'wait' : 'pointer' }}
              >
                {sending ? 'Sending…' : 'Send message →'}
              </button>

              <p className="mono" style={{ color: 'var(--bone-500)', fontSize: '11px', textAlign: 'center', letterSpacing: '0.12em' }}>
                WE REPLY WITHIN 48 HOURS · NO BOTS
              </p>
            </motion.form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
