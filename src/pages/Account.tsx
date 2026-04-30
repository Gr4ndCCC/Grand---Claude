import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, CreditCard, Calendar, Settings,
  LogOut, Check, Crown, ChevronRight,
  Shield, Flame, Clock, Plus,
} from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useAuth } from '../lib/auth';
import { getAllEvents } from '../data/events';

type Tab = 'profile' | 'billing' | 'events' | 'settings';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile',  label: 'Profile',  icon: User       },
  { id: 'billing',  label: 'Billing',  icon: CreditCard },
  { id: 'events',   label: 'Events',   icon: Calendar   },
  { id: 'settings', label: 'Settings', icon: Settings   },
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
        display: 'inline-flex', alignItems: 'center',
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
      <div>
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
            style={{ background: '#1A1A1A', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', width: '200px' }}
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
  const since = user.subSince ? new Date(user.subSince).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
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
  const attended = allEvents.filter(e => e.attendees.some(a => a.name === user.name));
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
  const [emailEvents,    setEmailEvents]    = useState(true);
  const [emailWeekly,    setEmailWeekly]    = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(false);
  const [pushEvents,     setPushEvents]     = useState(true);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <SCard title="Notifications" subtitle="How we reach you">
        <Row label="Event reminders" desc="Day-before and day-of reminders for events you're attending">
          <Toggle checked={emailEvents} onChange={setEmailEvents} />
        </Row>
        <Row label="Weekly digest" desc="What's happening in your cities this week">
          <Toggle checked={emailWeekly} onChange={setEmailWeekly} />
        </Row>
        <Row label="Offers & news" desc="Occasional emails about new features and partner deals">
          <Toggle checked={emailMarketing} onChange={setEmailMarketing} />
        </Row>
        <Row label="Push notifications" desc="Browser push for chat messages and RSVPs">
          <Toggle checked={pushEvents} onChange={setPushEvents} />
        </Row>
      </SCard>

      <SCard title="Security">
        <Row label="Change password" desc="You'll receive a reset link by email">
          <button style={{ background: 'rgba(255,255,255,0.06)', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>
            Send reset link
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
    profile:  <ProfileTab />,
    billing:  <BillingTab />,
    events:   <EventsTab />,
    settings: <SettingsTab />,
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
            {/* Sidebar */}
            <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', position: 'sticky', top: '90px' }}>
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '14px 18px',
                    background: tab === id ? 'rgba(128,0,0,0.12)' : 'transparent',
                    borderLeft: tab === id ? '3px solid var(--maroon)' : '3px solid transparent',
                    border: 'none', cursor: 'pointer',
                    color: tab === id ? '#fff' : '#A0A0A0',
                    fontSize: '14px', fontFamily: 'inherit',
                    transition: 'all 0.15s', textAlign: 'left',
                  }}
                >
                  <Icon size={15} style={{ flexShrink: 0 }} />
                  {label}
                  {tab === id && <ChevronRight size={12} style={{ marginLeft: 'auto', color: 'var(--maroon)' }} />}
                </button>
              ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {CONTENT[tab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
      <Footer />
      <style>{`@media(max-width:700px){.account-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
