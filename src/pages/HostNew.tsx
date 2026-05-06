import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Calendar, Users, Globe, Lock,
  Plus, X, Flame, Sparkles, Eye,
} from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useAuth } from '../lib/auth';
import { createEvent, COVER_PALETTE, THEME_OPTIONS } from '../data/events';
import { sendEventHostEmail } from '../lib/email';

const FLAG_BY_COUNTRY: Record<string, string> = {
  netherlands: '🇳🇱', amsterdam: '🇳🇱',
  japan: '🇯🇵', tokyo: '🇯🇵',
  usa: '🇺🇸', 'united states': '🇺🇸', 'new york': '🇺🇸', 'los angeles': '🇺🇸', brooklyn: '🇺🇸',
  portugal: '🇵🇹', lisbon: '🇵🇹',
  germany: '🇩🇪', berlin: '🇩🇪',
  brazil: '🇧🇷', 'são paulo': '🇧🇷', sao_paulo: '🇧🇷',
  france: '🇫🇷', paris: '🇫🇷',
  uk: '🇬🇧', london: '🇬🇧',
  italy: '🇮🇹', rome: '🇮🇹', milan: '🇮🇹',
  spain: '🇪🇸', madrid: '🇪🇸', barcelona: '🇪🇸',
};

function pickFlag(location: string) {
  const l = location.toLowerCase();
  for (const [key, flag] of Object.entries(FLAG_BY_COUNTRY)) {
    if (l.includes(key)) return flag;
  }
  return '🔥';
}

function extractCity(location: string) {
  return location.split(',')[0]?.trim() || location.trim();
}

export function HostNew() {
  const navigate = useNavigate();
  const { user, openAuth } = useAuth();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00');
  const [theme, setTheme] = useState(THEME_OPTIONS[0]);
  const [description, setDescription] = useState('');
  const [maxGuests, setMaxGuests] = useState(12);
  const [isPublic, setIsPublic] = useState(true);
  const [coverColor, setCoverColor] = useState(COVER_PALETTE[0].value);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [needed, setNeeded] = useState<string[]>(['Drinks', 'Sides', 'Dessert']);
  const [neededInput, setNeededInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) openAuth('Sign in to host an event.');
  }, [user, openAuth]);

  const formattedDate = useMemo(() => {
    if (!date) return '';
    try {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch { return date; }
  }, [date]);

  const canPublish = name.trim() && location.trim() && date && time && theme && description.trim() && maxGuests > 0;

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 6) setTags([...tags, t]);
    setTagInput('');
  };
  const removeTag = (t: string) => setTags(tags.filter(x => x !== t));

  const addNeeded = () => {
    const n = neededInput.trim();
    if (n && !needed.includes(n) && needed.length < 12) setNeeded([...needed, n]);
    setNeededInput('');
  };
  const removeNeeded = (n: string) => setNeeded(needed.filter(x => x !== n));

  const handlePublish = () => {
    if (!user) return openAuth('Sign in to host an event.');
    if (!canPublish) return;
    setSubmitting(true);
    const newEvent = createEvent({
      city: extractCity(location),
      flag: pickFlag(location),
      title: name.trim(),
      host: user.name,
      hostId: user.email,
      hostRank: 'Iron',
      date: formattedDate,
      time,
      max: maxGuests,
      isPublic,
      tags: tags.length ? tags : [theme.toLowerCase().split(' ')[0]],
      location: location.trim(),
      description: description.trim(),
      theme,
      coverColor,
      needed,
    });
    sendEventHostEmail({
      name: user.name,
      email: user.email,
      eventTitle: name.trim(),
      eventDate: formattedDate,
      eventTime: time,
      eventLocation: location.trim(),
      eventId: newEvent.id,
      maxGuests,
    });
    setTimeout(() => navigate(`/events/${newEvent.id}`), 300);
  };

  if (!user) {
    return (
      <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
        <Nav />
        <div style={{ padding: '160px 24px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '40px', marginBottom: '16px' }}>
            Sign in to host an event
          </h1>
          <p style={{ color: '#A0A0A0', marginBottom: '24px' }}>You need a free account to create your gathering.</p>
          <button
            onClick={() => openAuth('Sign in to host an event.')}
            style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontFamily: 'inherit' }}
          >Sign in</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      {/* Hero */}
      <section style={{ paddingTop: '120px', paddingBottom: '40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${coverColor}33 0%, transparent 65%)`,
          pointerEvents: 'none', transition: 'background 0.4s',
        }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <button
            onClick={() => navigate('/hosts')}
            style={{ background: 'transparent', border: 'none', color: '#A0A0A0', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '16px', fontFamily: 'inherit' }}
          ><ArrowLeft size={14} /> Back to host hub</button>
          <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '6px' }}>Create event</p>
          <span className="maroon-rule" />
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(36px, 5vw, 60px)', color: '#fff', lineHeight: 1.06, marginBottom: '8px' }}
          >Light your fire.</motion.h1>
          <p style={{ color: '#A0A0A0', fontSize: '16px', maxWidth: '560px' }}>
            Customize every detail. Your event goes live the second you publish.
          </p>
        </div>
      </section>

      {/* Form + Preview */}
      <section style={{ padding: '20px 0 80px' }}>
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 380px)', gap: '32px', alignItems: 'start' }} className="host-new-grid">
            {/* FORM */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Basics */}
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}>
                <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px', fontSize: '11px' }}>01 — Basics</p>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '20px' }}>Name your event</h3>

                <FormLabel label="Event name *">
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Sunday Sunset BBQ"
                    style={inputStyle}
                  />
                </FormLabel>

                <FormLabel label="Description *">
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="What's the vibe? What's on the grill? What should guests expect?"
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </FormLabel>
              </div>

              {/* Location */}
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}>
                <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px', fontSize: '11px' }}>02 — Where</p>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '20px' }}>Pick the spot</h3>

                <FormLabel label="Location *">
                  <div style={{ position: 'relative' }}>
                    <MapPin size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5A5A5A' }} />
                    <input
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="Brooklyn, NY · Rooftop address"
                      style={{ ...inputStyle, paddingLeft: '40px' }}
                    />
                  </div>
                </FormLabel>

                {/* Map placeholder */}
                <div style={{
                  height: '160px',
                  background: 'linear-gradient(135deg, rgba(128,0,0,0.10), rgba(184,134,11,0.05))',
                  border: '1px dashed rgba(255,255,255,0.10)',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', gap: '8px',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                    backgroundSize: '24px 24px', pointerEvents: 'none',
                  }} />
                  <MapPin size={20} style={{ color: 'var(--maroon)', position: 'relative' }} />
                  <p style={{ fontSize: '12px', color: '#5A5A5A', position: 'relative' }}>
                    {location ? `📍 ${location}` : 'Map preview will pin your location'}
                  </p>
                </div>
              </div>

              {/* Date / Time */}
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}>
                <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px', fontSize: '11px' }}>03 — When</p>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '20px' }}>Date and time</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <FormLabel label="Date *">
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      style={inputStyle}
                    />
                  </FormLabel>
                  <FormLabel label="Time *">
                    <input
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      style={inputStyle}
                    />
                  </FormLabel>
                </div>
              </div>

              {/* Theme */}
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}>
                <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px', fontSize: '11px' }}>04 — Theme</p>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '20px' }}>Pick the vibe</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
                  {THEME_OPTIONS.map(t => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      style={{
                        background: theme === t ? 'var(--maroon)' : 'rgba(255,255,255,0.04)',
                        color: theme === t ? '#fff' : '#A0A0A0',
                        border: theme === t ? 'none' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px', padding: '12px 8px', cursor: 'pointer',
                        fontSize: '13px', fontFamily: 'inherit', textAlign: 'center',
                      }}
                    >{t}</button>
                  ))}
                </div>
              </div>

              {/* Cover color */}
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}>
                <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px', fontSize: '11px' }}>05 — Cover</p>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '20px' }}>Pick a cover color</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {COVER_PALETTE.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setCoverColor(c.value)}
                      title={c.name}
                      style={{
                        width: '52px', height: '52px', borderRadius: '12px',
                        background: c.value,
                        border: coverColor === c.value ? '3px solid var(--beige)' : '3px solid transparent',
                        cursor: 'pointer', transition: 'border 0.15s',
                        boxShadow: coverColor === c.value ? `0 0 0 2px ${c.value}66` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Capacity & Privacy */}
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}>
                <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px', fontSize: '11px' }}>06 — Crew</p>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '20px' }}>Capacity & privacy</h3>

                <FormLabel label="Max participants *">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="range" min={2} max={50}
                      value={maxGuests}
                      onChange={e => setMaxGuests(parseInt(e.target.value))}
                      style={{ flex: 1, accentColor: 'var(--maroon)' }}
                    />
                    <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', color: 'var(--beige)', minWidth: '50px', textAlign: 'right' }}>{maxGuests}</span>
                  </div>
                </FormLabel>

                <FormLabel label="Visibility">
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setIsPublic(true)}
                      style={{ flex: 1, background: isPublic ? 'rgba(128,0,0,0.15)' : 'rgba(255,255,255,0.04)', border: isPublic ? '1px solid var(--maroon)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px', cursor: 'pointer', color: '#fff', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px' }}
                    ><Globe size={14} /> Public</button>
                    <button
                      onClick={() => setIsPublic(false)}
                      style={{ flex: 1, background: !isPublic ? 'rgba(128,0,0,0.15)' : 'rgba(255,255,255,0.04)', border: !isPublic ? '1px solid var(--maroon)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px', cursor: 'pointer', color: '#fff', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px' }}
                    ><Lock size={14} /> Private</button>
                  </div>
                </FormLabel>
              </div>

              {/* Tags */}
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}>
                <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px', fontSize: '11px' }}>07 — Tags</p>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '20px' }}>Tag your event</h3>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="brisket, charcoal, rooftop…"
                    style={{ ...inputStyle, marginBottom: 0 }}
                  />
                  <button onClick={addTag} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#fff', borderRadius: '8px', padding: '0 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <Plus size={14} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {tags.map(t => (
                    <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--beige)', background: 'rgba(228,207,179,0.08)', border: '1px solid rgba(228,207,179,0.20)', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>
                      {t}
                      <button onClick={() => removeTag(t)} style={{ background: 'transparent', border: 'none', color: 'var(--beige)', cursor: 'pointer', padding: 0, display: 'inline-flex' }}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Needed list */}
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}>
                <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px', fontSize: '11px' }}>08 — Menu</p>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '8px' }}>What do you need covered?</h3>
                <p style={{ color: '#A0A0A0', fontSize: '13px', marginBottom: '16px' }}>Guests will see this list and claim items as their contribution.</p>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    value={neededInput}
                    onChange={e => setNeededInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addNeeded())}
                    placeholder="Drinks, salad, charcoal, dessert…"
                    style={{ ...inputStyle, marginBottom: 0 }}
                  />
                  <button onClick={addNeeded} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#fff', borderRadius: '8px', padding: '0 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <Plus size={14} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {needed.map(n => (
                    <span key={n} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#fff', background: 'rgba(128,0,0,0.15)', border: '1px solid rgba(128,0,0,0.30)', borderRadius: '6px', padding: '6px 10px', fontSize: '12px' }}>
                      {n}
                      <button onClick={() => removeNeeded(n)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'inline-flex', opacity: 0.7 }}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* PREVIEW */}
            <div style={{ position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={14} style={{ color: '#5A5A5A' }} />
                <p className="mono" style={{ color: '#5A5A5A', fontSize: '11px' }}>Live preview</p>
              </div>
              <div style={{
                background: '#111', border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '14px', overflow: 'hidden',
              }}>
                <div style={{
                  height: '110px', background: `linear-gradient(135deg, ${coverColor}, ${coverColor}88)`,
                  position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '14px',
                }}>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '4px' }}>
                    {!isPublic && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#fff', background: 'rgba(0,0,0,0.40)', borderRadius: '4px', padding: '3px 8px', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}><Lock size={10} /> Private</span>}
                  </div>
                  <Flame size={28} style={{ color: '#fff', opacity: 0.6 }} />
                </div>
                <div style={{ padding: '20px' }}>
                  <p className="mono" style={{ color: '#5A5A5A', marginBottom: '6px', fontSize: '11px' }}>
                    {pickFlag(location)} {extractCity(location) || 'City'} · {theme}
                  </p>
                  <h4 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '18px', color: '#fff', marginBottom: '10px', lineHeight: 1.3 }}>
                    {name || 'Your event name'}
                  </h4>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#A0A0A0', fontSize: '12px' }}>
                      <Calendar size={11} /> {formattedDate || 'Date'} · {time}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#A0A0A0', fontSize: '12px' }}>
                      <Users size={11} /> 1/{maxGuests}
                    </span>
                  </div>
                  <p style={{ color: '#5A5A5A', fontSize: '12px', lineHeight: 1.6, minHeight: '36px' }}>
                    {description || 'Your event description will appear here.'}
                  </p>
                  {tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '12px' }}>
                      {tags.map(t => <span key={t} style={{ color: '#5A5A5A', background: 'rgba(255,255,255,0.04)', borderRadius: '3px', padding: '2px 6px', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}>{t}</span>)}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ background: 'rgba(228,207,179,0.05)', border: '1px solid rgba(228,207,179,0.12)', borderRadius: '12px', padding: '16px' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--beige)', fontSize: '12px', marginBottom: '6px' }}>
                  <Sparkles size={12} /> Ember tip
                </p>
                <p style={{ color: '#A0A0A0', fontSize: '12px', lineHeight: 1.6 }}>
                  Add a clear description of what you'll be cooking. Hosts who write 2+ sentences fill 4× faster.
                </p>
              </div>

              <button
                onClick={handlePublish}
                disabled={!canPublish || submitting}
                style={{
                  background: canPublish ? 'var(--maroon)' : 'rgba(255,255,255,0.05)',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  padding: '16px', cursor: canPublish ? 'pointer' : 'not-allowed',
                  fontSize: '15px', fontWeight: 600, fontFamily: 'inherit',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => canPublish && (e.currentTarget.style.background = 'var(--maroon-light)')}
                onMouseLeave={e => canPublish && (e.currentTarget.style.background = 'var(--maroon)')}
              >
                <Flame size={16} /> {submitting ? 'Lighting the fire…' : 'Create Event'}
              </button>
              {!canPublish && (
                <p style={{ color: '#5A5A5A', fontSize: '11px', textAlign: 'center' }}>
                  Fill in all required fields to publish.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .host-new-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0A0A0A',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '8px',
  padding: '12px 14px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
  marginBottom: '12px',
};

function FormLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', marginBottom: '8px' }}>
      <span style={{ display: 'block', fontSize: '12px', color: '#A0A0A0', marginBottom: '6px' }}>{label}</span>
      {children}
    </label>
  );
}
