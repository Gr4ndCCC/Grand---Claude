import { useState } from 'react';
import { Search, SlidersHorizontal, Flame, CalendarDays, UserCheck, TrendingUp } from 'lucide-react';
import { EventCard } from '../components/EventCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EVENTS, CURRENT_USER } from '../data/mock';
import type { Tab } from '../types';

const TABS: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
  { id: 'discover',   label: 'Discover',   icon: <TrendingUp size={14} /> },
  { id: 'my-events',  label: 'My Events',  icon: <Flame size={14} /> },
  { id: 'invited',    label: 'Invited',    icon: <UserCheck size={14} /> },
];

const FILTER_TAGS = ['All', 'This weekend', 'Backyard', 'Rooftop', 'Vegan', 'Family', 'Free'];

export function Events() {
  const [activeTab, setActiveTab] = useState<Tab>('discover');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const myEvents = EVENTS.filter(e => e.host.id === CURRENT_USER.id);
  const invitedEvents = EVENTS.filter(e =>
    e.guests.some(g => g.user.id === CURRENT_USER.id)
  );
  const discoverEvents = EVENTS.filter(e => e.isPublic);

  const sourceEvents =
    activeTab === 'my-events' ? myEvents :
    activeTab === 'invited'   ? invitedEvents :
    discoverEvents;

  const filtered = sourceEvents.filter(e =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  const upcoming = filtered.filter(e => e.status === 'upcoming');
  const past      = filtered.filter(e => e.status === 'past');

  return (
    <div className="min-h-screen bg-ember-bg pb-24 md:pb-8">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-96 h-96 bg-glow-orange opacity-30" />
      </div>

      <div className="page-container relative z-10 pt-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-2xl font-black text-ember-cream">
                Fires <span className="fire-text">near you</span>
              </h1>
              <p className="text-ember-muted text-sm mt-0.5">Brooklyn, New York · 8 events</p>
            </div>
            <Button variant="secondary" size="sm" icon={<SlidersHorizontal size={14} />}>
              Filters
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ember-subtle" />
          <input
            type="text"
            placeholder="Search events, hosts, locations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="ember-input pl-10"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-ember-surface rounded-xl p-1 mb-5">
          {TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold
                          transition-all duration-200 ${
                activeTab === id
                  ? 'bg-ember-orange text-white shadow-ember'
                  : 'text-ember-muted hover:text-ember-cream'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          {FILTER_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
                activeFilter === tag
                  ? 'bg-ember-orange text-white'
                  : 'bg-ember-surface2 text-ember-muted border border-ember-border hover:border-ember-orange/40 hover:text-ember-cream'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-ember-cream font-bold text-lg mb-2">No events found</h3>
            <p className="text-ember-muted text-sm mb-6">Try a different search or filter</p>
            <Button variant="outline" onClick={() => { setSearch(''); setActiveFilter('All'); }}>
              Clear filters
            </Button>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays size={16} className="text-ember-orange" />
              <h2 className="text-ember-cream font-bold">Upcoming</h2>
              <Badge variant="orange">{upcoming.length}</Badge>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Past events */}
        {past.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-ember-muted font-bold">Past events</h2>
              <Badge variant="ghost">{past.length}</Badge>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
              {past.map(event => (
                <EventCard key={event.id} event={event} compact />
              ))}
            </div>
          </section>
        )}

        {/* CTA if no events hosted */}
        {activeTab === 'my-events' && myEvents.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-float">🔥</div>
            <h3 className="text-ember-cream font-bold text-xl mb-2">Light your first fire</h3>
            <p className="text-ember-muted mb-6">You haven't hosted any BBQs yet. Time to change that.</p>
            <Button variant="primary" onClick={() => window.location.href = '/create'}>
              Host a BBQ
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
