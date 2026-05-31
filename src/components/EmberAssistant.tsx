import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Flame } from 'lucide-react';

/**
 * Global Ember AI help assistant — floating bottom-left.
 *
 * This is the platform-wide help assistant (distinct from the event-specific
 * Ember AI panel on each event detail page).
 *
 * Responses are currently rule-based placeholders. When a real AI backend is
 * connected, replace `placeholderReply()` with a fetch to the assistant API.
 */

interface Msg {
  from: 'user' | 'ember';
  text: string;
}

const WELCOME =
  'Ask Ember anything about events, hosting, or the platform.';

/* Lightweight keyword responder — stands in until the AI backend is wired. */
function placeholderReply(input: string): string {
  const q = input.toLowerCase();

  if (/(price|cost|how much|€|euro|pay)/.test(q))
    return 'The Vault is €15/month or €99/year (save 45%). Discovering and joining events is always free. Head to the Vault page to join.';
  if (/(host|create|start).*(event|bbq|grill)|how do i host/.test(q))
    return 'To host: open "Host an Event", set a location, date, theme and capacity, then publish. Your event goes live for members to find. Hosting is always free.';
  if (/(vault|membership|subscribe|join)/.test(q))
    return 'The Vault unlocks exclusive recipes, live masterclasses, the Brotherhood Network, The Board, partner deals, Council voting, and Annual Summit access. €15/mo or €99/yr.';
  if (/(private|request|invite|approve)/.test(q))
    return 'Private events require host approval. You tap "Request to Join", and the host accepts or declines. The full address is only revealed once you\'re accepted.';
  if (/(summit|annual)/.test(q))
    return 'The Annual Summit is one city, one weekend, the whole brotherhood. Location is revealed exclusively to Vault members — your subscription is your ticket.';
  if (/(rank|tier|board|iron|gold|legend|ember)/.test(q))
    return 'The Board has four tiers — Ember, Iron, Gold, Legend — earned through hosting events and contributing. New members start at Iron.';
  if (/(contact|support|help|email|problem|issue)/.test(q))
    return 'You can reach the team any time at emberworldwide@gmail.com, or use the Contact page. We reply within 48 hours.';
  if (/(cancel|refund|billing)/.test(q))
    return 'You can cancel any time from your Account → Billing. Access continues until the end of your current billing period.';
  if (/(hello|hi|hey|yo)\b/.test(q))
    return 'Welcome to the fire. Ask me about events, hosting, the Vault, or anything Ember.';

  return "I'm Ember's assistant. I can help with events, hosting, the Vault, pricing, and getting around the platform. For anything else, reach the team at emberworldwide@gmail.com.";
}

export function EmberAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'ember', text: WELCOME }]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMsgs(m => [...m, { from: 'user', text }]);
    // Simulate a short think before the placeholder reply
    setTimeout(() => {
      setMsgs(m => [...m, { from: 'ember', text: placeholderReply(text) }]);
    }, 450);
  };

  return (
    <>
      {/* Launcher button */}
      <button
        aria-label="Open Ember assistant"
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          left: '22px',
          bottom: '22px',
          zIndex: 9998,
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          border: '1px solid rgba(228,207,179,0.18)',
          background: 'linear-gradient(160deg, #8a0f0f 0%, #5a0000 100%)',
          color: '#F5EDE0',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(128,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s',
        }}
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
            role="dialog"
            aria-label="Ember assistant"
            style={{
              position: 'fixed',
              left: '22px',
              bottom: '88px',
              zIndex: 9998,
              width: 'min(360px, calc(100vw - 44px))',
              height: 'min(520px, calc(100vh - 130px))',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(14,11,12,0.92)',
              backdropFilter: 'blur(24px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
              border: '1px solid rgba(245,237,224,0.09)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 24px 70px rgba(0,0,0,0.55)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 18px', borderBottom: '1px solid rgba(245,237,224,0.07)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(128,0,0,0.3)', border: '1px solid rgba(128,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={15} style={{ color: '#E4CFB3' }} />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff', lineHeight: 1.1 }}>Ember Assistant</p>
                <p className="mono" style={{ color: '#5A5A5A', fontSize: '10px', letterSpacing: '0.06em' }}>Always by the fire</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {msgs.map((m, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: m.from === 'user' ? 'var(--maroon, #800000)' : 'rgba(245,237,224,0.05)',
                    color: m.from === 'user' ? '#fff' : '#C8C2B8',
                    border: m.from === 'user' ? 'none' : '1px solid rgba(245,237,224,0.07)',
                    borderRadius: m.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    padding: '11px 14px',
                    fontSize: '13.5px',
                    lineHeight: 1.55,
                  }}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '14px', borderTop: '1px solid rgba(245,237,224,0.07)', display: 'flex', gap: '8px' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') send(); }}
                placeholder="Ask Ember…"
                style={{
                  flex: 1,
                  background: 'rgba(245,237,224,0.04)',
                  border: '1px solid rgba(245,237,224,0.09)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '13.5px',
                  outline: 'none',
                  fontFamily: 'var(--font-body, inherit)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(128,0,0,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(245,237,224,0.09)')}
              />
              <button
                aria-label="Send"
                onClick={send}
                style={{
                  width: '40px', height: '40px', flexShrink: 0,
                  borderRadius: '10px', border: 'none', cursor: 'pointer',
                  background: 'var(--maroon, #800000)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
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
