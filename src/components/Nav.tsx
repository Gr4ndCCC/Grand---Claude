import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/events', label: 'Events' },
  { to: '/vault',  label: 'Vault'  },
  { to: '/hosts',  label: 'Hosts'  },
  { to: '/about',  label: 'About'  },
  { to: '/faq',    label: 'FAQ'    },
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
          background: scrolled ? 'rgba(10,10,10,0.94)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div className="page-container flex items-center justify-between h-16">
          <button
            onClick={() => navigate('/')}
            className="ember-focus"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <span style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '22px', fontWeight: '400',
              color: 'var(--beige)', letterSpacing: '-0.3px',
            }}>Ember</span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to} to={to}
                className="ember-focus px-4 py-2 rounded-lg text-sm transition-all duration-200"
                style={({ isActive }) => ({
                  color: isActive ? '#fff' : '#A0A0A0',
                  background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  textDecoration: 'none',
                })}
              >{label}</NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/events')}
              className="text-sm ember-focus"
              style={{ color: '#A0A0A0', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
            >Sign in</button>
            <button
              onClick={() => navigate('/vault')}
              className="ember-focus text-sm font-medium"
              style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', cursor: 'pointer', transition: 'background 0.2s, transform 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--maroon-light)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--maroon)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >Join the Vault</button>
          </div>

          <button
            className="md:hidden ember-focus p-2"
            style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col pt-16" style={{ background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(20px)' }}>
          <nav className="flex flex-col gap-1 p-6">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)}
                className="px-4 py-4 rounded-lg text-lg ember-focus"
                style={({ isActive }) => ({ color: isActive ? '#fff' : '#A0A0A0', background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent', textDecoration: 'none' })}
              >{label}</NavLink>
            ))}
          </nav>
          <div className="px-6 mt-4 flex flex-col gap-3">
            <button onClick={() => { navigate('/vault'); setOpen(false); }}
              style={{ background: 'var(--maroon)', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}
            >Join the Vault</button>
          </div>
        </div>
      )}
    </>
  );
}
