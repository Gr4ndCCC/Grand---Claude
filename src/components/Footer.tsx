import { useNavigate } from 'react-router-dom';

const LINKS = [
  { label: 'Events',  to: '/events' },
  { label: 'Vault',   to: '/vault'  },
  { label: 'Hosts',   to: '/hosts'  },
  { label: 'About',   to: '/about'  },
  { label: 'FAQ',     to: '/faq'    },
];

const LEGAL = [
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms',   to: '/terms'   },
];

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      style={{
        background: '#0A0A0A',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="page-container py-16">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
          {/* Brand */}
          <div className="max-w-xs">
            <button
              onClick={() => navigate('/')}
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '24px',
                color: '#E4CFB3',
                letterSpacing: '-0.5px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginBottom: '12px',
                display: 'block',
              }}
            >
              Ember
            </button>
            <p style={{ color: '#5A5A5A', fontSize: '14px', lineHeight: '1.6' }}>
              The world's first global social BBQ brotherhood. 40+ countries.
              One fire.
            </p>
          </div>

          {/* Nav */}
          <div className="flex gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: '#5A5A5A' }}>
                Platform
              </p>
              <ul className="flex flex-col gap-3">
                {LINKS.map(({ label, to }) => (
                  <li key={label}>
                    <button
                      onClick={() => navigate(to)}
                      className="text-sm transition-colors"
                      style={{ color: '#A0A0A0', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: '#5A5A5A' }}>
                Company
              </p>
              <ul className="flex flex-col gap-3">
                {LEGAL.map(({ label, to }) => (
                  <li key={label}>
                    <button
                      onClick={() => navigate(to)}
                      className="text-sm transition-colors"
                      style={{ color: '#A0A0A0', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
                    >
                      {label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => navigate('/hosts')}
                    className="text-sm transition-colors"
                    style={{ color: '#A0A0A0', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
                  >
                    Work with Ember
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Download */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#5A5A5A' }}>
              Get the app
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: '#1A1A1A',
                  border: '1px solid rgba(255,255,255,0.08)',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(228,207,179,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              >
                <span style={{ fontSize: '20px' }}>🍎</span>
                <div>
                  <p style={{ color: '#5A5A5A', fontSize: '10px' }}>Download on the</p>
                  <p style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600' }}>App Store</p>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: '#1A1A1A',
                  border: '1px solid rgba(255,255,255,0.08)',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(228,207,179,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              >
                <span style={{ fontSize: '20px' }}>🤖</span>
                <div>
                  <p style={{ color: '#5A5A5A', fontSize: '10px' }}>Get it on</p>
                  <p style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600' }}>Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p style={{ color: '#5A5A5A', fontSize: '13px' }}>
            © 2026 Ember. The brotherhood burns everywhere.
          </p>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: '#800000' }}
            />
            <span style={{ color: '#5A5A5A', fontSize: '13px' }}>
              15 gatherings live right now
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
