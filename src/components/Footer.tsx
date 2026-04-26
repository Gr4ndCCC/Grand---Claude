import { useNavigate } from 'react-router-dom';

const LEGAL = [
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms',   to: '/terms'   },
  { label: 'Contact', to: '/contact' },
];

const PLATFORM = [
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

  return (
    <footer style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="page-container py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <button
              onClick={() => navigate('/')}
              className="ember-focus mb-4"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'block' }}
            >
              <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', color: 'var(--beige)' }}>
                Ember
              </span>
            </button>
            <p style={{ color: '#5A5A5A', fontSize: '14px', lineHeight: '1.7', maxWidth: '280px' }}>
              The world's first global social BBQ brotherhood. 40+ countries. One fire.
            </p>
          </div>

          <div>
            <p className="mono mb-4" style={{ color: '#5A5A5A' }}>Platform</p>
            <ul className="flex flex-col gap-3">
              {PLATFORM.map(({ label, to }) => (
                <li key={label}>
                  <button
                    onClick={() => navigate(to)}
                    className="ember-focus"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#A0A0A0', fontSize: '14px', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
                  >{label}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mono mb-4" style={{ color: '#5A5A5A' }}>The Brotherhood</p>
            <ul className="flex flex-col gap-3">
              {BROTHERHOOD.map(({ label, to }) => (
                <li key={label}>
                  <button
                    onClick={() => navigate(to)}
                    className="ember-focus"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#A0A0A0', fontSize: '14px', transition: 'color 0.2s', textAlign: 'left' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
                  >{label}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p className="mono" style={{ color: '#5A5A5A' }}>© {new Date().getFullYear()} Ember · The world grills.</p>
          <div className="flex gap-6">
            {LEGAL.map(({ label, to }) => (
              <button key={label} className="ember-focus mono"
                onClick={() => navigate(to)}
                style={{ color: '#5A5A5A', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#A0A0A0')}
                onMouseLeave={e => (e.currentTarget.style.color = '#5A5A5A')}
              >{label}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
