import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const RANK_COLORS: Record<string, { fg: string; bg: string; border: string }> = {
  Legend: { fg: 'var(--gold-hi)',  bg: 'rgba(212,168,95,0.08)',  border: 'rgba(212,168,95,0.4)'  },
  Gold:   { fg: 'var(--gold-v3)', bg: 'rgba(184,146,74,0.06)',  border: 'rgba(184,146,74,0.35)' },
  Iron:   { fg: 'var(--bone-300)',bg: 'rgba(245,237,224,0.04)', border: 'rgba(245,237,224,0.12)' },
  Ember:  { fg: 'var(--burgundy)',bg: 'rgba(85,0,0,0.2)',       border: 'rgba(128,0,0,0.4)'     },
};

const MEMBERS = [
  { name: 'Lars V.',   city: 'Amsterdam', country: '🇳🇱', rank: 'Gold',   hosted: 24, bio: 'Charcoal-only. Specialises in dry-aged ribeye.' },
  { name: 'Hiro M.',   city: 'Tokyo',     country: '🇯🇵', rank: 'Iron',   hosted: 8,  bio: 'Yakitori master. Binchotan binchotan binchotan.' },
  { name: 'Marcus B.', city: 'New York',  country: '🇺🇸', rank: 'Legend', hosted: 67, bio: 'Texas-style. Brisket purist. Wood: post oak only.' },
  { name: 'João C.',   city: 'Lisbon',    country: '🇵🇹', rank: 'Ember',  hosted: 3,  bio: 'New host. Piri-piri everything. Friendly fire.' },
  { name: 'Klaus R.',  city: 'Berlin',    country: '🇩🇪', rank: 'Iron',   hosted: 12, bio: 'Fire-pit cooking. Whole-animal weekends.' },
  { name: 'Bruno A.',  city: 'São Paulo', country: '🇧🇷', rank: 'Gold',   hosted: 31, bio: 'Churrasco. Picanha at altitude. Cachaça optional.' },
  { name: 'Diogo M.',  city: 'Lisbon',    country: '🇵🇹', rank: 'Gold',   hosted: 22, bio: 'Rooftop grills. Sunset only. Reservations are the menu.' },
  { name: 'Yuto K.',   city: 'Tokyo',     country: '🇯🇵', rank: 'Ember',  hosted: 2,  bio: 'New to Ember. Coming from cooking school.' },
  { name: 'Marco T.',  city: 'Rome',      country: '🇮🇹', rank: 'Gold',   hosted: 28, bio: 'Old-school Italian grilling. Chianina cuts.' },
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

function RankBadge({ rank }: { rank: string }) {
  const c = RANK_COLORS[rank] ?? RANK_COLORS.Ember;
  return (
    <span className="rank-badge" style={{ color: c.fg, background: c.bg, border: `1px solid ${c.border}` }}>
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
    <div style={{ color: 'var(--bone-100)', minHeight: '100vh' }}>
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="v3-section" style={{ paddingTop: '140px', paddingBottom: '48px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="section-label">Brotherhood Network</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 72px)', color: 'var(--bone-100)', lineHeight: 1.05, marginBottom: '24px' }}
          >
            Show up a stranger.<br />
            <span className="accent-italic">Leave a brother.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: 'var(--bone-400)', fontSize: '17px', lineHeight: 1.7, maxWidth: '600px' }}
          >
            Verified Vault members across 40+ countries. Search by city, by
            rank, by craft. Travelling somewhere new? There's a fire burning
            and a brother to meet.
          </motion.p>
        </div>
      </section>

      {/* ── MEMBER DIRECTORY ─────────────────────────────────── */}
      <section style={{ padding: '20px 0 100px', borderTop: '1px solid rgba(245,237,224,0.06)' }}>
        <div className="page-container">
          <FadeUp>
            <div className="section-label" style={{ marginBottom: '32px' }}>The Brotherhood</div>
          </FadeUp>

          {/* Search + rank filter */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 280px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--bone-500)' }} />
              <input
                value={q} onChange={e => setQ(e.target.value)}
                placeholder="Search by city or name…"
                style={{
                  width: '100%',
                  background: 'rgba(26,23,20,0.7)',
                  border: '1px solid rgba(245,237,224,0.08)',
                  borderRadius: '10px',
                  padding: '12px 16px 12px 44px',
                  color: 'var(--bone-100)',
                  fontSize: '14px', outline: 'none',
                  fontFamily: 'var(--font-mono)',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(128,0,0,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(245,237,224,0.08)')}
              />
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {ranks.map(r => (
                <button key={r} onClick={() => setRank(r)}
                  className="btn-v3"
                  style={{
                    background: rank === r ? 'rgba(128,0,0,0.35)' : 'rgba(245,237,224,0.04)',
                    color: rank === r ? 'var(--bone-100)' : 'var(--bone-400)',
                    border: rank === r ? '1px solid rgba(128,0,0,0.6)' : '1px solid rgba(245,237,224,0.07)',
                    borderRadius: '8px', padding: '8px 16px', cursor: 'pointer',
                    fontSize: '13px', fontFamily: 'var(--font-mono)',
                    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >{r}</button>
              ))}
            </div>
          </div>

          {/* Member cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {filtered.map(({ name, city, country, rank, hosted, bio }, i) => (
              <motion.article key={name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.05 }}
                className="rank-card-v3"
                style={{ padding: '24px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '50%',
                      background: 'rgba(128,0,0,0.25)', color: 'var(--beige)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600,
                      border: '1px solid rgba(228,207,179,0.15)',
                    }}>{name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}</div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '17px', color: 'var(--bone-100)' }}>{name}</p>
                      <p className="mono" style={{ color: 'var(--bone-500)', fontSize: '11px' }}>{country} {city}</p>
                    </div>
                  </div>
                  <RankBadge rank={rank} />
                </div>
                <p style={{ color: 'var(--bone-400)', fontSize: '14px', lineHeight: 1.65, marginBottom: '14px' }}>{bio}</p>
                <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(245,237,224,0.06)', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="mono" style={{ color: 'var(--bone-500)', fontSize: '11px' }}>{hosted} events hosted</span>
                  <span className="mono" style={{ color: 'var(--beige)', fontSize: '11px' }}>VERIFIED</span>
                </div>
              </motion.article>
            ))}
            {filtered.length === 0 && (
              <p style={{ color: 'var(--bone-500)', gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                No members match. Try another city or rank.
              </p>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button onClick={() => navigate('/vault')} className="btn-v3 primary lg">
              Get verified · Join the Vault
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
