import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, PlusCircle, User, Flame } from 'lucide-react';
import clsx from 'clsx';
import { EmberLogo } from './EmberLogo';
import { Avatar } from './ui/Avatar';
import { CURRENT_USER } from '../data/mock';

const NAV_ITEMS = [
  { to: '/events',  icon: Home,       label: 'Home'    },
  { to: '/explore', icon: Search,     label: 'Explore' },
  { to: '/create',  icon: PlusCircle, label: 'Host'    },
  { to: '/profile', icon: User,       label: 'Profile' },
];

export function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop top bar */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16
                         bg-ember-bg/80 backdrop-blur-xl border-b border-ember-border/50">
        <div className="page-container flex items-center justify-between w-full">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="focus:outline-none">
            <EmberLogo size={28} />
          </button>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-ember-orange/15 text-ember-orange'
                      : 'text-ember-muted hover:text-ember-cream hover:bg-ember-surface2',
                  )
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right: streak + avatar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-ember-surface2 border border-ember-border px-3 py-1.5 rounded-full">
              <Flame size={14} className="text-ember-orange" />
              <span className="text-xs font-semibold text-ember-amber">12 streak</span>
            </div>
            <button onClick={() => navigate('/profile')}>
              <Avatar
                src={CURRENT_USER.avatar}
                name={CURRENT_USER.name}
                size="sm"
                ring
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50
                      bg-ember-surface/90 backdrop-blur-xl border-t border-ember-border/50">
        <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200',
                  isActive
                    ? 'text-ember-orange'
                    : 'text-ember-subtle hover:text-ember-muted',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                  <span className="text-[10px] font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Spacer for fixed header (desktop) */}
      <div className="hidden md:block h-16" />
    </>
  );
}
