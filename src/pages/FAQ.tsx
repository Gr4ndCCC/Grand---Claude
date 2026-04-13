import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaqAccordion } from '../components/FaqAccordion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const FAQ_ITEMS = [
  {
    q: 'What is Ember?',
    a: 'Ember is a global social platform for men who take grilling seriously. Discover events, host gatherings, connect with pitmasters worldwide, and access exclusive knowledge through the Vault. Think Eventbrite meets Instagram, built around the grill.',
  },
  {
    q: 'Is Ember free to use?',
    a: 'Discovering and joining events is free. The Secret Vault — which includes exclusive recipes, live masterclasses, the Brotherhood Network, The Board certification, vetted partner deals, The Council votes, and Annual Summit access — requires a monthly (€12) or annual (€89) subscription.',
  },
  {
    q: 'How do I host an event?',
    a: 'Download the Ember app, create your gathering with a location and date, and publish it to the globe. Your event appears as a live pin for members nearby. You coordinate contributions (who\'s bringing what) directly in the event chat. Hosting is free.',
  },
  {
    q: 'What is The Board?',
    a: 'The Board is Ember\'s host certification system. There are four tiers — Ember, Iron, Gold, and Legend — each earned through hosting events, maintaining high ratings, and contributing to the community. Your rank appears on your profile and increases your visibility on the platform. It\'s not a gamification mechanic. It\'s a standard.',
  },
  {
    q: 'What is the Annual Ember Summit?',
    a: 'The Annual Summit is Ember\'s flagship event — one city, one weekend, pitmasters from 40+ countries. Location, speakers, and tickets are revealed exclusively to Vault members. Your Vault subscription is your ticket.',
  },
  {
    q: 'How do I become a Vault member?',
    a: 'In the app, tap the Vault tab and subscribe via Stripe. Monthly (€12) or annual (€89). Cancel anytime. Your membership activates instantly and unlocks everything — recipes, masterclasses, Brotherhood Network, The Board, Partners, The Council, and Summit access.',
  },
  {
    q: 'Can my business be featured on Ember?',
    a: 'Yes. Premium butchers, charcoal suppliers, knife makers, and other relevant businesses can apply for a Vault partner listing. Go to Work with Ember and submit an application. We review every submission personally. Only businesses the brotherhood would trust get listed.',
  },
  {
    q: 'Is there a mobile app?',
    a: 'Yes. Ember is available on iOS and Android. The website is the web companion — the full event discovery, Vault content, and hosting tools live in the app. Download links are in the footer.',
  },
  {
    q: 'What countries is Ember available in?',
    a: 'Ember is live in 40+ countries. Events are concentrated in Europe, North America, South America, Asia-Pacific, and Southern Africa. The globe is the best view — if you see a pin near you, there\'s a fire burning.',
  },
  {
    q: 'How does the contribution coordination work?',
    a: 'When you RSVP to an event, you can claim what you\'re bringing from the host\'s menu board — meat, drinks, charcoal, sides. The host sees who\'s bringing what in real time. No doubles. No gaps. The grill is covered.',
  },
];

export function FAQ() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#0A0A0A', color: '#FFFFFF', minHeight: '100vh' }}>
      <Nav />

      {/* HERO */}
      <section style={{ paddingTop: '140px', paddingBottom: '80px' }}>
        <div className="page-container" style={{ maxWidth: '760px' }}>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ color: '#800000', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}
          >
            Frequently asked
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px, 5vw, 60px)', color: '#FFFFFF', lineHeight: 1.08, marginBottom: '20px' }}
          >
            Questions answered.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ color: '#A0A0A0', fontSize: '16px', lineHeight: '1.6' }}
          >
            Everything you need to know about Ember, the Vault, and the brotherhood.
          </motion.p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="page-container" style={{ maxWidth: '760px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <FaqAccordion items={FAQ_ITEMS} />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 0 120px' }}>
        <div className="page-container" style={{ maxWidth: '760px' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{
                  padding: '32px', background: '#111111',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#E4CFB3', marginBottom: '10px' }}>
                  Still have questions?
                </p>
                <p style={{ color: '#5A5A5A', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                  We answer personally. No automated replies.
                </p>
                <a
                  href="mailto:hello@ember.app"
                  style={{
                    display: 'inline-block', padding: '10px 20px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '8px', color: '#FFFFFF',
                    fontSize: '13px', fontWeight: '600', textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(228,207,179,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
                >
                  Get in touch
                </a>
              </div>

              <div
                style={{
                  padding: '32px', background: '#0d0000',
                  border: '1px solid rgba(128,0,0,0.25)', borderRadius: '16px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#E4CFB3', marginBottom: '10px' }}>
                  Ready to join?
                </p>
                <p style={{ color: '#5A5A5A', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                  One subscription. One brotherhood. One fire.
                </p>
                <button
                  onClick={() => navigate('/vault')}
                  style={{
                    background: '#800000', color: '#FFFFFF', border: 'none',
                    borderRadius: '8px', padding: '10px 20px', fontSize: '13px',
                    fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#990000')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#800000')}
                >
                  Join the Vault
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
