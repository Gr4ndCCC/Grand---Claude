// react-router-dom used by Nav internally
import { motion } from 'framer-motion';
import { PartnerForm } from '../components/PartnerForm';
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

const HOST_BENEFITS = [
  { icon: '🌍', title: 'Global discovery', body: 'Your event appears as a live pin on the Ember globe. Members nearby find you automatically.' },
  { icon: '🥩', title: 'Contribution coordination', body: "Know exactly who's bringing what. Meat, drinks, charcoal — built in. No group chats needed." },
  { icon: '💬', title: 'Group chat included', body: 'Every event gets a private group chat for your crew. No third-party apps. Just fire.' },
  { icon: '🏆', title: 'Board ranking', body: 'Host great events, earn your rank. Ember, Iron, Gold, Legend. Your reputation is yours forever.' },
];

export function Hosts() {

  return (
    <div style={{ background: '#0A0A0A', color: '#FFFFFF', minHeight: '100vh' }}>
      <Nav />

      {/* ── HOST HERO ─────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: '140px', paddingBottom: '120px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.14) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '80px', alignItems: 'center' }}>
            <div>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ color: '#800000', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}
              >
                For hosts
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px, 5vw, 60px)', color: '#FFFFFF', lineHeight: 1.08, marginBottom: '24px' }}
              >
                Ready to host?
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                style={{ color: '#A0A0A0', fontSize: '16px', lineHeight: '1.7', marginBottom: '40px', maxWidth: '480px' }}
              >
                Create your event, set the menu, publish it to the globe. Your gathering appears as a live pin for members in your city.
                Free to create. Free to host. The grill is yours.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
              >
                <a
                  href="#"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '13px 22px', background: '#111111',
                    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px',
                    color: '#FFFFFF', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(228,207,179,0.30)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                >
                  <span style={{ fontSize: '20px' }}>🍎</span>
                  <div>
                    <div style={{ fontSize: '10px', color: '#5A5A5A', lineHeight: 1 }}>Download on the</div>
                    <div>App Store</div>
                  </div>
                </a>
                <a
                  href="#"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '13px 22px', background: '#111111',
                    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px',
                    color: '#FFFFFF', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(228,207,179,0.30)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                >
                  <span style={{ fontSize: '20px' }}>🤖</span>
                  <div>
                    <div style={{ fontSize: '10px', color: '#5A5A5A', lineHeight: 1 }}>Get it on</div>
                    <div>Google Play</div>
                  </div>
                </a>
              </motion.div>
            </div>

            {/* Benefits grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}
            >
              {HOST_BENEFITS.map(({ icon, title, body }) => (
                <div
                  key={title}
                  style={{
                    padding: '24px 20px', background: '#111111',
                    border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px',
                    transition: 'border-color 0.3s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(128,0,0,0.35)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                >
                  <span style={{ fontSize: '24px', display: 'block', marginBottom: '12px' }}>{icon}</span>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: '#E4CFB3', marginBottom: '6px' }}>{title}</h3>
                  <p style={{ color: '#5A5A5A', fontSize: '12px', lineHeight: '1.6' }}>{body}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ──────────────────────────────────────────────────────── */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

      {/* ── PARTNER SECTION ──────────────────────────────────────────────── */}
      <section style={{ padding: '120px 0' }}>
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '80px', alignItems: 'start' }}>
            {/* Copy */}
            <div style={{ maxWidth: '480px' }}>
              <FadeUp>
                <p style={{ color: '#800000', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
                  For businesses
                </p>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 4vw, 48px)', color: '#FFFFFF', lineHeight: 1.1, marginBottom: '20px' }}>
                  Work with Ember.
                </h2>
                <p style={{ color: '#A0A0A0', fontSize: '16px', lineHeight: '1.7', marginBottom: '32px' }}>
                  We partner with premium butchers, charcoal suppliers, knife makers, and other relevant businesses.
                  Not ads. Vetted listings that the brotherhood trusts.
                </p>
              </FadeUp>

              <FadeUp delay={0.1}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                  {[
                    'Listed in the Vault — seen by every member',
                    'Member-exclusive deals you control',
                    'Event and Summit sponsorship options',
                    'Personal review by the Ember team',
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ color: '#800000', fontSize: '14px', marginTop: '1px', flexShrink: 0 }}>→</span>
                      <span style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: '1.5' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </FadeUp>

              <FadeUp delay={0.15}>
                <div
                  style={{
                    padding: '20px 24px', background: '#111111',
                    border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px',
                  }}
                >
                  <p style={{ color: '#5A5A5A', fontSize: '13px', lineHeight: '1.6' }}>
                    "We joined Ember as a partner and within a week had orders from 8 countries.
                    The brotherhood is real."
                  </p>
                  <p style={{ color: '#E4CFB3', fontSize: '12px', fontWeight: '600', marginTop: '12px' }}>
                    — Pieter V., Butcher, Amsterdam
                  </p>
                </div>
              </FadeUp>
            </div>

            {/* Form */}
            <FadeUp delay={0.12}>
              <PartnerForm />
            </FadeUp>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
