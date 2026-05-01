import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, CreditCard, Calendar, Settings,
  LogOut, Check, Crown, ChevronRight,
  Shield, Flame, Clock, Plus,
  Globe, Palette, Bell, Mic, Monitor, Lock,
} from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useAuth } from '../lib/auth';
import { getAllEvents } from '../data/events';

type Tab =
  | 'profile' | 'billing' | 'events' | 'settings'
  | 'general' | 'personalization' | 'notifications' | 'speech' | 'appearance' | 'privacy';

const ACCOUNT_TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile',  label: 'Profile',  icon: User       },
  { id: 'billing',  label: 'Billing',  icon: CreditCard },
  { id: 'events',   label: 'Events',   icon: Calendar   },
  { id: 'settings', label: 'Settings', icon: Settings   },
];

const PREF_TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'general',         label: 'General',         icon: Globe    },
  { id: 'personalization', label: 'Personalization', icon: Palette  },
  { id: 'notifications',   label: 'Notifications',   icon: Bell     },
  { id: 'speech',          label: 'Speech',          icon: Mic      },
  { id: 'appearance',      label: 'Appearance',      icon: Monitor  },
  { id: 'privacy',         label: 'Privacy & Data',  icon: Lock     },
];

function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: '44px', height: '24px', borderRadius: '12px', padding: '2px',
        background: checked ? 'var(--maroon)' : 'rgba(255,255,255,0.12)',
        border: 'none', cursor: 'pointer', transition: 'background 0.2s',
        display: 'inline-flex', alignItems: 'center', flexShrink: 0,
      }}
    >
      <div style={{
        width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
        transform: checked ? 'translateX(20px)' : 'translateX(0)',
        transition: 'transform 0.2s',
      }} />
    </button>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: '24px' }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ color: '#fff', fontSize: '14px', marginBottom: desc ? '3px' : 0 }}>{label}</p>
        {desc && <p style={{ color: '#666', fontSize: '12px', lineHeight: 1.5 }}>{desc}</p>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function SCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px', marginBottom: '16px' }}>
      <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px', color: '#fff', marginBottom: subtitle ? '6px' : '20px' }}>{title}</h3>
      {subtitle && <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>{subtitle}</p>}
      {children}
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  background: '#1A1A1A', color: '#fff',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px', padding: '8px 12px',
  fontSize: '13px', outline: 'none',
  fontFamily: 'inherit', cursor: 'pointer',
};

function SegBtn<T extends string>({ options, value, onChange }: {
  options: readonly T[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          style={{
            background: value === o ? 'var(--maroon)' : 'rgba(255,255,255,0.06)',
            color: value === o ? '#fff' : '#A0A0A0',
            border: 'none', borderRadius: '6px',
            padding: '6px 14px', cursor: 'pointer',
            fontSize: '13px', fontFamily: 'inherit', textTransform: 'capitalize',
          }}
        >{o}</button>
      ))}
    </div>
  );
}

/* ─── Tab components ─────────────────────────────────────── */

function ProfileTab() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? '');
  const [saved, setSaved] = useState(false);
  if (!user) return null;
  const status = user.verifyStatus ?? 'unverified';
  const save = () => {
    updateUser({ name: name.trim() || user.name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <>
      <SCard title="Your identity" subtitle="How the brotherhood sees you">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', color: '#fff', flexShrink: 0 }}>
            {initials(user.name)}
          </div>
          <div>
            <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '18px', color: '#fff' }}>{user.name}</p>
            <p style={{ color: '#666', fontSize: '13px' }}>{user.email}</p>
          </div>
        </div>
        <Row label="Display name" desc="Shown to other members on the platform">
          <input value={name} onChange={e => setName(e.target.value)}
            style={{ background: '#1A1A1A', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', width: '180px' }}
          />
        </Row>
        <Row label="Email address">
          <span style={{ color: '#666', fontSize: '13px' }}>{user.email}</span>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button onClick={save}
            style={{ background: saved ? 'rgba(34,197,94,0.15)' : 'var(--maroon)', color: saved ? '#4ade80' : '#fff', border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none', borderRadius: '8px', padding: '9px 20px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
          >{saved ? <><Check size={13} /> Saved</> : 'Save changes'}</button>
        </div>
      </SCard>

      <SCard title="Identity verification">
        {status === 'unverified' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(128,0,0,0.10)', border: '1px solid rgba(128,0,0,0.25)', borderRadius: '10px', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={18} style={{ color: 'var(--maroon)', flexShrink: 0 }} />
              <div>
                <p style={{ color: '#fff', fontSize: '14px', marginBottom: '3px' }}>Verify your identity</p>
                <p style={{ color: '#666', fontSize: '12px' }}>Required for Vault access and Brotherhood Network features.</p>
              </div>
            </div>
            <button onClick={() => navigate('/verify')}
              style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
            >Start <ChevronRight size={13} /></button>
          </div>
        )}
        {status === 'pending' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(218,165,32,0.08)', border: '1px solid rgba(218,165,32,0.25)', borderRadius: '10px' }}>
            <Clock size={18} style={{ color: '#DAA520', flexShrink: 0 }} />
            <div>
              <p style={{ color: '#DAA520', fontSize: '14px', marginBottom: '3px' }}>Verification under review</p>
              <p style={{ color: '#666', fontSize: '12px' }}>Usually approved within 24 hours.</p>
            </div>
          </div>
        )}
        {status === 'verified' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px' }}>
            <Check size={18} style={{ color: '#4ade80', flexShrink: 0 }} />
            <p style={{ color: '#4ade80', fontSize: '14px' }}>Identity verified — full access enabled.</p>
          </div>
        )}
      </SCard>
    </>
  );
}

function BillingTab() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  const active = user.subActive;
  const plan = user.subPlan;
  const since = user.subSince
    ? new Date(user.subSince).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  return (
    <>
      <SCard title="Current plan" subtitle="Your active Ember membership">
        {active && plan ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(128,0,0,0.10)', border: '1px solid rgba(128,0,0,0.25)', borderRadius: '10px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={18} style={{ color: '#fff' }} />
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>
                  Vault {plan === 'annual' ? 'Annual' : 'Monthly'} · {plan === 'annual' ? '€99/yr' : '€15/mo'}
                </p>
                {since && <p style={{ color: '#666', fontSize: '12px' }}>Member since {since}</p>}
              </div>
            </div>
            <span style={{ color: '#4ade80', background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.20)', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>Active</span>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Crown size={20} style={{ color: '#5A5A5A' }} />
            </div>
            <p style={{ color: '#A0A0A0', fontSize: '14px', marginBottom: '16px' }}>No active membership</p>
            <button onClick={() => navigate('/vault')}
              style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit' }}
            >Join the Vault</button>
          </div>
        )}
      </SCard>
      <SCard title="Invoices" subtitle="Your payment history">
        {active ? (
          <div>
            {[
              { date: 'Apr 1, 2026', amount: plan === 'annual' ? '€99.00' : '€15.00' },
              { date: 'Mar 1, 2026', amount: '€15.00' },
            ].map((inv, i, arr) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div>
                  <p style={{ color: '#fff', fontSize: '13px' }}>Vault membership</p>
                  <p style={{ color: '#666', fontSize: '11px', marginTop: '2px' }}>{inv.date}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#A0A0A0', fontSize: '13px' }}>{inv.amount}</span>
                  <span style={{ color: '#4ade80', fontSize: '10px', background: 'rgba(34,197,94,0.08)', borderRadius: '4px', padding: '2px 7px', fontFamily: 'JetBrains Mono, monospace' }}>Paid</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#5A5A5A', fontSize: '13px', textAlign: 'center', padding: '24px' }}>No invoices yet.</p>
        )}
      </SCard>
    </>
  );
}

function EventsTab() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const allEvents = getAllEvents();
  if (!user) return null;
  const attended = allEvents.filter(e => e.attendees.some((a: { name: string }) => a.name === user.name));
  const hosted   = allEvents.filter(e => e.host === user.name);

  const ERow = ({ ev, badge }: { ev: typeof allEvents[0]; badge: string }) => (
    <div onClick={() => navigate(`/events/${ev.id}`)}
      style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', cursor: 'pointer', transition: 'background 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
    >
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: ev.coverColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{ev.flag}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#fff', fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</p>
        <p style={{ color: '#666', fontSize: '11px', marginTop: '2px' }}>{ev.date} · {ev.city}</p>
      </div>
      <span style={{ fontSize: '10px', color: '#A0A0A0', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', padding: '3px 7px', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>{badge}</span>
    </div>
  );

  return (
    <>
      <SCard title="Attending" subtitle={`${attended.length} event${attended.length !== 1 ? 's' : ''}`}>
        {attended.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <p style={{ color: '#5A5A5A', fontSize: '13px', marginBottom: '12px' }}>No events joined yet.</p>
            <button onClick={() => navigate('/events')} style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>Browse events</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {attended.map(ev => <ERow key={ev.id} ev={ev} badge="Attending" />)}
          </div>
        )}
      </SCard>
      <SCard title="Hosting" subtitle={`${hosted.length} event${hosted.length !== 1 ? 's' : ''}`}>
        {hosted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <p style={{ color: '#5A5A5A', fontSize: '13px', marginBottom: '12px' }}>You haven't hosted any events yet.</p>
            <button onClick={() => navigate('/hosts/new')} style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={13} /> Create event
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {hosted.map(ev => <ERow key={ev.id} ev={ev} badge="Host" />)}
          </div>
        )}
      </SCard>
    </>
  );
}

function SettingsTab() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <SCard title="Security">
        <Row label="Change password" desc="You'll receive a reset link by email">
          <button style={{ background: 'rgba(255,255,255,0.06)', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>
            Send reset link
          </button>
        </Row>
        <Row label="Two-factor authentication" desc="Add an extra layer of security to your account">
          <button style={{ background: 'rgba(255,255,255,0.06)', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>
            Enable
          </button>
        </Row>
      </SCard>
      <SCard title="Danger zone">
        <Row label="Sign out">
          <button onClick={() => { signOut(); navigate('/'); }}
            style={{ background: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          ><LogOut size={12} /> Sign out</button>
        </Row>
        <Row label="Delete account" desc="Permanently remove all your data. This cannot be undone.">
          <button style={{ background: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>
            Delete
          </button>
        </Row>
      </SCard>
    </>
  );
}

function GeneralTab() {
  const [language,   setLanguage]   = useState('English');
  const [timezone,   setTimezone]   = useState('UTC+0 London');
  const [tempUnit,   setTempUnit]   = useState<'C' | 'F'>('C');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  return (
    <SCard title="General" subtitle="Regional and display preferences">
      <Row label="Language" desc="Interface language across the platform">
        <select value={language} onChange={e => setLanguage(e.target.value)} style={selectStyle}>
          {['English', 'French', 'Spanish', 'German', 'Portuguese', 'Italian', 'Dutch'].map(l => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </Row>
      <Row label="Timezone" desc="Used for event times and reminders">
        <select value={timezone} onChange={e => setTimezone(e.target.value)} style={selectStyle}>
          {['UTC-5 New York', 'UTC+0 London', 'UTC+1 Amsterdam', 'UTC+3 Istanbul', 'UTC+9 Tokyo', 'UTC+10 Sydney', 'UTC-3 São Paulo'].map(tz => (
            <option key={tz}>{tz}</option>
          ))}
        </select>
      </Row>
      <Row label="Temperature unit" desc="Shown on event weather cards">
        <SegBtn options={['C', 'F'] as const} value={tempUnit} onChange={setTempUnit} />
      </Row>
      <Row label="Date format">
        <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} style={selectStyle}>
          {['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map(f => <option key={f}>{f}</option>)}
        </select>
      </Row>
    </SCard>
  );
}

function PersonalizationTab() {
  const [accent,          setAccent]          = useState('#800000');
  const [defaultView,     setDefaultView]     = useState<'grid' | 'list'>('grid');
  const [emojiReactions,  setEmojiReactions]  = useState(true);
  const [recommendations, setRecommendations] = useState(true);

  const ACCENTS = ['#800000', '#1e3a5f', '#1a4a2e', '#3d2a4a', '#4a3a1a', '#2e2e2e'];
  return (
    <SCard title="Personalization" subtitle="Tailor the Ember experience to you">
      <Row label="Accent colour" desc="Highlights throughout the interface">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {ACCENTS.map(c => (
            <button key={c} onClick={() => setAccent(c)}
              style={{ width: '26px', height: '26px', borderRadius: '50%', background: c, border: accent === c ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer', outline: 'none', flexShrink: 0 }}
            />
          ))}
        </div>
      </Row>
      <Row label="Default events view" desc="How events are displayed when you first visit">
        <SegBtn options={['grid', 'list'] as const} value={defaultView} onChange={setDefaultView} />
      </Row>
      <Row label="Emoji reactions" desc="React to menu items and chat messages with emoji">
        <Toggle checked={emojiReactions} onChange={setEmojiReactions} />
      </Row>
      <Row label="Event recommendations" desc="Suggested events based on your history and location">
        <Toggle checked={recommendations} onChange={setRecommendations} />
      </Row>
    </SCard>
  );
}

function NotificationsTab() {
  const [emailEvents,    setEmailEvents]    = useState(true);
  const [emailWeekly,    setEmailWeekly]    = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(false);
  const [push,           setPush]           = useState(true);
  const [chatNotifs,     setChatNotifs]     = useState(true);
  const [rsvpNotifs,     setRsvpNotifs]     = useState(true);
  const [hostNotifs,     setHostNotifs]     = useState(true);
  return (
    <>
      <SCard title="Email" subtitle="Control what we send to your inbox">
        <Row label="Event reminders" desc="Day-before and day-of reminders for events you're attending">
          <Toggle checked={emailEvents} onChange={setEmailEvents} />
        </Row>
        <Row label="Weekly digest" desc="What's happening in your cities this week">
          <Toggle checked={emailWeekly} onChange={setEmailWeekly} />
        </Row>
        <Row label="Offers & news" desc="Occasional emails about new features and partner deals">
          <Toggle checked={emailMarketing} onChange={setEmailMarketing} />
        </Row>
      </SCard>
      <SCard title="Push notifications" subtitle="Browser and mobile push alerts">
        <Row label="Enable push" desc="Allow Ember to send browser push notifications">
          <Toggle checked={push} onChange={setPush} />
        </Row>
        <Row label="Chat messages" desc="When someone replies in an event chat you're part of">
          <Toggle checked={chatNotifs} onChange={setChatNotifs} />
        </Row>
        <Row label="New RSVPs" desc="When someone joins an event you're hosting">
          <Toggle checked={rsvpNotifs} onChange={setRsvpNotifs} />
        </Row>
        <Row label="Host announcements" desc="Updates from the host of events you're attending">
          <Toggle checked={hostNotifs} onChange={setHostNotifs} />
        </Row>
      </SCard>
    </>
  );
}

function SpeechTab() {
  const [voiceCommands, setVoiceCommands] = useState(false);
  const [speechLang,    setSpeechLang]    = useState('English');
  const [speechToText,  setSpeechToText]  = useState(false);
  return (
    <SCard title="Speech" subtitle="Voice and audio input preferences">
      <Row label="Voice commands" desc="Navigate and RSVP using voice (requires microphone permission)">
        <Toggle checked={voiceCommands} onChange={setVoiceCommands} />
      </Row>
      <Row label="Speech language" desc="Language used for voice recognition">
        <select value={speechLang} onChange={e => setSpeechLang(e.target.value)}
          style={{ ...selectStyle, opacity: voiceCommands ? 1 : 0.4 }} disabled={!voiceCommands}
        >
          {['English', 'French', 'Spanish', 'German', 'Portuguese', 'Japanese', 'Arabic'].map(l => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </Row>
      <Row label="Speech-to-text in chat" desc="Dictate chat messages using your microphone">
        <Toggle checked={speechToText} onChange={setSpeechToText} />
      </Row>
    </SCard>
  );
}

function AppearanceTab() {
  const [theme,        setTheme]        = useState<'dark' | 'light' | 'system'>('dark');
  const [fontSize,     setFontSize]     = useState<'small' | 'medium' | 'large'>('medium');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [compact,      setCompact]      = useState(false);
  return (
    <SCard title="Appearance" subtitle="Customise how Ember looks">
      <Row label="Theme">
        <SegBtn options={['dark', 'light', 'system'] as const} value={theme} onChange={setTheme} />
      </Row>
      <Row label="Font size">
        <SegBtn options={['small', 'medium', 'large'] as const} value={fontSize} onChange={setFontSize} />
      </Row>
      <Row label="Reduce motion" desc="Disable animations and page transitions">
        <Toggle checked={reduceMotion} onChange={setReduceMotion} />
      </Row>
      <Row label="Compact mode" desc="Tighter spacing throughout the interface">
        <Toggle checked={compact} onChange={setCompact} />
      </Row>
    </SCard>
  );
}

function PrivacyTab() {
  const [profileVisible, setProfileVisible] = useState<'public' | 'members' | 'private'>('members');
  const [showEvents,     setShowEvents]     = useState(true);
  const [analytics,      setAnalytics]      = useState(true);
  return (
    <>
      <SCard title="Privacy" subtitle="Control who can see your information">
        <Row label="Profile visibility" desc="Who can view your profile and rank">
          <select value={profileVisible}
            onChange={e => setProfileVisible(e.target.value as 'public' | 'members' | 'private')}
            style={selectStyle}
          >
            <option value="public">Public — anyone</option>
            <option value="members">Members only</option>
            <option value="private">Private</option>
          </select>
        </Row>
        <Row label="Show attending events" desc="Display upcoming events on your public profile">
          <Toggle checked={showEvents} onChange={setShowEvents} />
        </Row>
        <Row label="Usage analytics" desc="Share anonymous data to help improve Ember">
          <Toggle checked={analytics} onChange={setAnalytics} />
        </Row>
      </SCard>
      <SCard title="Your data" subtitle="Manage and export your personal data">
        <Row label="Export data" desc="Download a copy of all your Ember data as JSON">
          <button style={{ background: 'rgba(255,255,255,0.06)', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>Export</button>
        </Row>
        <Row label="Cookie preferences" desc="Manage which cookies Ember stores on this device">
          <button style={{ background: 'rgba(255,255,255,0.06)', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>Manage</button>
        </Row>
      </SCard>
    </>
  );
}

function TabBtn({ label, icon: Icon, active, onClick }: {
  id?: Tab; label: string; icon: React.ElementType; active: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
        padding: '13px 18px',
        background: active ? 'rgba(128,0,0,0.12)' : 'transparent',
        borderLeft: active ? '3px solid var(--maroon)' : '3px solid transparent',
        border: 'none', cursor: 'pointer',
        color: active ? '#fff' : '#A0A0A0',
        fontSize: '13px', fontFamily: 'inherit',
        transition: 'all 0.15s', textAlign: 'left',
      }}
    >
      <Icon size={14} style={{ flexShrink: 0 }} />
      {label}
      {active && <ChevronRight size={11} style={{ marginLeft: 'auto', color: 'var(--maroon)' }} />}
    </button>
  );
}

export function Account() {
  const { user, openAuth, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('profile');

  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams(location.search);
    if (params.get('checkout') !== 'success') return;

    const planParam = params.get('plan');
    const pendingPlan = sessionStorage.getItem('ember_pending_plan');
    const plan = planParam === 'monthly' || planParam === 'annual'
      ? planParam
      : pendingPlan === 'monthly' || pendingPlan === 'annual'
        ? pendingPlan
        : 'annual';

    updateUser({ subPlan: plan, subActive: true, subSince: Date.now() });
    sessionStorage.removeItem('ember_pending_plan');
    setTab('billing');
    navigate('/account', { replace: true });
  }, [location.search, navigate, updateUser, user]);

  if (!user) {
    return (
      <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
        <Nav />
        <div style={{ padding: '160px 24px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(128,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <User size={24} style={{ color: 'var(--maroon)' }} />
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '40px', marginBottom: '12px' }}>Sign in to your account</h1>
          <p style={{ color: '#A0A0A0', marginBottom: '24px' }}>Access your profile, billing and event history.</p>
          <button onClick={() => openAuth()}
            style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 28px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '15px', fontWeight: 600 }}
          >Sign in</button>
        </div>
        <Footer />
      </div>
    );
  }

  const CONTENT: Record<Tab, React.ReactNode> = {
    profile:         <ProfileTab />,
    billing:         <BillingTab />,
    events:          <EventsTab />,
    settings:        <SettingsTab />,
    general:         <GeneralTab />,
    personalization: <PersonalizationTab />,
    notifications:   <NotificationsTab />,
    speech:          <SpeechTab />,
    appearance:      <AppearanceTab />,
    privacy:         <PrivacyTab />,
  };

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />
      <section style={{ paddingTop: '100px', paddingBottom: '80px' }}>
        <div className="page-container">
          <div style={{ marginBottom: '32px' }}>
            <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '6px' }}>Settings</p>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(36px, 5vw, 56px)', color: '#fff', lineHeight: 1.06 }}>Account</h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '220px minmax(0,1fr)', gap: '24px', alignItems: 'start' }} className="account-grid">
            <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', position: 'sticky', top: '90px' }}>
              <div style={{ padding: '12px 18px 4px', fontSize: '10px', color: '#444', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Account</div>
              {ACCOUNT_TABS.map(t => <TabBtn key={t.id} {...t} active={tab === t.id} onClick={() => setTab(t.id)} />)}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '6px 0' }} />
              <div style={{ padding: '8px 18px 4px', fontSize: '10px', color: '#444', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Preferences</div>
              {PREF_TABS.map(t => <TabBtn key={t.id} {...t} active={tab === t.id} onClick={() => setTab(t.id)} />)}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {CONTENT[tab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
      <Footer />
      <style>{`@media(max-width:700px){.account-grid{grid-template-columns:1fr!important;}.account-grid>div:first-child{position:static!important;}}`}</style>
    </div>
  );
}
