import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, Lock } from 'lucide-react';
import { Globe } from '../components/Globe';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const FILTERS = ['Nearby', 'This weekend', 'Public', 'Private'];

const RANK_COLORS: Record<string, string> = {
  Legend: '#DAA520', Gold: '#B8860B', Iron: '#6B7280', Ember: '#800000',
};

const SAMPLE_EVENTS = [
  {
    id: 'e1', city: 'Amsterdam', flag: '🇳🇱',
    title: 'Amsterdam Sunset BBQ',
    host: 'Lars V.', rank: 'Gold',
    date: 'Sat, Apr 19', time: '18:00',
    guests: 8, max: 12, isPublic: true,
    bg: 'linear-gradient(135deg, #1a0505, #3a1010)',
    tags: ['charcoal', 'brisket', 'rooftop'],
  },
  {
    id: 'e2', city: 'Tokyo', flag: '🇯🇵',
    title: 'Tokyo Garden Grill',
    host: 'Hiro M.', rank: 'Iron',
    date: 'Sun, Apr 20', time: '17:00',
    guests: 6, max: 10, isPublic: true,
    bg: 'linear-gradient(135deg, #050515, #0f1a3a)',
    tags: ['yakitori', 'binchotan'],
  },
  {
    id: 'e3', city: 'New York', flag: '🇺🇸',
    title: 'Brooklyn Smokehouse Night',
    host: 'Marcus B.', rank: 'Legend',
    date: 'Fri, Apr 25', time: '19:00',
    guests: 14, max: 20, isPublic: true,
    bg: 'linear-gradient(135deg, #050f05, #0f2a0f)',
    tags: ['smoke', 'brisket', 'ribs'],
  },
  {
    id: 'e4', city: 'Lisbon', flag: '🇵🇹',
    title: 'Lisbon Rooftop Grill',
    host: 'João C.', rank: 'Ember',
    date: 'Sat, Apr 26', time: '20:00',
    guests: 5, max: 15, isPublic: true,
    bg: 'linear-gradient(135deg, #1a1000, #3a2a00)',
    tags: ['piri-piri', 'outdoor'],
  },
  {
    id: 'e5', city: 'Berlin', flag: '🇩🇪',
    title: 'Berlin Winter BBQ',
    host: 'Klaus R.', rank: 'Iron',
    date: 'Sat, May 3', time: '16:00',
    guests: 9, max: 18, isPublic: false,
    bg: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
    tags: ['fire-pit', 'bratwurst'],
  },
  {
    id: 'e6', city: 'São Paulo', flag: '🇧🇷',
    title: 'São Paulo Churrasco Night',
    host: 'Rafael M.', rank: 'Gold',
    date: 'Sun, May 4', time: '13:00',
    guests: 16, max: 25, isPublic: true,
    bg: 'linear-gradient(135deg, #1a0800, #3a1500)',
    tags: ['churrasco', 'picanha'],
  },
];

const TOP_CITIES = [
  { city: 'New York',  events: 5, flag: '🇺🇸' },
  { city: 'Amsterdam', events: 4, flag: '🇳🇱' },
  { city: 'Tokyo',     events: 3, flag: '🇯🇵' },
  { city: 'São Paulo', events: 3, flag: '🇧🇷' },
  { city: 'Barcelona', events: 3, flag: '🇪🇸' },
];

export function Events() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (f: string) =>
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const filtered = SAMPLE_EVENTS.filter(e => {
    if (search) {
      const q = search.toLowerCase();
      if (!e.city.toLowerCase().includes(q) && !e.title.toLowerCase().includes(q)) return false;
    }
    if (activeFilters.includes('Public') && !e.isPublic) return false;
    if (activeFilters.includes('Private') && e.isPublic) return false;
    return true;
  });

  return (
    <div style={{ background: '#0A0A0A', color: '#FFFFFF', minHeight: '100vh' }}>
      <Nav />

      {/* HERO */}
      <section style={{ paddingTop: '120px', paddingBottom: '64px', textAlign: 'center' }}>
        <div className="page-container">
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ color: '#800000', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}
          >
            Global discovery
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px, 5vw, 64px)', color: '#FFFFFF', lineHeight: 1.05, marginBottom: '16px' }}
          >
            Find your next gathering.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ color: '#A0A0A0', fontSize: '16px', marginBottom: '40px' }}
          >
            Your city has a gathering this weekend. Are you in?
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ maxWidth: '480px', margin: '0 auto 20px', position: 'relative' }}
          >
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#5A5A5A' }} />
            <input
              type="text"
              placeholder="Search city or event…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', background: '#111111',
                border: '1px solid rgba(255,255,255,0.10)', borderRadius: '12px',
                padding: '14px 16px 14px 44px', color: '#FFFFFF', fontSize: '15px', outline: 'none',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(128,0,0,0.60)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                style={{
                  padding: '7px 16px', borderRadius: '99px', fontSize: '13px',
                  fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s',
                  background: activeFilters.includes(f) ? '#800000' : 'rgba(255,255,255,0.06)',
                  color: activeFilters.includes(f) ? '#FFFFFF' : '#A0A0A0',
                  border: activeFilters.includes(f) ? '1px solid rgba(128,0,0,0.50)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MAP + LIST */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '32px', alignItems: 'start' }}>
            {/* Sticky globe */}
            <div
              className="hidden lg:block"
              style={{ position: 'sticky', top: '80px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', height: '600px' }}
            >
              <Globe mode="sidebar" className="w-full h-full" />
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ color: '#5A5A5A', fontSize: '13px' }}>
                {filtered.length} gathering{filtered.length !== 1 ? 's' : ''} found
              </p>
              {filtered.map((event, i) => (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => navigate(`/events/${event.id}`)}
                  whileHover={{ y: -2 }}
                  style={{
                    background: '#111111', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
                    transition: 'border-color 0.25s',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(228,207,179,0.20)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)')}
                >
                  {/* Cover gradient */}
                  <div style={{ height: '72px', background: event.bg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
                    <span style={{ fontSize: '26px' }}>{event.flag}</span>
                    {!event.isPublic && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.45)', borderRadius: '6px', padding: '3px 8px' }}>
                        <Lock size={10} style={{ color: '#A0A0A0' }} />
                        <span style={{ color: '#A0A0A0', fontSize: '11px' }}>Private</span>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div>
                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#FFFFFF', marginBottom: '3px' }}>{event.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#A0A0A0', fontSize: '12px' }}>by {event.host}</span>
                          <span style={{ background: `${RANK_COLORS[event.rank]}22`, border: `1px solid ${RANK_COLORS[event.rank]}44`, borderRadius: '4px', padding: '1px 6px', color: RANK_COLORS[event.rank], fontSize: '10px', fontWeight: '700' }}>
                            {event.rank}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#5A5A5A', fontSize: '12px' }}>
                        <Calendar size={11} />{event.date} · {event.time}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#5A5A5A', fontSize: '12px' }}>
                        <MapPin size={11} />{event.city}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#5A5A5A', fontSize: '12px' }}>
                        <Users size={11} />{event.guests}/{event.max}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {event.tags.slice(0, 2).map(tag => (
                          <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '2px 7px', color: '#5A5A5A', fontSize: '11px' }}>#{tag}</span>
                        ))}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); }}
                        style={{ background: '#800000', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '7px 15px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#990000')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#800000')}
                      >
                        Join gathering
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TOP CITIES */}
      <section style={{ padding: '80px 0 120px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#080808' }}>
        <div className="page-container">
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3vw, 36px)', color: '#FFFFFF', marginBottom: '32px' }}>
            Cities with the most events
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {TOP_CITIES.map(({ city, events, flag }, i) => (
              <motion.button
                key={city}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -2 }}
                onClick={() => setSearch(city)}
                style={{ padding: '20px', background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.2s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{flag}</span>
                  <span style={{ background: '#800000', color: '#FFFFFF', borderRadius: '99px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' }}>
                    {events}
                  </span>
                </div>
                <p style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600' }}>{city}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
