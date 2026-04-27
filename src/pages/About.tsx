import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { FireButton } from '../components/FireButton';

export function About() {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: '140px', paddingBottom: '100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '900px', height: '600px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.22) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px' }}>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '16px', letterSpacing: '0.14em' }}>
            ABOUT EMBER
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(52px, 9vw, 110px)', color: '#fff', lineHeight: 0.95, marginBottom: '32px', letterSpacing: '-0.02em' }}
          >
            Not just<br />
            <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>a BBQ.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            style={{ color: '#A0A0A0', fontSize: '19px', lineHeight: '1.75', maxWidth: '620px', margin: '0 auto' }}
          >
            A global brotherhood built around fire, craft, and the people who take both seriously. 40+ countries. One standard. No shortcuts.
          </motion.p>
        </div>
      </section>

      <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0D0D0D' }}>
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '40px' }}>
            {[
              { value: '40+', label: 'Countries' },
              { value: '3,200+', label: 'Verified members' },
              { value: '12,000+', label: 'Events hosted' },
              { value: '4', label: 'Board tiers' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(40px, 6vw, 72px)', color: 'var(--beige)', lineHeight: 1 }}>{value}</p>
                <p className="mono" style={{ color: '#5A5A5A', marginTop: '8px' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 0' }}>
        <div className="page-container" style={{ maxWidth: '760px' }}>
          {[
            { label: 'Where it started', title: 'A gathering that should have existed.', body: 'It started with a single question: why is there no place to find people who grill the way you do? Not the casual weekend crowd. The ones who know the difference between binchotan and briquettes. Who talk about the Maillard reaction. Who treat a brisket like a project. Ember is the answer.' },
            { label: 'The platform', title: 'Three things merged into one.', body: 'Ember is Eventbrite for BBQ events, Instagram for the culture, and a brotherhood that holds you to a standard. The map is live. Events appear as pins. You discover, join, contribute, and leave with people you\'ll grill with for years. The Vault deepens everything.' },
            { label: 'The standard', title: 'A rank means something because it can\'t be faked.', body: 'The Board exists because hosting matters. Not all events are equal. Not all hosts are equal. Ember, Iron, Gold, Legend. Four tiers earned through hosting, getting rated, contributing. No shortcuts. No buying your way up. Your rank follows you across 40+ countries.' },
            { label: 'Who Ember is for', title: 'Show up a stranger. Leave a brother.', body: 'Ember is for people who take the grill seriously. Not exclusionary — welcoming. But specific. The host who spends more time on wood selection than a sommelier spends on wine. The traveller who finds a grill in every city. That\'s not a tagline. That\'s what happens at every Ember gathering.' },
          ].map(({ label, title, body }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }} transition={{ delay: i * 0.05 }}
              style={{ paddingBottom: '72px', marginBottom: '72px', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
            >
              <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '10px', letterSpacing: '0.12em' }}>{label}</p>
              <h2 style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 'clamp(28px, 3.5vw, 48px)',
                color: '#fff',
                lineHeight: 1.1, marginBottom: '24px',
              }}>{title}</h2>
              <p style={{ color: '#A0A0A0', fontSize: '17px', lineHeight: '1.8' }}>{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ padding: '100px 0', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="page-container" style={{ maxWidth: '640px' }}>
          <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '16px' }}>Ready?</p>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(32px, 5vw, 56px)', color: '#fff', marginBottom: '24px', lineHeight: 1.1 }}>
            The fire's already lit.
          </h2>
          <p style={{ color: '#A0A0A0', fontSize: '17px', lineHeight: '1.7', marginBottom: '40px' }}>
            Join Vault. Find events. Earn your rank. Be part of the only BBQ brotherhood that exists at this scale.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <FireButton variant="primary" size="lg" onClick={() => navigate('/vault')}>
              Join the Vault
            </FireButton>
            <FireButton variant="outline" size="lg" onClick={() => navigate('/events')}>
              Browse events
            </FireButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
