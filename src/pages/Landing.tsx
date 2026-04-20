import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Globe } from '../components/Globe';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const serif = "'Playfair Display', Georgia, serif";

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const inc = to / (1400 / 16);
    const id = setInterval(() => {
      cur = Math.min(cur + inc, to);
      setVal(Math.round(cur));
      if (cur >= to) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function FadeUp({ children, delay = 0, style = {} }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function Italic({ children }: { children: React.ReactNode }) {
  return <span style={{ color: '#E4CFB3', fontStyle: 'italic' }}>{children}</span>;
}

const STATS = [
  { value: 15, suffix: '',  label: 'LIVE EVENTS'   },
  { value: 40, suffix: '+', label: 'COUNTRIES'     },
  { value: 4,  suffix: '',  label: 'BOARD TIERS'   },
  { value: 1,  suffix: '',  label: 'ANNUAL SUMMIT' },
];

const HOW_STEPS = [
  { n: '01', title: 'Discover events on the live globe',
    body: 'Every active gathering appears as a real-time pin on the spinning globe. Filter by distance, date, or host rank. Your next grill is closer than you think.' },
  { n: '02', title: 'Join, RSVP and coordinate', body: "RSVP in seconds. Tell the host what you're bringing. No doubled dishes, no gaps. The group chat handles the rest." },
  { n: '03', title: 'Build your rank on The Board', body: 'Host events. Get rated. Climb from Ember to Iron to Gold to Legend. Your rank follows you everywhere fire burns.' },
];

const VAULT_FEATURES = [
  { icon: '📖', title: 'Exclusive recipes',   body: 'Member-only. Not on any food blog. Submitted by the brotherhood and never published anywhere else.' },
  { icon: '🔥', title: 'Knowledge',           body: 'Live masterclasses filmed at real gatherings. Fire science, binchotan, dry-aging. Craft, not content.' },
  { icon: '🤝', title: 'Brotherhood Network', body: 'Verified members worldwide. Search by city. Show up a stranger, leave a brother.' },
  { icon: '🏆', title: 'The Board',           body: 'Ember, Iron, Gold, Legend. Earned through real events, real ratings, real craft.' },
  { icon: '🔪', title: 'Partners',            body: 'Premium butchers, charcoal, knife makers. Exclusive member discounts from suppliers who get it.' },
  { icon: '🗳️', title: 'The Council',         body: 'Vote on platform direction. The brotherhood has a voice. Your membership shapes Ember.' },
];

const EVENTS = [
  { location: 'Vondelpark, Amsterdam',    date: 'Sat Apr 12 · 15:00', title: 'Amsterdam Sunset BBQ',      host: 'Jakob K.',  rank: 'Gold',   going: 9,  spots: 8 },
  { location: 'Shinjuku Gyoen, Tokyo',    date: 'Sun Apr 13 · 17:00', title: 'Tokyo Garden Grill',         host: 'Ryo S.',    rank: 'Legend', going: 14, spots: 2 },
  { location: 'Prospect Park, New York',  date: 'Fri Apr 18 · 18:00', title: 'Brooklyn Smokehouse Night',  host: 'Marcus J.', rank: 'Iron',   going: 7,  spots: 5 },
  { location: 'Alfama, Lisbon',           date: 'Sat Apr 19 · 19:00', title: 'Lisbon Rooftop Grill',       host: 'Diogo M.',  rank: 'Gold',   going: 6,  spots: 4 },
  { location: 'Tempelhof, Berlin',        date: 'Sun Apr 20 · 16:00', title: 'Berlin Winter BBQ',          host: 'Lars K.',   rank: 'Iron',   going: 8,  spots: 6 },
  { location: 'Vila Madalena, São Paulo', date: 'Sat Apr 26 · 14:00', title: 'São Paulo Churrasco Night',  host: 'Bruno A.',  rank: 'Gold',   going: 12, spots: 3 },
];

const TESTIMONIALS = [
  { quote: "I flew to Amsterdam for an Ember gathering. Left with four guys I'll grill with for life. That doesn't happen on Eventbrite.", name: 'Kofi A.', city: 'Accra → Amsterdam', rank: 'Iron' },
  { quote: "The Board made me take hosting seriously. I went from a backyard weekend thing to something people actually talk about.", name: 'Marco T.', city: 'Rome', rank: 'Gold' },
  { quote: "I've used every events app. None of them care about the food. Ember understands that the grill is the whole point.", name: 'Yuto K.', city: 'Tokyo', rank: 'Ember' },
];

const RANK_COLOR: Record<string, string> = { Ember: '#800000', Iron: '#6B7280', Gold: '#B8860B', Legend: '#DAA520' };

function RankBadge({ rank }: { rank: string }) {
  const c = RANK_COLOR[rank] ?? '#555';
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
      border: `1px solid ${c}44`, color: c, background: `${c}15` }}>{rank}</span>
  );
}

function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#800000','#6B7280','#B8860B','#1a3a6b','#2d6b2d'];
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: colors[name.charCodeAt(0) % colors.length],
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38,
      fontWeight: 700, color: '#FFF', flexShrink: 0, border: '2px solid #1a1a1a' }}>{initials}</div>
  );
}

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
);
const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export function Landing() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const btnMaroon: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 8, background: '#800000',
    color: '#FFF', border: 'none', borderRadius: 9999, padding: '13px 26px',
    fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
  };
  const btnDark: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(255,255,255,0.07)', color: '#FFF',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 9999, padding: '13px 26px', fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
  };

  return (
    <div style={{ background: '#0A0A0A', color: '#FFF', minHeight: '100vh', overflowX: 'hidden' }}>
      <Nav />

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '80px 0 60px', position: 'relative', overflow: 'hidden' }}>
        <div className="page-container" style={{ width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)', borderRadius: 9999, padding: '6px 14px',
                  fontSize: 13, color: '#A0A0A0', marginBottom: 28 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                15 events live now worldwide
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily: serif, fontSize: 'clamp(44px, 5.5vw, 76px)', fontWeight: 700,
                  lineHeight: 1.08, color: '#FFF', marginBottom: 24 }}>
                The world grills.<br />Join the <Italic>brotherhood.</Italic>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}
                style={{ color: '#A0A0A0', fontSize: 17, lineHeight: 1.65, marginBottom: 36, maxWidth: 420 }}>
                Discover BBQ events in 40+ countries. Host your own gathering. Connect with pitmasters worldwide.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.34 }}
                style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button style={btnMaroon} onClick={() => navigate('/events')}
                  onMouseEnter={e => { e.currentTarget.style.background = '#990000'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#800000'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <PinIcon /> Find events near you
                </button>
                <button style={btnDark} onClick={() => navigate('/vault')}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.11)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <LockIcon /> Explore the Vault
                </button>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: 'min(520px, 48vw)', height: 'min(520px, 48vw)', borderRadius: '50%', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 0 80px rgba(128,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 60px rgba(0,0,0,0.6)',
                background: '#050a15' }}>
                <Globe mode="hero" />
              </div>
            </motion.div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#2A2A2A', fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)' }} />
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {STATS.map(({ value, suffix, label }, i) => (
              <FadeUp key={label} delay={i * 0.07}>
                <div style={{ padding: '52px 24px', textAlign: 'center',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <p style={{ fontFamily: serif, fontSize: 'clamp(40px,4.5vw,60px)', color: '#E4CFB3', lineHeight: 1, marginBottom: 10 }}>
                    <Counter to={value} suffix={suffix} />
                  </p>
                  <p style={{ color: '#3A3A3A', fontSize: 11, letterSpacing: '2.5px', fontWeight: 600 }}>{label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '120px 0' }}>
        <div className="page-container">
          <FadeUp>
            <p style={{ color: '#800000', fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 20 }}>How it works</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(34px,4vw,54px)', color: '#FFF', lineHeight: 1.1, marginBottom: 64 }}>
              Three steps to the <Italic>perfect gathering</Italic>
            </h2>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {HOW_STEPS.map(({ n, title, body }, i) => (
                <div key={n} onClick={() => setActiveStep(i)} style={{
                  padding: '28px 24px 28px 20px',
                  borderLeft: `2px solid ${i === activeStep ? '#800000' : 'rgba(255,255,255,0.07)'}`,
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  cursor: 'pointer', transition: 'border-color 0.3s',
                }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ fontFamily: serif, fontSize: 13, color: i === activeStep ? '#800000' : '#2A2A2A',
                      fontWeight: 700, marginTop: 2, minWidth: 24, transition: 'color 0.3s' }}>{n}</span>
                    <div>
                      <p style={{ fontFamily: serif, fontSize: 18, fontWeight: 600, marginBottom: i === activeStep ? 12 : 0,
                        color: i === activeStep ? '#E4CFB3' : '#FFF', transition: 'color 0.3s' }}>{title}</p>
                      {i === activeStep && body && (
                        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
                          style={{ color: '#A0A0A0', fontSize: 14, lineHeight: 1.7 }}>{body}</motion.p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <FadeUp delay={0.2}>
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ height: 380, position: 'relative' }}>
                  <Globe mode="sidebar" width={480} height={380} />
                </div>
                <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontFamily: serif, fontSize: 17, color: '#FFF', fontStyle: 'italic', marginBottom: 4 }}>The live globe</p>
                  <p style={{ color: '#5A5A5A', fontSize: 13 }}>Drag to explore · 15 events worldwide</p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* THE VAULT */}
      <section style={{ padding: '0 0 120px' }}>
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            <FadeUp>
              <p style={{ color: '#3A3A3A', fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 20 }}>Premium membership</p>
              <h2 style={{ fontFamily: serif, fontSize: 'clamp(40px,4.5vw,60px)', color: '#FFF', lineHeight: 1.05, marginBottom: 20 }}>
                The Secret <Italic>Vault.</Italic>
              </h2>
              <p style={{ color: '#A0A0A0', fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 400 }}>
                Recipes that will never appear on a food blog. Knowledge passed between brothers. One subscription unlocks everything.
              </p>
              <button style={{ ...btnMaroon, marginBottom: 40 }} onClick={() => navigate('/vault')}
                onMouseEnter={e => { e.currentTarget.style.background = '#990000'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#800000'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                → Become a Vault member
              </button>
              <div style={{ background: 'linear-gradient(135deg,#1a0000,#220000)', border: '1px solid rgba(128,0,0,0.30)', borderRadius: 16, padding: '28px' }}>
                <p style={{ fontFamily: serif, fontSize: 18, color: '#E4CFB3', fontStyle: 'italic', marginBottom: 20, textAlign: 'center' }}>Choose your membership</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ background: 'rgba(0,0,0,0.40)', borderRadius: 10, padding: '20px 16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ color: '#5A5A5A', fontSize: 11, letterSpacing: '2px', fontWeight: 600, marginBottom: 8 }}>MONTHLY</p>
                    <p style={{ fontFamily: serif, fontSize: 42, color: '#FFF', lineHeight: 1, marginBottom: 4 }}>€12</p>
                    <p style={{ color: '#5A5A5A', fontSize: 12, marginBottom: 16 }}>per month</p>
                    <button style={{ width: '100%', background: 'rgba(255,255,255,0.08)', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, padding: '9px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Start membership</button>
                  </div>
                  <div style={{ background: 'rgba(128,0,0,0.22)', borderRadius: 10, padding: '20px 16px', textAlign: 'center', border: '1px solid rgba(128,0,0,0.40)' }}>
                    <p style={{ color: '#800000', fontSize: 11, letterSpacing: '2px', fontWeight: 600, marginBottom: 8 }}>ANNUAL</p>
                    <p style={{ fontFamily: serif, fontSize: 42, color: '#E4CFB3', lineHeight: 1, marginBottom: 4 }}>€89</p>
                    <p style={{ color: '#B8860B', fontSize: 12, marginBottom: 16 }}>2 months free</p>
                    <button style={{ width: '100%', background: '#B8860B', color: '#000', border: 'none', borderRadius: 8, padding: '9px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Join annually</button>
                  </div>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {VAULT_FEATURES.map(({ icon, title, body }) => (
                  <div key={title} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '22px 18px', transition: 'border-color 0.25s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(128,0,0,0.35)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(128,0,0,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 14 }}>{icon}</div>
                    <p style={{ color: '#FFF', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{title}</p>
                    <p style={{ color: '#5A5A5A', fontSize: 12, lineHeight: 1.6 }}>{body}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* RANKINGS */}
      <section style={{ padding: '120px 0', background: '#080808', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="page-container">
          <FadeUp>
            <p style={{ color: '#800000', fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 20 }}>Rankings</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(32px,4vw,52px)', color: '#FFF', lineHeight: 1.1, marginBottom: 12 }}>The Board.</h2>
            <p style={{ color: '#5A5A5A', fontSize: 15, maxWidth: 480, lineHeight: 1.65, marginBottom: 56 }}>The more you host, the higher you climb. Every tier unlocks greater perks, visibility, and community access.</p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
            {[
              { icon: '🔥', tier: 'Ember',  color: '#800000', req: 'Join the Vault · Host your first event',      perks: 'Globe listing · Event chat · Contribution tracking' },
              { icon: '🪨', tier: 'Iron',   color: '#6B7280', req: '5+ events · 4.5★ average rating',             perks: 'Priority discovery · Iron badge · Network access'   },
              { icon: '🏅', tier: 'Gold',   color: '#B8860B', req: '20+ events · 4.8★ · Vault contributor',       perks: 'Featured host · Gold badge · Council vote weight'   },
              { icon: '👑', tier: 'Legend', color: '#DAA520', req: 'Top 1% globally · Invitation only',           perks: 'Summit speaker · Legend profile · Founding status'  },
            ].map(({ icon, tier, color, req, perks }, i) => (
              <FadeUp key={tier} delay={i * 0.08}>
                <div style={{ padding: '32px 24px', background: '#111', border: `1px solid ${color}22`, borderRadius: 16, transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}22`; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <span style={{ fontSize: 30, display: 'block', marginBottom: 16 }}>{icon}</span>
                  <p style={{ fontFamily: serif, fontSize: 22, color, marginBottom: 8 }}>{tier}</p>
                  <p style={{ color: '#5A5A5A', fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{req}</p>
                  <p style={{ color: '#2A2A2A', fontSize: 11, lineHeight: 1.6 }}>{perks}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE EVENTS */}
      <section style={{ padding: '120px 0' }}>
        <div className="page-container">
          <FadeUp>
            <p style={{ color: '#800000', fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 20 }}>Live events</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(36px,4.5vw,58px)', color: '#FFF', lineHeight: 1.08, marginBottom: 56 }}>
              Your city has a gathering <Italic>this weekend.</Italic>
            </h2>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 40, alignItems: 'start' }}>
            <FadeUp>
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', aspectRatio: '1' }}>
                <Globe mode="sidebar" width={500} height={500} />
              </div>
            </FadeUp>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {EVENTS.map(({ title, location, date, host, rank, going, spots }, i) => (
                <FadeUp key={title} delay={i * 0.05}>
                  <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 2, transition: 'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#FFF', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{title}</p>
                      <div style={{ display: 'flex', gap: 14, marginBottom: 10, flexWrap: 'wrap' }}>
                        <span style={{ color: '#5A5A5A', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                          {location}
                        </span>
                        <span style={{ color: '#5A5A5A', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                          {date}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar name={host} size={26} />
                        <span style={{ color: '#A0A0A0', fontSize: 13, fontWeight: 500 }}>{host}</span>
                        <RankBadge rank={rank} />
                      </div>
                      <p style={{ color: '#2A2A2A', fontSize: 12, marginTop: 7 }}>+{going} going · {spots} spots left</p>
                    </div>
                    <button onClick={() => navigate('/events')}
                      style={{ background: '#800000', color: '#FFF', border: 'none', borderRadius: 9999, padding: '9px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#990000')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#800000')}>Join</button>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '120px 0', background: '#080808', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="page-container">
          <FadeUp>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(28px,3.5vw,44px)', color: '#FFF', marginBottom: 56, textAlign: 'center' }}>Brotherhood, in their words.</h2>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
            {TESTIMONIALS.map(({ quote, name, city, rank }, i) => (
              <FadeUp key={name} delay={i * 0.1}>
                <div style={{ padding: '36px 32px', background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
                  <p style={{ color: '#A0A0A0', fontSize: 15, lineHeight: 1.8, marginBottom: 28, fontStyle: 'italic' }}>"{quote}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={name} size={32} />
                      <div>
                        <p style={{ color: '#FFF', fontWeight: 600, fontSize: 14 }}>{name}</p>
                        <p style={{ color: '#2A2A2A', fontSize: 12, marginTop: 1 }}>{city}</p>
                      </div>
                    </div>
                    <RankBadge rank={rank} />
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* SUMMIT */}
      <section style={{ padding: '120px 0' }}>
        <div className="page-container">
          <FadeUp>
            <div style={{ borderRadius: 20, overflow: 'hidden', background: 'linear-gradient(135deg,#0d0000,#1a0000,#0d0000)', border: '1px solid rgba(128,0,0,0.25)', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(128,0,0,0.22) 0%, transparent 55%), radial-gradient(ellipse at 70% 50%, rgba(128,0,0,0.13) 0%, transparent 55%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', padding: 'clamp(64px,8vw,112px) clamp(32px,6vw,96px)', textAlign: 'center' }}>
                <p style={{ color: '#800000', fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 24 }}>Annual gathering</p>
                <h2 style={{ fontFamily: serif, fontSize: 'clamp(36px,5vw,68px)', color: '#E4CFB3', lineHeight: 1.05, marginBottom: 24 }}>
                  One City. One Weekend.<br /><Italic>Every fire on Earth.</Italic>
                </h2>
                <p style={{ color: '#A0A0A0', fontSize: 17, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
                  The finest pitmasters from every continent gather around the greatest fire of the year. Location, speakers, and tickets revealed exclusively to Vault members.
                </p>
                <button style={btnMaroon} onClick={() => navigate('/vault')}
                  onMouseEnter={e => { e.currentTarget.style.background = '#990000'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#800000'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  Join to unlock
                </button>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
