import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/events', label: 'Events'    },
  { to: '/vault',  label: 'Vault'     },
  { to: '/about',  label: 'The Board' },
  { to: '/hosts',  label: 'Hosts'     },
];

export function Nav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(10,10,10,0.92)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div className="page-container flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="focus:outline-none"
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '22px',
              fontWeight: '400',
              color: '#E4CFB3',
              letterSpacing: '-0.5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Ember
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-white/08'
                      : 'text-[#A0A0A0] hover:text-white hover:bg-white/05'
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? 'rgba(255,255,255,0.08)' : undefined,
                })}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/events')}
              className="text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors px-3 py-2"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/vault')}
              className="text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: '#800000',
                color: '#FFFFFF',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#990000')}
              onMouseLeave={e => (e.currentTarget.style.background = '#800000')}
            >
              Join free
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[#A0A0A0] hover:text-white transition-colors"
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] flex">
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.75)' }}
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <div
            className="relative ml-auto w-72 h-full flex flex-col p-6"
            style={{ background: '#111111', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center justify-between mb-8">
              <span
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '20px',
                  color: '#E4CFB3',
                  letterSpacing: '-0.5px',
                }}
              >
                Ember
              </span>
              <button onClick={() => setOpen(false)} className="text-[#5A5A5A] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-[#A0A0A0] hover:text-white'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="flex flex-col gap-3 pt-6 border-t border-white/08"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <button
                onClick={() => { setOpen(false); navigate('/events'); }}
                className="w-full py-3 rounded-lg text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.10)' }}
              >
                Sign in
              </button>
              <button
                onClick={() => { setOpen(false); navigate('/vault'); }}
                className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-colors"
                style={{ background: '#800000' }}
              >
                Join free
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
