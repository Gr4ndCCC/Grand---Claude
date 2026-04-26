import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const SECTIONS = [
  {
    title: '1. Who We Are',
    body: `Ember ("we", "us", "our") is a global social platform for BBQ events and communities. We are the controller of your personal data collected through this website and application.`,
  },
  {
    title: '2. Data We Collect',
    body: `When you create an account, we collect your name, email address, date of birth (to verify you are 18 or older), and password (stored as a secure hash). When you host or join events, we collect location preferences and event activity. When you apply for Vault membership, we may collect identity verification documents (passport or government-issued ID) solely to verify your identity and eligibility. These documents are encrypted at rest and are never shared with third parties. When you use the platform, we collect usage data such as pages visited, events browsed, and features used, to improve our product.`,
  },
  {
    title: '3. Identity Verification',
    body: `Vault membership requires identity verification. If you choose to submit a document (passport, national ID, or driver's licence), it is: (a) encrypted using AES-256 before storage; (b) reviewed only by verified Ember staff; (c) deleted within 30 days of a successful verification; (d) never sold, rented, or shared with any third party. You may request deletion of your verification document at any time by contacting support@ember.community.`,
  },
  {
    title: '4. How We Use Your Data',
    body: `We use your data to provide and operate the Ember platform, verify your identity and eligibility, send you event notifications and account updates (you may unsubscribe at any time), improve product features and performance, and comply with legal obligations. We do not use your data for advertising or sell it to third parties under any circumstances.`,
  },
  {
    title: '5. Data Sharing',
    body: `We share data only with service providers who assist in operating the platform (e.g. cloud infrastructure, email delivery), and only under strict data processing agreements. We may disclose data if required to by law or to protect the safety of users. We never sell personal data.`,
  },
  {
    title: '6. Your Rights',
    body: `Depending on your jurisdiction, you have the right to access the personal data we hold about you, correct inaccurate data, request deletion of your account and data, object to or restrict certain processing, and port your data to another service. To exercise any right, email privacy@ember.community. We will respond within 30 days.`,
  },
  {
    title: '7. Data Retention',
    body: `We retain your account data for as long as your account is active. Verification documents are deleted within 30 days of successful verification. Event activity data is retained for 12 months. You may request full data deletion at any time.`,
  },
  {
    title: '8. Cookies',
    body: `We use only essential cookies required for authentication and session management. We do not use advertising or tracking cookies. No cookie consent banner is displayed because we do not use non-essential cookies.`,
  },
  {
    title: '9. Security',
    body: `We use HTTPS for all data in transit, AES-256 encryption for sensitive documents at rest, bcrypt hashing for passwords, and regular security audits. No system is 100% secure, and we cannot guarantee absolute security, but we take every reasonable measure.`,
  },
  {
    title: '10. Contact',
    body: `For privacy questions or to exercise your rights: privacy@ember.community. For general support: support@ember.community.`,
  },
];

export function Privacy() {
  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: '140px', paddingBottom: '60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.14) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ maxWidth: '760px', position: 'relative', zIndex: 1 }}>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>Legal</motion.p>
          <span className="maroon-rule" />
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(36px, 5vw, 64px)', color: '#fff', lineHeight: 1.1, marginBottom: '16px' }}
          >Privacy Policy</motion.h1>
          <p className="mono" style={{ color: '#5A5A5A' }}>Last updated: 1 January 2026</p>
        </div>
      </section>

      <section style={{ padding: '20px 0 120px' }}>
        <div className="page-container" style={{ maxWidth: '760px' }}>
          {SECTIONS.map(({ title, body }, i) => (
            <motion.div key={title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.04 }}
              style={{ paddingBottom: '40px', marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: 'var(--beige)', marginBottom: '14px' }}>{title}</h2>
              <p style={{ color: '#A0A0A0', fontSize: '15px', lineHeight: '1.85' }}>{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
