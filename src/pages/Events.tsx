import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useAuth } from '../lib/auth';

const RANK_COLORS: Record<string, string> = {
  Legend: '#DAA520', Gold: '#B8860B', Iron: '#6B7280', Ember: '#800000',
};

const SAMPLE_EVENTS = [
  { id: 'e1', city: 'Amsterdam', flag: '🇳🇱', title: 'Amsterdam Sunset BBQ',     host: 'Lars V.',    rank: 'Gold',   date: 'Sat, Apr 19', time: '18:00', guests: 8,  max: 12, isPublic: true,  tags: ['charcoal', 'brisket', 'rooftop'] },
  { id: 'e2', city: 'Tokyo',     flag: '🇯🇵', title: 'Tokyo Garden Grill',        host: 'Hiro M.',    rank: 'Iron',   date: 'Sun, Apr 20', time: '17:00', guests: 6,  max: 10, isPublic: true,  tags: ['yakitori', 'binchotan'] },
  { id: 'e3', city: 'New York',  flag: '🇺🇸', title: 'Brooklyn Smokehouse Night', host: 'Marcus B.',  rank: 'Legend', date: 'Fri, Apr 25', time: '19:00', guests: 14, max: 20, isPublic: true,  tags: ['smoke', 'brisket', 'ribs'] },
  { id: 'e4', city: 'Lisbon',    flag: '🇵🇹', title: 'Lisbon Rooftop Grill',      host: 'João C.',    rank: 'Ember',  date: 'Sat, Apr 26', time: '20:00', guests: 5,  max: 15, isPublic: true,  tags: ['piri-piri', 'outdoor'] },
  { id: 'e5', city: 'Berlin',    flag: '🇩🇪', title: 'Berlin Winter BBQ',         host: 'Klaus R.',   rank: 'Iron',   date: 'Sat, May 3',  time: '16:00', guests: 9,  max: 18, isPublic: false, tags: ['fire-pit', 'bratwurst'] },
  { id: 'e6', city: 'São Paulo', flag: '🇧🇷', title: 'São Paulo Churrasco Night', host: 'Bruno A.',   rank: 'Gold',   date: 'Sat, Apr 26', time: '14:00', guests: 12, max: 20, isPublic: true,  tags: ['churrasco', 'outdoor'] },
];

const TOP_CITIES = [
  { city: 'New York',     flag: '🇺🇸', count: 5 },
  { city: 'Amsterdam',    flag: '🇳🇱', count: 4 },
  { city: 'Tokyo',        flag: '🇯🇵', count: 3 },
  { city: 'Berlin',       flag: '🇩🇪', count: 3 },
  { city: 'São Paulo',    flag: '🇧🇷', count: 3 },
  { city: 'Lisbon',       flag: '🇵🇹', count: 3 },
];

function RankBadge({ rank }: { rank: string }) {
  const c = RANK_COLORS[rank] ?? '#555';
  return (
    <span className="rank-badge" style={{ color: c, background: `${c}18`, border: `1px solid ${c}44` }}>
      {rank}
    </span>
  );
}

export function Events() {
  const navigate = useNavigate();
  const { user, openAuth } = useAuth();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const handleJoin = (eventTitle: string) => {
    if (!user) return openAuth(`Sign in to join "${eventTitle}".`);
    alert(`RSVP confirmed for ${eventTitle}.\nThe host has been notified.`);
  };
  const handleHostNav = () => {
    if (!user) return openAuth('Sign in to host an event.');
    navigate('/hosts');
  };

  const filters = ['All', 'Nearby', 'This weekend', 'Public', 'Private'];
  const filtered = SAMPLE_EVENTS.filter(e =>
    (!query || e.title.toLowerCase().includes(query.toLowerCase()) || e.city.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      {/* header */}
      <section style={{ paddingTop: '120px', paddingBottom: '60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.16) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>
                Live events
              </motion.p>
              <span className="maroon-rule" />
              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(36px, 5vw, 64px)', color: '#fff', marginBottom: '16px', lineHeight: 1.06 }}
              >
                Fires burning<br />
                <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>near you.</span>
              </motion.h1>
              <p style={{ color: '#A0A0A0', fontSize: '17px', marginBottom: '40px' }}>
                Real events. Real hosts. Real fire.
              </p>
            </div>

            {/* Host an Event CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              style={{ background: 'rgba(128,0,0,0.10)', border: '1px solid rgba(128,0,0,0.28)', borderRadius: '16px', padding: '28px', maxWidth: '280px', flexShrink: 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={16} style={{ color: '#fff' }} />
                </div>
                <p style={{ color: '#fff', fontWeight: 500, fontSize: '15px' }}>Host an Event</p>
              </div>
              <p style={{ color: '#A0A0A0', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
                Open your grill to the brotherhood. Build your rank. Earn your place on The Board.
              </p>
              <button
                onClick={handleHostNav}
                style={{ width: '100%', background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--maroon-light)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--maroon)')}
              >Start hosting →</button>
            </motion.div>
          </div>

          {/* search */}
          <div style={{ position: 'relative', maxWidth: '500px', marginBottom: '24px' }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#5A5A5A' }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by city or event name…"
              style={{
                width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '10px', padding: '14px 16px 14px 44px',
                color: '#fff', fontSize: '15px', outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* filters */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                style={{
                  background: activeFilter === f ? 'var(--maroon)' : 'rgba(255,255,255,0.05)',
                  color: activeFilter === f ? '#fff' : '#A0A0A0',
                  border: activeFilter === f ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px', padding: '8px 16px', cursor: 'pointer',
                  fontSize: '13px', fontFamily: 'inherit', transition: 'all 0.2s',
                }}
              >{f}</button>
            ))}
          </div>
        </div>
      </section>

      {/* events grid */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="page-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {filtered.map(({ city, flag, title, host, rank, date, time, guests, max, isPublic, tags }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card-glow"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p className="mono" style={{ color: '#5A5A5A' }}>{flag} {city}</p>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {!isPublic && <span className="rank-badge" style={{ color: '#5A5A5A', border: '1px solid rgba(255,255,255,0.1)' }}>Private</span>}
                    <RankBadge rank={rank} />
                  </div>
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '18px', color: '#fff', lineHeight: 1.3 }}>{title}</h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#A0A0A0', fontSize: '13px' }}>
                    <Calendar size={12} /> {date} · {time}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: guests >= max - 2 ? 'var(--gold)' : '#A0A0A0', fontSize: '13px' }}>
                    <Users size={12} /> {guests}/{max}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {tags.map(t => (
                    <span key={t} className="mono" style={{ color: '#5A5A5A', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', padding: '3px 8px', fontSize: '10px' }}>{t}</span>
                  ))}
                </div>
                <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#A0A0A0', fontSize: '13px' }}>Hosted by <span style={{ color: 'var(--beige)' }}>{host}</span></span>
                  <button
                    onClick={() => handleJoin(title)}
                    style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--maroon-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--maroon)'}
                  >Join →</button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* top cities */}
          <div>
            <p className="mono" style={{ color: '#5A5A5A', marginBottom: '16px' }}>Top cities</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {TOP_CITIES.map(({ city, flag, count }) => (
                <div key={city} className="card-glow" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px', textAlign: 'center', cursor: 'pointer' }}>
                  <p style={{ fontSize: '24px', marginBottom: '6px' }}>{flag}</p>
                  <p style={{ color: '#fff', fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>{city}</p>
                  <p className="mono" style={{ color: 'var(--maroon)' }}>{count} events</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
