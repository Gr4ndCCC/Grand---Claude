import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../lib/auth';

const NAV_LINKS = [
  { to: '/events', label: 'Events' },
  { to: '/vault',  label: 'Vault'  },
  { to: '/hosts',  label: 'Hosts'  },
  { to: '/about',  label: 'About'  },
  { to: '/faq',    label: 'FAQ'    },
];

/* Liquid-glass transition timing — matches iOS spring easing */
const GLASS_TRANSITION =
  'background 0.55s cubic-bezier(0.4,0,0.2,1), ' +
  'backdrop-filter 0.55s cubic-bezier(0.4,0,0.2,1), ' +
  '-webkit-backdrop-filter 0.55s cubic-bezier(0.4,0,0.2,1), ' +
  'border-color 0.55s cubic-bezier(0.4,0,0.2,1), ' +
  'box-shadow 0.55s cubic-bezier(0.4,0,0.2,1)';

export function Nav() {
  const navigate = useNavigate();
  const { user, openAuth, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 50,
          height: '72px',
          /* ── Liquid glass core ──────────────────────────────
             When scrolled: frosted glass panel with soft edge highlight.
             When at top: fully transparent — content shows through cleanly. */
          background: scrolled
            ? 'rgba(8, 6, 10, 0.38)'
            : 'transparent',
          backdropFilter: scrolled
            ? 'blur(24px) saturate(1.7) brightness(0.92)'
            : 'blur(0px) saturate(1)',
          WebkitBackdropFilter: scrolled
            ? 'blur(24px) saturate(1.7) brightness(0.92)'
            : 'blur(0px) saturate(1)',
          /* Top edge: subtle light-refraction highlight (glass edge glow)
             Bottom: soft depth shadow for nav/content separation */
          boxShadow: scrolled
            ? 'inset 0 1px 0 rgba(245,237,224,0.07), 0 8px 40px rgba(0,0,0,0.22)'
            : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(245,237,224,0.06)'
            : '1px solid transparent',
          transition: GLASS_TRANSITION,
        }}
      >
        <div className="page-container flex items-center justify-between" style={{ height: '72px' }}>
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="ember-focus"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <span className="logo-mark-v3" aria-hidden />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, color: 'var(--bone-100)', letterSpacing: '-0.01em' }}>
              ember
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center" style={{ gap: '32px' }}>
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className="ember-focus nav-link-glass"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--bone-100)' : 'var(--bone-300)',
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: '15px',
                  textDecoration: 'none',
                  letterSpacing: '-0.005em',
                  transition: 'color 0.3s cubic-bezier(0.4,0,0.2,1), text-shadow 0.3s cubic-bezier(0.4,0,0.2,1)',
                })}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--bone-100)';
                  e.currentTarget.style.textShadow = '0 0 22px rgba(245,237,224,0.25)';
                }}
                onMouseLeave={e => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.color = 'var(--bone-300)';
                  }
                  e.currentTarget.style.textShadow = 'none';
                }}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center" style={{ gap: '12px' }}>
            {user ? (
              <>
                <button
                  onClick={() => navigate('/account')}
                  className="ember-focus"
                  style={{
                    color: 'var(--bone-300)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '6px 10px', fontSize: '13px',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    borderRadius: '8px', transition: 'color 0.2s',
                    fontStyle: 'italic',
                    fontFamily: 'var(--font-display)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--bone-100)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--bone-300)')}
                >
                  <Settings size={14} />
                  <span>{user.name}</span>
                </button>
                <button onClick={signOut} className="ember-focus"
                  style={{ color: 'var(--bone-500)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
                  title="Sign out"
                ><LogOut size={16} /></button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuth('Sign in to your Ember account.')}
                  className="ember-focus"
                  style={{
                    color: 'var(--bone-300)', background: 'none', border: 'none', cursor: 'pointer',
                    padding: '8px 12px', fontSize: '15px',
                    fontFamily: 'var(--font-display)', fontStyle: 'italic',
                    transition: 'color 0.25s, text-shadow 0.25s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--bone-100)';
                    e.currentTarget.style.textShadow = '0 0 22px rgba(245,237,224,0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--bone-300)';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >Sign in</button>
                <button
                  onClick={() => openAuth('Join Ember to access the Vault and all features.')}
                  className="ember-focus btn-v3 primary nav-vault-btn"
                  style={{ height: '40px', padding: '0 20px', fontSize: '14px' }}
                >
                  Join the Vault
                </button>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            className="md:hidden ember-focus"
            style={{
              color: 'var(--bone-100)', background: 'none', border: 'none',
              cursor: 'pointer', padding: '8px',
            }}
            onClick={() => setOpen(!open)} aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu — glass panel */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col"
          style={{
            paddingTop: '72px',
            background: 'rgba(8, 6, 10, 0.82)',
            backdropFilter: 'blur(28px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(28px) saturate(1.5)',
            borderTop: '1px solid rgba(245,237,224,0.06)',
          }}
        >
          <nav className="flex flex-col" style={{ gap: '4px', padding: '28px 24px' }}>
            {user && (
              <NavLink to="/account" onClick={() => setOpen(false)}
                className="ember-focus"
                style={({ isActive }) => ({
                  padding: '14px 18px',
                  borderRadius: '10px',
                  fontSize: '18px',
                  fontFamily: 'var(--font-display)',
                  color: isActive ? 'var(--bone-100)' : 'var(--beige)',
                  background: isActive ? 'rgba(128,0,0,0.16)' : 'rgba(128,0,0,0.06)',
                  textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  fontWeight: 500,
                  borderLeft: '2px solid var(--burgundy)',
                })}
              >
                <Settings size={16} /> Account
              </NavLink>
            )}
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)}
                className="ember-focus"
                style={({ isActive }) => ({
                  padding: '14px 18px',
                  borderRadius: '10px',
                  fontSize: '18px',
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  color: isActive ? 'var(--bone-100)' : 'var(--bone-300)',
                  background: isActive ? 'rgba(245,237,224,0.06)' : 'transparent',
                  textDecoration: 'none',
                })}
              >{label}</NavLink>
            ))}
          </nav>
          <div style={{ padding: '0 24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {user ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'rgba(245,237,224,0.04)', borderRadius: '10px' }}>
                <span style={{ color: 'var(--bone-300)', fontSize: '14px' }}>{user.name} · {user.email}</span>
                <button onClick={() => { signOut(); setOpen(false); }} style={{ color: 'var(--bone-500)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => { openAuth(); setOpen(false); }}
                  className="btn-v3 ghost"
                  style={{ width: '100%', height: '52px' }}
                >Sign in</button>
                <button onClick={() => { openAuth('Join the Vault.'); setOpen(false); }}
                  className="btn-v3 primary"
                  style={{ width: '100%', height: '52px' }}
                >Join the Vault</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
