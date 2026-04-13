import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Globe } from '../components/Globe';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const dur = 1400;
    const step = 16;
    const inc = to / (dur / step);
    let cur = 0;
    const id = setInterval(() => {
      cur = Math.min(cur + inc, to);
      setVal(Math.round(cur));
      if (cur >= to) clearInterval(id);
    }, step);
    return () => clearInterval(id);
  }, [inView, to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const STATS = [
  { value: 15,  suffix: '',   label: 'live events'   },
  { value: 40,  suffix: '+',  label: 'countries'     },
  { value: 4,   suffix: '',   label: 'Board tiers'   },
  { value: 1,   suffix: '',   label: 'Annual Summit' },
];

const HOW_IT_WORKS = [
  {
    n: '01', icon: '🌍', title: 'Discover',
    body: 'Find BBQ gatherings near you on the live globe. Every pin is a real event, a real host, a real fire.',
  },
  {
    n: '02', icon: '🥩', title: 'Join & Contribute',
    body: "RSVP, tell the host what you're bringing — meat, charcoal, drinks. No doubling up. No gaps.",
  },
  {
    n: '03', icon: '🏆', title: 'Level up',
    body: "Host. Get rated. Earn your rank on The Board. Build a reputation that follows you everywhere fire burns.",
  },
];

const BOARD_RANKS = [
  { icon: '🔥', tier: 'Ember',  color: '#800000', req: 'Join the Vault · Host your first event' },
  { icon: '🪨', tier: 'Iron',   color: '#6B7280', req: '5+ events · 4.5★ average rating' },
  { icon: '🏅', tier: 'Gold',   color: '#B8860B', req: '20+ events · 4.8★ · Vault contributor' },
  { icon: '👑', tier: 'Legend', color: '#DAA520', req: 'Top 1% globally · Invitation only · Summit speaker' },
];

const CITIES = [
  { name: 'Amsterdam',    flag: '🇳🇱', events: 4 },
  { name: 'Tokyo',        flag: '🇯🇵', events: 3 },
  { name: 'New York',     flag: '🇺🇸', events: 5 },
  { name: 'Rome',         flag: '🇮🇹', events: 2 },
  { name: 'Lisbon',       flag: '🇵🇹', events: 3 },
  { name: 'Johannesburg', flag: '🇿🇦', events: 2 },
  { name: 'São Paulo',    flag: '🇧🇷', events: 3 },
  { name: 'Singapore',    flag: '🇸🇬', events: 2 },
  { name: 'Barcelona',    flag: '🇪🇸', events: 3 },
];

const TESTIMONIALS = [
  {
    quote: "I flew to Amsterdam for an Ember gathering. Left with four guys I'll grill with for life. That doesn't happen on Eventbrite.",
    name: 'Kofi A.', city: 'Accra → Amsterdam', rank: 'Iron',
  },
  {
    quote: "The Board made me take hosting seriously. I went from a backyard weekend thing to something people actually talk about.",
    name: 'Marco T.', city: 'Rome', rank: 'Gold',
  },
  {
    quote: "I've used every events app. None of them care about the food. Ember understands that the grill is the whole point.",
    name: 'Yuto K.', city: 'Tokyo', rank: 'Ember',
  },
];

const btn = {
  maroon: {
    background: '#800000', color: '#FFFFFF', border: 'none',
    borderRadius: '10px', padding: '14px 28px', fontSize: '15px',
    fontWeight: '600' as const, cursor: 'pointer' as const, transition: 'all 0.2s',
  },
  outline: {
    background: 'transparent', color: '#E4CFB3',
    border: '1px solid rgba(228,207,179,0.35)',
    borderRadius: '10px', padding: '14px 28px', fontSize: '15px',
    fontWeight: '600' as const, cursor: 'pointer' as const, transition: 'all 0.2s',
  },
};

export function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#0A0A0A', color: '#FFFFFF', minHeight: '100vh', overflowX: 'hidden' }}>
      <Nav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', width: '100%', height: '100vh', minHeight: '640px' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Globe mode="hero" />
        </div>
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
            background: 'linear-gradient(to bottom, transparent, #0A0A0A)',
          }}
        />
        <div
          style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            padding: '0 24px', paddingTop: '64px',
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(40px, 7vw, 88px)',
              fontWeight: '400', lineHeight: '1.08',
              color: '#FFFFFF', maxWidth: '800px',
              marginBottom: '24px',
              textShadow: '0 2px 40px rgba(0,0,0,0.9)',
            }}
          >
            The world grills.
            <br />
            <span style={{ color: '#E4CFB3' }}>Join the brotherhood.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              color: '#A0A0A0', fontSize: 'clamp(15px, 2vw, 19px)',
              maxWidth: '520px', lineHeight: '1.6', marginBottom: '40px',
              textShadow: '0 1px 20px rgba(0,0,0,1)',
            }}
          >
            Discover BBQ events in 40+ countries. Host your own gathering.
            Connect with pitmasters worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <button
              style={btn.maroon}
              onClick={() => navigate('/events')}
              onMouseEnter={e => { e.currentTarget.style.background = '#990000'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#800000'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Find events near you
            </button>
            <button
              style={btn.outline}
              onClick={() => navigate('/about')}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(228,207,179,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Learn more
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          style={{
            position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          }}
        >
          <span style={{ color: '#5A5A5A', fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: '1px', height: '36px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.20), transparent)' }} />
        </motion.div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {STATS.map(({ value, suffix, label }, i) => (
              <FadeUp key={label} delay={i * 0.08}>
                <div
                  style={{
                    padding: '40px 24px', textAlign: 'center',
                    borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}
                >
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 4vw, 48px)', color: '#E4CFB3', marginBottom: '4px', lineHeight: 1 }}>
                    <Counter to={value} suffix={suffix} />
                  </p>
                  <p style={{ color: '#5A5A5A', fontSize: '13px' }}>{label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '120px 0' }}>
        <div className="page-container">
          <FadeUp>
            <p style={{ color: '#800000', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
              How it works
            </p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 4vw, 52px)', color: '#FFFFFF', maxWidth: '560px', lineHeight: 1.1, marginBottom: '64px' }}>
              Three steps to the brotherhood.
            </h2>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2px' }}>
            {HOW_IT_WORKS.map(({ n, icon, title, body }, i) => (
              <FadeUp key={n} delay={i * 0.12}>
                <div
                  style={{ padding: '48px 36px', background: '#111111', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', transition: 'border-color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(128,0,0,0.35)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
                >
                  <span style={{ position: 'absolute', top: '24px', right: '24px', fontFamily: 'Georgia, serif', fontSize: '52px', color: 'rgba(255,255,255,0.04)', lineHeight: 1 }}>
                    {n}
                  </span>
                  <span style={{ fontSize: '36px', display: 'block', marginBottom: '24px' }}>{icon}</span>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', color: '#FFFFFF', marginBottom: '12px' }}>{title}</h3>
                  <p style={{ color: '#A0A0A0', fontSize: '15px', lineHeight: '1.65' }}>{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── VAULT TEASER ─────────────────────────────────────────────────── */}
      <section style={{ padding: '0 0 120px' }}>
        <div className="page-container">
          <FadeUp>
            <div
              style={{
                background: 'linear-gradient(135deg, #0d0000 0%, #111111 50%, #0d0000 100%)',
                border: '1px solid rgba(128,0,0,0.30)',
                borderRadius: '20px',
                padding: 'clamp(48px, 6vw, 80px) clamp(32px, 5vw, 80px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(128,0,0,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', maxWidth: '620px' }}>
                <p style={{ color: '#800000', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
                  Members only
                </p>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 4vw, 52px)', color: '#E4CFB3', lineHeight: 1.1, marginBottom: '20px' }}>
                  The Secret Vault.
                </h2>
                <p style={{ color: '#A0A0A0', fontSize: '16px', lineHeight: '1.7', marginBottom: '36px' }}>
                  Member-only recipes. Live masterclasses. The Brotherhood Network. The Council. The Annual Summit.
                  One subscription unlocks everything.
                </p>
                <button
                  style={btn.maroon}
                  onClick={() => navigate('/vault')}
                  onMouseEnter={e => { e.currentTarget.style.background = '#990000'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#800000'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Become a Vault member
                </button>
              </div>
              <div
                style={{ position: 'absolute', right: '48px', top: '50%', transform: 'translateY(-50%)', fontSize: '96px', opacity: 0.06, userSelect: 'none', lineHeight: 1 }}
                className="hidden md:block"
              >
                🔒
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── THE BOARD ────────────────────────────────────────────────────── */}
      <section style={{ padding: '0 0 120px' }}>
        <div className="page-container">
          <FadeUp>
            <p style={{ color: '#800000', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
              Ranking system
            </p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 4vw, 52px)', color: '#FFFFFF', lineHeight: 1.1, marginBottom: '12px' }}>
              The Board.
            </h2>
            <p style={{ color: '#A0A0A0', fontSize: '16px', maxWidth: '480px', lineHeight: '1.6', marginBottom: '52px' }}>
              Not just a ranking. A standard. Every tier earned through real events, real ratings, real craft.
            </p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {BOARD_RANKS.map(({ icon, tier, color, req }, i) => (
              <FadeUp key={tier} delay={i * 0.10}>
                <div
                  style={{ padding: '32px 24px', background: '#111111', border: `1px solid ${color}22`, borderRadius: '16px', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}22`; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <span style={{ fontSize: '32px', display: 'block', marginBottom: '16px' }}>{icon}</span>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: color, marginBottom: '10px' }}>{tier}</h3>
                  <p style={{ color: '#5A5A5A', fontSize: '13px', lineHeight: '1.6' }}>{req}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITIES ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '0 0 120px' }}>
        <div className="page-container">
          <FadeUp>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', color: '#FFFFFF', marginBottom: '40px' }}>
              Your city is grilling.
            </h2>
          </FadeUp>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px' }} className="no-scrollbar">
            {CITIES.map(({ name, flag, events }, i) => (
              <FadeUp key={name} delay={i * 0.06}>
                <button
                  onClick={() => navigate('/events')}
                  style={{ minWidth: '152px', padding: '24px 20px', background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.25s', flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(228,207,179,0.22)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <span style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }}>{flag}</span>
                  <p style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{name}</p>
                  <p style={{ color: '#5A5A5A', fontSize: '12px' }}>{events} active</p>
                </button>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '120px 0', background: '#080808', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="page-container">
          <FadeUp>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', color: '#FFFFFF', marginBottom: '56px', textAlign: 'center' }}>
              Brotherhood, in their words.
            </h2>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {TESTIMONIALS.map(({ quote, name, city, rank }, i) => (
              <FadeUp key={name} delay={i * 0.12}>
                <div style={{ padding: '36px 32px', background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px' }}>
                  <p style={{ color: '#A0A0A0', fontSize: '15px', lineHeight: '1.75', marginBottom: '28px', fontStyle: 'italic' }}>
                    "{quote}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '14px' }}>{name}</p>
                      <p style={{ color: '#5A5A5A', fontSize: '12px', marginTop: '2px' }}>{city}</p>
                    </div>
                    <span style={{ background: 'rgba(128,0,0,0.15)', border: '1px solid rgba(128,0,0,0.30)', borderRadius: '6px', padding: '3px 10px', color: '#E4CFB3', fontSize: '11px', fontWeight: '600' }}>
                      {rank}
                    </span>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANNUAL SUMMIT ────────────────────────────────────────────────── */}
      <section style={{ padding: '120px 0' }}>
        <div className="page-container">
          <FadeUp>
            <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', background: '#0d0000', border: '1px solid rgba(128,0,0,0.25)' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(128,0,0,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(128,0,0,0.10) 0%, transparent 60%)' }} />
              <div style={{ position: 'relative', padding: 'clamp(56px, 7vw, 96px) clamp(32px, 5vw, 80px)', textAlign: 'center' }}>
                <p style={{ color: '#800000', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>
                  Annual gathering
                </p>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px, 5vw, 64px)', color: '#E4CFB3', lineHeight: 1.05, marginBottom: '24px' }}>
                  Ember Summit 2025.
                </h2>
                <p style={{ color: '#A0A0A0', fontSize: '16px', maxWidth: '520px', margin: '0 auto 40px', lineHeight: '1.7' }}>
                  One city. One weekend. The finest pitmasters from every continent.
                  Location revealed to Vault members only.
                </p>
                <button
                  style={btn.maroon}
                  onClick={() => navigate('/vault')}
                  onMouseEnter={e => { e.currentTarget.style.background = '#990000'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#800000'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
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
