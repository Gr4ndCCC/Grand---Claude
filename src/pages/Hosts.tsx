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
  { n: '02', title: 'Build the menu',     body: 'Add the dishes you need covered. Guests claim what they\'re bringing. Nothing doubles.' },
  { n: '03', title: 'Publish to the map', body: 'Your event goes live. Members in your area get notified. RSVPs start coming in.' },
  { n: '04', title: 'Show up and grill',  body: 'Day-of reminders go out automatically. Everyone shows up prepared. You focus on the fire.' },
];

export function Hosts() {
  const navigate = useNavigate();
  const { user, openAuth } = useAuth();
  const handleCreate = () => {
    if (!user) return openAuth('Sign in to create your first event.');
    alert('Event creation flow — coming soon. Phase 4 will add the full host studio.');
  };

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      {/* hero */}
      <section style={{ paddingTop: '140px', paddingBottom: '100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '30%', width: '700px', height: '500px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.14) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '80px', alignItems: 'center' }}>
            <div>
              <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>
                For hosts
              </motion.p>
              <span className="maroon-rule" />
              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(36px, 5vw, 64px)', color: '#fff', lineHeight: 1.08, marginBottom: '24px' }}
              >
                Ready to host?
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                style={{ color: '#A0A0A0', fontSize: '17px', lineHeight: '1.7', marginBottom: '40px', maxWidth: '480px' }}
              >
                Create your event, set the menu, publish it. Your gathering appears
                as a live pin for members in your city. Free to create. Free to host.
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleCreate}
                  style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 28px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--maroon-light)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--maroon)'; e.currentTarget.style.transform = 'none'; }}
                >Create your first event</button>
                <button
                  onClick={() => navigate('/vault')}
                  style={{ background: 'transparent', color: 'var(--beige)', border: '1px solid rgba(228,207,179,0.25)', borderRadius: '10px', padding: '14px 28px', fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(228,207,179,0.07)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >Join the Vault</button>
              </motion.div>
            </div>

            {/* stats panel */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '36px' }}>
                <p className="mono" style={{ color: '#5A5A5A', marginBottom: '24px' }}>Host stats</p>
                {[
                  { v: '15', l: 'Active events this week' },
                  { v: '40+', l: 'Countries with Ember hosts' },
                  { v: '94%', l: 'Events with full menus claimed' },
                  { v: 'Free', l: 'To create and host any event' },
                ].map(({ v, l }) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ color: '#A0A0A0', fontSize: '14px' }}>{l}</p>
                    <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: 'var(--beige)' }}>{v}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* benefits */}
      <section style={{ padding: '80px 0', background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="page-container">
          <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>Why host on Ember</p>
          <span className="maroon-rule" />
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '48px', color: '#fff', marginBottom: '48px' }}>Built for hosts.</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOST_BENEFITS.map(({ title, body }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.1 }}
                className="card-glow"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px' }}
              >
                <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '17px', color: 'var(--beige)', marginBottom: '10px' }}>{title}</p>
                <p style={{ color: '#5A5A5A', fontSize: '14px', lineHeight: '1.7' }}>{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* steps */}
      <section style={{ padding: '100px 0' }}>
        <div className="page-container">
          <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>How to host</p>
          <span className="maroon-rule" />
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '48px', color: '#fff', marginBottom: '56px' }}>Four steps. One fire.</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {STEPS.map(({ n, title, body }, i) => (
              <motion.div key={n} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ borderLeft: '2px solid var(--maroon)', paddingLeft: '20px' }}
              >
                <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '10px' }}>{n}</p>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px', color: '#fff', marginBottom: '10px' }}>{title}</h3>
                <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: '1.7' }}>{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
