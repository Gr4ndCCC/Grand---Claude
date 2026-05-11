import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useAuth } from '../lib/auth';
import { FireGraph } from '../components/ui/FireGraph';

/* ── tiny utilities ────────────────────────────────────────── */

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

function FadeUp({ children, delay = 0, className = '', style }: {
  children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
      style={style}
    >{children}</motion.div>
  );
}

/* ── content (kept verbatim) ───────────────────────────────── */

const STATS = [
  { value: 15,  suffix: '',  label: 'Live events'   },
  { value: 40,  suffix: '+', label: 'Countries'     },
  { value: 4,   suffix: '',  label: 'Board tiers'   },
  { value: 1,   suffix: '',  label: 'Annual Summit' },
];

const HOW_STEPS = [
  { n: '01', title: 'Discover',           body: 'Find BBQ gatherings near you on the live map. Every pin is a real event, a real host, a real fire.' },
  { n: '02', title: 'Join & Contribute',  body: "RSVP, tell the host what you're bringing — meat, charcoal, drinks. No doubling up. No gaps." },
  { n: '03', title: 'Level up',           body: "Host. Get rated. Earn your rank on The Board. Build a reputation that follows you everywhere fire burns." },
];

type RankTier = 'ember' | 'iron' | 'gold' | 'legend';
const BOARD_RANKS: { tier: RankTier; name: string; req: string }[] = [
  { tier: 'ember',  name: 'Ember',  req: 'Join the Vault · Host your first event' },
  { tier: 'iron',   name: 'Iron',   req: '5+ events · 4.5★ average rating' },
  { tier: 'gold',   name: 'Gold',   req: '20+ events · 4.8★ · Vault contributor' },
  { tier: 'legend', name: 'Legend', req: 'Top 1% globally · Invitation only' },
];

const EVENTS = [
  { city: 'Amsterdam', cc: 'NL', title: 'Amsterdam Sunset BBQ',     host: 'Lars V.',    rank: 'Gold'   as const, date: 'Sat, Apr 19', time: '18:00', guests: 8,  max: 12 },
  { city: 'Tokyo',     cc: 'JP', title: 'Tokyo Garden Grill',        host: 'Hiro M.',    rank: 'Iron'   as const, date: 'Sun, Apr 20', time: '17:00', guests: 6,  max: 10 },
  { city: 'New York',  cc: 'US', title: 'Brooklyn Smokehouse Night', host: 'Marcus B.',  rank: 'Legend' as const, date: 'Fri, Apr 25', time: '19:00', guests: 14, max: 20 },
];

const TESTIMONIALS = [
  { quote: "I flew to Amsterdam for an Ember gathering. Left with four guys I'll grill with for life. That doesn't happen on Eventbrite.", name: 'Kofi A.',  city: 'Accra → Amsterdam', rank: 'Iron'  as const },
  { quote: "The Board made me take hosting seriously. I went from a backyard weekend thing to something people actually talk about.",         name: 'Marco T.', city: 'Rome',              rank: 'Gold'  as const },
  { quote: "I've used every events app. None of them care about the food. Ember understands that the grill is the whole point.",             name: 'Yuto K.',  city: 'Tokyo',             rank: 'Ember' as const },
];

const VAULT_FEATURES = [
  { title: 'Recipes',             body: 'Member-only. Not on any food blog.' },
  { title: 'Knowledge',            body: 'Live masterclasses from real gatherings.' },
  { title: 'Brotherhood Network',  body: 'Verified members worldwide.' },
  { title: 'The Board',            body: 'Four tiers. Earned through craft.' },
  { title: 'Partners',             body: 'Premium suppliers, exclusive deals.' },
  { title: 'The Council',          body: 'Vote on platform direction.' },
];

const VERSES = [
  { text: 'Iron sharpens iron, and one man sharpens another.',                                         ref: 'Proverbs 27:17'      },
  { text: 'Behold, how good and how pleasant it is for brothers to dwell together in unity!',          ref: 'Psalm 133:1'         },
  { text: 'Two are better than one, for if either falls, the other can help his companion up.',        ref: 'Ecclesiastes 4:9–10' },
  { text: 'So whether you eat or drink or whatever you do, do it all for the glory of God.',           ref: '1 Corinthians 10:31' },
  { text: 'A friend loves at all times, and a brother is born for a time of adversity.',               ref: 'Proverbs 17:17'      },
  { text: 'Bear one another\'s burdens, and so fulfill the law of Christ.',                            ref: 'Galatians 6:2'       },
  { text: 'Where two or three are gathered together in My name, I am there among them.',               ref: 'Matthew 18:20'       },
  { text: 'As each has received a gift, use it to serve one another, as good stewards of God\'s grace.', ref: '1 Peter 4:10'     },
];

/* ── tier styling helpers ──────────────────────────────────── */

function tierBadgeStyle(rank: 'Ember' | 'Iron' | 'Gold' | 'Legend'): React.CSSProperties {
  switch (rank) {
    case 'Gold':
      return { color: 'var(--gold-v3)', border: '1px solid rgba(184,146,74,0.4)', background: 'rgba(184,146,74,0.06)' };
    case 'Iron':
      return { color: 'var(--bone-300)', border: '1px solid rgba(245,237,224,0.15)', background: 'rgba(245,237,224,0.03)' };
    case 'Legend':
      return { color: 'var(--gold-hi)', border: '1px solid rgba(212,168,95,0.5)', background: 'rgba(212,168,95,0.08)', boxShadow: '0 0 20px rgba(212,168,95,0.15)' };
    case 'Ember':
    default:
      return { color: 'var(--burgundy)', border: '1px solid rgba(128,0,0,0.5)', background: 'rgba(85,0,0,0.2)' };
  }
}

function rankCardAccents(tier: RankTier) {
  switch (tier) {
    case 'ember':
      return { iconBg: 'rgba(85,0,0,0.35)', iconBorder: '1px solid rgba(128,0,0,0.4)', dot: 'var(--burgundy)', dotShadow: '0 0 12px var(--burgundy)', hoverShadow: '0 24px 60px rgba(85,0,0,0.3), 0 0 0 1px rgba(128,0,0,0.45)' };
    case 'iron':
      return { iconBg: 'rgba(245,237,224,0.04)', iconBorder: '1px solid rgba(245,237,224,0.1)', dot: 'var(--bone-300)', dotShadow: '0 0 8px rgba(217,201,171,0.4)', hoverShadow: '0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,237,224,0.18)' };
    case 'gold':
      return { iconBg: 'rgba(184,146,74,0.12)', iconBorder: '1px solid rgba(184,146,74,0.4)', dot: 'var(--gold-v3)', dotShadow: '0 0 12px var(--gold-v3)', hoverShadow: '0 24px 60px rgba(184,146,74,0.18), 0 0 0 1px var(--gold-v3)' };
    case 'legend':
      return { iconBg: 'rgba(212,168,95,0.18)', iconBorder: '1px solid rgba(212,168,95,0.5)', dot: 'var(--gold-hi)', dotShadow: '0 0 16px var(--gold-hi)', hoverShadow: '0 24px 60px rgba(212,168,95,0.25), 0 0 0 1px var(--gold-hi), 0 0 100px rgba(212,168,95,0.15)' };
  }
}

/* ── RSVP / Menu interaction (kept from existing site, restyled) ── */

function RSVPMenu() {
  const { user, openAuth } = useAuth();
  const [rsvp, setRsvp] = useState<'in' | 'maybe' | 'cant'>();
  const [score] = useState(84);

  const initialMenu = [
    { id: 'm1', name: 'Brisket, hot and fast',     cat: 'MAIN',  claimed: false, by: '' },
    { id: 'm2', name: 'Charred shishitos',         cat: 'VEG',   claimed: true,  by: 'Marin K.' },
    { id: 'm3', name: 'Sumac slaw',                cat: 'SIDE',  claimed: false, by: '' },
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

  const radius = 22, circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <div className="section-label">The interaction</div>
        <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 64px)', color: 'var(--bone-100)', marginBottom: '20px' }}>
          Tap once.<br />
          <span className="accent-italic">You're in.</span>
        </h2>
        <p style={{ color: 'var(--bone-400)', fontSize: '17px', lineHeight: 1.7, marginBottom: '40px', maxWidth: '440px' }}>
          No accounts. No profiles. No notifications. Three buttons and a list.
          The whole product fits in a text message.
        </p>

        {/* RSVP row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '28px' }}>
          <span className="mono" style={{ color: 'var(--bone-500)', width: '60px' }}>RSVP</span>
          <div style={{
            display: 'inline-flex', gap: '4px',
            background: 'rgba(26,23,20,0.7)', border: '1px solid rgba(245,237,224,0.08)',
            borderRadius: '999px', padding: '4px',
          }}>
            {RSVPS.map(r => (
              <button key={r.id} onClick={() => handleRsvp(r.id)}
                className="ember-focus"
                style={{
                  background: rsvp === r.id ? 'linear-gradient(135deg, var(--burgundy), var(--burgundy-d))' : 'transparent',
                  color: rsvp === r.id ? 'var(--bone-100)' : 'var(--bone-300)',
                  border: 'none', borderRadius: '999px',
                  padding: '8px 18px', fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontStyle: rsvp === r.id ? 'normal' : 'italic',
                  transition: 'all 0.25s var(--ease-coal)',
                }}
              >{r.label}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span className="mono" style={{ color: 'var(--bone-500)', width: '60px' }}>SCORE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(245,237,224,0.08)" strokeWidth="3" />
              <circle cx="28" cy="28" r={radius} fill="none" stroke="var(--burgundy)" strokeWidth="3"
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
              <text x="28" y="28" textAnchor="middle" dominantBaseline="central"
                style={{ fontFamily: 'var(--font-display)', fill: 'var(--bone-100)', fontSize: '15px', transform: 'rotate(90deg)', transformOrigin: '28px 28px' }}>
                {score}
              </text>
            </svg>
            <div>
              <p className="mono" style={{ color: 'var(--beige)', marginBottom: '2px' }}>Ember score</p>
              <p style={{ color: 'var(--bone-400)', fontSize: '14px' }}>Reliable host</p>
            </div>
          </div>
        </div>
      </div>

      {/* menu card */}
      <div className="card-glow" style={{
        background: 'linear-gradient(180deg, rgba(26,23,20,0.7) 0%, rgba(13,10,12,0.9) 100%)',
        border: '1px solid rgba(245,237,224,0.08)',
        borderRadius: '16px',
        padding: '28px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--bone-100)' }}>The menu so far</h3>
          <span className="mono" style={{
            background: 'rgba(128,0,0,0.2)', color: 'var(--ember-hi)',
            padding: '4px 10px', borderRadius: '6px', fontSize: '10px',
            border: '1px solid rgba(128,0,0,0.4)',
          }}>
            <span className="animate-ember-pulse" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--ember-hi)', marginRight: '6px', verticalAlign: 'middle' }} />
            LIVE
          </span>
        </div>
        <p className="mono" style={{ color: 'var(--bone-500)', marginBottom: '20px' }}>
          Tap "I'll bring this" to claim a dish
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {menu.map(item => (
            <button key={item.id} onClick={() => claim(item.id)}
              className="ember-focus"
              style={{
                width: '100%', textAlign: 'left',
                background: item.claimed ? 'linear-gradient(135deg, var(--burgundy), var(--burgundy-d))' : 'rgba(245,237,224,0.04)',
                border: item.claimed ? '1px solid rgba(184,83,50,0.45)' : '1px solid rgba(245,237,224,0.08)',
                borderRadius: '12px', padding: '16px 18px',
                cursor: 'pointer', transition: 'all 0.25s var(--ease-coal)',
                position: 'relative', overflow: 'hidden',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                if (!item.claimed) {
                  e.currentTarget.style.background = 'rgba(245,237,224,0.07)';
                  e.currentTarget.style.borderColor = 'rgba(217,201,171,0.18)';
                }
              }}
              onMouseLeave={e => {
                if (!item.claimed) {
                  e.currentTarget.style.background = 'rgba(245,237,224,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(245,237,224,0.08)';
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
                      <Check size={16} style={{ color: 'var(--bone-100)' }} />
                      <span className="mono" style={{ color: 'var(--bone-100)', fontSize: '12px', letterSpacing: '0.16em' }}>CLAIMED</span>
                    </div>
                    {item.by && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'rgba(245,237,224,0.85)', fontSize: '14px' }}>{item.by}</span>
                        <span style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          background: 'rgba(0,0,0,0.35)', color: 'var(--beige)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', fontFamily: 'var(--font-display)',
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
                    <p className="mono" style={{ color: 'var(--burgundy)', fontSize: '10px', marginBottom: '4px' }}>
                      {item.cat}
                    </p>
                    <p style={{ color: 'var(--bone-100)', fontFamily: 'var(--font-display)', fontSize: '17px' }}>
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

/* ── rotating Bible verse bar ──────────────────────────────── */
function VerseBar() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % VERSES.length);
        setVisible(true);
      }, 650);
    }, 7500);
    return () => clearInterval(id);
  }, []);

  const v = VERSES[idx];
  return (
    <div className="verse-bar">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="verse-text">"{v.text}"</p>
            <p className="verse-ref">{v.ref}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Landing page ──────────────────────────────────────────── */

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
    <div style={{ color: 'var(--bone-100)', minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      <Nav />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section
        className="v3-section"
        style={{
          position: 'relative',
          minHeight: '100vh',
          padding: '140px 0 120px',
          overflow: 'hidden',
        }}
      >
        <div className="hero-firelight" aria-hidden />

        <div className="page-container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            className="v3-hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              gap: '64px',
              alignItems: 'center',
            }}
          >
            {/* Left: copy */}
            <div style={{ pointerEvents: 'auto' }}>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <span className="section-label" style={{ color: 'var(--burgundy)', borderBottomColor: 'rgba(128,0,0,0.4)' }}>
                  The global BBQ brotherhood
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(44px, 7vw, 96px)',
                  fontWeight: 400,
                  lineHeight: 0.94,
                  letterSpacing: '-0.04em',
                  color: 'var(--bone-100)',
                  textShadow: '0 0 40px rgba(184,83,50,0.18)',
                }}
              >
                The world<br />grills.<br />
                <span className="accent-italic">Join the<br />brotherhood.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                style={{ marginTop: '40px', maxWidth: '480px', fontSize: '19px', lineHeight: 1.6, color: 'var(--bone-300)' }}
              >
                Discover BBQ events in 40+ countries. Host your own gathering.
                Build your rank. Connect with pitmasters worldwide.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7 }}
                style={{ marginTop: '40px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}
              >
                <button className="btn-v3 primary lg" onClick={handleJoinEvent}>
                  Find events near you
                </button>
                <button className="btn-v3 ghost lg" onClick={handleHostEvent}>
                  Host an event
                </button>
              </motion.div>

              {/* stats bar */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.8 }}
                className="hero-stats"
                style={{ marginTop: '64px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}
              >
                {STATS.map(({ value, suffix, label }) => (
                  <div key={label}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 56px)', fontWeight: 400, color: 'var(--beige)', lineHeight: 1, letterSpacing: '-0.025em' }}>
                      <Counter to={value} suffix={suffix} />
                    </p>
                    <p className="mono" style={{ color: 'var(--bone-500)', marginTop: '8px' }}>{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: fire graph — free-floating, no box, edges fade out */}
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1 / 1.05',
              maskImage:
                'radial-gradient(ellipse 85% 85% at 50% 50%, black 40%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 85% 85% at 50% 50%, black 40%, transparent 100%)',
            }}>
              <FireGraph className="absolute inset-0 w-full h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ── BIBLE VERSE BAR ───────────────────────────────────── */}
      <VerseBar />

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="v3-section" style={{ position: 'relative', padding: '140px 0' }}>
        <div className="page-container">
          <FadeUp>
            <div className="section-label">How it works</div>
            <h2 style={{ fontSize: 'clamp(42px, 5.5vw, 80px)', color: 'var(--bone-100)', marginBottom: '0', maxWidth: '1100px' }}>
              Three steps. <span className="accent-italic">One fire.</span>
            </h2>
          </FadeUp>

          <div
            className="v3-three-col"
            style={{ marginTop: '64px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '56px' }}
          >
            {HOW_STEPS.map(({ n, title, body }, i) => (
              <FadeUp key={n} delay={i * 0.12}>
                <div style={{ position: 'relative', paddingLeft: '28px', borderLeft: '1px solid rgba(128,0,0,0.35)' }}>
                  {/* pulsing ember dot */}
                  <span
                    style={{
                      position: 'absolute',
                      left: '-5px', top: 0,
                      width: '9px', height: '9px',
                      borderRadius: '50%',
                      background: 'var(--ember-hi)',
                      boxShadow: '0 0 12px var(--ember-hi)',
                      animation: 'pulse-dot 2s var(--ease-coal) infinite',
                    }}
                  />
                  {/* ghost numeral */}
                  <span style={{
                    position: 'absolute',
                    left: '28px', top: '24px',
                    fontFamily: 'var(--font-display)', fontSize: '220px', fontWeight: 300,
                    color: 'rgba(245,237,224,0.025)', lineHeight: 1, letterSpacing: '-0.04em',
                    pointerEvents: 'none', zIndex: 0, userSelect: 'none',
                  }} aria-hidden>
                    {n}
                  </span>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <p className="mono" style={{ color: 'var(--burgundy)', marginBottom: '24px' }}>STEP {n}</p>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '36px',
                      fontWeight: 500,
                      letterSpacing: '-0.02em',
                      marginBottom: '18px',
                      color: 'var(--bone-100)',
                    }}>{title}</h3>
                    <p style={{ color: 'var(--bone-400)', lineHeight: 1.65, fontSize: '16px' }}>{body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE BOARD ─────────────────────────────────────────── */}
      <section className="v3-section" style={{ position: 'relative', padding: '120px 0' }}>
        <div className="page-container">
          <FadeUp>
            <div className="section-label">The Board</div>
            <h2 style={{ fontSize: 'clamp(42px, 5.5vw, 80px)', color: 'var(--bone-100)', marginBottom: '24px' }}>
              Rank earned. <span className="accent-italic">Not bought.</span>
            </h2>
            <p style={{ color: 'var(--bone-400)', maxWidth: '600px', marginBottom: '0', lineHeight: 1.6, fontSize: '18px' }}>
              Four tiers. Each earned through real events, real ratings, real craft.
              Your rank follows you everywhere fire burns.
            </p>
          </FadeUp>

          <div
            className="v3-four-col"
            style={{ marginTop: '72px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}
          >
            {BOARD_RANKS.map(({ tier, name, req }, i) => {
              const a = rankCardAccents(tier);
              return (
                <FadeUp key={tier} delay={i * 0.1}>
                  <div
                    className="rank-card-v3"
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = a.hoverShadow;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <div>
                      <div style={{
                        width: '56px', height: '56px', borderRadius: '12px',
                        background: a.iconBg, border: a.iconBorder,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '32px',
                      }}>
                        <div style={{
                          width: '14px', height: '14px', borderRadius: '50%',
                          background: a.dot, boxShadow: a.dotShadow,
                          ...(tier === 'legend' ? { animation: 'pulse-dot 2s var(--ease-coal) infinite' } : {}),
                        }} />
                      </div>
                      <p style={{
                        fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 500,
                        letterSpacing: '-0.02em', marginBottom: '8px',
                        color: 'var(--bone-100)',
                      }}>{name}</p>
                    </div>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--bone-500)', lineHeight: 1.5 }}>{req}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LIVE THIS WEEK ────────────────────────────────────── */}
      <section className="v3-section" style={{ position: 'relative', padding: '120px 0' }}>
        <div className="page-container">
          <FadeUp>
            <div className="section-label">Live this week</div>
            <h2 style={{ fontSize: 'clamp(42px, 5.5vw, 80px)', color: 'var(--bone-100)', marginBottom: '24px' }}>
              Fires burning <span className="accent-italic">near you.</span>
            </h2>
            <p style={{ color: 'var(--bone-400)', fontSize: '18px', lineHeight: 1.6, marginBottom: '0' }}>
              Real events, real hosts. Join a gathering or{' '}
              <button
                onClick={() => navigate('/hosts')}
                style={{
                  color: 'var(--beige)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  textDecoration: 'underline',
                  textDecorationColor: 'rgba(228,207,179,0.4)',
                  textUnderlineOffset: '4px',
                  fontFamily: 'inherit', fontSize: 'inherit',
                  transition: 'color 0.25s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--bone-100)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--beige)')}
              >start your own.</button>
            </p>
          </FadeUp>

          <div
            className="v3-three-col"
            style={{ marginTop: '72px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}
          >
            {EVENTS.map(({ city, cc, title, host, rank, date, time, guests, max }, i) => (
              <FadeUp key={title} delay={i * 0.1}>
                <article className="event-card-v3">
                  <span className="heat-bar" aria-hidden />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div className="mono" style={{ color: 'var(--bone-400)' }}>
                      <span style={{ color: 'var(--bone-500)', marginRight: '6px', fontSize: '10px' }}>{cc}</span>
                      {city}
                    </div>
                    <div className="rank-badge" style={tierBadgeStyle(rank)}>{rank}</div>
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 500,
                    letterSpacing: '-0.015em', lineHeight: 1.15,
                    marginBottom: '18px', color: 'var(--bone-100)',
                  }}>{title}</h3>
                  <div className="mono" style={{ color: 'var(--bone-300)', marginBottom: '24px', display: 'flex', gap: '18px' }}>
                    <span>{date}</span>
                    <span>{time}</span>
                  </div>
                  <div style={{ height: '1px', margin: '0 -28px 22px', background: 'linear-gradient(90deg, transparent, rgba(245,237,224,0.08), transparent)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--bone-300)' }}>
                      Hosted by <strong style={{ color: 'var(--bone-100)', fontWeight: 500 }}>{host}</strong>
                    </p>
                    <p className="mono" style={{ color: guests >= max - 2 ? 'var(--gold-v3)' : 'var(--bone-500)' }}>
                      {guests}/{max} going
                    </p>
                  </div>
                  <button
                    onClick={handleJoinEvent}
                    className="btn-v3 primary"
                    style={{ width: '100%' }}
                  >Join event</button>
                </article>
              </FadeUp>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
            <button
              onClick={() => navigate('/events')}
              className="btn-v3 ghost"
            >See all events →</button>
          </div>
        </div>
      </section>

      {/* ── THE INTERACTION (RSVP + MENU) ─────────────────────── */}
      <section className="v3-section" style={{ position: 'relative', padding: '120px 0' }}>
        <div className="page-container">
          <FadeUp>
            <RSVPMenu />
          </FadeUp>
        </div>
      </section>

      {/* ── THE VAULT ─────────────────────────────────────────── */}
      <section
        className="v3-section"
        style={{
          position: 'relative',
          padding: '180px 0',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 50% 60% at 30% 50%, rgba(85,0,0,0.25) 0%, transparent 60%), ' +
              'radial-gradient(ellipse 40% 60% at 80% 30%, rgba(184,146,74,0.06) 0%, transparent 55%)',
          }}
        />
        <div className="page-container">
          <div
            className="v3-vault-grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}
          >
            <FadeUp>
              <div className="section-label">The Vault</div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(48px, 6vw, 88px)',
                fontWeight: 400, lineHeight: 1, letterSpacing: '-0.03em',
                marginBottom: '32px',
                color: 'var(--bone-100)',
              }}>
                The inner circle.
              </h2>
              <p style={{ color: 'var(--bone-400)', lineHeight: 1.7, fontSize: '18px', maxWidth: '540px' }}>
                Exclusive recipes, live masterclasses, The Board certification,
                Brotherhood Network, vetted partner deals, The Council, and Annual
                Summit access. Everything the grill deserves.
              </p>

              <div style={{ display: 'flex', gap: '16px', marginTop: '48px' }}>
                <div className="price-card-v3">
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '56px', fontWeight: 300, letterSpacing: '-0.025em', lineHeight: 1, color: 'var(--bone-100)' }}>€15</p>
                  <p className="mono" style={{ color: 'var(--bone-400)', marginTop: '14px' }}>Per month</p>
                </div>
                <div className="price-card-v3 featured">
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '56px', fontWeight: 300, letterSpacing: '-0.025em', lineHeight: 1, color: 'var(--bone-100)' }}>€99</p>
                  <p className="mono" style={{ color: 'var(--beige)', marginTop: '14px' }}>Annual · Best value</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/vault')}
                className="btn-v3 primary lg"
                style={{ marginTop: '36px' }}
              >Join the Vault →</button>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div
                className="v3-vault-features"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}
              >
                {VAULT_FEATURES.map(({ title, body }) => (
                  <div key={title} className="vault-feature-v3">
                    <h4 style={{
                      fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 500,
                      letterSpacing: '-0.01em', color: 'var(--beige)', marginBottom: '8px',
                      position: 'relative', zIndex: 1,
                    }}>{title}</h4>
                    <p style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--bone-500)', position: 'relative', zIndex: 1 }}>{body}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── FROM THE BROTHERHOOD ──────────────────────────────── */}
      <section className="v3-section" style={{ position: 'relative', padding: '120px 0' }}>
        <div className="page-container">
          <FadeUp>
            <div className="section-label">From the Brotherhood</div>
            <h2 style={{ fontSize: 'clamp(42px, 5.5vw, 80px)', color: 'var(--bone-100)', marginBottom: '0' }}>
              Show up a stranger. <span className="accent-italic">Leave a brother.</span>
            </h2>
          </FadeUp>

          <div
            className="v3-three-col"
            style={{ marginTop: '72px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}
          >
            {TESTIMONIALS.map(({ quote, name, city, rank }, i) => (
              <FadeUp key={name} delay={i * 0.1}>
                <article className="quote-card-v3">
                  <span className="quote-mark" aria-hidden>“</span>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontStyle: 'italic',
                    fontSize: '19px', lineHeight: 1.55, color: 'var(--beige)',
                    marginBottom: '32px', position: 'relative',
                    paddingTop: '8px',
                  }}>{quote}</p>
                  <div style={{ height: '1px', margin: '0 -32px 24px', background: 'linear-gradient(90deg, transparent, rgba(245,237,224,0.08), transparent)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 500, color: 'var(--bone-100)' }}>{name}</p>
                      <p className="mono" style={{ color: 'var(--bone-500)', marginTop: '4px', fontSize: '10px', letterSpacing: '0.15em' }}>{city}</p>
                    </div>
                    <div className="rank-badge" style={tierBadgeStyle(rank)}>{rank}</div>
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANNUAL SUMMIT ─────────────────────────────────────── */}
      <section
        className="v3-section"
        style={{
          position: 'relative',
          padding: '180px 0 140px',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(85,0,0,0.3) 0%, transparent 60%), ' +
              'radial-gradient(ellipse 40% 30% at 50% 90%, rgba(184,83,50,0.12) 0%, transparent 60%)',
          }}
        />
        <div className="page-container">
          <FadeUp>
            <div className="section-label" style={{ marginInline: 'auto', display: 'inline-block' }}>Annual Summit</div>
            <h2 style={{
              fontSize: 'clamp(48px, 6.5vw, 96px)',
              color: 'var(--bone-100)',
              lineHeight: 1.05,
              margin: '0 auto',
              maxWidth: '1100px',
            }}>
              One city. One weekend.<br />
              <span className="accent-italic">The whole brotherhood.</span>
            </h2>
            <p style={{
              margin: '36px auto 0',
              maxWidth: '620px',
              fontSize: '18px', lineHeight: 1.65, color: 'var(--bone-400)',
            }}>
              Location revealed exclusively to Vault members. Your subscription is your ticket.
              Every year, a different city. Always unforgettable.
            </p>
            <button
              onClick={() => navigate('/vault')}
              className="btn-v3 primary lg"
              style={{ marginTop: '56px' }}
            >Join the Vault · Get Summit access</button>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
