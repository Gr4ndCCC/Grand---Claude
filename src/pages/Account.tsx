import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings, Palette, Bell, Mic, Eye, Shield,
  LogOut, ChevronRight, User, Globe, Moon,
  Volume2, Trash2, Download, ToggleLeft, ToggleRight,
  CheckCircle2, Clock, AlertTriangle,
} from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { useAuth } from '../lib/auth';

type Section =
  | 'general'
  | 'personalization'
  | 'notifications'
  | 'speech'
  | 'appearance'
  | 'privacy';

const SECTIONS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'general',         label: 'General',         icon: Settings  },
  { id: 'personalization', label: 'Personalization', icon: Palette   },
  { id: 'notifications',   label: 'Notifications',   icon: Bell      },
  { id: 'speech',          label: 'Speech',          icon: Mic       },
  { id: 'appearance',      label: 'Appearance',      icon: Eye       },
  { id: 'privacy',         label: 'Privacy & Data',  icon: Shield    },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: checked ? 'var(--maroon)' : '#444' }}
    >
      {checked ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
    </button>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: '24px' }}>
      <div>
        <p style={{ color: '#fff', fontSize: '14px', marginBottom: desc ? '3px' : 0 }}>{label}</p>
        {desc && <p style={{ color: '#666', fontSize: '12px' }}>{desc}</p>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: '#1A1A1A', color: '#fff', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '8px', padding: '8px 12px', fontSize: '13px',
        fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
      }}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function DangerBtn({ label, icon: Icon, onClick }: { label: string; icon: React.ElementType; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'rgba(180,30,30,0.1)', color: '#cc4444',
        border: '1px solid rgba(180,30,30,0.25)', borderRadius: '8px',
        padding: '10px 16px', cursor: 'pointer', fontSize: '13px',
        fontFamily: 'inherit', transition: 'all 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(180,30,30,0.2)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(180,30,30,0.1)'; }}
    >
      <Icon size={14} />{label}
    </button>
  );
}

function VerificationCard({ status, onAction }: { status: string; onAction: () => void }) {
  const isVerified = status === 'verified';
  const isPending  = status === 'pending';
  const tone =
    isVerified ? { bg: 'rgba(60,140,80,0.10)', border: 'rgba(60,140,80,0.30)', icon: CheckCircle2, color: '#5cb85c' } :
    isPending  ? { bg: 'rgba(218,165,32,0.10)', border: 'rgba(218,165,32,0.30)', icon: Clock,         color: '#DAA520' } :
                 { bg: 'rgba(128,0,0,0.10)',    border: 'rgba(128,0,0,0.30)',    icon: AlertTriangle, color: 'var(--maroon)' };
  const Icon = tone.icon;
  return (
    <div style={{ background: tone.bg, border: `1px solid ${tone.border}`, borderRadius: '12px', padding: '18px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
      <Icon size={20} style={{ color: tone.color, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: '160px' }}>
        <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>
          {isVerified ? 'Identity verified' : isPending ? 'Verification pending' : 'Verify your identity'}
        </p>
        <p style={{ color: '#888', fontSize: '12px' }}>
          {isVerified ? 'You have full access to the Vault and Brotherhood Network.'
           : isPending ? 'We\'re reviewing your documents. Usually takes 24 hours.'
           : 'Required for Vault access and Brotherhood Network features.'}
        </p>
      </div>
      {!isVerified && !isPending && (
        <button onClick={onAction}
          style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', flexShrink: 0 }}
        >Start →</button>
      )}
    </div>
  );
}

function GeneralSection({ user }: { user: NonNullable<ReturnType<typeof useAuth>['user']> }) {
  const navigate = useNavigate();
  const status = user.verifyStatus ?? 'unverified';

  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '4px' }}>General</h2>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '32px' }}>Account information and preferences</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: '#111', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '24px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={22} style={{ color: '#fff' }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#fff', fontWeight: 500 }}>{user.name}</p>
          <p style={{ color: '#666', fontSize: '13px' }}>{user.email}</p>
        </div>
        {status === 'verified' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(60,140,80,0.12)', border: '1px solid rgba(60,140,80,0.3)', borderRadius: '999px', padding: '4px 10px' }}>
            <CheckCircle2 size={12} style={{ color: '#5cb85c' }} />
            <span className="mono" style={{ color: '#5cb85c', fontSize: '10px' }}>VERIFIED</span>
          </div>
        )}
      </div>

      <VerificationCard status={status} onAction={() => navigate('/verify')} />

      <Row label="Display name" desc="Shown to other members on the platform">
        <input
          defaultValue={user.name}
          style={{ background: '#1A1A1A', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', width: '180px' }}
        />
      </Row>
      <Row label="Email address">
        <span style={{ color: '#666', fontSize: '13px' }}>{user.email}</span>
      </Row>
      <Row label="Language" desc="Platform language">
        <Select value="English" options={['English', 'Español', 'Français', 'Deutsch', 'Italiano', 'Português']} onChange={() => {}} />
      </Row>
      <Row label="Timezone">
        <Select value="UTC+1 Amsterdam" options={['UTC-5 New York', 'UTC+1 Amsterdam', 'UTC+2 Warsaw', 'UTC+9 Tokyo', 'UTC+11 Sydney']} onChange={() => {}} />
      </Row>
      <Row label="Locale" desc="Date, time, and number format">
        <Select value="EU (dd/mm/yyyy)" options={['EU (dd/mm/yyyy)', 'US (mm/dd/yyyy)', 'ISO (yyyy-mm-dd)']} onChange={() => {}} />
      </Row>
    </div>
  );
}

function PersonalizationSection() {
  const [memHistory, setMemHistory] = useState(true);
  const [customInstructions, setCustomInstructions] = useState(false);
  const [showRank, setShowRank] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);

  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '4px' }}>Personalization</h2>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '32px' }}>Control how Ember remembers and displays your activity</p>

      <Row label="Activity history" desc="Ember uses your event history to surface relevant events and hosts">
        <Toggle checked={memHistory} onChange={setMemHistory} />
      </Row>
      <Row label="Custom preferences" desc="Let Ember tailor event recommendations based on your grilling style">
        <Toggle checked={customInstructions} onChange={setCustomInstructions} />
      </Row>
      <Row label="Show Board rank publicly" desc="Display your tier badge on your profile">
        <Toggle checked={showRank} onChange={setShowRank} />
      </Row>
      <Row label="Public profile" desc="Other members can find and view your profile">
        <Toggle checked={publicProfile} onChange={setPublicProfile} />
      </Row>

      <div style={{ marginTop: '32px', padding: '20px', background: '#111', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p style={{ color: '#A0A0A0', fontSize: '14px', marginBottom: '12px' }}>Grilling style</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Charcoal', 'Wood fire', 'Offset smoker', 'Kettle grill', 'Kamado', 'Gas', 'Yakitori', 'Argentine'].map(tag => (
            <button key={tag}
              style={{ background: 'rgba(128,0,0,0.15)', color: 'var(--beige)', border: '1px solid rgba(128,0,0,0.3)', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
            >{tag}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsSection() {
  const [eventsNearby, setEventsNearby] = useState(true);
  const [hostUpdates, setHostUpdates] = useState(true);
  const [vaultReleases, setVaultReleases] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [boardUpdates, setBoardUpdates] = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '4px' }}>Notifications</h2>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '32px' }}>Choose what Ember sends you and how</p>

      <p className="mono" style={{ color: 'var(--maroon)', fontSize: '10px', letterSpacing: '0.1em', marginBottom: '12px' }}>EMAIL</p>
      <Row label="Events near you" desc="New events in your city or region">
        <Toggle checked={eventsNearby} onChange={setEventsNearby} />
      </Row>
      <Row label="Host updates" desc="Changes to events you've RSVP'd to">
        <Toggle checked={hostUpdates} onChange={setHostUpdates} />
      </Row>
      <Row label="Vault releases" desc="New recipes, masterclasses, and content">
        <Toggle checked={vaultReleases} onChange={setVaultReleases} />
      </Row>
      <Row label="Weekly digest" desc="Summary of activity and upcoming events">
        <Toggle checked={weeklyDigest} onChange={setWeeklyDigest} />
      </Row>
      <Row label="Board & rank updates" desc="When you earn or lose a rank tier">
        <Toggle checked={boardUpdates} onChange={setBoardUpdates} />
      </Row>
      <Row label="Promotional emails" desc="Offers from Ember partners">
        <Toggle checked={emailMarketing} onChange={setEmailMarketing} />
      </Row>

      <p className="mono" style={{ color: 'var(--maroon)', fontSize: '10px', letterSpacing: '0.1em', marginBottom: '12px', marginTop: '24px' }}>PUSH</p>
      <Row label="Push notifications" desc="Browser or mobile push alerts">
        <Toggle checked={pushEnabled} onChange={setPushEnabled} />
      </Row>
    </div>
  );
}

function SpeechSection() {
  const [voiceInput, setVoiceInput] = useState(false);
  const [readAloud, setReadAloud] = useState(false);
  const [autoSend, setAutoSend] = useState(false);

  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '4px' }}>Speech</h2>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '32px' }}>Voice input and text-to-speech settings</p>

      <Row label="Voice input" desc="Use microphone to search events and navigate">
        <Toggle checked={voiceInput} onChange={setVoiceInput} />
      </Row>
      <Row label="Read descriptions aloud" desc="Text-to-speech for event details and recipes">
        <Toggle checked={readAloud} onChange={setReadAloud} />
      </Row>
      <Row label="Auto-send voice messages" desc="Send voice queries without pressing confirm">
        <Toggle checked={autoSend} onChange={setAutoSend} />
      </Row>
      <Row label="Voice speed">
        <Select value="Normal" options={['Slow', 'Normal', 'Fast']} onChange={() => {}} />
      </Row>
      <Row label="Voice">
        <Select value="Default" options={['Default', 'Natural', 'Ember (custom)']} onChange={() => {}} />
      </Row>

      <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(128,0,0,0.08)', borderRadius: '10px', border: '1px solid rgba(128,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Volume2 size={14} style={{ color: 'var(--maroon)' }} />
          <p style={{ color: 'var(--beige)', fontSize: '13px', fontWeight: 500 }}>Ember Voice — coming soon</p>
        </div>
        <p style={{ color: '#666', fontSize: '12px' }}>A custom voice trained on real pitmaster voices. Available to Legend-tier members.</p>
      </div>
    </div>
  );
}

function AppearanceSection() {
  const [theme, setTheme] = useState<'dark' | 'auto'>('dark');
  const [compactMode, setCompactMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState('Default');

  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '4px' }}>Appearance</h2>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '32px' }}>Customize how Ember looks for you</p>

      <p className="mono" style={{ color: 'var(--maroon)', fontSize: '10px', letterSpacing: '0.1em', marginBottom: '12px' }}>THEME</p>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {(['dark', 'auto'] as const).map(t => (
          <button key={t} onClick={() => setTheme(t)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: theme === t ? 'rgba(128,0,0,0.15)' : '#111',
              border: theme === t ? '1px solid rgba(128,0,0,0.4)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px', padding: '14px 20px', cursor: 'pointer',
              color: theme === t ? 'var(--beige)' : '#666',
              fontSize: '13px', fontFamily: 'inherit', transition: 'all 0.2s',
            }}
          >
            {t === 'dark' ? <Moon size={14} /> : <Globe size={14} />}
            {t === 'dark' ? 'Dark (default)' : 'System'}
          </button>
        ))}
      </div>

      <Row label="Compact mode" desc="Reduce spacing for denser content">
        <Toggle checked={compactMode} onChange={setCompactMode} />
      </Row>
      <Row label="Reduce motion" desc="Minimize animations across the platform">
        <Toggle checked={reducedMotion} onChange={setReducedMotion} />
      </Row>
      <Row label="Font size">
        <Select value={fontSize} options={['Small', 'Default', 'Large']} onChange={setFontSize} />
      </Row>
    </div>
  );
}

function PrivacySection({ onSignOut }: { onSignOut: () => void }) {
  const [locationSharing, setLocationSharing] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [profileIndexing, setProfileIndexing] = useState(false);

  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: '#fff', marginBottom: '4px' }}>Privacy & Data</h2>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '32px' }}>Control what Ember knows and stores about you</p>

      <Row label="Location sharing" desc="Used to show nearby events and Nearby Now feature">
        <Toggle checked={locationSharing} onChange={setLocationSharing} />
      </Row>
      <Row label="Usage analytics" desc="Help improve Ember by sharing anonymous usage data">
        <Toggle checked={analytics} onChange={setAnalytics} />
      </Row>
      <Row label="Profile search indexing" desc="Let search engines find your public profile">
        <Toggle checked={profileIndexing} onChange={setProfileIndexing} />
      </Row>

      <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p className="mono" style={{ color: '#5A5A5A', fontSize: '10px', letterSpacing: '0.1em' }}>DATA</p>
        <DangerBtn label="Download my data" icon={Download} />
        <DangerBtn label="Clear activity history" icon={Trash2} />
        <DangerBtn label="Delete account" icon={Trash2} />
      </div>

      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={onSignOut}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'transparent', color: '#888',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
            padding: '10px 16px', cursor: 'pointer', fontSize: '13px',
            fontFamily: 'inherit', transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#888')}
        >
          <LogOut size={14} />Sign out of all devices
        </button>
      </div>
    </div>
  );
}

export function Account() {
  const { user, openAuth, signOut } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>('general');

  if (!user) {
    return (
      <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
        <Nav />
        <div style={{ paddingTop: '160px', textAlign: 'center' }}>
          <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '12px' }}>Account</p>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '36px', color: '#fff', marginBottom: '16px' }}>
            You're not signed in.
          </h1>
          <p style={{ color: '#A0A0A0', marginBottom: '32px' }}>Sign in to manage your Ember account.</p>
          <button
            onClick={() => openAuth('Sign in to access your account settings.')}
            style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 32px', cursor: 'pointer', fontSize: '15px', fontWeight: 600, fontFamily: 'inherit' }}
          >Sign in</button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const renderSection = () => {
    switch (section) {
      case 'general':         return <GeneralSection user={user} />;
      case 'personalization': return <PersonalizationSection />;
      case 'notifications':   return <NotificationsSection />;
      case 'speech':          return <SpeechSection />;
      case 'appearance':      return <AppearanceSection />;
      case 'privacy':         return <PrivacySection onSignOut={handleSignOut} />;
    }
  };

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      <div className="page-container" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
        <motion.p
          className="mono"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: 'var(--maroon)', marginBottom: '6px' }}
        >Settings</motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(28px, 4vw, 48px)', color: '#fff', marginBottom: '40px' }}
        >Account</motion.h1>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '32px', alignItems: 'start' }}>
          {/* sidebar */}
          <div style={{ position: 'sticky', top: '96px' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSection(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: section === id ? 'rgba(128,0,0,0.15)' : 'transparent',
                    color: section === id ? '#fff' : '#888',
                    border: 'none', borderRadius: '8px',
                    padding: '11px 14px', cursor: 'pointer',
                    fontSize: '14px', fontFamily: 'inherit',
                    textAlign: 'left', transition: 'all 0.15s',
                    borderLeft: section === id ? '2px solid var(--maroon)' : '2px solid transparent',
                  }}
                  onMouseEnter={e => { if (section !== id) e.currentTarget.style.color = '#ccc'; }}
                  onMouseLeave={e => { if (section !== id) e.currentTarget.style.color = '#888'; }}
                >
                  <Icon size={15} />
                  {label}
                  {section === id && <ChevronRight size={13} style={{ marginLeft: 'auto', color: 'var(--maroon)' }} />}
                </button>
              ))}
            </nav>
          </div>

          {/* content */}
          <motion.div
            key={section}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '32px' }}
          >
            {renderSection()}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
