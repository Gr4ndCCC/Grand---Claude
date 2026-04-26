import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { FireButton } from '../components/FireButton';

const RANK_COLORS: Record<string, string> = { Legend: '#DAA520', Gold: '#B8860B', Iron: '#6B7280', Ember: '#800000' };

const MEMBERS = [
  { name: 'Lars V.',     city: 'Amsterdam',   country: '🇳🇱', rank: 'Gold',   hosted: 24, bio: 'Charcoal-only. Specialises in dry-aged ribeye.' },
  { name: 'Hiro M.',     city: 'Tokyo',       country: '🇯🇵', rank: 'Iron',   hosted: 8,  bio: 'Yakitori master. Binchotan binchotan binchotan.' },
  { name: 'Marcus B.',   city: 'New York',    country: '🇺🇸', rank: 'Legend', hosted: 67, bio: 'Texas-style. Brisket purist. Wood: post oak only.' },
  { name: 'João C.',     city: 'Lisbon',      country: '🇵🇹', rank: 'Ember',  hosted: 3,  bio: 'New host. Piri-piri everything. Friendly fire.' },
  { name: 'Klaus R.',    city: 'Berlin',      country: '🇩🇪', rank: 'Iron',   hosted: 12, bio: 'Fire-pit cooking. Whole-animal weekends.' },
  { name: 'Bruno A.',    city: 'São Paulo',   country: '🇧🇷', rank: 'Gold',   hosted: 31, bio: 'Churrasco. Picanha at altitude. Cachaça optional.' },
  { name: 'Diogo M.',    city: 'Lisbon',      country: '🇵🇹', rank: 'Gold',   hosted: 22, bio: 'Rooftop grills. Sunset only. Reservations are the menu.' },
  { name: 'Yuto K.',     city: 'Tokyo',       country: '🇯🇵', rank: 'Ember',  hosted: 2,  bio: 'New to Ember. Coming from cooking school.' },
  { name: 'Marco T.',    city: 'Rome',        country: '🇮🇹', rank: 'Gold',   hosted: 28, bio: 'Old-school Italian grilling. Chianina cuts.' },
];

function RankBadge({ rank }: { rank: string }) {
  const c = RANK_COLORS[rank] ?? '#555';
  return (
    <span className="rank-badge" style={{ color: c, background: `${c}18`, border: `1px solid ${c}44` }}>
      {rank}
    </span>
  );
}

export function Network() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [rank, setRank] = useState<string>('All');
  const ranks = ['All', 'Legend', 'Gold', 'Iron', 'Ember'];
  const filtered = MEMBERS.filter(m =>
    (rank === 'All' || m.rank === rank) &&
    (!q || m.city.toLowerCase().includes(q.toLowerCase()) || m.name.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: '140px', paddingBottom: '60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>Brotherhood Network</motion.p>
          <span className="maroon-rule" />
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff', lineHeight: 1.06, marginBottom: '24px' }}
          >
            Show up a stranger.<br />
            <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>Leave a brother.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: '#A0A0A0', fontSize: '17px', lineHeight: '1.7', maxWidth: '600px' }}
          >
            Verified Vault members across 40+ countries. Search by city, by
            rank, by craft. Travelling somewhere new? There's a fire burning
            and a brother to meet.
          </motion.p>
        </div>
      </section>

      <section style={{ padding: '20px 0 100px' }}>
        <div className="page-container">
          {/* search + filter */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 280px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#5A5A5A' }} />
              <input
                value={q} onChange={e => setQ(e.target.value)}
                placeholder="Search by city or name…"
                style={{ width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '10px', padding: '12px 16px 12px 44px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {ranks.map(r => (
                <button key={r} onClick={() => setRank(r)}
                  style={{
                    background: rank === r ? 'var(--maroon)' : 'rgba(255,255,255,0.05)',
                    color: rank === r ? '#fff' : '#A0A0A0',
                    border: rank === r ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px', padding: '8px 16px', cursor: 'pointer',
                    fontSize: '13px', fontFamily: 'inherit', transition: 'all 0.2s',
                  }}
                >{r}</button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {filtered.map(({ name, city, country, rank, hosted, bio }, i) => (
              <motion.div key={name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.05 }}
                className="card-glow"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '50%',
                      background: 'rgba(128,0,0,0.25)', color: 'var(--beige)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Playfair Display, Georgia, serif', fontSize: '15px', fontWeight: 600,
                      border: '1px solid rgba(228,207,179,0.15)',
                    }}>{name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                    <div>
                      <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '17px', color: '#fff' }}>{name}</p>
                      <p className="mono" style={{ color: '#5A5A5A' }}>{country} {city}</p>
                    </div>
                  </div>
                  <RankBadge rank={rank} />
                </div>
                <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: '1.6', marginBottom: '14px' }}>{bio}</p>
                <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="mono" style={{ color: '#5A5A5A' }}>{hosted} events hosted</span>
                  <span className="mono" style={{ color: 'var(--beige)' }}>VERIFIED</span>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <p style={{ color: '#5A5A5A', gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0' }}>
                No members match. Try another city or rank.
              </p>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <FireButton variant="primary" size="lg" onClick={() => navigate('/vault')}>
              Get verified · Join the Vault
            </FireButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
