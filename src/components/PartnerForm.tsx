import { useState, FormEvent } from 'react';
import { Check } from 'lucide-react';

const BUSINESS_TYPES = [
  'Butcher / Meat supplier',
  'Charcoal / Fire supplier',
  'Grill equipment',
  'Knife maker',
  'Wine & spirits',
  'Spices & rubs',
];

const YEARS_OPTIONS = ['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years'];

const PARTNERSHIP_TYPES = [
  'Partner listing in the Vault',
  'Exclusive member discount',
  'Sponsor an Ember event',
  'Sponsor the Annual Summit',
];

type Step = 1 | 2 | 3 | 4;

export function PartnerForm() {
  const [step,      setStep]      = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [form,      setForm]      = useState({
    company:         '',
    owner:           '',
    email:           '',
    phone:           '',
    country:         '',
    city:            '',
    website:         '',
    businessType:    '',
    yearsInBusiness: '',
    why:             '',
    unique:          '',
    awards:          '',
    partnershipType: '',
  });

  const progress = submitted ? 100 : ((step - 1) / 4) * 100;

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL || '';
    if (apiUrl) {
      fetch(`${apiUrl}/api/partners/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }).catch(() => {});
    }
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#1A1A1A',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: 'system-ui',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#A0A0A0',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '6px',
  };

  const fieldFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'rgba(128,0,0,0.70)';
    e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(128,0,0,0.12)';
  };
  const fieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
    e.currentTarget.style.boxShadow   = 'none';
  };

  if (submitted) {
    return (
      <div
        className="rounded-2xl p-10 text-center"
        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div
          className="mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-full"
          style={{ background: 'rgba(128,0,0,0.20)', border: '1px solid rgba(128,0,0,0.40)' }}
        >
          <Check size={28} style={{ color: '#E4CFB3' }} />
        </div>
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#FFFFFF', marginBottom: '12px' }}>
          Application received.
        </h3>
        <p style={{ color: '#A0A0A0', fontSize: '15px', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
          We review every submission personally. If you're a fit for the brotherhood, you'll hear from us within 5 business days.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Progress bar */}
      <div style={{ height: '3px', background: '#1A1A1A' }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: '#800000',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      <div className="p-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {([1, 2, 3, 4] as Step[]).map(s => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: step >= s ? '#800000' : '#1A1A1A',
                  color:      step >= s ? '#FFFFFF' : '#5A5A5A',
                  border:     step === s ? '1px solid #990000' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {step > s ? <Check size={12} /> : s}
              </div>
              {s < 4 && (
                <div
                  style={{
                    width: '32px',
                    height: '1px',
                    background: step > s ? '#800000' : 'rgba(255,255,255,0.08)',
                  }}
                />
              )}
            </div>
          ))}
          <span style={{ color: '#5A5A5A', fontSize: '13px', marginLeft: '8px' }}>
            Step {step} of 4
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Company identity */}
          {step === 1 && (
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#E4CFB3', marginBottom: '4px' }}>
                Company identity
              </h3>
              <p style={{ color: '#5A5A5A', fontSize: '13px', marginBottom: '24px' }}>Tell us who you are.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'company', label: 'Company name', placeholder: 'e.g. Black Angus Butchery' },
                  { key: 'owner',   label: 'Owner name',   placeholder: 'Your full name' },
                  { key: 'email',   label: 'Email',         placeholder: 'you@company.com', type: 'email' },
                  { key: 'phone',   label: 'Phone',         placeholder: '+1 (555) 000-0000', type: 'tel' },
                  { key: 'country', label: 'Country',       placeholder: 'e.g. Netherlands' },
                  { key: 'city',    label: 'City',          placeholder: 'e.g. Amsterdam' },
                ].map(({ key, label, placeholder, type = 'text' }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      type={type}
                      value={form[key as keyof typeof form]}
                      onChange={set(key as keyof typeof form)}
                      placeholder={placeholder}
                      style={inputStyle}
                      onFocus={fieldFocus}
                      onBlur={fieldBlur}
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label style={labelStyle}>Website</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={set('website')}
                    placeholder="https://yourcompany.com"
                    style={inputStyle}
                    onFocus={fieldFocus}
                    onBlur={fieldBlur}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business background */}
          {step === 2 && (
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#E4CFB3', marginBottom: '4px' }}>
                Business background
              </h3>
              <p style={{ color: '#5A5A5A', fontSize: '13px', marginBottom: '24px' }}>Tell us about your craft.</p>

              <div className="flex flex-col gap-4">
                <div>
                  <label style={labelStyle}>Business type</label>
                  <select
                    value={form.businessType}
                    onChange={set('businessType')}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={fieldFocus}
                    onBlur={fieldBlur}
                  >
                    <option value="" disabled>Select your business type</option>
                    {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Years in business</label>
                  <select
                    value={form.yearsInBusiness}
                    onChange={set('yearsInBusiness')}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={fieldFocus}
                    onBlur={fieldBlur}
                  >
                    <option value="" disabled>Select years in business</option>
                    {YEARS_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Why Ember */}
          {step === 3 && (
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#E4CFB3', marginBottom: '4px' }}>
                Why Ember
              </h3>
              <p style={{ color: '#5A5A5A', fontSize: '13px', marginBottom: '24px' }}>Convince us. We're picky.</p>

              <div className="flex flex-col gap-4">
                <div>
                  <label style={labelStyle}>Why should your company be on Ember?</label>
                  <textarea
                    value={form.why}
                    onChange={set('why')}
                    placeholder="The brotherhood deserves the best. Here's why that's us..."
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={fieldFocus}
                    onBlur={fieldBlur}
                  />
                </div>
                <div>
                  <label style={labelStyle}>What makes you unique?</label>
                  <input
                    type="text"
                    value={form.unique}
                    onChange={set('unique')}
                    placeholder="e.g. Only supplier of Japanese binchotan in Europe"
                    style={inputStyle}
                    onFocus={fieldFocus}
                    onBlur={fieldBlur}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Awards or press (optional)</label>
                  <input
                    type="text"
                    value={form.awards}
                    onChange={set('awards')}
                    placeholder="e.g. Best Butcher 2024 – Time Out Amsterdam"
                    style={inputStyle}
                    onFocus={fieldFocus}
                    onBlur={fieldBlur}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Partnership details */}
          {step === 4 && (
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#E4CFB3', marginBottom: '4px' }}>
                Partnership type
              </h3>
              <p style={{ color: '#5A5A5A', fontSize: '13px', marginBottom: '24px' }}>How do you want to work with us?</p>

              <div className="flex flex-col gap-3">
                {PARTNERSHIP_TYPES.map(type => (
                  <label
                    key={type}
                    className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      background:   form.partnershipType === type ? 'rgba(128,0,0,0.12)' : '#1A1A1A',
                      border:       `1px solid ${form.partnershipType === type ? 'rgba(128,0,0,0.50)' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <input
                      type="radio"
                      name="partnershipType"
                      value={type}
                      checked={form.partnershipType === type}
                      onChange={set('partnershipType')}
                      style={{ accentColor: '#800000' }}
                    />
                    <span style={{ color: form.partnershipType === type ? '#FFFFFF' : '#A0A0A0', fontSize: '14px' }}>
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as Step)}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  color: '#A0A0A0',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as Step)}
                style={{
                  background: '#800000',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 28px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                style={{
                  background: '#800000',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 28px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Submit application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
