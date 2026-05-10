import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Users, Globe, Award } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PILLARS = [
  { icon: Flame,  title: 'Fire',         body: 'Real charcoal. Real wood. Real heat. Anyone can grill — only some understand fire.' },
  { icon: Users,  title: 'Brotherhood',  body: 'Verified members across 40+ countries. Show up a stranger. Leave a brother.' },
  { icon: Globe,  title: 'Global',       body: 'From Amsterdam to Tokyo to São Paulo. One platform. One standard. No shortcuts.' },
  { icon: Award,  title: 'Earned rank',  body: 'Four tiers — Ember, Iron, Gold, Legend. Each earned. None bought. Reputation that follows you everywhere.' },
];

function FadeUp({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.4, 0, 0.2, 1] }}
      style={style}
    >{children}</motion.div>
  );
}

export function About() {
  const navigate = useNavigate();

  return (
    <div style={{ color: 'var(--bone-100)', minHeight: '100vh', overflowX: 'hidden' }}>
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="v3-section" style={{ paddingTop: '160px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: '20%', left: '-10%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(128,0,0,0.22), transparent 60%)', pointerEvents: 'none', filter: 'blur(40px)' }} />
        <div aria-hidden style={{ position: 'absolute', top: '60%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(184,146,74,0.07), transparent 60%)', pointerEvents: 'none', filter: 'blur(30px)' }} />

        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="section-label">§ About Ember</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(64px, 13vw, 180px)',
              lineHeight: 0.88, marginBottom: '0', letterSpacing: '-0.04em',
              fontWeight: 400, color: 'var(--bone-100)',
            }}
          >
            Not just<br />
            <span className="accent-italic" style={{ fontSize: 'clamp(72px, 15vw, 210px)' }}>
              a BBQ.
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            style={{ marginTop: '60px', maxWidth: '520px', marginLeft: 'auto' }}
          >
            <p style={{ color: 'var(--bone-400)', fontSize: '20px', lineHeight: 1.65 }}>
              A global brotherhood built around fire, craft, and the people who take both seriously.
              <br /><br />
              <span style={{ color: 'var(--beige)' }}>40+ countries. One standard. No shortcuts.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── BIG QUOTE ────────────────────────────────────────── */}
      <section style={{ padding: '120px 0', borderTop: '1px solid rgba(245,237,224,0.06)', borderBottom: '1px solid rgba(245,237,224,0.06)', background: 'rgba(13,10,12,0.5)', textAlign: 'center' }}>
        <div className="page-container" style={{ maxWidth: '900px' }}>
          <FadeUp>
            <p style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic',
              fontSize: 'clamp(28px, 4.5vw, 56px)',
              color: 'var(--bone-200)', lineHeight: 1.3, letterSpacing: '-0.01em',
            }}>
              "We started Ember because the people who care most about fire
              <span style={{ color: 'var(--ember-hi)' }}> had nowhere to find each other.</span>"
            </p>
            <p className="mono" style={{ color: 'var(--bone-500)', marginTop: '40px' }}>— THE FOUNDERS</p>
          </FadeUp>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(245,237,224,0.06)' }}>
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px' }}>
            {[
              { value: '40+',     label: 'Countries' },
              { value: '3,200+',  label: 'Verified members' },
              { value: '12,000+', label: 'Events hosted' },
              { value: '4',       label: 'Board tiers' },
              { value: '1',       label: 'Annual Summit' },
            ].map(({ value, label }, i) => (
              <FadeUp key={label} delay={i * 0.07} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 80px)', color: 'var(--beige)', lineHeight: 1 }}>{value}</p>
                <p className="mono" style={{ color: 'var(--bone-500)', marginTop: '12px' }}>{label}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 PILLARS ────────────────────────────────────────── */}
      <section className="v3-section" style={{ padding: '140px 0' }}>
        <div className="page-container">
          <FadeUp style={{ marginBottom: '80px', maxWidth: '600px' }}>
            <div className="section-label">§ What we stand for</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5.5vw, 72px)', lineHeight: 1.05, color: 'var(--bone-100)', letterSpacing: '-0.02em' }}>
              Four things.<br />
              <span className="accent-italic">One fire.</span>
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-8">
            {PILLARS.map(({ icon: Icon, title, body }, i) => (
              <FadeUp key={title} delay={i * 0.1}>
                <div
                  className="rank-card-v3"
                  style={{ padding: '48px', ...(i % 2 === 0 ? { transform: 'translateY(-12px)' } : {}) }}
                >
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '12px',
                    background: 'rgba(85,0,0,0.35)', border: '1px solid rgba(128,0,0,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px',
                  }}>
                    <Icon size={22} style={{ color: 'var(--ember-hi)' }} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--bone-100)', marginBottom: '14px', letterSpacing: '-0.01em' }}>
                    {title}
                  </h3>
                  <p style={{ color: 'var(--bone-400)', fontSize: '16px', lineHeight: 1.7 }}>{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────────── */}
      <section className="v3-section" style={{ padding: '120px 0', borderTop: '1px solid rgba(245,237,224,0.06)', borderBottom: '1px solid rgba(245,237,224,0.06)', background: 'rgba(13,10,12,0.4)' }}>
        <div className="page-container">
          {[
            { label: 'WHERE IT STARTED', title: 'A gathering that should have existed.', body: 'It started with a single question: why is there no place to find people who grill the way you do? Not the casual weekend crowd. The ones who know the difference between binchotan and briquettes. Who talk about the Maillard reaction. Who treat a brisket like a project. Ember is the answer.', align: 'left' },
            { label: 'THE PLATFORM',     title: 'Three things merged into one.',         body: "Ember is Eventbrite for BBQ events, Instagram for the culture, and a brotherhood that holds you to a standard. The map is live. Events appear as pins. You discover, join, contribute, and leave with people you'll grill with for years. The Vault deepens everything.", align: 'right' },
            { label: 'THE STANDARD',     title: "A rank means something because it can't be faked.", body: "The Board exists because hosting matters. Not all events are equal. Not all hosts are equal. Ember, Iron, Gold, Legend. Four tiers earned through hosting, getting rated, contributing. No shortcuts. No buying your way up. Your rank follows you across 40+ countries.", align: 'left' },
            { label: 'WHO EMBER IS FOR', title: 'Show up a stranger. Leave a brother.', body: "Ember is for people who take the grill seriously. Not exclusionary — welcoming. But specific. The host who spends more time on wood selection than a sommelier spends on wine. The traveller who finds a grill in every city. That's not a tagline. That's what happens at every Ember gathering.", align: 'right' },
          ].map(({ label, title, body, align }, i) => (
            <FadeUp key={label} delay={0.05} style={{ marginBottom: i < 3 ? '120px' : 0 }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start',
                direction: align === 'right' ? 'rtl' : 'ltr',
              }} className="story-row">
                <div style={{ direction: 'ltr' }}>
                  <p className="mono" style={{ color: 'var(--burgundy)', marginBottom: '14px' }}>{label}</p>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 52px)', color: 'var(--bone-100)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                    {title}
                  </h2>
                </div>
                <p style={{ direction: 'ltr', color: 'var(--bone-400)', fontSize: '17px', lineHeight: 1.85, paddingTop: '12px' }}>
                  {body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="v3-section" style={{ padding: '180px 0 140px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(85,0,0,0.28) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
          <FadeUp>
            <div className="section-label" style={{ display: 'inline-block' }}>§ Ready?</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 8vw, 110px)', lineHeight: 0.95, letterSpacing: '-0.03em', color: 'var(--bone-100)', marginBottom: '40px' }}>
              The fire's<br />
              <span className="accent-italic">already lit.</span>
            </h2>
            <p style={{ color: 'var(--bone-400)', fontSize: '19px', lineHeight: 1.7, marginBottom: '48px', maxWidth: '560px', margin: '0 auto 48px' }}>
              Join the Vault. Find events. Earn your rank. Be part of the only BBQ brotherhood that exists at this scale.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-v3 primary lg" onClick={() => navigate('/vault')}>Join the Vault</button>
              <button className="btn-v3 ghost lg"    onClick={() => navigate('/events')}>Browse events</button>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .story-row { grid-template-columns: 1fr !important; direction: ltr !important; gap: 24px !important; }
        }
      `}</style>
    </div>
  );
}
