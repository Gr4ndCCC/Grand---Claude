import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Camera, Check, X, Shield, AlertCircle, FileText, Loader,
} from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useAuth } from '../lib/auth';

type Step = 'intro' | 'document' | 'selfie' | 'review' | 'submitted';

export function Verify() {
  const { user, openAuth, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('intro');
  const [docFile, setDocFile] = useState<{ name: string; preview: string } | null>(null);
  const [selfieFile, setSelfieFile] = useState<{ name: string; preview: string } | null>(null);
  const [docType, setDocType] = useState<'passport' | 'drivers' | 'national_id'>('passport');
  const [submitting, setSubmitting] = useState(false);

  const docInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
        <Nav />
        <div style={{ paddingTop: '160px', textAlign: 'center' }}>
          <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '12px' }}>Verification</p>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '36px', color: '#fff', marginBottom: '16px' }}>
            Sign in first.
          </h1>
          <p style={{ color: '#A0A0A0', marginBottom: '32px' }}>
            You need an Ember account to start ID verification.
          </p>
          <button
            onClick={() => openAuth('Sign in to verify your identity.')}
            style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 32px', cursor: 'pointer', fontSize: '15px', fontWeight: 600, fontFamily: 'inherit' }}
          >Sign in</button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, kind: 'doc' | 'selfie') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = { name: file.name, preview: ev.target?.result as string };
      if (kind === 'doc') setDocFile(result);
      else setSelfieFile(result);
    };
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    updateUser({ verifyStatus: 'pending', verifySubmittedAt: Date.now() });
    setSubmitting(false);
    setStep('submitted');
  };

  const status = user.verifyStatus ?? 'unverified';

  // Already verified or pending → show status banner
  if ((status === 'pending' || status === 'verified') && step === 'intro') {
    return (
      <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
        <Nav />
        <div className="page-container" style={{ paddingTop: '140px', paddingBottom: '120px', maxWidth: '720px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center', padding: '48px',
              background: status === 'verified' ? 'rgba(60,140,80,0.10)' : 'rgba(218,165,32,0.10)',
              border: status === 'verified' ? '1px solid rgba(60,140,80,0.30)' : '1px solid rgba(218,165,32,0.30)',
              borderRadius: '20px',
            }}
          >
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: status === 'verified' ? 'rgba(60,140,80,0.18)' : 'rgba(218,165,32,0.18)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
            }}>
              {status === 'verified' ? <Check size={32} style={{ color: '#5cb85c' }} /> : <Loader size={32} style={{ color: '#DAA520' }} />}
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '36px', color: '#fff', marginBottom: '12px' }}>
              {status === 'verified' ? 'You\'re verified.' : 'Under review.'}
            </h1>
            <p style={{ color: '#A0A0A0', fontSize: '16px', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 32px' }}>
              {status === 'verified'
                ? 'Your identity has been confirmed. You have full access to the Vault, the Brotherhood Network, and all Ember features.'
                : 'We\'re reviewing your documents. This usually takes 1–3 business days. We\'ll email you the moment your verification is complete.'}
            </p>
            <button
              onClick={() => navigate(status === 'verified' ? '/vault' : '/account')}
              style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 28px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit' }}
            >
              {status === 'verified' ? 'Continue to Vault' : 'Back to account'}
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      <div className="page-container" style={{ paddingTop: '120px', paddingBottom: '100px', maxWidth: '720px' }}>
        {/* progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
          {(['intro', 'document', 'selfie', 'review'] as Step[]).map((s, i) => {
            const active = ['intro', 'document', 'selfie', 'review'].indexOf(step);
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: i <= active ? 'var(--maroon)' : '#1A1A1A',
                  border: i <= active ? '1px solid var(--maroon)' : '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: i <= active ? '#fff' : '#555', fontSize: '11px', fontWeight: 600,
                  flexShrink: 0,
                }}>{i + 1}</div>
                {i < 3 && <div style={{ flex: 1, height: '1px', background: i < active ? 'var(--maroon)' : 'rgba(255,255,255,0.08)' }} />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px', letterSpacing: '0.14em' }}>VAULT VERIFICATION</p>
              <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(36px, 5vw, 56px)', color: '#fff', marginBottom: '20px', lineHeight: 1.05 }}>
                Verify your identity.<br />
                <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>Earn the badge.</span>
              </h1>
              <p style={{ color: '#A0A0A0', fontSize: '16px', lineHeight: 1.7, marginBottom: '40px', maxWidth: '560px' }}>
                The Vault is real members only. We verify every account so the Brotherhood Network stays trustworthy. It takes 2 minutes. We&apos;ll never share your documents.
              </p>

              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px', marginBottom: '24px' }}>
                <p className="mono" style={{ color: '#5A5A5A', marginBottom: '20px', letterSpacing: '0.12em' }}>WHAT YOU&apos;LL NEED</p>
                {[
                  { icon: FileText, label: 'A government-issued photo ID', desc: 'Passport, driver\'s license, or national ID card' },
                  { icon: Camera,   label: 'A live selfie',                desc: 'To match against your ID document' },
                  { icon: Shield,   label: '2 minutes of your time',       desc: 'We process most reviews within 24 hours' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <Icon size={18} style={{ color: 'var(--maroon)', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <p style={{ color: '#fff', fontSize: '14px', marginBottom: '2px' }}>{label}</p>
                      <p style={{ color: '#666', fontSize: '12px' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '14px 16px', background: 'rgba(128,0,0,0.06)', border: '1px solid rgba(128,0,0,0.2)', borderRadius: '10px', marginBottom: '32px' }}>
                <Shield size={14} style={{ color: 'var(--maroon)', flexShrink: 0 }} />
                <p style={{ color: '#A0A0A0', fontSize: '12px' }}>
                  Documents are encrypted at rest, reviewed by our team, then deleted within 30 days.
                </p>
              </div>

              <button onClick={() => setStep('document')}
                style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 28px', cursor: 'pointer', fontSize: '15px', fontWeight: 600, fontFamily: 'inherit', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--maroon-light)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--maroon)')}
              >Start verification →</button>
            </motion.div>
          )}

          {step === 'document' && (
            <motion.div key="document" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>STEP 1 OF 3</p>
              <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '36px', color: '#fff', marginBottom: '12px' }}>Upload your ID</h2>
              <p style={{ color: '#A0A0A0', marginBottom: '32px', fontSize: '15px' }}>Pick a document type and upload a clear photo of both sides.</p>

              {/* doc type selector */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' }}>
                {[
                  { id: 'passport',    label: 'Passport' },
                  { id: 'drivers',     label: 'Driver\'s License' },
                  { id: 'national_id', label: 'National ID' },
                ].map(t => (
                  <button key={t.id} onClick={() => setDocType(t.id as typeof docType)}
                    style={{
                      padding: '14px 12px', borderRadius: '10px',
                      background: docType === t.id ? 'rgba(128,0,0,0.18)' : '#111',
                      border: docType === t.id ? '1px solid var(--maroon)' : '1px solid rgba(255,255,255,0.08)',
                      color: docType === t.id ? '#fff' : '#888',
                      cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
                      transition: 'all 0.2s',
                    }}
                  >{t.label}</button>
                ))}
              </div>

              <input
                ref={docInputRef}
                type="file"
                accept="image/*,application/pdf"
                style={{ display: 'none' }}
                onChange={e => handleFile(e, 'doc')}
              />

              {!docFile ? (
                <button
                  onClick={() => docInputRef.current?.click()}
                  style={{
                    width: '100%', padding: '60px 24px',
                    background: '#0E0E0E', border: '2px dashed rgba(255,255,255,0.12)',
                    borderRadius: '14px', cursor: 'pointer', color: '#888',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                    fontFamily: 'inherit', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--maroon)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#888'; }}
                >
                  <Upload size={28} />
                  <p style={{ fontSize: '15px' }}>Click to upload your ID</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>JPG, PNG or PDF · Max 10 MB</p>
                </button>
              ) : (
                <div style={{ background: '#111', border: '1px solid rgba(60,140,80,0.3)', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {docFile.preview.startsWith('data:image') ? (
                    <img src={docFile.preview} alt="ID preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={28} style={{ color: '#888' }} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Check size={14} style={{ color: '#5cb85c' }} />
                      <p className="mono" style={{ color: '#5cb85c', fontSize: '11px' }}>UPLOADED</p>
                    </div>
                    <p style={{ color: '#fff', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{docFile.name}</p>
                  </div>
                  <button onClick={() => setDocFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '4px' }}><X size={16} /></button>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                <button onClick={() => setStep('intro')} style={{ background: 'transparent', color: '#888', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 20px', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}>← Back</button>
                <button
                  onClick={() => setStep('selfie')}
                  disabled={!docFile}
                  style={{
                    background: docFile ? 'var(--maroon)' : 'rgba(128,0,0,0.3)',
                    color: '#fff', border: 'none', borderRadius: '10px',
                    padding: '12px 24px', cursor: docFile ? 'pointer' : 'not-allowed',
                    fontSize: '14px', fontWeight: 600, fontFamily: 'inherit',
                    opacity: docFile ? 1 : 0.5,
                  }}
                >Continue →</button>
              </div>
            </motion.div>
          )}

          {step === 'selfie' && (
            <motion.div key="selfie" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>STEP 2 OF 3</p>
              <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '36px', color: '#fff', marginBottom: '12px' }}>Take a selfie</h2>
              <p style={{ color: '#A0A0A0', marginBottom: '32px', fontSize: '15px' }}>Show your face clearly. We&apos;ll match it against your ID photo.</p>

              <input
                ref={selfieInputRef}
                type="file"
                accept="image/*"
                capture="user"
                style={{ display: 'none' }}
                onChange={e => handleFile(e, 'selfie')}
              />

              {!selfieFile ? (
                <button
                  onClick={() => selfieInputRef.current?.click()}
                  style={{
                    width: '100%', padding: '60px 24px',
                    background: '#0E0E0E', border: '2px dashed rgba(255,255,255,0.12)',
                    borderRadius: '14px', cursor: 'pointer', color: '#888',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                    fontFamily: 'inherit', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--maroon)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#888'; }}
                >
                  <Camera size={28} />
                  <p style={{ fontSize: '15px' }}>Tap to take a selfie</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>Or upload a recent photo</p>
                </button>
              ) : (
                <div style={{ background: '#111', border: '1px solid rgba(60,140,80,0.3)', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img src={selfieFile.preview} alt="Selfie preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Check size={14} style={{ color: '#5cb85c' }} />
                      <p className="mono" style={{ color: '#5cb85c', fontSize: '11px' }}>CAPTURED</p>
                    </div>
                    <p style={{ color: '#fff', fontSize: '14px' }}>{selfieFile.name}</p>
                  </div>
                  <button onClick={() => setSelfieFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '4px' }}><X size={16} /></button>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                <button onClick={() => setStep('document')} style={{ background: 'transparent', color: '#888', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 20px', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}>← Back</button>
                <button
                  onClick={() => setStep('review')}
                  disabled={!selfieFile}
                  style={{
                    background: selfieFile ? 'var(--maroon)' : 'rgba(128,0,0,0.3)',
                    color: '#fff', border: 'none', borderRadius: '10px',
                    padding: '12px 24px', cursor: selfieFile ? 'pointer' : 'not-allowed',
                    fontSize: '14px', fontWeight: 600, fontFamily: 'inherit',
                    opacity: selfieFile ? 1 : 0.5,
                  }}
                >Review →</button>
              </div>
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div key="review" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>STEP 3 OF 3</p>
              <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '36px', color: '#fff', marginBottom: '12px' }}>Review and submit</h2>
              <p style={{ color: '#A0A0A0', marginBottom: '32px', fontSize: '15px' }}>Confirm everything looks right. You won&apos;t be able to edit after submitting.</p>

              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
                <p className="mono" style={{ color: '#5A5A5A', marginBottom: '12px' }}>NAME ON FILE</p>
                <p style={{ color: '#fff', fontSize: '15px', marginBottom: '20px' }}>{user.name}</p>

                <p className="mono" style={{ color: '#5A5A5A', marginBottom: '12px' }}>DOCUMENT TYPE</p>
                <p style={{ color: '#fff', fontSize: '15px', marginBottom: '20px', textTransform: 'capitalize' }}>{docType.replace('_', ' ')}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <p className="mono" style={{ color: '#5A5A5A', marginBottom: '8px' }}>ID DOCUMENT</p>
                    {docFile?.preview.startsWith('data:image') ? (
                      <img src={docFile.preview} alt="ID" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      <div style={{ height: '140px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={32} style={{ color: '#666' }} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="mono" style={{ color: '#5A5A5A', marginBottom: '8px' }}>SELFIE</p>
                    {selfieFile && <img src={selfieFile.preview} alt="Selfie" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} />}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '14px 16px', background: 'rgba(218,165,32,0.06)', border: '1px solid rgba(218,165,32,0.2)', borderRadius: '10px', marginBottom: '32px' }}>
                <AlertCircle size={14} style={{ color: '#DAA520', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ color: '#A0A0A0', fontSize: '12px', lineHeight: 1.6 }}>
                  By submitting, you confirm the documents are genuine and belong to you. Submitting fake documents will result in a permanent ban from Ember.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep('selfie')} disabled={submitting} style={{ background: 'transparent', color: '#888', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 20px', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '14px', fontFamily: 'inherit' }}>← Back</button>
                <button
                  onClick={submit}
                  disabled={submitting}
                  style={{
                    background: 'var(--maroon)', color: '#fff', border: 'none',
                    borderRadius: '10px', padding: '12px 28px',
                    cursor: submitting ? 'wait' : 'pointer',
                    fontSize: '14px', fontWeight: 600, fontFamily: 'inherit',
                    opacity: submitting ? 0.7 : 1,
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                >
                  {submitting && <Loader size={14} className="animate-spin" />}
                  {submitting ? 'Submitting…' : 'Submit for review'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'submitted' && (
            <motion.div key="submitted" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'rgba(60,140,80,0.18)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Check size={40} style={{ color: '#5cb85c' }} />
              </div>
              <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '40px', color: '#fff', marginBottom: '16px' }}>
                Submitted.
              </h2>
              <p style={{ color: '#A0A0A0', fontSize: '16px', maxWidth: '460px', margin: '0 auto 32px', lineHeight: 1.7 }}>
                We&apos;ve received your documents. Most reviews complete within 24 hours.
                We&apos;ll email <span style={{ color: 'var(--beige)' }}>{user.email}</span> as soon as you&apos;re verified.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => navigate('/account')} style={{ background: 'transparent', color: 'var(--beige)', border: '1px solid rgba(228,207,179,0.25)', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}>Go to account</button>
                <button onClick={() => navigate('/')} style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit' }}>Back to Ember</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
