import { useNavigate } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmberLogo } from '../components/EmberLogo';
import { EventCard } from '../components/EventCard';
import { EVENTS, USERS } from '../data/mock';

const FEATURES = [
  {
    icon: '🔥',
    title: 'Host in seconds',
    desc: 'Create a BBQ event, set the menu, and invite your crew — all in under 2 minutes.',
  },
  {
    icon: '👥',
    title: 'Know your crowd',
    desc: 'See who\'s coming, what they\'re bringing, and fill every spot effortlessly.',
  },
  {
    icon: '🥩',
    title: 'Coordinate the grill',
    desc: 'Shared menu boards let guests claim dishes so nothing gets doubled up.',
  },
  {
    icon: '📍',
    title: 'Discover local fires',
    desc: 'Find public BBQs near you and join a crew you\'ll want to grill with forever.',
  },
];

const STATS = [
  { value: '12K+', label: 'BBQs hosted' },
  { value: '84K+', label: 'Guests served' },
  { value: '4.9★', label: 'Average rating' },
];

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ember-bg overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-glow-orange opacity-50" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-glow-amber opacity-30" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-glow-orange opacity-20" />
      </div>

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <EmberLogo size={30} />
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/events')}>
            Sign in
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/events')}
            iconRight={<ArrowRight size={14} />}
          >
            Get started
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 bg-ember-orange/10 border border-ember-orange/30
                        text-ember-orange text-sm font-semibold px-4 py-1.5 rounded-full mb-8
                        animate-fade-in">
          <Flame size={14} className="animate-pulse" />
          The social BBQ app
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-ember-cream
                       max-w-3xl mx-auto mb-6 animate-slide-up text-balance">
          Gather around{' '}
          <span
            className="inline-block"
            style={{
              background: 'linear-gradient(135deg, #FF5C1A 0%, #FFAA33 60%, #FFD166 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            the fire.
          </span>
        </h1>

        <p className="text-ember-muted text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed animate-slide-up">
          Ember makes it dead simple to host, join, and coordinate backyard BBQs
          with the people you love — or the neighbours you should.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/events')}
            iconRight={<ArrowRight size={18} />}
          >
            Find a BBQ near you
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/create')}
          >
            Host one yourself
          </Button>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-2 mt-8 text-ember-muted text-sm">
          <div className="flex -space-x-2">
            {USERS.map(u => (
              <img key={u.id} src={u.avatar} alt={u.name}
                className="w-7 h-7 rounded-full border-2 border-ember-bg object-cover" />
            ))}
          </div>
          <span>Join <span className="text-ember-cream font-semibold">12,000+</span> fire starters</span>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-2xl mx-auto glass-card px-8 py-6 grid grid-cols-3 divide-x divide-ember-border/50">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center px-4">
              <p className="text-2xl md:text-3xl font-black fire-text">{value}</p>
              <p className="text-ember-muted text-xs md:text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 pb-24 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-ember-cream mb-3">
            Everything your BBQ needs
          </h2>
          <p className="text-ember-muted max-w-md mx-auto">
            From invite to cleanup — Ember keeps everyone in sync so you can focus on the grill.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="glass-card p-5 hover:border-ember-orange/30 transition-all duration-300
                                        hover:-translate-y-1 hover:shadow-ember">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="text-ember-cream font-bold mb-1.5">{title}</h3>
              <p className="text-ember-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Event previews */}
      <section className="relative z-10 px-6 pb-24 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-ember-cream">Fires near you</h2>
            <p className="text-ember-muted text-sm mt-1">Brooklyn, New York</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/events')}
            iconRight={<ArrowRight size={14} />}
          >
            See all
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EVENTS.filter(e => e.status === 'upcoming').slice(0, 3).map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-fire-gradient opacity-90" />
          <div className="absolute inset-0 bg-glow-orange" />
          <div className="relative z-10 text-center py-16 px-8">
            <div className="text-5xl mb-4">🔥</div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              Ready to light it up?
            </h2>
            <p className="text-white/80 max-w-md mx-auto mb-8 text-lg">
              Host your first BBQ free. No setup fees, no guest limits on launch.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/create')}
              iconRight={<ArrowRight size={18} />}
            >
              Host for free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-ember-border/50 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <EmberLogo size={24} />
          <p className="text-ember-subtle text-sm">
            © 2026 Ember. Made with 🔥 for BBQ lovers.
          </p>
          <div className="flex gap-6 text-ember-subtle text-sm">
            <a href="#" className="hover:text-ember-muted transition-colors">Privacy</a>
            <a href="#" className="hover:text-ember-muted transition-colors">Terms</a>
            <a href="#" className="hover:text-ember-muted transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
