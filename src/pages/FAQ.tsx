import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const ITEMS = [
  { q: 'What is Ember?', a: "Ember is a global social platform for people who take grilling seriously. Discover events, host gatherings, connect with pitmasters worldwide, and access exclusive knowledge through the Vault. Think Eventbrite meets Instagram, built around the grill." },
  { q: 'Is Ember free to use?', a: "Discovering and joining events is free. The Vault — which includes exclusive recipes, live masterclasses, the Brotherhood Network, The Board certification, vetted partner deals, The Council votes, and Annual Summit access — requires a monthly (€12) or annual (€89) subscription." },
  { q: 'How do I host an event?', a: "Create your gathering with a location and date, then publish it. Your event appears as a live pin for members nearby. You coordinate contributions (who's bringing what) directly in the event. Hosting is always free." },
  { q: 'What is The Board?', a: "The Board is Ember's host certification system. Four tiers — Ember, Iron, Gold, Legend — each earned through hosting events, maintaining high ratings, and contributing to the community. Your rank appears on your profile. It's not a gamification mechanic. It's a standard." },
  { q: 'What is the Annual Ember Summit?', a: "The Annual Summit is Ember's flagship event — one city, one weekend, pitmasters from 40+ countries. Location, speakers, and tickets are revealed exclusively to Vault members. Your Vault subscription is your ticket." },
  { q: 'How do I become a Vault member?', a: "Subscribe via the Vault page. Monthly (€12) or annual (€89). Cancel anytime. Your membership activates instantly and unlocks everything — recipes, masterclasses, Brotherhood Network, The Board, Partners, The Council, and Summit access." },
  { q: 'Can my business be featured on Ember?', a: "Yes. Premium butchers, charcoal suppliers, knife makers, and other relevant businesses can apply for a Vault partner listing. We review every submission personally. Only businesses the brotherhood would trust get listed." },
  { q: 'What countries is Ember available in?', a: "Ember is live in 40+ countries. Events are concentrated in Europe, North America, South America, Asia-Pacific, and Southern Africa. If you see a pin near you, there's a fire burning." },
  { q: 'How does contribution coordination work?', a: "When you RSVP to an event, you claim what you're bringing from the host's menu board — meat, drinks, charcoal, sides. The host sees who's bringing what in real time. No doubles. No gaps. The grill is covered." },
  { q: 'Is there a mobile app?', a: "Yes. Ember is available on iOS and Android. The website is the web companion — the full event discovery, Vault content, and hosting tools live in the app." },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '24px' }}
      >
        <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '18px', color: open ? 'var(--beige)' : '#fff', lineHeight: '1.3', transition: 'color 0.2s' }}>{q}</span>
        {open ? <Minus size={16} style={{ color: 'var(--maroon)', flexShrink: 0 }} /> : <Plus size={16} style={{ color: '#5A5A5A', flexShrink: 0 }} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ color: '#A0A0A0', lineHeight: '1.8', fontSize: '16px', paddingBottom: '24px' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: '140px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.14) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>
            FAQ
          </motion.p>
          <span className="maroon-rule" />
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(36px, 5vw, 64px)', color: '#fff', lineHeight: 1.06, marginBottom: '16px' }}
          >
            Questions answered.
          </motion.h1>
          <p style={{ color: '#A0A0A0', fontSize: '17px' }}>Everything you need to know about Ember.</p>
        </div>
      </section>

      <section style={{ padding: '0 0 80px' }}>
        <div className="page-container" style={{ maxWidth: '760px' }}>
          {ITEMS.map(item => <Item key={item.q} {...item} />)}
        </div>
      </section>

      {/* dual CTA */}
      <section style={{ padding: '80px 0', background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="page-container">
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
            <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' }}>
              <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '12px' }}>Find an event</p>
              <p style={{ color: '#A0A0A0', marginBottom: '24px', lineHeight: '1.7' }}>Browse live gatherings near you. Real hosts. Real fire.</p>
              <button
                onClick={() => navigate('/events')}
                style={{ background: 'rgba(255,255,255,0.07)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              >Browse events →</button>
            </div>
            <div style={{ background: 'rgba(128,0,0,0.12)', border: '1px solid rgba(128,0,0,0.3)', borderRadius: '16px', padding: '32px' }}>
              <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '12px' }}>Join the Vault</p>
              <p style={{ color: '#A0A0A0', marginBottom: '24px', lineHeight: '1.7' }}>Recipes, masterclasses, The Board, and the Annual Summit.</p>
              <button
                onClick={() => navigate('/vault')}
                style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', fontFamily: 'inherit', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--maroon-light)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--maroon)'}
              >Join the Vault →</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
