import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const SECTIONS = [
  {
    title: '1. Acceptance',
    body: `By creating an account or using the Ember platform, you agree to these Terms. If you do not agree, do not use Ember. These Terms apply to all users — members, Vault subscribers, and hosts.`,
  },
  {
    title: '2. Eligibility',
    body: `You must be at least 18 years old to use Ember. By creating an account, you confirm that you meet this requirement. We may request identity verification at any time to confirm eligibility or to grant Vault access.`,
  },
  {
    title: '3. Account',
    body: `You are responsible for keeping your account credentials secure. You may not share your account or impersonate another person. We may suspend or terminate accounts that violate these Terms, engage in fraudulent behaviour, or harm other members.`,
  },
  {
    title: '4. The Vault',
    body: `Vault membership is billed monthly (€12/month) or annually (€89/year). All prices include applicable taxes. You may cancel at any time; access continues until the end of the current billing period. No refunds are issued for partial periods unless required by law. Vault membership may require identity verification. Providing false documents is grounds for permanent ban and may be reported to relevant authorities.`,
  },
  {
    title: '5. Events',
    body: `Hosts are responsible for the safety, legality, and accuracy of events they list on Ember. Events must comply with local laws. Ember is a platform connecting hosts and attendees — we do not operate events and are not liable for incidents at events unless caused directly by our negligence. Attendees join events at their own risk.`,
  },
  {
    title: '6. Code of Conduct',
    body: `Ember is a brotherhood built on respect. Harassment, discrimination, hate speech, or behaviour that demeans others will result in immediate removal. The Board ranking system reflects genuine contribution — any attempt to game, buy, or fraudulently acquire rank will result in permanent account removal.`,
  },
  {
    title: '7. Content',
    body: `By posting content (event descriptions, reviews, photos), you grant Ember a non-exclusive, royalty-free licence to display it on the platform. You retain ownership. You may not post content that infringes copyright, is illegal, or violates our Code of Conduct. We may remove content at our discretion.`,
  },
  {
    title: '8. Intellectual Property',
    body: `The Ember name, logo, design, and code are our intellectual property. You may not copy, reproduce, or create derivative works without our written consent.`,
  },
  {
    title: '9. Limitation of Liability',
    body: `To the maximum extent permitted by law, Ember is not liable for indirect, incidental, or consequential damages arising from use of the platform. Our total liability to you for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.`,
  },
  {
    title: '10. Governing Law',
    body: `These Terms are governed by the laws of Portugal. Any disputes will be resolved in the courts of Lisbon, unless you are a consumer in a jurisdiction with mandatory local consumer protection laws.`,
  },
  {
    title: '11. Changes',
    body: `We may update these Terms. We will notify you by email at least 14 days before material changes take effect. Continuing to use Ember after the effective date constitutes acceptance.`,
  },
  {
    title: '12. Contact',
    body: `For legal queries: legal@ember.community. For general support: support@ember.community.`,
  },
];

export function Terms() {
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
          >Terms & Conditions</motion.h1>
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
