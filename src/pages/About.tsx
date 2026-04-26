import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const MANIFESTO = [
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
    label: "What we're building",
    title: 'A platform worth trusting.',
    body: [
      "Ember is three things merged: Eventbrite for BBQ events, Instagram for the culture, and a brotherhood that holds you to a standard.",
      "The map is live. Events appear as pins. You discover, join, contribute, and leave with people you'll grill with for years.",
      "The Vault is the inner circle — recipes that don't exist anywhere else, live masterclasses, the Brotherhood Network, The Board, and the Annual Summit.",
    ],
  },
  {
    label: 'The brotherhood',
    title: 'Who Ember is for.',
    body: [
      "Ember is for people who take the grill seriously. Not exclusionary — welcoming. But specific.",
      "The host who spends more time on wood selection than a sommelier spends on wine. The traveller who finds a grill in every city. The person who has eight BBQ tongs but lends them freely.",
      "Show up as a stranger. Leave as a brother. That's not a tagline. That's what happens at every Ember gathering we've ever been to.",
    ],
  },
  {
    label: 'The Board',
    title: 'A standard, not a gamification.',
    body: [
      "The Board exists because hosting matters. Not all events are equal. Not all hosts are equal.",
      "Ember, Iron, Gold, Legend. Four tiers. Earned through hosting events, getting rated, and contributing to the community. No shortcuts. No buying your way up.",
      "Your rank is yours. It follows you everywhere. It means something because it can't be faked.",
    ],
  },
];

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

export function About() {
  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: '140px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1, maxWidth: '760px' }}>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>
            About
          </motion.p>
          <span className="maroon-rule" />
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff', lineHeight: 1.06, marginBottom: '24px' }}
          >
            The world grills.<br />
            <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>We connected it.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: '#A0A0A0', fontSize: '18px', lineHeight: '1.8' }}
          >
            Ember is the global social BBQ brotherhood. 40+ countries. One standard.
            One fire.
          </motion.p>
        </div>
      </section>

      {/* manifesto */}
      <section style={{ padding: '60px 0 100px' }}>
        <div className="page-container" style={{ maxWidth: '760px' }}>
          {MANIFESTO.map(({ label, title, body }, i) => (
            <FadeUp key={label} delay={i * 0.05}>
              <div style={{ paddingBottom: '72px', borderBottom: i < MANIFESTO.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', marginBottom: '72px' }}>
                <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>{label}</p>
                <span className="maroon-rule" />
                <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', color: '#fff', marginBottom: '28px', lineHeight: 1.1 }}>
                  {title}
                </h2>
                {body.map((p, j) => (
                  <p key={j} style={{ color: i === 0 ? '#C0C0C0' : '#A0A0A0', fontSize: '17px', lineHeight: '1.8', marginBottom: j < body.length - 1 ? '20px' : 0 }}>{p}</p>
                ))}
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
