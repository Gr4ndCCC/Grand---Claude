import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const MANIFESTO_SECTIONS = [
  {
    label: 'Where it started',
    title: 'A gathering that should have existed.',
    body: [
      "It started with a question: why is there no place to find people who grill the way you do?",
      "Not the casual weekend crowd. The ones who know the difference between binchotan and briquettes. Who talk about the Maillard reaction. Who treat a brisket like a project.",
      "Social media is full of food content but empty of community. Event apps don't know what a gathering is. Nothing understood that the grill is where something real happens.",
      "Ember is the answer to that question.",
    ],
  },
  {
    label: 'What we\'re building',
    title: 'A platform worth trusting.',
    body: [
      "Ember is three things merged: Eventbrite for BBQ events, Instagram for the culture, and a brotherhood that holds you to a standard.",
      "The globe is live. Events appear as pins. You discover, join, contribute, and leave with people you'll grill with for years.",
      "The Vault is the inner circle — recipes that don't exist anywhere else, live masterclasses, the Brotherhood Network, The Board, and the Annual Summit.",
      "We're building something that lasts because we're building something that matters.",
    ],
  },
  {
    label: 'The brotherhood',
    title: 'Who Ember is for.',
    body: [
      "Ember is for men who take the grill seriously. Not exclusionary — welcoming. But specific.",
      "The host who spends more time on wood selection than a sommelier spends on wine. The traveller who finds a grill in every city. The guy who has eight BBQ tongs but lends them freely.",
      "Show up as a stranger. Leave as a brother. That's not a tagline. That's what happens at every Ember gathering we've ever been to.",
      "This is a community built around craft. The craft of fire. The craft of hospitality. The craft of doing something well because it matters.",
    ],
  },
  {
    label: 'The Board',
    title: 'Why ranking matters.',
    body: [
      "Not every host is equal. That sounds harsh until you've been to a great gathering and a terrible one.",
      "The Board exists because we believe excellence should be recognised and mediocricy should be motivated.",
      "Ember, Iron, Gold, Legend. Four tiers. Each earned. Your rank lives on your profile, travels with you, and opens doors — literally, to gatherings that only Legends can join.",
      "Not just a ranking. A standard.",
    ],
  },
];

export function About() {
  return (
    <div style={{ background: '#0A0A0A', color: '#FFFFFF', minHeight: '100vh' }}>
      <Nav />

      {/* HERO */}
      <section style={{ paddingTop: '160px', paddingBottom: '120px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', maxWidth: '760px' }}>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ color: '#800000', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '24px' }}
          >
            Manifesto
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(40px, 6vw, 72px)',
              color: '#FFFFFF',
              lineHeight: 1.06,
              marginBottom: '32px',
            }}
          >
            We believe the grill is where men build something real.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{ color: '#A0A0A0', fontSize: '18px', lineHeight: '1.7', maxWidth: '600px' }}
          >
            Fire has always been the place. Not the table. Not the bar. The grill.
            Ember exists to connect the people who know that.
          </motion.p>
        </div>
      </section>

      {/* MANIFESTO SECTIONS */}
      {MANIFESTO_SECTIONS.map(({ label, title, body }, i) => (
        <section
          key={label}
          style={{
            padding: '80px 0',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: i % 2 === 1 ? '#080808' : '#0A0A0A',
          }}
        >
          <div className="page-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '80px', alignItems: 'start' }}>
              <FadeUp delay={0.05}>
                <div style={{ position: 'sticky', top: '100px' }}>
                  <p style={{ color: '#800000', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
                    {label}
                  </p>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px, 3.5vw, 40px)', color: '#E4CFB3', lineHeight: 1.15 }}>
                    {title}
                  </h2>
                </div>
              </FadeUp>
              <FadeUp delay={0.15}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {body.map((para, j) => (
                    <p key={j} style={{ color: '#A0A0A0', fontSize: '16px', lineHeight: '1.8' }}>{para}</p>
                  ))}
                </div>
              </FadeUp>
            </div>
          </div>
        </section>
      ))}

      {/* TEAM */}
      <section style={{ padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="page-container">
          <FadeUp>
            <p style={{ color: '#800000', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
              Behind the fire
            </p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', color: '#FFFFFF', lineHeight: 1.1, marginBottom: '48px' }}>
              The team.
            </h2>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {/* Founder */}
              <div
                style={{
                  padding: '36px 32px', background: '#111111',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px',
                  maxWidth: '320px',
                }}
              >
                <div
                  style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #800000, #1a0000)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px', marginBottom: '20px',
                    border: '1px solid rgba(128,0,0,0.40)',
                  }}
                >
                  🔥
                </div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#E4CFB3', marginBottom: '4px' }}>
                  Founder
                </h3>
                <p style={{ color: '#800000', fontSize: '12px', fontWeight: '600', marginBottom: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Ember HQ
                </p>
                <p style={{ color: '#5A5A5A', fontSize: '14px', lineHeight: '1.65' }}>
                  Built Ember because the grill needed a platform worthy of it. 12 years of hosting.
                  Binchotan loyalist. Ribs negotiable.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ padding: '0 0 120px' }}>
        <div className="page-container">
          <FadeUp>
            <div
              style={{
                background: '#111111', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', padding: '56px 48px',
              }}
            >
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3vw, 36px)', color: '#FFFFFF', marginBottom: '40px' }}>
                What we stand for.
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px' }}>
                {[
                  { word: 'Brotherhood', desc: 'The reason any of this exists.' },
                  { word: 'Craft',       desc: 'Excellence at the grill, excellence at hosting.' },
                  { word: 'Fire',        desc: 'The oldest gathering place in human history.' },
                  { word: 'Standard',   desc: 'Not everyone makes the Board. That\'s the point.' },
                ].map(({ word, desc }) => (
                  <div key={word}>
                    <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#E4CFB3', marginBottom: '8px' }}>{word}</p>
                    <p style={{ color: '#5A5A5A', fontSize: '13px', lineHeight: '1.6' }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
