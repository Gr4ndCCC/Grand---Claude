import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { sendNewsletterEmail } from '../lib/email';

const LEGAL = [
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms',   to: '/terms'   },
  { label: 'Contact', to: '/contact' },
];

const PLATFORM_BASE = [
  { label: 'Events',  to: '/events' },
  { label: 'Vault',   to: '/vault'  },
  { label: 'Hosts',   to: '/hosts'  },
  { label: 'About',   to: '/about'  },
  { label: 'FAQ',     to: '/faq'    },
];

const BROTHERHOOD = [
  { label: 'The Board',           to: '/board'    },
  { label: 'Annual Summit',       to: '/summit'   },
  { label: 'The Council',         to: '/council'  },
  { label: 'Partners',            to: '/partners' },
  { label: 'Brotherhood Network', to: '/network'  },
];

export function Footer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nlEmail, setNlEmail] = useState('');
  const [nlDone, setNlDone] = useState(false);

  const subscribeNewsletter = () => {
    if (!nlEmail.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return;
    sendNewsletterEmail(nlEmail, user?.name);
    setNlDone(true);
  };
  const PLATFORM = user
    ? [{ label: 'Account', to: '/account' }, ...PLATFORM_BASE]
    : PLATFORM_BASE;

  return (
    <footer style={{ background: '#090504', position: 'relative', overflow: 'hidden' }}>
      {/* Maroon-to-transparent top hairline */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(128,0,0,0.6) 30%, rgba(228,207,179,0.15) 50%, rgba(128,0,0,0.6) 70%, transparent 100%)' }} />

      {/* Subtle maroon smoke behind wordmark */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '500px', height: '300px', background: 'radial-gradient(ellipse at 20% 20%, rgba(128,0,0,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <div className="page-container py-16" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid md:grid-cols-3 gap-12 mb-14">

          {/* Brand column */}
          <div>
            <button
              onClick={() => navigate('/')}
              className="ember-focus"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'block', marginBottom: '12px' }}
            >
              <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '32px', color: 'var(--beige)', letterSpacing: '-0.01em', lineHeight: 1 }}>
                Ember
              </span>
            </button>
            <p style={{ color: 'var(--beige)', fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic', fontSize: '15px', marginBottom: '12px', opacity: 0.6 }}>
              The world grills.
            </p>
            <p style={{ color: '#4A4A4A', fontSize: '13px', lineHeight: '1.7', maxWidth: '260px', marginBottom: '20px' }}>
              The global social BBQ brotherhood. 40+ countries. One fire.
            </p>

            {/* Newsletter */}
            {nlDone ? (
              <p style={{ color: 'var(--beige)', fontSize: '13px', fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic' }}>
                You're in the fire circle.
              </p>
            ) : (
              <div>
                <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '8px', fontSize: '10px', letterSpacing: '0.12em' }}>Stay close to the fire</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="email"
                    value={nlEmail}
                    onChange={e => setNlEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && subscribeNewsletter()}
                    placeholder="your@email.com"
                    style={{
                      flex: 1, background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: '8px', padding: '9px 12px',
                      color: '#fff', fontSize: '13px', outline: 'none',
                      fontFamily: 'inherit', minWidth: 0,
                    }}
                  />
                  <button
                    onClick={subscribeNewsletter}
                    style={{
                      background: 'var(--maroon)', color: '#fff',
                      border: 'none', borderRadius: '8px',
                      padding: '9px 14px', cursor: 'pointer',
                      fontSize: '12px', fontFamily: 'inherit',
                      fontWeight: 600, flexShrink: 0,
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--maroon-light)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--maroon)')}
                  >Join</button>
                </div>
              </div>
            )}
          </div>

          {/* Platform column */}
          <div>
            <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '6px', fontSize: '10px', letterSpacing: '0.15em' }}>Platform</p>
            <div style={{ width: '16px', height: '1px', background: 'linear-gradient(90deg, var(--maroon), transparent)', marginBottom: '16px' }} />
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {PLATFORM.map(({ label, to }) => (
                <li key={label}>
                  <button
                    onClick={() => navigate(to)}
                    className="ember-focus footer-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', color: '#6A6A6A', fontSize: '14px', transition: 'color 0.2s, padding-left 0.2s', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0px', textAlign: 'left' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#E4CFB3'; e.currentTarget.style.paddingLeft = '6px'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#6A6A6A'; e.currentTarget.style.paddingLeft = '0'; }}
                  >{label}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Brotherhood column */}
          <div>
            <p className="mono" style={{ color: 'var(--maroon)', marginBottom: '6px', fontSize: '10px', letterSpacing: '0.15em' }}>The Brotherhood</p>
            <div style={{ width: '16px', height: '1px', background: 'linear-gradient(90deg, var(--maroon), transparent)', marginBottom: '16px' }} />
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {BROTHERHOOD.map(({ label, to }) => (
                <li key={label}>
                  <button
                    onClick={() => navigate(to)}
                    className="ember-focus"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', color: '#6A6A6A', fontSize: '14px', transition: 'color 0.2s, padding-left 0.2s', fontFamily: 'inherit', textAlign: 'left' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#E4CFB3'; e.currentTarget.style.paddingLeft = '6px'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#6A6A6A'; e.currentTarget.style.paddingLeft = '0'; }}
                  >{label}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="animate-ember-pulse" style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#c96e47', display: 'inline-block', flexShrink: 0 }} />
            <p className="mono" style={{ color: '#333', fontSize: '10px' }}>
              © {new Date().getFullYear()} Ember · The world grills.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {LEGAL.map(({ label, to }) => (
              <button key={label} className="ember-focus mono"
                onClick={() => navigate(to)}
                style={{ color: '#333', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s', fontSize: '10px' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#6A6A6A')}
                onMouseLeave={e => (e.currentTarget.style.color = '#333')}
              >{label}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
