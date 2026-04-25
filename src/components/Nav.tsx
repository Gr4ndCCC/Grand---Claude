import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '../lib/cn';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-30 transition-colors duration-200 ease-flame',
        scrolled ? 'bg-paper/85 backdrop-blur border-b border-line' : 'bg-transparent',
      )}
    >
      <div className="page-container h-14 flex items-center justify-between">
        <Link to="/" className="ember-focus inline-flex items-center gap-2">
          <span className="block w-2 h-2 rounded-pill bg-ember" />
          <span className="font-display text-xl text-ink">Ember</span>
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink
            to="/design-system"
            className={({ isActive }) => cn(
              'ember-focus mono px-3 h-9 inline-flex items-center rounded-sm transition-colors',
              isActive ? 'text-ink' : 'text-ink-soft hover:text-ink',
            )}
          >
            Design system
          </NavLink>
          <a
            href="#join"
            className="ember-focus spark inline-flex items-center h-9 px-4 rounded-md
                       bg-ember text-ink-inverse text-sm font-medium hover:bg-ember-hot
                       active:bg-ember-deep transition-colors"
          >
            Start a fire
          </a>
        </nav>
      </div>
    </header>
  );
}
