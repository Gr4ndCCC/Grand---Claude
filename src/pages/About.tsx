import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Users, Globe, Award } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { FireButton } from '../components/FireButton';

const PILLARS = [
  { icon: Flame,  title: 'Fire',         body: 'Real charcoal. Real wood. Real heat. Anyone can grill — only some understand fire.' },
  { icon: Users,  title: 'Brotherhood',  body: 'Verified members across 40+ countries. Show up a stranger. Leave a brother.' },
  { icon: Globe,  title: 'Global',       body: 'From Amsterdam to Tokyo to São Paulo. One platform. One standard. No shortcuts.' },
  { icon: Award,  title: 'Earned rank',  body: 'Four tiers — Ember, Iron, Gold, Legend. Each earned. None bought. Reputation that follows you everywhere.' },
];

export function About() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      <Nav />

      {/* ── HERO — asymmetric statement ─────────────────────── */}
      <section style={{ paddingTop: '160px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(128,0,0,0.18), transparent 60%)', pointerEvents: 'none', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '60%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(228,207,179,0.05), transparent 60%)', pointerEvents: 'none', filter: 'blur(30px)' }} />

        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.p className="mono"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ color: 'var(--maroon)', marginBottom: '32px', letterSpacing: '0.16em' }}
          >ABOUT EMBER</motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(64px, 14vw, 200px)',
              lineHeight: 0.85, marginBottom: '0', letterSpacing: '-0.04em',
              fontWeight: 400,
            }}
          >
            Not just<br />
            <span style={{ color: 'var(--beige)', fontStyle: 'italic', fontSize: 'clamp(72px, 16vw, 240px)' }}>
              a BBQ.
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            style={{ marginTop: '60px', maxWidth: '520px', marginLeft: 'auto' }}
          >
            <span className="maroon-rule" style={{ marginBottom: '20px' }} />
            <p style={{ color: '#A0A0A0', fontSize: '20px', lineHeight: 1.65 }}>
              A global brotherhood built around fire, craft, and the people who take both seriously.
              <br /><br />
              <span style={{ color: 'var(--beige)' }}>40+ countries. One standard. No shortcuts.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── BIG QUOTE — full bleed ──────────────────────────── */}
      <section style={{ padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0D0D0D', textAlign: 'center' }}>
        <div className="page-container" style={{ maxWidth: '900px' }}>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(32px, 5vw, 60px)',
              fontStyle: 'italic', color: '#fff',
              lineHeight: 1.25, letterSpacing: '-0.01em',
            }}
          >
            "We started Ember because the people who care most about fire
            <span style={{ color: 'var(--maroon)' }}> had nowhere to find each other.</span>"
          </motion.p>
          <motion.p className="mono"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            style={{ color: '#5A5A5A', marginTop: '40px', letterSpacing: '0.18em' }}
          >— THE FOUNDERS</motion.p>
        </div>
      </section>

      {/* ── STATS — full width strip ────────────────────────── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px' }}>
            {[
              { value: '40+',     label: 'Countries' },
              { value: '3,200+',  label: 'Verified members' },
              { value: '12,000+', label: 'Events hosted' },
              { value: '4',       label: 'Board tiers' },
              { value: '1',       label: 'Annual Summit' },
            ].map(({ value, label }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{ textAlign: 'center' }}
              >
                <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(48px, 7vw, 90px)', color: 'var(--beige)', lineHeight: 1 }}>{value}</p>
                <p className="mono" style={{ color: '#5A5A5A', marginTop: '12px', letterSpacing: '0.12em' }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 PILLARS — asymmetric grid ─────────────────────── */}
      <section style={{ padding: '120px 0' }}>
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ marginBottom: '80px', maxWidth: '600px' }}
          >
            <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '12px' }}>What we stand for</p>
            <span className="maroon-rule" style={{ marginBottom: '24px' }} />
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.05, color: '#fff', letterSpacing: '-0.02em' }}>
              Four things.<br />
              <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>One fire.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {PILLARS.map(({ icon: Icon, title, body }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: '#111', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '20px', padding: '48px', position: 'relative',
                  overflow: 'hidden',
                  ...(i % 2 === 0 ? { transform: 'translateY(-12px)' } : {}),
                }}
                className="card-glow"
              >
                <div style={{
                  width: '52px', height: '52px',
                  borderRadius: '12px',
                  background: 'rgba(128,0,0,0.15)',
                  border: '1px solid rgba(128,0,0,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '28px',
                }}>
                  <Icon size={22} style={{ color: 'var(--maroon)' }} />
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '32px', color: '#fff', marginBottom: '14px', letterSpacing: '-0.01em' }}>
                  {title}
                </h3>
                <p style={{ color: '#A0A0A0', fontSize: '16px', lineHeight: 1.7 }}>{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY — long form, alternating ──────────────────── */}
      <section style={{ padding: '120px 0', background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="page-container">
          {[
            {
              label: 'WHERE IT STARTED',
              title: 'A gathering that should have existed.',
              body: 'It started with a single question: why is there no place to find people who grill the way you do? Not the casual weekend crowd. The ones who know the difference between binchotan and briquettes. Who talk about the Maillard reaction. Who treat a brisket like a project. Ember is the answer.',
              align: 'left',
            },
            {
              label: 'THE PLATFORM',
              title: 'Three things merged into one.',
              body: 'Ember is Eventbrite for BBQ events, Instagram for the culture, and a brotherhood that holds you to a standard. The map is live. Events appear as pins. You discover, join, contribute, and leave with people you\'ll grill with for years. The Vault deepens everything.',
              align: 'right',
            },
            {
              label: 'THE STANDARD',
              title: 'A rank means something because it can\'t be faked.',
              body: 'The Board exists because hosting matters. Not all events are equal. Not all hosts are equal. Ember, Iron, Gold, Legend. Four tiers earned through hosting, getting rated, contributing. No shortcuts. No buying your way up. Your rank follows you across 40+ countries.',
              align: 'left',
            },
            {
              label: 'WHO EMBER IS FOR',
              title: 'Show up a stranger. Leave a brother.',
              body: 'Ember is for people who take the grill seriously. Not exclusionary — welcoming. But specific. The host who spends more time on wood selection than a sommelier spends on wine. The traveller who finds a grill in every city. That\'s not a tagline. That\'s what happens at every Ember gathering.',
              align: 'right',
            },
          ].map(({ label, title, body, align }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.05 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '60px', alignItems: 'start',
                marginBottom: i < 3 ? '120px' : 0,
                direction: align === 'right' ? 'rtl' : 'ltr',
              }}
              className="story-row"
            >
              <div style={{ direction: 'ltr' }}>
                <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '14px', letterSpacing: '0.16em' }}>{label}</p>
                <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(32px, 4.5vw, 56px)', color: '#fff', lineHeight: 1.05, letterSpacing: '-0.01em' }}>
                  {title}
                </h2>
              </div>
              <p style={{ direction: 'ltr', color: '#A0A0A0', fontSize: '17px', lineHeight: 1.85, paddingTop: '12px' }}>
                {body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HUGE CALL TO ACTION ─────────────────────────────── */}
      <section style={{ padding: '180px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(128,0,0,0.2), transparent 60%)', pointerEvents: 'none', filter: 'blur(60px)' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
          <motion.p className="mono"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ color: 'var(--maroon)', marginBottom: '16px', letterSpacing: '0.18em' }}
          >READY?</motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(48px, 9vw, 120px)',
              lineHeight: 0.95, marginBottom: '40px', letterSpacing: '-0.03em',
            }}
          >
            The fire's<br />
            <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>already lit.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            style={{ color: '#A0A0A0', fontSize: '19px', lineHeight: 1.7, marginBottom: '48px', maxWidth: '560px', margin: '0 auto 48px' }}
          >
            Join the Vault. Find events. Earn your rank. Be part of the only BBQ brotherhood that exists at this scale.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.45 }}
            style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <FireButton variant="primary" size="lg" onClick={() => navigate('/vault')}>
              Join the Vault
            </FireButton>
            <FireButton variant="outline" size="lg" onClick={() => navigate('/events')}>
              Browse events
            </FireButton>
          </motion.div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .story-row {
            grid-template-columns: 1fr !important;
            direction: ltr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
