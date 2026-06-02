import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, X, ThumbsUp, ThumbsDown, Lock } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { FireButton } from '../components/FireButton';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

interface Proposal {
  id: string;
  title: string;
  description: string;
  creator_name: string;
  status: 'open' | 'closed';
  created_at: string;
  ends_at: string;
  yes_count: number;
  no_count: number;
  my_vote: 'yes' | 'no' | null;
}

async function fetchProposals(userId: string | null): Promise<Proposal[]> {
  const { data: proposals, error } = await supabase
    .from('council_proposals')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !proposals) return [];

  const ids = proposals.map((p: { id: string }) => p.id);
  if (ids.length === 0) return [];

  const { data: votes } = await supabase
    .from('council_votes')
    .select('proposal_id, choice, user_id')
    .in('proposal_id', ids);

  const voteMap: Record<string, { yes: number; no: number; mine: 'yes' | 'no' | null }> = {};
  for (const id of ids) voteMap[id] = { yes: 0, no: 0, mine: null };

  for (const v of (votes ?? []) as { proposal_id: string; choice: 'yes' | 'no'; user_id: string }[]) {
    if (!voteMap[v.proposal_id]) continue;
    if (v.choice === 'yes') voteMap[v.proposal_id].yes++;
    else voteMap[v.proposal_id].no++;
    if (userId && v.user_id === userId) voteMap[v.proposal_id].mine = v.choice;
  }

  return proposals.map((p: { id: string; title: string; description: string; creator_name: string; status: 'open' | 'closed'; created_at: string; ends_at: string }) => ({
    ...p,
    yes_count: voteMap[p.id]?.yes ?? 0,
    no_count:  voteMap[p.id]?.no  ?? 0,
    my_vote:   voteMap[p.id]?.mine ?? null,
  }));
}

function VoteBar({ yes, no }: { yes: number; no: number }) {
  const total = yes + no;
  const yesPct = total ? Math.round((yes / total) * 100) : 50;
  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${yesPct}%`, background: 'linear-gradient(90deg, var(--maroon), var(--ember))', borderRadius: '3px', transition: 'width 0.4s' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
        <span className="mono" style={{ color: 'var(--maroon)', fontSize: '10px' }}>{yes} YES</span>
        <span className="mono" style={{ color: '#5A5A5A', fontSize: '10px' }}>{total} total</span>
        <span className="mono" style={{ color: '#6B7280', fontSize: '10px' }}>{no} NO</span>
      </div>
    </div>
  );
}

export function Council() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');

  const isVaultMember = !!user?.subActive;

  const reload = async () => {
    const data = await fetchProposals(user?.id ?? null);
    setProposals(data);
  };

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, [user?.id]);

  const handleVote = async (proposalId: string, choice: 'yes' | 'no', currentVote: 'yes' | 'no' | null) => {
    if (!user || !isVaultMember) return;

    if (currentVote === choice) {
      // Remove vote
      await supabase.from('council_votes').delete().eq('proposal_id', proposalId).eq('user_id', user.id);
    } else {
      if (currentVote) {
        // Change vote — delete then insert
        await supabase.from('council_votes').delete().eq('proposal_id', proposalId).eq('user_id', user.id);
      }
      await supabase.from('council_votes').insert({ proposal_id: proposalId, user_id: user.id, choice });
    }
    await reload();
  };

  const handleCreate = async () => {
    if (!user || !isVaultMember || !newTitle.trim() || !newDesc.trim()) return;
    setSubmitting(true);
    setCreateError('');
    const { error } = await supabase.from('council_proposals').insert({
      title: newTitle.trim(),
      description: newDesc.trim(),
      created_by: user.id,
      creator_name: user.name,
    });
    if (error) {
      setCreateError('Could not create proposal. Make sure your Vault membership is active.');
      setSubmitting(false);
      return;
    }
    setNewTitle('');
    setNewDesc('');
    setShowCreate(false);
    setSubmitting(false);
    await reload();
  };

  const open   = proposals.filter(p => p.status === 'open');
  const closed = proposals.filter(p => p.status === 'closed');

  return (
    <div style={{ color: 'var(--bone-100)', minHeight: '100vh' }}>
      <Nav />

      <section style={{ paddingTop: '140px', paddingBottom: '60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', background: 'radial-gradient(ellipse at 50% 0%, rgba(128,0,0,0.20) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--maroon)', marginBottom: '8px' }}>The Council</motion.p>
          <span className="maroon-rule" />
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff', lineHeight: 1.06, marginBottom: '24px' }}
          >
            Your membership<br />
            <span style={{ color: 'var(--beige)', fontStyle: 'italic' }}>shapes Ember.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: '#A0A0A0', fontSize: '18px', lineHeight: '1.7', maxWidth: '640px' }}
          >
            The Council is how members vote on platform direction.
            New features. Event formats. Pricing. Annual Summit location.
            One member, one vote. Every voice counts the same.
          </motion.p>
        </div>
      </section>

      <section style={{ padding: '40px 0 60px' }}>
        <div className="page-container">

          {/* Create proposal button (Vault members only) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p className="mono" style={{ color: '#5A5A5A' }}>Active votes</p>
            {isVaultMember ? (
              <button
                onClick={() => setShowCreate(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}
              >
                <Plus size={13} /> New proposal
              </button>
            ) : (
              <span className="mono" style={{ color: '#5A5A5A', fontSize: '10px' }}>
                <Lock size={10} style={{ display: 'inline', marginRight: '4px' }} />
                Vault members can create proposals
              </span>
            )}
          </div>

          {/* Create proposal modal */}
          <AnimatePresence>
            {showCreate && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowCreate(false)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                  onClick={e => e.stopPropagation()}
                  style={{ background: '#111', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '100%' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#fff' }}>New proposal</h3>
                    <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', color: '#5A5A5A', cursor: 'pointer' }}><X size={18} /></button>
                  </div>
                  <label style={{ display: 'block', marginBottom: '14px' }}>
                    <span style={{ display: 'block', fontSize: '12px', color: '#A0A0A0', marginBottom: '6px' }}>Title *</span>
                    <input
                      value={newTitle} onChange={e => setNewTitle(e.target.value)}
                      placeholder="What are you proposing?"
                      style={{ width: '100%', background: 'rgba(26,23,20,0.8)', border: '1px solid rgba(245,237,224,0.1)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
                    />
                  </label>
                  <label style={{ display: 'block', marginBottom: '20px' }}>
                    <span style={{ display: 'block', fontSize: '12px', color: '#A0A0A0', marginBottom: '6px' }}>Description *</span>
                    <textarea
                      value={newDesc} onChange={e => setNewDesc(e.target.value)}
                      placeholder="Explain the proposal and why it matters..."
                      rows={4}
                      style={{ width: '100%', background: 'rgba(26,23,20,0.8)', border: '1px solid rgba(245,237,224,0.1)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                  </label>
                  {createError && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{createError}</p>}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setShowCreate(false)}
                      style={{ flex: 1, background: 'transparent', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
                    >Cancel</button>
                    <button onClick={handleCreate} disabled={submitting || !newTitle.trim() || !newDesc.trim()}
                      style={{ flex: 2, background: newTitle.trim() && newDesc.trim() ? 'var(--maroon)' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', cursor: newTitle.trim() && newDesc.trim() ? 'pointer' : 'not-allowed', fontWeight: 600, fontFamily: 'inherit' }}
                    >{submitting ? 'Submitting…' : 'Submit proposal'}</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <p className="mono" style={{ color: '#5A5A5A', textAlign: 'center', padding: '40px' }}>Loading votes…</p>
          ) : open.length === 0 && closed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', background: 'rgba(245,237,224,0.02)', border: '1px solid rgba(245,237,224,0.07)', borderRadius: '14px' }}>
              <p style={{ color: '#A0A0A0', fontSize: '16px', marginBottom: '8px' }}>No proposals yet.</p>
              <p style={{ color: '#5A5A5A', fontSize: '13px' }}>
                {isVaultMember ? 'Be the first — create a proposal above.' : 'Join the Vault to create and vote on proposals.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[...open, ...closed].map((p, i) => {
                const total = p.yes_count + p.no_count;
                const isOpen = p.status === 'open';
                const endsDate = new Date(p.ends_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                return (
                  <motion.div key={p.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className="card-glow"
                    style={{ background: 'rgba(26,23,20,0.7)', border: '1px solid rgba(245,237,224,0.07)', borderRadius: '14px', padding: '24px' }}
                  >
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <span className="mono" style={{
                        background: isOpen ? 'rgba(128,0,0,0.2)' : 'rgba(107,114,128,0.15)',
                        color: isOpen ? 'var(--maroon)' : '#6B7280',
                        padding: '4px 10px', borderRadius: '6px', fontSize: '10px',
                        border: isOpen ? '1px solid rgba(128,0,0,0.4)' : '1px solid rgba(107,114,128,0.3)',
                        flexShrink: 0,
                      }}>{isOpen ? 'OPEN' : 'CLOSED'}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#fff', marginBottom: '4px' }}>{p.title}</p>
                        <p style={{ color: '#A0A0A0', fontSize: '13px', lineHeight: 1.6, marginBottom: '8px' }}>{p.description}</p>
                        <p className="mono" style={{ color: '#5A5A5A', fontSize: '9px' }}>
                          by {p.creator_name} · {isOpen ? `Ends ${endsDate}` : `Closed ${endsDate}`}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <p className="mono" style={{ color: '#5A5A5A', fontSize: '10px' }}>{total.toLocaleString()} votes</p>
                      </div>
                    </div>

                    <VoteBar yes={p.yes_count} no={p.no_count} />

                    {isOpen && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                        {isVaultMember ? (
                          <>
                            <button
                              onClick={() => handleVote(p.id, 'yes', p.my_vote)}
                              style={{
                                flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                background: p.my_vote === 'yes' ? 'var(--maroon)' : 'rgba(128,0,0,0.1)',
                                color: p.my_vote === 'yes' ? '#fff' : 'var(--maroon)',
                                border: '1px solid rgba(128,0,0,0.35)', borderRadius: '8px',
                                padding: '9px 16px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
                                fontWeight: p.my_vote === 'yes' ? 600 : 400,
                                transition: 'all 0.2s',
                              }}
                            >
                              <ThumbsUp size={13} /> Yes {p.my_vote === 'yes' ? '✓' : ''}
                            </button>
                            <button
                              onClick={() => handleVote(p.id, 'no', p.my_vote)}
                              style={{
                                flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                background: p.my_vote === 'no' ? 'rgba(107,114,128,0.25)' : 'rgba(107,114,128,0.08)',
                                color: '#6B7280',
                                border: '1px solid rgba(107,114,128,0.3)', borderRadius: '8px',
                                padding: '9px 16px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
                                fontWeight: p.my_vote === 'no' ? 600 : 400,
                                transition: 'all 0.2s',
                              }}
                            >
                              <ThumbsDown size={13} /> No {p.my_vote === 'no' ? '✓' : ''}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => navigate('/vault')}
                            style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', color: '#5A5A5A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 16px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}
                          >
                            <Lock size={12} /> Join the Vault to vote
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: '60px 0 100px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="page-container" style={{ maxWidth: '720px' }}>
          <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px' }}>How voting works</p>
          <span className="maroon-rule" />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: '#fff', marginBottom: '32px' }}>One member. One vote.</h2>
          {[
            { n: '01', t: 'Proposals come from anywhere',  b: 'Vault members, the Ember team, or the Council itself can put a question forward.' },
            { n: '02', t: '30-day window',                  b: 'Every vote runs for 30 days. Open and transparent. Real-time tally visible to all members.' },
            { n: '03', t: 'Result is binding',              b: 'If it passes, it ships. If it fails, it stays the way it was. The community decides.' },
          ].map(({ n, t, b }) => (
            <div key={n} style={{ paddingBottom: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
                <p className="mono" style={{ color: 'var(--maroon)' }}>{n}</p>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--beige)', marginBottom: '8px' }}>{t}</h3>
                  <p style={{ color: '#A0A0A0', fontSize: '15px', lineHeight: '1.7' }}>{b}</p>
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <FireButton variant="primary" size="lg" onClick={() => navigate('/vault')}>
              Get a vote · Join the Vault
            </FireButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
