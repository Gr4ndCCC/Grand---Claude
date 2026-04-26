import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { FireButton } from '../components/FireButton';

const PARTNERS = [
  { name: 'Pat LaFrieda Meat Purveyors', cat: 'Butcher',  city: 'New York',  discount: '15%', body: 'Dry-aged ribeyes, brisket flats, and short ribs cut to order.' },
  { name: 'Binchotan Charcoal Co.',      cat: 'Charcoal', city: 'Tokyo',     discount: '20%', body: 'Imported binchotan. The cleanest, hottest, longest-burning charcoal made.' },
  { name: 'Bjørklund Knives',            cat: 'Knife',    city: 'Oslo',      discount: '10%', body: 'Hand-forged carbon steel. Each blade signed by the maker.' },
  { name: 'Maldon Sea Salt',             cat: 'Salt',     city: 'Essex',     discount: 'Member pricing', body: 'Pyramid-flake sea salt. The only finishing salt the brotherhood uses.' },
  { name: 'Brava Hot Sauce',             cat: 'Sauce',    city: 'Lisbon',    discount: '15%', body: 'Smoked piri-piri. Small batch. Members get first access to seasonal drops.' },
  { name: 'Smoke & Iron Forge',          cat: 'Grill',    city: 'Texas',     discount: 'Direct line', body: 'Custom-built offset smokers. 18-month wait list — Vault members go first.' },
];

export function Partners() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('All');
  const cats = ['All', 'Butcher', 'Charcoal', 'Knife', 'Salt', 'Sauce', 'Grill'];
  const filtered = filter === 'All' ? PARTNERS : PARTNERS.filter(p => p.cat === filter);

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: '140px', paddingBottom: '60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>Partners</motion.p>
          <span className="maroon-rule" />
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff', lineHeight: 1.06, marginBottom: '24px' }}
          >
            Vetted by the brotherhood.<br />
            <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>Discounted for the Vault.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: '#A0A0A0', fontSize: '17px', lineHeight: '1.7', maxWidth: '600px' }}
          >
            Premium butchers, charcoal suppliers, knife makers, and salt
            producers. No ads. No paid placement. Only suppliers the
            brotherhood already trusts. Vault members get exclusive deals.
          </motion.p>
        </div>
      </section>

      <section style={{ padding: '20px 0 100px' }}>
        <div className="page-container">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {cats.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                style={{
                  background: filter === c ? 'var(--maroon)' : 'rgba(255,255,255,0.05)',
                  color: filter === c ? '#fff' : '#A0A0A0',
                  border: filter === c ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px', padding: '8px 16px', cursor: 'pointer',
                  fontSize: '13px', fontFamily: 'inherit', transition: 'all 0.2s',
                }}
              >{c}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {filtered.map(({ name, cat, city, discount, body }, i) => (
              <motion.div key={name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.06 }}
                className="card-glow"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '4px' }}>{cat}</p>
                    <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px', color: '#fff', lineHeight: 1.2 }}>{name}</p>
                    <p className="mono" style={{ color: '#5A5A5A', marginTop: '4px' }}>{city}</p>
                  </div>
                </div>
                <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: '1.7', flex: 1 }}>{body}</p>
                <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mono" style={{ color: 'var(--beige)' }}>VAULT · {discount}</span>
                  <span className="mono" style={{ color: '#5A5A5A' }}>VERIFIED</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="card-glow" style={{ background: 'rgba(128,0,0,0.10)', border: '1px solid rgba(128,0,0,0.30)', borderRadius: '16px', padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>Apply</p>
              <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '28px', color: '#fff', marginBottom: '8px' }}>Run a business the brotherhood would trust?</h3>
              <p style={{ color: '#A0A0A0', fontSize: '15px', lineHeight: '1.7' }}>
                Apply for partner status. We review every application personally. No fees. No paid placement.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <FireButton variant="primary" size="md" onClick={() => navigate('/hosts')}>
                Apply for partnership
              </FireButton>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
