import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useAuth } from '../lib/auth';
import { getAllEvents, getCityCounts, EmberEvent } from '../data/events';

const RANK_COLORS: Record<string, string> = {
  Legend: '#DAA520', Platinum: '#8B5CF6', Gold: '#B8860B', Iron: '#6B7280', Ember: '#800000',
};

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
  const [allEvents, setAllEvents] = useState<EmberEvent[]>([]);
  const [topCities, setTopCities] = useState<{ city: string; flag: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getAllEvents(), getCityCounts()])
      .then(([evs, cities]) => {
        if (active) { setAllEvents(evs); setTopCities(cities); }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleJoin = (eventId: string) => navigate(`/events/${eventId}`);
  const handleHostNav = () => {
    if (!user) return openAuth('Sign in to host an event.');
    navigate('/hosts/new');
  };

  const filters = ['All', 'Nearby', 'This weekend', 'Public', 'Private'];
  const filtered = useMemo(() => allEvents.filter(e => {
    if (query && !e.title.toLowerCase().includes(query.toLowerCase()) && !e.city.toLowerCase().includes(query.toLowerCase())) return false;
    if (activeFilter === 'Public'  && !e.isPublic) return false;
    if (activeFilter === 'Private' &&  e.isPublic) return false;
    return true;
  }), [allEvents, query, activeFilter]);

  return (
    <div style={{ color: 'var(--bone-100)', minHeight: '100vh' }}>
      <Nav />

      {/* header */}
      <section style={{ paddingTop: '120px', paddingBottom: '60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.16) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginBottom: '24px' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>
                Live events
              </motion.p>
              <span className="maroon-rule" />
              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 64px)', color: 'var(--bone-100)', marginBottom: '16px', lineHeight: 1.06 }}
              >
                Fires burning<br />
                <span className="accent-italic">near you.</span>
              </motion.h1>
              <p style={{ color: 'var(--bone-400)', fontSize: '17px' }}>
                Real events. Real hosts. Real fire.
              </p>
            </div>

            {/* Host CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              style={{ background: 'rgba(85,0,0,0.2)', border: '1px solid rgba(128,0,0,0.35)', borderRadius: '14px', padding: '24px', maxWidth: '280px', flexShrink: 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={16} style={{ color: '#fff' }} />
                </div>
                <p style={{ color: '#fff', fontWeight: 500, fontSize: '15px' }}>Host an Event</p>
              </div>
              <p style={{ color: '#A0A0A0', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                Customize your gathering. Build the menu. Light the fire.
              </p>
              <button onClick={handleHostNav} className="btn-v3 primary" style={{ width: '100%' }}>
                Create Event →
              </button>
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
                width: '100%', background: 'rgba(26,23,20,0.7)', border: '1px solid rgba(245,237,224,0.1)',
                borderRadius: '10px', padding: '14px 16px 14px 44px',
                color: 'var(--bone-100)', fontSize: '15px', outline: 'none',
                fontFamily: 'var(--font-display)',
              }}
            />
          </div>

          {/* filters */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                style={{
                  background: activeFilter === f ? 'linear-gradient(135deg, var(--burgundy), var(--burgundy-d))' : 'rgba(245,237,224,0.04)',
                  color: activeFilter === f ? 'var(--bone-100)' : 'var(--bone-400)',
                  border: activeFilter === f ? '1px solid rgba(184,83,50,0.45)' : '1px solid rgba(245,237,224,0.08)',
                  borderRadius: '8px', padding: '8px 16px', cursor: 'pointer',
                  fontSize: '13px', fontFamily: 'var(--font-display)', transition: 'all 0.25s var(--ease-coal)',
                }}
              >{f}</button>
            ))}
          </div>
        </div>
      </section>

      {/* events grid */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="page-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <p className="mono" style={{ color: 'var(--bone-500)' }}>Stoking the coals…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', marginBottom: '48px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--bone-100)', marginBottom: '8px' }}>
                No live events yet.
              </h2>
              <p style={{ color: 'var(--bone-400)', fontSize: '15px', marginBottom: '24px' }}>
                Host the first one.
              </p>
              <button onClick={() => navigate('/hosts/new')} className="btn-v3 primary">
                Host an Event →
              </button>
            </div>
          ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {filtered.map((ev, i) => {
              const isMyEvent = !!user && user.id === ev.hostUserId;
              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => handleJoin(ev.id)}
                  className="event-card-v3"
                  style={{ cursor: 'pointer', gap: '14px', display: 'flex', flexDirection: 'column' }}
                >
                  <span className="heat-bar" aria-hidden />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p className="mono" style={{ color: 'var(--bone-500)' }}>{ev.flag} {ev.city}</p>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {!ev.isPublic && <span className="rank-badge" style={{ color: 'var(--bone-500)', border: '1px solid rgba(245,237,224,0.12)' }}>Private</span>}
                      <RankBadge rank={ev.hostRank} />
                    </div>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--bone-100)', lineHeight: 1.3 }}>{ev.title}</h3>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--bone-400)', fontSize: '13px' }}>
                      <Calendar size={12} /> {ev.date} · {ev.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: ev.guests >= ev.max - 2 ? 'var(--gold-v3)' : 'var(--bone-500)', fontSize: '13px' }}>
                      <Users size={12} /> {ev.guests}/{ev.max}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {ev.tags.map(t => (
                      <span key={t} className="mono" style={{ color: 'var(--bone-500)', background: 'rgba(245,237,224,0.04)', borderRadius: '4px', padding: '3px 8px', fontSize: '10px' }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(245,237,224,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--bone-400)', fontSize: '13px' }}>Hosted by <span style={{ color: 'var(--beige)' }}>{ev.host}</span></span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleJoin(ev.id); }}
                      className="btn-v3 primary"
                      style={{ padding: '8px 16px', height: 'auto', fontSize: '13px' }}
                    >{isMyEvent ? 'Manage →' : 'Join →'}</button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          )}

          {/* top cities — real data */}
          {topCities.length > 0 && (
            <div>
              <p className="mono" style={{ color: 'var(--bone-500)', marginBottom: '16px' }}>Top cities</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {topCities.map(({ city, flag, count }) => (
                  <button
                    key={city}
                    onClick={() => setQuery(city)}
                    className="vault-feature-v3"
                    style={{ textAlign: 'center', cursor: 'pointer', background: 'none', border: '1px solid rgba(245,237,224,0.07)', width: '100%' }}
                  >
                    <p style={{ fontSize: '24px', marginBottom: '6px' }}>{flag}</p>
                    <p style={{ color: 'var(--bone-100)', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{city}</p>
                    <p className="mono" style={{ color: 'var(--burgundy)' }}>{count} {count === 1 ? 'event' : 'events'}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
