import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, BookOpen, GraduationCap, Users, Trophy, Knife, CheckSquare } from 'lucide-react';
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

const VAULT_FEATURES = [
  {
    Icon: BookOpen,
    title: 'Recipes',
    body: "Member-only recipes. Not on any food blog. Submitted by the brotherhood — pitmasters from 40 countries who've earned their stripes.",
  },
  {
    Icon: GraduationCap,
    title: 'Knowledge',
    body: "Live masterclasses filmed at real gatherings. Fire science. Wood & smoke theory. Dry-aging at home. The kind of knowledge that doesn't have a Wikipedia page.",
  },
  {
    Icon: Users,
    title: 'Brotherhood Network',
    body: 'Verified members worldwide. Show up as a stranger in any city on the map. Leave as a brother. The network is the feature.',
  },
  {
    Icon: Trophy,
    title: 'The Board',
    body: 'The host certification system. Four tiers — Ember, Iron, Gold, Legend — each earned through real events and real ratings. Your rank means something.',
  },
  {
    Icon: Knife,
    title: 'Partners',
    body: 'Premium butchers, charcoal suppliers, and knife makers vetted by the community. No ads. Only the best. Members get exclusive deals.',
  },
  {
    Icon: CheckSquare,
    title: 'The Council',
    body: "Vote on platform direction. New features. Event formats. Annual Summit location. Your membership shapes Ember — this is your brotherhood to build.",
  },
];

const INCLUDED = [
  'Unlimited recipe access',
  'Live & recorded masterclasses',
  'Brotherhood Network verified badge',
  'Board certification eligibility',
  'Partner discounts & early access',
  'Council voting rights',
  'Annual Summit access',
  'Priority event discovery',
];

export function Vault() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#0A0A0A', color: '#FFFFFF', minHeight: '100vh' }}>
      <Nav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: '160px',
          paddingBottom: '120px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '800px', height: '600px',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.20) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        {/* Lock SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', display: 'inline-block', marginBottom: '40px' }}
        >
          <svg width="72" height="88" viewBox="0 0 72 88" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="36" width="64" height="48" rx="8" fill="#111111" stroke="rgba(128,0,0,0.60)" strokeWidth="1.5" />
            <path d="M18 36V24C18 15.163 24.163 9 33 9H39C47.837 9 54 15.163 54 24V36" stroke="rgba(128,0,0,0.60)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <circle cx="36" cy="58" r="8" fill="rgba(128,0,0,0.80)" />
            <rect x="33" y="58" width="6" height="10" rx="3" fill="rgba(228,207,179,0.70)" />
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ color: '#800000', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}
        >
          Members only
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(44px, 7vw, 80px)',
            color: '#E4CFB3',
            lineHeight: 1.05,
            marginBottom: '24px',
            position: 'relative',
          }}
        >
          The Secret Vault.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28 }}
          style={{
            color: '#A0A0A0', fontSize: '17px', maxWidth: '520px',
            margin: '0 auto 48px', lineHeight: '1.7',
          }}
        >
          One subscription. One brotherhood. One fire.
          Everything in the Vault is exclusive to members.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <button
            onClick={() => {
              const el = document.getElementById('pricing');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: '#800000', color: '#FFFFFF', border: 'none',
              borderRadius: '10px', padding: '14px 28px', fontSize: '15px',
              fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#990000'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#800000'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Join the Vault
          </button>
        </motion.div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '0 0 120px' }}>
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2px' }}>
            {VAULT_FEATURES.map(({ Icon, title, body }, i) => (
              <FadeUp key={title} delay={i * 0.08}>
                <div
                  style={{
                    padding: '48px 36px',
                    background: '#111111',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'border-color 0.3s',
                    minHeight: '220px',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(128,0,0,0.35)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
                >
                  <span style={{ display: 'block', marginBottom: '20px' }}><Icon size={32} color="#E4CFB3" strokeWidth={1.5} /></span>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#E4CFB3', marginBottom: '12px' }}>{title}</h3>
                  <p style={{ color: '#A0A0A0', fontSize: '15px', lineHeight: '1.65' }}>{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        style={{
          padding: '120px 0',
          background: '#080808',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="page-container">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <p style={{ color: '#800000', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
                Membership
              </p>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 4vw, 52px)', color: '#FFFFFF', lineHeight: 1.1, marginBottom: '12px' }}>
                Unlock the Vault.
              </h2>
              <p style={{ color: '#5A5A5A', fontSize: '15px' }}>
                Powered by Stripe. Cancel anytime.
              </p>
            </div>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '720px', margin: '0 auto' }}>
            {/* Monthly */}
            <FadeUp delay={0.1}>
              <div
                style={{
                  padding: '40px 36px',
                  background: '#111111',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: '20px',
                }}
              >
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#FFFFFF', marginBottom: '8px' }}>Monthly</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '48px', color: '#FFFFFF' }}>€12</span>
                  <span style={{ color: '#5A5A5A', fontSize: '15px' }}>/month</span>
                </div>
                <p style={{ color: '#5A5A5A', fontSize: '13px', marginBottom: '32px' }}>Billed monthly. Cancel anytime.</p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {INCLUDED.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#A0A0A0', fontSize: '14px' }}>
                      <Check size={14} style={{ color: '#800000', flexShrink: 0, marginTop: '1px' }} />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  style={{
                    width: '100%', background: 'transparent', color: '#E4CFB3',
                    border: '1px solid rgba(228,207,179,0.30)', borderRadius: '10px',
                    padding: '13px', fontSize: '14px', fontWeight: '600',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(228,207,179,0.07)'; e.currentTarget.style.borderColor = 'rgba(228,207,179,0.50)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(228,207,179,0.30)'; }}
                >
                  Start your membership
                </button>
              </div>
            </FadeUp>

            {/* Annual */}
            <FadeUp delay={0.18}>
              <div
                style={{
                  padding: '40px 36px',
                  background: 'linear-gradient(135deg, #0d0000 0%, #111111 100%)',
                  border: '1px solid rgba(184,134,11,0.50)',
                  borderRadius: '20px',
                  position: 'relative',
                  boxShadow: '0 0 40px rgba(184,134,11,0.08)',
                }}
              >
                <div
                  style={{
                    position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)',
                    background: '#B8860B', color: '#000000',
                    fontSize: '11px', fontWeight: '700', letterSpacing: '1px',
                    padding: '4px 14px', borderRadius: '0 0 8px 8px',
                  }}
                >
                  BEST VALUE
                </div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#FFFFFF', marginBottom: '8px' }}>Annual</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '48px', color: '#E4CFB3' }}>€89</span>
                  <span style={{ color: '#5A5A5A', fontSize: '15px' }}>/year</span>
                </div>
                <p style={{ color: '#B8860B', fontSize: '13px', marginBottom: '32px' }}>
                  2 months free · €7.42/month
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {INCLUDED.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#A0A0A0', fontSize: '14px' }}>
                      <Check size={14} style={{ color: '#B8860B', flexShrink: 0, marginTop: '1px' }} />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  style={{
                    width: '100%', background: '#800000', color: '#FFFFFF',
                    border: 'none', borderRadius: '10px',
                    padding: '13px', fontSize: '14px', fontWeight: '600',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#990000'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#800000'; }}
                >
                  Join the Vault — Best value
                </button>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── SUMMIT CTA ───────────────────────────────────────────────────── */}
      <section style={{ padding: '120px 0' }}>
        <div className="page-container">
          <FadeUp>
            <div
              style={{
                background: '#800000', borderRadius: '20px',
                padding: 'clamp(56px, 7vw, 96px) clamp(32px, 5vw, 80px)',
                textAlign: 'center', position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                <p style={{ color: 'rgba(228,207,179,0.70)', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
                  Annual gathering
                </p>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 4vw, 48px)', color: '#FFFFFF', lineHeight: 1.1, marginBottom: '16px' }}>
                  Your Vault subscription is your ticket to the Annual Ember Summit.
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', maxWidth: '520px', margin: '0 auto 36px', lineHeight: '1.7' }}>
                  Every Vault member gets Summit access. One city. The finest pitmasters from every continent. Your next gathering starts here.
                </p>
                <button
                  onClick={() => navigate('/')}
                  style={{
                    background: '#FFFFFF', color: '#800000',
                    border: 'none', borderRadius: '10px',
                    padding: '14px 32px', fontSize: '15px',
                    fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Join the brotherhood
                </button>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
