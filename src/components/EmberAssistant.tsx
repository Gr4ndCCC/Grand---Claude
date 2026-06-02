import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Flame } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

interface Msg { from: 'user' | 'ember'; text: string; }

const WELCOME = 'Ask Ember anything — events, rankings, cities, hosting, or the Vault.';

async function liveReply(input: string, userId: string | null): Promise<string> {
  const q = input.toLowerCase();

  /* ── live event count ───────────────────────────────── */
  if (/(how many|total|count).*(event|fire|gathering)/.test(q) || /live event/.test(q)) {
    const { count } = await supabase.from('events').select('*', { count: 'exact', head: true });
    return `There are currently ${count ?? 0} active event${count === 1 ? '' : 's'} on Ember.`;
  }

  /* ── events in a city ───────────────────────────────── */
  const cityMatch = q.match(/event.*in\s+([a-z\s]+)|in\s+([a-z\s]+).*event/);
  if (cityMatch) {
    const city = (cityMatch[1] ?? cityMatch[2]).trim();
    const { count } = await supabase
      .from('events').select('*', { count: 'exact', head: true })
      .ilike('city', `%${city}%`);
    if (count !== null) {
      return count === 0
        ? `No events found in ${city} right now. Want to host the first one?`
        : `There ${count === 1 ? 'is' : 'are'} currently ${count} event${count === 1 ? '' : 's'} in ${city}.`;
    }
  }

  /* ── upcoming events list in a city ────────────────── */
  if (/(upcoming|next|what.*event|show.*event)/.test(q)) {
    const cityMention = q.match(/in\s+([a-z\s]+)/)?.[1]?.trim();
    let query = supabase.from('events').select('title, city, event_date, event_time').order('event_date', { ascending: true }).limit(3);
    if (cityMention) query = query.ilike('city', `%${cityMention}%`);
    const { data } = await query;
    if (data && data.length > 0) {
      const list = data.map((e: { title: string; city: string; event_date: string | null; event_time: string | null }) =>
        `• ${e.title} — ${e.city}, ${e.event_date ?? 'TBD'} at ${e.event_time ?? 'TBD'}`
      ).join('\n');
      return `Upcoming events${cityMention ? ` in ${cityMention}` : ''}:\n${list}`;
    }
    return cityMention
      ? `No upcoming events in ${cityMention} right now.`
      : 'No upcoming events right now.';
  }

  /* ── what rank am I ─────────────────────────────────── */
  if (/(my rank|what rank|what tier|my tier)/.test(q)) {
    if (!userId) return "Sign in to check your rank. Your tier is based on how many events you've hosted.";
    const { data } = await supabase.from('profiles').select('tier, display_name').eq('id', userId).maybeSingle();
    if (data) return `You're ${data.display_name}, currently at the ${data.tier} tier. Ranks: Ember (0-4 events) → Iron (5-14) → Gold (15-29) → Platinum (30-49) → Legend (50+).`;
    return "I couldn't find your profile. Try signing out and back in.";
  }

  /* ── attendee count for my event ───────────────────── */
  if (/(how many.*join|attendee|people.*event|my event)/.test(q)) {
    if (!userId) return "Sign in to check your event stats.";
    const { data } = await supabase
      .from('events')
      .select('title, id')
      .eq('host_user_id', userId)
      .order('event_date', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!data) return "You haven't hosted any events yet. Head to /hosts/new to create one.";
    const { count } = await supabase
      .from('event_attendees').select('*', { count: 'exact', head: true }).eq('event_id', data.id);
    return `Your event "${data.title}" has ${count ?? 0} attendee${count === 1 ? '' : 's'} (including you as host).`;
  }

  /* ── top cities ─────────────────────────────────────── */
  if (/(top cit|popular cit|most event|where.*most|busiest)/.test(q)) {
    const { data } = await supabase.from('events').select('city');
    if (data) {
      const counts: Record<string, number> = {};
      for (const row of data as { city: string | null }[]) {
        if (row.city) counts[row.city] = (counts[row.city] ?? 0) + 1;
      }
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
      if (top.length === 0) return 'No events yet. Host the first one!';
      const list = top.map(([city, count]) => `• ${city}: ${count} event${count === 1 ? '' : 's'}`).join('\n');
      return `Top cities right now:\n${list}`;
    }
  }

  /* ── static knowledge ───────────────────────────────── */
  if (/(price|cost|how much|€|euro|pay)/.test(q))
    return 'The Vault is €15/month or €99/year (save 45%). Discovering and joining events is always free.';
  if (/(host|create|start).*(event|bbq|grill)|how do i host/.test(q))
    return 'To host: go to the Events page → Create Event, set a location, date, theme and capacity, then publish. Hosting is always free.';
  if (/(vault|membership|subscribe|join vault)/.test(q))
    return 'The Vault unlocks exclusive recipes, live masterclasses, the Ember Network, The Board, partner deals, Council voting, and Annual Summit access. €15/mo or €99/yr.';
  if (/(private|request|invite|approve)/.test(q))
    return "Private events require host approval. Tap 'Request to Join' — once accepted, the full address is revealed.";
  if (/(summit|annual summit)/.test(q))
    return 'The Annual Summit is one city, one weekend — the whole community. Location revealed exclusively to Vault members.';
  if (/(rank|tier|board|iron|gold|legend|platinum|ember rank)/.test(q))
    return 'The Board has 5 tiers — Ember (0-4 events), Iron (5-14), Gold (15-29), Platinum (30-49), Legend (50+). Rank is based on events you\'ve hosted.';
  if (/(contact|support|help|email|problem|issue)/.test(q))
    return 'Reach the team at emberworldwide@gmail.com or use the Contact page. We reply within 48 hours.';
  if (/(cancel|refund|billing)/.test(q))
    return 'Cancel any time from Account → Billing. Access continues until the end of your billing period.';
  if (/(hello|hi|hey|yo)\b/.test(q))
    return 'Welcome to the fire. Ask about events, rankings, cities, hosting, or the Vault.';

  return "I can help with events, hosting, rankings, cities, and the Vault. Try: 'How many events in Amsterdam?' or 'What's my rank?'";
}

export function EmberAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'ember', text: WELCOME }]);
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || thinking) return;
    setInput('');
    setMsgs(m => [...m, { from: 'user', text }]);
    setThinking(true);
    try {
      const reply = await liveReply(text, user?.id ?? null);
      setMsgs(m => [...m, { from: 'ember', text: reply }]);
    } finally {
      setThinking(false);
    }
  }, [input, thinking, user?.id]);

  return (
    <>
      {/* Launcher */}
      <button
        aria-label="Open Ember assistant"
        onClick={() => setOpen(o => !o)}
        style={{ position: 'fixed', right: '22px', bottom: '22px', zIndex: 9998, width: '54px', height: '54px', borderRadius: '50%', border: '1px solid rgba(228,207,179,0.18)', background: 'linear-gradient(160deg, #8a0f0f 0%, #5a0000 100%)', color: '#F5EDE0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 30px rgba(128,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)', transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = '0 10px 38px rgba(128,0,0,0.6)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(128,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)'; }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            role="dialog" aria-label="Ember assistant"
            style={{ position: 'fixed', right: '22px', bottom: '88px', zIndex: 9998, width: 'min(360px, calc(100vw - 44px))', height: 'min(520px, calc(100vh - 130px))', display: 'flex', flexDirection: 'column', background: 'rgba(14,11,12,0.92)', backdropFilter: 'blur(24px) saturate(1.4)', WebkitBackdropFilter: 'blur(24px) saturate(1.4)', border: '1px solid rgba(245,237,224,0.09)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 24px 70px rgba(0,0,0,0.55)' }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 18px', borderBottom: '1px solid rgba(245,237,224,0.07)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(128,0,0,0.3)', border: '1px solid rgba(128,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={15} style={{ color: '#E4CFB3' }} />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff', lineHeight: 1.1 }}>Ember Assistant</p>
                <p className="mono" style={{ color: '#5A5A5A', fontSize: '10px', letterSpacing: '0.06em' }}>Live platform data</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', background: m.from === 'user' ? 'var(--maroon, #800000)' : 'rgba(245,237,224,0.05)', color: m.from === 'user' ? '#fff' : '#C8C2B8', border: m.from === 'user' ? 'none' : '1px solid rgba(245,237,224,0.07)', borderRadius: m.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', padding: '11px 14px', fontSize: '13.5px', lineHeight: 1.55, whiteSpace: 'pre-line' }}>
                  {m.text}
                </div>
              ))}
              {thinking && (
                <div style={{ alignSelf: 'flex-start', background: 'rgba(245,237,224,0.05)', border: '1px solid rgba(245,237,224,0.07)', borderRadius: '14px 14px 14px 4px', padding: '11px 14px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#5A5A5A', animation: 'pulse-dot 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: '14px', borderTop: '1px solid rgba(245,237,224,0.07)', display: 'flex', gap: '8px' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') send(); }}
                placeholder="Ask Ember…"
                style={{ flex: 1, background: 'rgba(245,237,224,0.04)', border: '1px solid rgba(245,237,224,0.09)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '13.5px', outline: 'none', fontFamily: 'var(--font-body, inherit)' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(128,0,0,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(245,237,224,0.09)')}
              />
              <button
                aria-label="Send"
                onClick={send}
                disabled={!input.trim() || thinking}
                style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '10px', border: 'none', cursor: input.trim() && !thinking ? 'pointer' : 'not-allowed', background: input.trim() && !thinking ? 'var(--maroon, #800000)' : 'rgba(255,255,255,0.06)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
