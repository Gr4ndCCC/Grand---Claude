import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useAuth } from '../lib/auth';

const HOST_BENEFITS = [
  { title: 'Global discovery',         body: 'Your event appears on the live map. Members nearby find you automatically.' },
  { title: 'Contribution coordination',body: "Know exactly who's bringing what. Meat, drinks, charcoal — all coordinated. No group chats needed." },
  { title: 'Group chat included',      body: 'Every event gets a private group chat for your crew. No third-party apps. Just fire.' },
  { title: 'Board ranking',            body: 'Host great events, earn your rank. Ember, Iron, Gold, Legend. Your reputation is yours forever.' },
];

const STEPS = [
  { n: '01', title: 'Create your event',  body: 'Set the date, location, and max guests. Write a description. Takes 3 minutes.' },
  { n: '02', title: 'Build the menu',     body: "Add the dishes you need covered. Guests claim what they're bringing. Nothing doubles." },
  { n: '03', title: 'Publish to the map', body: 'Your event goes live. Members in your area get notified. RSVPs start coming in.' },
  { n: '04', title: 'Show up and grill',  body: 'Day-of reminders go out automatically. Everyone shows up prepared. You focus on the fire.' },
];

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.4, 0, 0.2, 1] }}
    >{children}</motion.div>
  );
}

export function Hosts() {
  const navigate = useNavigate();
  const { user, openAuth } = useAuth();

  const handleCreate = () => {
    if (!user) return openAuth('Sign in to host an event.');
    navigate('/hosts/new');
  };

  return (
    <div style={{ color: 'var(--bone-100)', minHeight: '100vh' }}>
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="v3-section" style={{ paddingTop: '140px', paddingBottom: '100px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: 0, left: '30%', width: '700px', height: '500px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '80px', alignItems: 'center' }}>
            <div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <span className="section-label">§ For hosts</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 72px)', color: 'var(--bone-100)', lineHeight: 1.05, marginBottom: '24px' }}
              >
                Ready to host?
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
                style={{ color: 'var(--bone-400)', fontSize: '18px', lineHeight: 1.7, marginBottom: '40px', maxWidth: '480px' }}
              >
                Create your event, set the menu, publish it. Your gathering appears
                as a live pin for members in your city. Free to create. Free to host.
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button onClick={handleCreate} className="btn-v3 primary lg">Create your first event</button>
                <button onClick={() => navigate('/vault')} className="btn-v3 ghost lg">Join the Vault</button>
              </motion.div>
            </div>

            {/* stats panel */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <div className="rank-card-v3" style={{ padding: '36px' }}>
                <p className="mono" style={{ color: 'var(--bone-500)', marginBottom: '24px' }}>Host stats</p>
                {[
                  { v: '15',   l: 'Active events this week' },
                  { v: '40+',  l: 'Countries with Ember hosts' },
                  { v: '94%',  l: 'Events with full menus claimed' },
                  { v: 'Free', l: 'To create and host any event' },
                ].map(({ v, l }) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(245,237,224,0.06)' }}>
                    <p style={{ color: 'var(--bone-400)', fontSize: '14px' }}>{l}</p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--beige)' }}>{v}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────────────────────── */}
      <section className="v3-section" style={{ padding: '80px 0', borderTop: '1px solid rgba(245,237,224,0.06)', borderBottom: '1px solid rgba(245,237,224,0.06)', background: 'rgba(13,10,12,0.4)' }}>
        <div className="page-container">
          <FadeUp>
            <div className="section-label">§ Why host on Ember</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 60px)', color: 'var(--bone-100)', marginBottom: '48px' }}>Built for hosts.</h2>
          </FadeUp>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOST_BENEFITS.map(({ title, body }, i) => (
              <FadeUp key={title} delay={i * 0.1}>
                <div className="vault-feature-v3">
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--beige)', marginBottom: '10px', position: 'relative', zIndex: 1 }}>{title}</p>
                  <p style={{ color: 'var(--bone-500)', fontSize: '14px', lineHeight: 1.7, position: 'relative', zIndex: 1 }}>{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ────────────────────────────────────────────── */}
      <section className="v3-section" style={{ padding: '120px 0' }}>
        <div className="page-container">
          <FadeUp>
            <div className="section-label">§ How to host</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 60px)', color: 'var(--bone-100)', marginBottom: '56px' }}>
              Four steps. <span className="accent-italic">One fire.</span>
            </h2>
          </FadeUp>
          <div className="grid md:grid-cols-4 gap-8">
            {STEPS.map(({ n, title, body }, i) => (
              <FadeUp key={n} delay={i * 0.1}>
                <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '1px solid rgba(128,0,0,0.35)' }}>
                  <span style={{ position: 'absolute', left: '-5px', top: 0, width: '9px', height: '9px', borderRadius: '50%', background: 'var(--ember-hi)', boxShadow: '0 0 12px var(--ember-hi)', animation: 'pulse-dot 2s var(--ease-coal) infinite' }} />
                  <p className="mono" style={{ color: 'var(--burgundy)', marginBottom: '10px' }}>{n}</p>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--bone-100)', marginBottom: '10px' }}>{title}</h3>
                  <p style={{ color: 'var(--bone-400)', fontSize: '14px', lineHeight: 1.7 }}>{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
