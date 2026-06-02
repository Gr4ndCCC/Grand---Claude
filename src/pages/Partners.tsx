import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { FireButton } from '../components/FireButton';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['Butcher', 'Grill & equipment', 'Charcoal & fuel', 'Drinks', 'Chef', 'DJ / music', 'Venue', 'Local food culture', 'Other'];

// The kinds of partners Ember is curating — shown as a vision, not fake listings.
const SEEKING = [
  { t: 'Butchers',          d: 'Dry-agers, whole-animal specialists, rare cuts.' },
  { t: 'Grill & equipment', d: 'Smoker builders, knife makers, fire tools.' },
  { t: 'Charcoal & fuel',   d: 'Lumpwood, binchotan, hardwood producers.' },
  { t: 'Drinks',            d: 'Natural wine, craft beer, mezcal, non-alc.' },
  { t: 'Chefs & DJs',       d: 'Talent for gatherings and the Annual Summit.' },
  { t: 'Venues',            d: 'Gardens, rooftops, farms — places to gather.' },
];

interface FormState {
  business_name: string; contact_name: string; email: string;
  category: string; location: string; link: string; message: string;
}
const EMPTY: FormState = { business_name: '', contact_name: '', email: '', category: CATEGORIES[0], location: '', link: '', message: '' };

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(26,23,20,0.8)', border: '1px solid rgba(245,237,224,0.1)',
  borderRadius: '8px', padding: '11px 12px', color: '#fff', fontSize: '14px', outline: 'none',
  fontFamily: 'inherit', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', color: '#A0A0A0', marginBottom: '6px' };

export function Partners() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const canSubmit = form.business_name.trim() && form.contact_name.trim() && emailOk && form.category && status !== 'sending';

  const submit = async () => {
    if (!canSubmit) return;
    setStatus('sending');
    setErrorMsg('');
    const { error } = await supabase.from('partner_applications').insert({
      business_name: form.business_name.trim(),
      contact_name: form.contact_name.trim(),
      email: form.email.trim(),
      category: form.category,
      location: form.location.trim() || null,
      link: form.link.trim() || null,
      message: form.message.trim() || null,
    });
    if (error) { setStatus('error'); setErrorMsg('Something went wrong. Please try again.'); return; }
    setStatus('done');
    setForm(EMPTY);
  };

  const close = () => { setOpen(false); setStatus('idle'); setErrorMsg(''); };

  return (
    <div style={{ color: 'var(--bone-100)', minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: '140px', paddingBottom: '60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>Partners</motion.p>
          <span className="maroon-rule" />
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff', lineHeight: 1.06, marginBottom: '24px' }}
          >
            Become an<br />
            <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>Ember Partner.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: '#A0A0A0', fontSize: '17px', lineHeight: '1.7', maxWidth: '620px' }}
          >
            Ember is building a curated network of butchers, grill suppliers, drink
            brands, chefs, DJs, venues, and local food-culture partners. Selected
            partners are featured inside the Vault and connected directly to the
            community. No fees. No paid placement. We review every application personally.
          </motion.p>
          <div style={{ marginTop: '32px' }}>
            <FireButton variant="primary" size="md" onClick={() => setOpen(true)}>
              Apply to Partner
            </FireButton>
          </div>
        </div>
      </section>

      <section style={{ padding: '20px 0 100px' }}>
        <div className="page-container">
          <p className="mono" style={{ color: '#5A5A5A', marginBottom: '20px' }}>Who we're looking for</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {SEEKING.map(({ t, d }, i) => (
              <motion.div key={t}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.05 }}
                style={{ background: 'rgba(26,23,20,0.7)', border: '1px solid rgba(245,237,224,0.07)', borderRadius: '14px', padding: '24px' }}
              >
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#fff', marginBottom: '6px' }}>{t}</p>
                <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: 1.6 }}>{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '16px', padding: '32px', maxWidth: '520px', width: '100%', margin: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#fff' }}>Apply to Partner</h3>
                <button onClick={close} style={{ background: 'none', border: 'none', color: '#5A5A5A', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              {status === 'done' ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#fff', marginBottom: '8px' }}>Application received.</p>
                  <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                    Thanks — we review every application personally and will be in touch by email.
                  </p>
                  <button onClick={close} style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 22px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Done</button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <label><span style={labelStyle}>Business name *</span><input value={form.business_name} onChange={set('business_name')} style={inputStyle} /></label>
                      <label><span style={labelStyle}>Contact name *</span><input value={form.contact_name} onChange={set('contact_name')} style={inputStyle} /></label>
                    </div>
                    <label><span style={labelStyle}>Email *</span><input type="email" value={form.email} onChange={set('email')} style={inputStyle} /></label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <label><span style={labelStyle}>Category *</span>
                        <select value={form.category} onChange={set('category')} style={{ ...inputStyle, cursor: 'pointer' }}>
                          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </label>
                      <label><span style={labelStyle}>City / Country</span><input value={form.location} onChange={set('location')} style={inputStyle} /></label>
                    </div>
                    <label><span style={labelStyle}>Website / Instagram</span><input value={form.link} onChange={set('link')} style={inputStyle} placeholder="https://" /></label>
                    <label><span style={labelStyle}>Short message</span>
                      <textarea value={form.message} onChange={set('message')} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Tell us about your business and why it's a fit." />
                    </label>
                  </div>
                  {errorMsg && <p style={{ color: '#f87171', fontSize: '13px', marginTop: '12px' }}>{errorMsg}</p>}
                  <button onClick={submit} disabled={!canSubmit}
                    style={{ width: '100%', marginTop: '20px', background: canSubmit ? 'var(--maroon)' : 'rgba(255,255,255,0.05)', color: canSubmit ? '#fff' : '#5A5A5A', border: 'none', borderRadius: '10px', padding: '13px', cursor: canSubmit ? 'pointer' : 'not-allowed', fontWeight: 600, fontFamily: 'inherit' }}
                  >{status === 'sending' ? 'Submitting…' : 'Submit application'}</button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
