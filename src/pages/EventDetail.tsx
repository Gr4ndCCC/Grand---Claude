import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Users, ArrowLeft, Send, Sparkles,
  MessageCircle, Plus, Check, Cloud, ChefHat, Lock, Globe, Flame,
} from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useAuth } from '../lib/auth';
import {
  EmberEvent, getEvent, joinEvent, addContribution, postChat,
  summarizeContributions, Rank,
} from '../data/events';

const RANK_COLORS: Record<Rank, string> = {
  Legend: '#DAA520', Gold: '#B8860B', Iron: '#6B7280', Ember: '#800000',
};

function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return `hsl(${h}, 35%, 30%)`;
}

function Avatar({ name, rank, size = 36 }: { name: string; rank?: Rank; size?: number }) {
  const ringColor = rank ? RANK_COLORS[rank] : 'transparent';
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: avatarColor(name),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 600, fontSize: size * 0.36,
        border: rank ? `2px solid ${ringColor}` : 'none',
      }}>
        {initials(name)}
      </div>
    </div>
  );
}

function RankPill({ rank }: { rank: Rank }) {
  const c = RANK_COLORS[rank];
  return (
    <span style={{
      color: c, background: `${c}18`, border: `1px solid ${c}44`,
      borderRadius: '4px', padding: '2px 7px', fontSize: '10px',
      fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>{rank}</span>
  );
}

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, openAuth } = useAuth();
  const [event, setEvent] = useState<EmberEvent | undefined>(() => id ? getEvent(id) : undefined);
  const [tab, setTab] = useState<'chat' | 'ai'>('chat');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [contribItem, setContribItem] = useState('');
  const [contribQty, setContribQty] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current && tab === 'chat') {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [event?.chat.length, tab]);

  if (!event) {
    return (
      <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
        <Nav />
        <div style={{ padding: '160px 24px', textAlign: 'center' }}>
          <p className="mono" style={{ color: '#5A5A5A', marginBottom: '16px' }}>Event not found</p>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '48px', marginBottom: '24px' }}>
            That fire has gone cold.
          </h1>
          <button
            onClick={() => navigate('/events')}
            style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontFamily: 'inherit' }}
          >Back to events</button>
        </div>
        <Footer />
      </div>
    );
  }

  const isAttending = !!user && event.attendees.some(a => a.name === user.name);
  const summary = useMemo(() => summarizeContributions(event), [event]);

  const handleJoinClick = () => {
    if (!user) return openAuth(`Sign in to join "${event.title}".`);
    if (isAttending) {
      setShowAddModal(true);
      return;
    }
    setShowJoinModal(true);
  };

  const confirmJoin = () => {
    if (!user) return;
    const updated = joinEvent(event.id, {
      id: user.email, name: user.name, rank: 'Ember',
    });
    if (updated) setEvent({ ...updated });
    setShowJoinModal(false);
    setShowAddModal(true);
  };

  const submitContribution = () => {
    if (!user || !contribItem.trim()) return;
    const updated = addContribution(event.id, {
      id: `co-${Date.now()}`,
      userId: user.email,
      userName: user.name,
      item: contribItem.trim(),
      quantity: contribQty.trim() || undefined,
      emoji: '🔥',
    });
    if (updated) setEvent({ ...updated });
    setContribItem('');
    setContribQty('');
    setShowAddModal(false);
  };

  const sendChat = () => {
    if (!user) return openAuth('Sign in to chat with the crew.');
    if (!chatInput.trim()) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const updated = postChat(event.id, {
      id: `m-${Date.now()}`, author: user.name, rank: 'Ember', text: chatInput.trim(), time,
    });
    if (updated) setEvent({ ...updated });
    setChatInput('');
  };

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      {/* Hero */}
      <section style={{ paddingTop: '100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, ${event.coverColor}55 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1, paddingTop: '40px', paddingBottom: '60px' }}>
          <button
            onClick={() => navigate('/events')}
            style={{ background: 'transparent', border: 'none', color: '#A0A0A0', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '24px', fontFamily: 'inherit' }}
          ><ArrowLeft size={14} /> Back to events</button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                <p className="mono" style={{ color: 'var(--maroon)' }}>{event.flag} {event.city}</p>
                <span style={{ color: '#333' }}>·</span>
                <p className="mono" style={{ color: '#5A5A5A' }}>{event.theme}</p>
                {event.isPublic
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#5A5A5A', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}><Globe size={10} /> Public</span>
                  : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#5A5A5A', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}><Lock size={10} /> Private</span>}
              </div>
              <span className="maroon-rule" />
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(36px, 5vw, 64px)', color: '#fff', lineHeight: 1.06, marginBottom: '20px' }}
              >{event.title}</motion.h1>
              <p style={{ color: '#A0A0A0', fontSize: '16px', lineHeight: '1.7', maxWidth: '600px', marginBottom: '28px' }}>
                {event.description}
              </p>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A0A0A0', fontSize: '14px' }}>
                  <Calendar size={14} /> {event.date} · {event.time}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A0A0A0', fontSize: '14px' }}>
                  <MapPin size={14} /> {event.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: event.attendees.length >= event.max - 2 ? 'var(--gold)' : '#A0A0A0', fontSize: '14px' }}>
                  <Users size={14} /> {event.attendees.length}/{event.max} guests
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Avatar name={event.host} rank={event.hostRank} size={40} />
                  <div>
                    <p style={{ fontSize: '13px', color: '#A0A0A0' }}>Hosted by</p>
                    <p style={{ fontSize: '14px', color: 'var(--beige)', fontFamily: 'Playfair Display, Georgia, serif' }}>{event.host}</p>
                  </div>
                </div>
                <RankPill rank={event.hostRank} />
              </div>
            </div>

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              style={{ background: 'rgba(17,17,17,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '16px', padding: '24px', minWidth: '280px', maxWidth: '320px' }}
            >
              <p className="mono" style={{ color: '#5A5A5A', marginBottom: '14px' }}>Your spot</p>
              {isAttending ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', marginBottom: '12px' }}>
                    <Check size={16} />
                    <span style={{ fontSize: '15px', fontWeight: 500 }}>You're going</span>
                  </div>
                  <p style={{ color: '#A0A0A0', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                    The host has been notified. Make sure to add what you're bringing.
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    style={{ width: '100%', background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  ><Plus size={14} /> Add a contribution</button>
                </>
              ) : (
                <>
                  <p style={{ color: '#A0A0A0', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                    {event.max - event.attendees.length} spots left. Tap to confirm and add what you're bringing.
                  </p>
                  <button
                    onClick={handleJoinClick}
                    style={{ width: '100%', background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--maroon-light)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--maroon)')}
                  ><Flame size={14} /> Join Event</button>
                </>
              )}
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: '11px', color: '#5A5A5A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Tags</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {event.tags.map(t => (
                    <span key={t} className="mono" style={{ color: '#5A5A5A', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', padding: '3px 8px', fontSize: '10px' }}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <section style={{ padding: '20px 0 80px' }}>
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 420px)', gap: '24px', alignItems: 'start' }} className="event-detail-grid">
            {/* LEFT — Attendees + Contributions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Attendees */}
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={16} style={{ color: 'var(--maroon)' }} />
                    <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px', color: '#fff' }}>
                      Who's coming
                    </h3>
                  </div>
                  <span className="mono" style={{ color: '#5A5A5A' }}>{event.attendees.length} attending</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                  {event.attendees.map(a => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                      <Avatar name={a.name} rank={a.rank} size={36} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '13px', color: '#fff', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</p>
                        <p style={{ fontSize: '11px', color: RANK_COLORS[a.rank], fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>{a.rank}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contributions */}
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ChefHat size={16} style={{ color: 'var(--maroon)' }} />
                    <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px', color: '#fff' }}>
                      What people are bringing
                    </h3>
                  </div>
                  <button
                    onClick={handleJoinClick}
                    style={{ background: 'transparent', color: 'var(--beige)', border: '1px solid rgba(228,207,179,0.3)', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  ><Plus size={12} /> Add contribution</button>
                </div>
                {event.contributions.length === 0 ? (
                  <p style={{ color: '#5A5A5A', fontSize: '13px', textAlign: 'center', padding: '24px' }}>
                    Nothing claimed yet. Be the first to contribute.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {event.contributions.map(c => (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(128,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                          {c.emoji || '🍽️'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>
                            {c.item}{c.quantity && <span style={{ color: '#5A5A5A', fontWeight: 400 }}> · {c.quantity}</span>}
                          </p>
                          <p style={{ fontSize: '12px', color: '#A0A0A0' }}>by <span style={{ color: 'var(--beige)' }}>{c.userName}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — Tabs (Chat | Ember AI) */}
            <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '640px', position: 'sticky', top: '90px' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <button
                  onClick={() => setTab('chat')}
                  style={{
                    flex: 1, background: tab === 'chat' ? 'rgba(128,0,0,0.10)' : 'transparent',
                    color: tab === 'chat' ? '#fff' : '#A0A0A0',
                    border: 'none', borderBottom: tab === 'chat' ? '2px solid var(--maroon)' : '2px solid transparent',
                    padding: '14px 12px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontWeight: tab === 'chat' ? 600 : 400,
                  }}
                ><MessageCircle size={14} /> Chat</button>
                <button
                  onClick={() => setTab('ai')}
                  style={{
                    flex: 1, background: tab === 'ai' ? 'rgba(128,0,0,0.10)' : 'transparent',
                    color: tab === 'ai' ? '#fff' : '#A0A0A0',
                    border: 'none', borderBottom: tab === 'ai' ? '2px solid var(--maroon)' : '2px solid transparent',
                    padding: '14px 12px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontWeight: tab === 'ai' ? 600 : 400,
                  }}
                ><Sparkles size={14} /> Ember AI</button>
              </div>

              {tab === 'chat' && (
                <>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {event.chat.length === 0 && (
                      <p style={{ color: '#5A5A5A', textAlign: 'center', fontSize: '13px', padding: '32px 16px' }}>
                        No messages yet. Start the conversation.
                      </p>
                    )}
                    {event.chat.map(m => {
                      const mine = user && m.author === user.name;
                      return (
                        <div key={m.id} style={{ display: 'flex', gap: '10px', flexDirection: mine ? 'row-reverse' : 'row' }}>
                          <Avatar name={m.author} rank={m.rank} size={30} />
                          <div style={{ maxWidth: '78%' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px', flexDirection: mine ? 'row-reverse' : 'row' }}>
                              <p style={{ fontSize: '12px', color: 'var(--beige)', fontWeight: 500 }}>{m.author}</p>
                              <p style={{ fontSize: '10px', color: '#5A5A5A', fontFamily: 'JetBrains Mono, monospace' }}>{m.time}</p>
                            </div>
                            <div style={{
                              background: mine ? 'var(--maroon)' : 'rgba(255,255,255,0.05)',
                              color: '#fff', padding: '8px 12px',
                              borderRadius: mine ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                              fontSize: '13px', lineHeight: 1.5,
                            }}>{m.text}</div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '12px', display: 'flex', gap: '8px' }}>
                    <input
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendChat()}
                      placeholder={user ? 'Write a message…' : 'Sign in to chat…'}
                      style={{ flex: 1, background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}
                    />
                    <button
                      onClick={sendChat}
                      disabled={!chatInput.trim()}
                      style={{ background: chatInput.trim() ? 'var(--maroon)' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 14px', cursor: chatInput.trim() ? 'pointer' : 'not-allowed', display: 'inline-flex', alignItems: 'center' }}
                    ><Send size={14} /></button>
                  </div>
                </>
              )}

              {tab === 'ai' && (
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--maroon), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={14} style={{ color: '#fff' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>Ember AI</p>
                      <p style={{ fontSize: '11px', color: '#5A5A5A', fontFamily: 'JetBrains Mono, monospace' }}>Live event intelligence</p>
                    </div>
                  </div>

                  {/* Weather */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '14px' }}>
                    <p className="mono" style={{ color: '#5A5A5A', marginBottom: '8px', fontSize: '11px' }}>
                      <Cloud size={11} style={{ display: 'inline', marginRight: '4px' }} /> Weather forecast
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '32px' }}>{event.weather.icon}</span>
                      <div>
                        <p style={{ fontSize: '22px', color: '#fff', fontFamily: 'Playfair Display, Georgia, serif' }}>{event.weather.temp}</p>
                        <p style={{ fontSize: '12px', color: '#A0A0A0' }}>{event.weather.condition}</p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', color: '#A0A0A0' }}>
                      <div>Wind: <span style={{ color: '#fff' }}>{event.weather.wind}</span></div>
                      <div>Humidity: <span style={{ color: '#fff' }}>{event.weather.humidity}</span></div>
                    </div>
                  </div>

                  {/* Coverage */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '14px' }}>
                    <p className="mono" style={{ color: '#5A5A5A', marginBottom: '10px', fontSize: '11px' }}>
                      <Check size={11} style={{ display: 'inline', marginRight: '4px' }} /> Already covered ({summary.covered.length})
                    </p>
                    {summary.covered.length === 0 ? (
                      <p style={{ fontSize: '12px', color: '#5A5A5A' }}>No contributions yet.</p>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {summary.covered.map((c, i) => (
                          <span key={i} style={{ fontSize: '11px', color: 'var(--gold)', background: 'rgba(184,134,11,0.10)', border: '1px solid rgba(184,134,11,0.25)', borderRadius: '4px', padding: '3px 8px', fontFamily: 'JetBrains Mono, monospace' }}>{c}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Missing */}
                  <div style={{ background: 'rgba(128,0,0,0.10)', border: '1px solid rgba(128,0,0,0.25)', borderRadius: '10px', padding: '14px' }}>
                    <p className="mono" style={{ color: 'var(--maroon-light)', marginBottom: '10px', fontSize: '11px' }}>
                      ⚠ Still missing ({summary.stillMissing.length})
                    </p>
                    {summary.stillMissing.length === 0 ? (
                      <p style={{ fontSize: '12px', color: '#A0A0A0' }}>All bases covered. Solid crew.</p>
                    ) : (
                      <>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                          {summary.stillMissing.map((m, i) => (
                            <span key={i} style={{ fontSize: '11px', color: '#fff', background: 'rgba(128,0,0,0.20)', borderRadius: '4px', padding: '3px 8px', fontFamily: 'JetBrains Mono, monospace' }}>{m}</span>
                          ))}
                        </div>
                        <button
                          onClick={handleJoinClick}
                          style={{ background: 'transparent', color: 'var(--beige)', border: '1px solid rgba(228,207,179,0.30)', borderRadius: '6px', padding: '6px 12px', fontSize: '11px', fontFamily: 'inherit', cursor: 'pointer' }}
                        >Claim something →</button>
                      </>
                    )}
                  </div>

                  {/* Reminders */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '14px' }}>
                    <p className="mono" style={{ color: '#5A5A5A', marginBottom: '10px', fontSize: '11px' }}>
                      💡 Event reminders
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <li style={{ fontSize: '12px', color: '#A0A0A0', lineHeight: 1.6 }}>
                        • Event starts at <span style={{ color: '#fff' }}>{event.time}</span> on <span style={{ color: '#fff' }}>{event.date}</span>
                      </li>
                      <li style={{ fontSize: '12px', color: '#A0A0A0', lineHeight: 1.6 }}>
                        • Location: <span style={{ color: '#fff' }}>{event.location}</span>
                      </li>
                      {event.weather.condition.toLowerCase().includes('rain') && (
                        <li style={{ fontSize: '12px', color: 'var(--gold)', lineHeight: 1.6 }}>
                          • Rain expected — bring covers or move under shelter
                        </li>
                      )}
                      {parseInt(event.weather.temp) < 12 && (
                        <li style={{ fontSize: '12px', color: 'var(--gold)', lineHeight: 1.6 }}>
                          • Cold conditions — wear layers
                        </li>
                      )}
                      <li style={{ fontSize: '12px', color: '#A0A0A0', lineHeight: 1.6 }}>
                        • Light coals 30–45 min before — be ready when guests arrive
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Join Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowJoinModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '16px', padding: '32px', maxWidth: '440px', width: '100%' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Flame size={20} style={{ color: '#fff' }} />
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', color: '#fff', marginBottom: '8px' }}>
                Join {event.title}?
              </h3>
              <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                You'll be added to the attendee list. The host gets notified, and you'll be able to add a contribution next.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowJoinModal(false)}
                  style={{ flex: 1, background: 'transparent', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
                >Cancel</button>
                <button
                  onClick={confirmJoin}
                  style={{ flex: 2, background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
                >Confirm RSVP</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Contribution Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '16px', padding: '32px', maxWidth: '480px', width: '100%' }}
            >
              <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', color: '#fff', marginBottom: '8px' }}>
                What are you bringing?
              </h3>
              <p style={{ color: '#A0A0A0', fontSize: '13px', marginBottom: '20px' }}>
                Add what you'll contribute so nothing doubles up.
              </p>

              {summary.stillMissing.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <p className="mono" style={{ color: '#5A5A5A', marginBottom: '8px', fontSize: '11px' }}>Still needed</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {summary.stillMissing.map((m, i) => (
                      <button key={i} onClick={() => setContribItem(m)}
                        style={{ background: 'rgba(128,0,0,0.15)', color: 'var(--beige)', border: '1px solid rgba(128,0,0,0.30)', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontFamily: 'inherit', cursor: 'pointer' }}
                      >+ {m}</button>
                    ))}
                  </div>
                </div>
              )}

              <label style={{ display: 'block', marginBottom: '12px' }}>
                <span style={{ display: 'block', fontSize: '12px', color: '#A0A0A0', marginBottom: '6px' }}>Item *</span>
                <input
                  value={contribItem}
                  onChange={e => setContribItem(e.target.value)}
                  placeholder="Steaks, drinks, charcoal…"
                  autoFocus
                  style={{ width: '100%', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
                />
              </label>
              <label style={{ display: 'block', marginBottom: '20px' }}>
                <span style={{ display: 'block', fontSize: '12px', color: '#A0A0A0', marginBottom: '6px' }}>Quantity (optional)</span>
                <input
                  value={contribQty}
                  onChange={e => setContribQty(e.target.value)}
                  placeholder="2kg, ×6, large bowl…"
                  style={{ width: '100%', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
                />
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, background: 'transparent', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
                >Skip</button>
                <button
                  onClick={submitContribution}
                  disabled={!contribItem.trim()}
                  style={{ flex: 2, background: contribItem.trim() ? 'var(--maroon)' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', cursor: contribItem.trim() ? 'pointer' : 'not-allowed', fontWeight: 600, fontFamily: 'inherit' }}
                >Add Contribution</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .event-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
