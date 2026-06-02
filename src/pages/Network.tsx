import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { supabase } from '../lib/supabase';

const RANK_COLORS: Record<string, { fg: string; bg: string; border: string }> = {
  Legend:   { fg: 'var(--gold-hi)',  bg: 'rgba(212,168,95,0.08)',  border: 'rgba(212,168,95,0.4)'  },
  Platinum: { fg: '#a78bfa',         bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.35)' },
  Gold:     { fg: 'var(--gold-v3)', bg: 'rgba(184,146,74,0.06)',  border: 'rgba(184,146,74,0.35)' },
  Iron:     { fg: 'var(--bone-300)',bg: 'rgba(245,237,224,0.04)', border: 'rgba(245,237,224,0.12)' },
  Ember:    { fg: 'var(--burgundy)',bg: 'rgba(85,0,0,0.2)',       border: 'rgba(128,0,0,0.4)'     },
};

interface Member {
  id: string;
  display_name: string;
  tier: string;
  sub_since: string | null;
  created_at: string;
}

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

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function memberSince(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export function Network() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [rank, setRank] = useState<string>('All');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const ranks = ['All', 'Legend', 'Platinum', 'Gold', 'Iron', 'Ember'];

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, display_name, tier, sub_since, created_at')
      .eq('sub_active', true)
      .order('sub_since', { ascending: false })
      .then(({ data }) => {
        setMembers((data as Member[]) ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = members.filter(m =>
    (rank === 'All' || m.tier === rank) &&
    (!q || m.display_name.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div style={{ color: 'var(--bone-100)', minHeight: '100vh' }}>
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="v3-section" style={{ paddingTop: '140px', paddingBottom: '48px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="section-label">Ember Network</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 72px)', color: 'var(--bone-100)', lineHeight: 1.05, marginBottom: '24px' }}
          >
            Show up a stranger.<br />
            <span className="accent-italic">Leave as one.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: 'var(--bone-400)', fontSize: '17px', lineHeight: 1.7, maxWidth: '600px' }}
          >
            Verified Vault members around the world. Search by name or rank.
            Travelling somewhere new? There's a fire burning and someone to meet.
          </motion.p>
        </div>
      </section>

      {/* ── MEMBER DIRECTORY ─────────────────────────────────── */}
      <section style={{ padding: '20px 0 100px', borderTop: '1px solid rgba(245,237,224,0.06)' }}>
        <div className="page-container">
          <FadeUp>
            <div className="section-label" style={{ marginBottom: '32px' }}>Members</div>
          </FadeUp>

          {/* Search + rank filter */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 280px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--bone-500)' }} />
              <input
                value={q} onChange={e => setQ(e.target.value)}
                placeholder="Search by name…"
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
          {loading ? (
            <p style={{ color: 'var(--bone-500)', textAlign: 'center', padding: '60px 0', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              Loading members…
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {filtered.map((m, i) => (
                <motion.article key={m.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.05 }}
                  className="rank-card-v3"
                  style={{ padding: '24px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '50%',
                        background: 'rgba(128,0,0,0.25)', color: 'var(--beige)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600,
                        border: '1px solid rgba(228,207,179,0.15)',
                      }}>{initials(m.display_name)}</div>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '17px', color: 'var(--bone-100)' }}>{m.display_name}</p>
                    </div>
                    <RankBadge rank={m.tier} />
                  </div>
                  <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(245,237,224,0.06)', display: 'flex', justifyContent: 'space-between' }}>
                    {memberSince(m.sub_since || m.created_at) && (
                      <span className="mono" style={{ color: 'var(--bone-500)', fontSize: '11px' }}>
                        Member since {memberSince(m.sub_since || m.created_at)}
                      </span>
                    )}
                    <span className="mono" style={{ color: 'var(--beige)', fontSize: '11px' }}>VERIFIED</span>
                  </div>
                </motion.article>
              ))}
              {filtered.length === 0 && !loading && (
                <p style={{ color: 'var(--bone-500)', gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                  {members.length === 0 ? 'Be the first Vault member. The fire is waiting.' : 'No members match. Try another rank.'}
                </p>
              )}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button onClick={() => navigate('/vault')} className="btn-v3 primary lg">
              Join the Vault to appear here
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
