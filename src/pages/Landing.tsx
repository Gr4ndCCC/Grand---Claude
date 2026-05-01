import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { FireButton } from '../components/FireButton';
import { useAuth } from '../lib/auth';
import { FireGraph } from '../components/ui/FireGraph';

function HintText() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: 'absolute', bottom: '16px', left: '50%',
      transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 2,
      opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease',
      fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
      color: 'rgba(200,184,162,0.55)', whiteSpace: 'nowrap',
    }}>
      drag nodes · double-click to ignite
    </div>
  );
}


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

/* ── fade-up wrapper ───────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >{children}</motion.div>
  );
}


const STATS = [
  { value: 15,  suffix: '',  label: 'Live events'   },
  { value: 40,  suffix: '+', label: 'Countries'     },
  { value: 4,   suffix: '',  label: 'Board tiers'   },
  { value: 1,   suffix: '',  label: 'Annual Summit' },
];

const HOW_STEPS = [
  { n: '01', title: 'Discover', body: 'Find BBQ gatherings near you on the live map. Every pin is a real event, a real host, a real fire.' },
  { n: '02', title: 'Join & Contribute', body: "RSVP, tell the host what you're bringing — meat, charcoal, drinks. No doubling up. No gaps." },
  { n: '03', title: 'Level up', body: "Host. Get rated. Earn your rank on The Board. Build a reputation that follows you everywhere fire burns." },
];

const BOARD_RANKS = [
  { tier: 'Ember',  color: '#800000', req: 'Join the Vault · Host your first event' },
  { tier: 'Iron',   color: '#6B7280', req: '5+ events · 4.5★ average rating' },
  { tier: 'Gold',   color: '#B8860B', req: '20+ events · 4.8★ · Vault contributor' },
  { tier: 'Legend', color: '#DAA520', req: 'Top 1% globally · Invitation only' },
];

const EVENTS = [
  { city: 'Amsterdam', flag: '🇳🇱', title: 'Amsterdam Sunset BBQ',     host: 'Lars V.',    rank: 'Gold',   date: 'Sat, Apr 19', time: '18:00', guests: 8,  max: 12 },
  { city: 'Tokyo',     flag: '🇯🇵', title: 'Tokyo Garden Grill',        host: 'Hiro M.',    rank: 'Iron',   date: 'Sun, Apr 20', time: '17:00', guests: 6,  max: 10 },
  { city: 'New York',  flag: '🇺🇸', title: 'Brooklyn Smokehouse Night', host: 'Marcus B.',  rank: 'Legend', date: 'Fri, Apr 25', time: '19:00', guests: 14, max: 20 },
];

const TESTIMONIALS = [
  { quote: "I flew to Amsterdam for an Ember gathering. Left with four guys I'll grill with for life. That doesn't happen on Eventbrite.", name: 'Kofi A.',  city: 'Accra → Amsterdam', rank: 'Iron'   },
  { quote: "The Board made me take hosting seriously. I went from a backyard weekend thing to something people actually talk about.",         name: 'Marco T.', city: 'Rome',              rank: 'Gold'   },
  { quote: "I've used every events app. None of them care about the food. Ember understands that the grill is the whole point.",             name: 'Yuto K.',  city: 'Tokyo',             rank: 'Ember'  },
];

const RANK_COLOR: Record<string, string> = { Ember: '#800000', Iron: '#6B7280', Gold: '#B8860B', Legend: '#DAA520' };

const CITIES = ['Amsterdam', 'Tokyo', 'New York', 'Rome', 'Lisbon', 'Johannesburg', 'São Paulo', 'Singapore', 'Barcelona', 'Berlin', 'Istanbul', 'Sydney', 'Chicago', 'Mumbai', 'Warsaw'];

function RankBadge({ rank }: { rank: string }) {
  const c = RANK_COLOR[rank] ?? '#555';
  return (
    <span className="rank-badge" style={{ color: c, background: `${c}18`, border: `1px solid ${c}44` }}>
      {rank}
    </span>
  );
}

/* ── RSVP pill + Menu claim — dark/maroon edition ─────────── */
function RSVPMenu() {
  const { user, openAuth } = useAuth();
  const [rsvp, setRsvp] = useState<'in' | 'maybe' | 'cant'>();
  const [score] = useState(84);

  const initialMenu = [
    { id: 'm1', name: 'Brisket, hot and fast',  cat: 'MAIN',  claimed: false, by: '' },
    { id: 'm2', name: 'Charred shishitos',      cat: 'VEG',   claimed: true,  by: 'Marin K.' },
    { id: 'm3', name: 'Sumac slaw',             cat: 'SIDE',  claimed: false, by: '' },
    { id: 'm4', name: 'Smoked stone fruit cobbler', cat: 'SWEET', claimed: false, by: '' },
  ];
  const [menu, setMenu] = useState(initialMenu);

  const handleRsvp = (id: 'in' | 'maybe' | 'cant') => {
    if (!user) return openAuth('Sign in to RSVP for events.');
    setRsvp(id);
  };

  const claim = (id: string) => {
    if (!user) return openAuth('Sign in to claim a menu item.');
    setMenu(m => m.map(x => x.id === id ? { ...x, claimed: !x.claimed, by: x.claimed ? '' : 'You' } : x));
  };

  const RSVPS = [
    { id: 'in',    label: "I'm in"   },
    { id: 'maybe', label: 'Maybe'    },
    { id: 'cant',  label: "Can't"    },
  ] as const;

  /* circular score svg */
  const radius = 22, circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* left — copy */}
      <div>
        <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>The interaction</p>
        <span className="maroon-rule" />
        <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(32px, 4vw, 52px)', color: '#fff', lineHeight: 1.06, marginBottom: '20px' }}>
          Tap once.<br />
          <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>You're in.</span>
        </h2>
        <p style={{ color: '#A0A0A0', fontSize: '17px', lineHeight: '1.7', marginBottom: '40px', maxWidth: '440px' }}>
          No accounts. No profiles. No notifications. Three buttons and a list.
          The whole product fits in a text message.
        </p>

        {/* RSVP row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '28px' }}>
          <span className="mono" style={{ color: '#5A5A5A', width: '60px' }}>RSVP</span>
          <div style={{
            display: 'inline-flex', gap: '4px',
            background: '#111', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '999px', padding: '4px',
          }}>
            {RSVPS.map(r => (
              <button key={r.id} onClick={() => handleRsvp(r.id)}
                className="ember-focus"
                style={{
                  background: rsvp === r.id ? 'var(--maroon)' : 'transparent',
                  color: rsvp === r.id ? '#fff' : '#A0A0A0',
                  border: 'none', borderRadius: '999px',
                  padding: '8px 18px', fontSize: '14px',
                  cursor: 'pointer', fontFamily: 'Playfair Display, Georgia, serif',
                  transition: 'all 0.2s',
                }}
              >{r.label}</button>
            ))}
          </div>
        </div>

        {/* Score row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span className="mono" style={{ color: '#5A5A5A', width: '60px' }}>SCORE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <circle cx="28" cy="28" r={radius} fill="none" stroke="var(--maroon)" strokeWidth="3"
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
              <text x="28" y="28" textAnchor="middle" dominantBaseline="central"
                style={{ fontFamily: 'Playfair Display, Georgia, serif', fill: '#fff', fontSize: '15px', transform: 'rotate(90deg)', transformOrigin: '28px 28px' }}>
                {score}
              </text>
            </svg>
            <div>
              <p className="mono" style={{ color: 'var(--beige)', marginBottom: '2px' }}>Ember score</p>
              <p style={{ color: '#A0A0A0', fontSize: '14px' }}>Reliable host</p>
            </div>
          </div>
        </div>
      </div>

      {/* right — menu card */}
      <div className="card-glow" style={{
        background: '#111',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '28px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', color: '#fff' }}>The menu so far</h3>
          <span className="mono" style={{
            background: 'rgba(128,0,0,0.2)', color: 'var(--maroon)',
            padding: '4px 10px', borderRadius: '6px', fontSize: '10px',
            border: '1px solid rgba(128,0,0,0.4)',
          }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--maroon)', marginRight: '6px', verticalAlign: 'middle' }} />
            LIVE
          </span>
        </div>
        <p className="mono" style={{ color: '#5A5A5A', marginBottom: '20px' }}>
          Tap "I'll bring this" to claim a dish
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {menu.map(item => (
            <button key={item.id} onClick={() => claim(item.id)}
              className="ember-focus"
              style={{
                width: '100%', textAlign: 'left',
                background: item.claimed ? 'var(--maroon)' : 'rgba(255,255,255,0.04)',
                border: item.claimed ? '1px solid var(--maroon-light)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', padding: '16px 18px',
                cursor: 'pointer', transition: 'all 0.25s var(--ease-flame)',
                position: 'relative', overflow: 'hidden',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                if (!item.claimed) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.borderColor = 'rgba(228,207,179,0.18)';
                }
              }}
              onMouseLeave={e => {
                if (!item.claimed) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }
              }}
            >
              <AnimatePresence mode="wait">
                {item.claimed ? (
                  <motion.div
                    key="claimed"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Check size={16} style={{ color: '#fff' }} />
                      <span className="mono" style={{ color: '#fff', fontSize: '12px', letterSpacing: '0.16em' }}>CLAIMED</span>
                    </div>
                    {item.by && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>{item.by}</span>
                        <span style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          background: 'rgba(0,0,0,0.35)', color: 'var(--beige)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', fontFamily: 'Playfair Display, Georgia, serif',
                          fontWeight: 600,
                        }}>
                          {item.by.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <p className="mono" style={{ color: 'var(--maroon)', fontSize: '10px', marginBottom: '4px' }}>
                      {item.cat}
                    </p>
                    <p style={{ color: '#fff', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '17px' }}>
                      {item.name}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const btn = {
  primary: {
    background: 'var(--maroon)', color: '#fff', border: 'none',
    borderRadius: '10px', padding: '14px 28px', fontSize: '15px',
    fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  outline: {
    background: 'transparent', color: 'var(--beige)',
    border: '1px solid rgba(228,207,179,0.25)',
    borderRadius: '10px', padding: '14px 28px', fontSize: '15px',
    fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s',
    fontFamily: 'inherit',
  } as React.CSSProperties,
};

export function Landing() {
  const navigate = useNavigate();
  const { user, openAuth } = useAuth();
  const handleJoinEvent = () => {
    if (!user) return openAuth('Sign in to join events near you.');
    navigate('/events');
  };
  const handleHostEvent = () => {
    if (!user) return openAuth('Sign in to host an event.');
    navigate('/hosts');
  };

  return (
    <div style={{ background: '#090504', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      <Nav />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{ position: 'relative', paddingTop: '120px', paddingBottom: '80px', minHeight: '760px', overflow: 'hidden' }}>
        {/* FireGraph fills the entire hero as the dominant visual */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <FireGraph className="w-full h-full" />
        </div>

        {/* Soft gradient fade so headline copy reads cleanly over the fire */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(90deg, rgba(9,5,4,0.92) 0%, rgba(9,5,4,0.82) 32%, rgba(9,5,4,0.45) 52%, rgba(9,5,4,0.10) 68%, rgba(9,5,4,0) 80%)',
        }} />

        {/* HUD pill at top center of hero */}
        <div style={{
          position: 'absolute', top: '92px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '10px 20px', borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
          pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 4,
        }}>
          <span className="animate-ember-pulse"
            style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c96e47', display: 'inline-block', flexShrink: 0 }}
          />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C8B8A2' }}>
            Ember · The global BBQ brotherhood
          </span>
        </div>

        {/* Hint */}
        <HintText />

        {/* Text content layered above the fire (passes pointer events for the canvas) */}
        <div className="page-container" style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }}>
          <div style={{ maxWidth: '560px' }}>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mono"
              style={{ color: 'var(--maroon)', marginBottom: '16px' }}
            >
              The global BBQ brotherhood
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 'clamp(42px, 6vw, 80px)',
                fontWeight: '400', lineHeight: '1.06',
                color: '#fff', marginBottom: '24px',
              }}
            >
              The world grills.
              <br />
              <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>
                Join the brotherhood.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ color: '#C8B8A2', fontSize: '17px', lineHeight: '1.7', maxWidth: '460px', marginBottom: '40px' }}
            >
              Discover BBQ events in 40+ countries. Host your own gathering.
              Build your rank. Connect with pitmasters worldwide.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px', pointerEvents: 'auto' }}
            >
              <FireButton variant="primary" onClick={handleJoinEvent}>
                Find events near you
              </FireButton>
              <FireButton variant="outline" onClick={handleHostEvent}>
                Host an event
              </FireButton>
            </motion.div>

            {/* stats bar */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}
            >
              {STATS.map(({ value, suffix, label }) => (
                <div key={label}>
                  <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '28px', fontWeight: '400', color: '#fff', lineHeight: 1 }}>
                    <Counter to={value} suffix={suffix} />
                  </p>
                  <p className="mono" style={{ color: '#5A5A5A', marginTop: '4px' }}>{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CITIES SCROLL ─────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', padding: '16px 0' }}>
        <div className="city-scroll">
          {[...CITIES, ...CITIES].map((city, i) => (
            <span key={i} className="mono" style={{ color: '#5A5A5A', padding: '0 24px', whiteSpace: 'nowrap' }}>
              {city}
              <span style={{ color: 'var(--maroon)', marginLeft: '24px' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section style={{ padding: '100px 0' }}>
        <div className="page-container">
          <FadeUp>
            <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>How it works</p>
            <span className="maroon-rule" />
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(32px, 4vw, 52px)', color: '#fff', marginBottom: '60px', maxWidth: '600px' }}>
              Three steps. One fire.
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_STEPS.map(({ n, title, body }, i) => (
              <FadeUp key={n} delay={i * 0.12}>
                <div style={{ borderLeft: '2px solid var(--maroon)', paddingLeft: '24px' }}>
                  <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '12px' }}>{n}</p>
                  <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', color: '#fff', marginBottom: '12px' }}>{title}</h3>
                  <p style={{ color: '#A0A0A0', lineHeight: '1.7' }}>{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE BOARD ─────────────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="page-container">
          <FadeUp>
            <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>The Board</p>
            <span className="maroon-rule" />
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(32px, 4vw, 52px)', color: '#fff', marginBottom: '16px' }}>
              Rank earned. Not bought.
            </h2>
            <p style={{ color: '#A0A0A0', maxWidth: '520px', marginBottom: '56px', lineHeight: '1.7' }}>
              Four tiers. Each earned through real events, real ratings, real craft.
              Your rank follows you everywhere fire burns.
            </p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BOARD_RANKS.map(({ tier, color, req }, i) => (
              <FadeUp key={tier} delay={i * 0.1}>
                <div className="card-glow" style={{
                  background: '#111',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '14px',
                  padding: '28px 24px',
                }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `${color}22`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color }} />
                  </div>
                  <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px', color: '#fff', marginBottom: '10px' }}>{tier}</p>
                  <p style={{ color: '#5A5A5A', fontSize: '13px', lineHeight: '1.6' }}>{req}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE EVENTS ───────────────────────────────────────── */}
      <section style={{ padding: '100px 0' }}>
        <div className="page-container">
          <FadeUp>
            <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>Live this week</p>
            <span className="maroon-rule" />
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(32px, 4vw, 52px)', color: '#fff', marginBottom: '16px' }}>
              Fires burning near you.
            </h2>
            <p style={{ color: '#A0A0A0', marginBottom: '48px' }}>
              Real events, real hosts. Join a gathering or{' '}
              <button onClick={() => navigate('/hosts')} style={{ color: 'var(--beige)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', textUnderlineOffset: '3px', fontFamily: 'inherit', fontSize: 'inherit' }}>
                start your own.
              </button>
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {EVENTS.map(({ city, flag, title, host, rank, date, time, guests, max }, i) => (
              <FadeUp key={title} delay={i * 0.1}>
                <div className="card-glow" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p className="mono" style={{ color: '#5A5A5A', marginBottom: '6px' }}>{flag} {city}</p>
                      <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '18px', color: '#fff', lineHeight: 1.3 }}>{title}</h3>
                    </div>
                    <RankBadge rank={rank} />
                  </div>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span className="mono" style={{ color: '#A0A0A0' }}>{date}</span>
                    <span className="mono" style={{ color: '#A0A0A0' }}>{time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ color: '#A0A0A0', fontSize: '14px' }}>Hosted by <span style={{ color: 'var(--beige)' }}>{host}</span></p>
                    <p className="mono" style={{ color: guests >= max - 2 ? 'var(--gold)' : '#5A5A5A' }}>
                      {guests}/{max} going
                    </p>
                  </div>
                  <FireButton variant="primary" size="sm" fullWidth onClick={handleJoinEvent}>
                    Join event
                  </FireButton>
                </div>
              </FadeUp>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              style={btn.outline}
              onClick={() => navigate('/events')}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(228,207,179,0.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >See all events →</button>
          </div>
        </div>
      </section>

      {/* ── THE INTERACTION (RSVP + MENU) ─────────────────────── */}
      <section style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="page-container">
          <FadeUp>
            <RSVPMenu />
          </FadeUp>
        </div>
      </section>

      {/* ── THE VAULT ─────────────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>The Vault</p>
              <span className="maroon-rule" />
              <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(32px, 4vw, 52px)', color: '#fff', marginBottom: '20px' }}>
                The inner circle.
              </h2>
              <p style={{ color: '#A0A0A0', lineHeight: '1.8', marginBottom: '40px', fontSize: '17px' }}>
                Exclusive recipes, live masterclasses, The Board certification,
                Brotherhood Network, vetted partner deals, The Council, and
                Annual Summit access. Everything the grill deserves.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
                <div style={{ textAlign: 'center', background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px 28px' }}>
                  <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '32px', color: '#fff' }}>€15</p>
                  <p className="mono" style={{ color: '#5A5A5A' }}>per month</p>
                </div>
                <div style={{ textAlign: 'center', background: 'rgba(128,0,0,0.15)', border: '1px solid rgba(128,0,0,0.3)', borderRadius: '12px', padding: '20px 28px' }}>
                  <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '32px', color: '#fff' }}>€99</p>
                  <p className="mono" style={{ color: 'var(--maroon)' }}>annual · best value</p>
                </div>
              </div>
              <button
                style={btn.primary}
                onClick={() => navigate('/vault')}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--maroon-light)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--maroon)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >Join the Vault →</button>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: 'Recipes',            body: 'Member-only. Not on any food blog.' },
                  { title: 'Knowledge',           body: 'Live masterclasses from real gatherings.' },
                  { title: 'Brotherhood Network', body: 'Verified members worldwide.' },
                  { title: 'The Board',           body: 'Four tiers. Earned through craft.' },
                  { title: 'Partners',            body: 'Premium suppliers, exclusive deals.' },
                  { title: 'The Council',         body: 'Vote on platform direction.' },
                ].map(({ title, body }) => (
                  <div key={title} className="card-glow" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px' }}>
                    <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '15px', color: 'var(--beige)', marginBottom: '6px' }}>{title}</p>
                    <p style={{ color: '#5A5A5A', fontSize: '13px', lineHeight: '1.6' }}>{body}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section style={{ padding: '100px 0' }}>
        <div className="page-container">
          <FadeUp>
            <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>From the brotherhood</p>
            <span className="maroon-rule" />
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(32px, 4vw, 52px)', color: '#fff', marginBottom: '56px' }}>
              Show up a stranger.
              <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}> Leave a brother.</span>
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ quote, name, city, rank }, i) => (
              <FadeUp key={name} delay={i * 0.1}>
                <div className="card-glow" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
                  <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic', fontSize: '18px', color: 'var(--beige)', lineHeight: '1.6', flex: 1 }}>
                    "{quote}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <p style={{ color: '#fff', fontWeight: '500', marginBottom: '2px' }}>{name}</p>
                      <p className="mono" style={{ color: '#5A5A5A' }}>{city}</p>
                    </div>
                    <RankBadge rank={rank} />
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANNUAL SUMMIT CTA ─────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: 'linear-gradient(135deg, #0D0000 0%, #0A0A0A 50%, #000D00 100%)', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.20) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>Annual Summit</p>
            <span className="maroon-rule" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(36px, 5vw, 64px)', color: '#fff', marginBottom: '20px', lineHeight: 1.1 }}>
              One city. One weekend.
              <br />
              <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>The whole brotherhood.</span>
            </h2>
            <p style={{ color: '#A0A0A0', maxWidth: '520px', margin: '0 auto 40px', fontSize: '17px', lineHeight: '1.7' }}>
              Location revealed exclusively to Vault members. Your subscription
              is your ticket. Every year, a different city. Always unforgettable.
            </p>
            <FireButton variant="primary" size="lg" onClick={() => navigate('/vault')}>
              Join the Vault · Get Summit access
            </FireButton>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
