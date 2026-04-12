import { useState, useEffect } from 'react';
import { Settings, Flame, Calendar, Users, Award, Edit2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { EventCard } from '../components/EventCard';
import { EVENTS } from '../data/mock';
import { fetchEvents } from '../services/events';
import { useAuth } from '../context/AuthContext';
import type { Event } from '../types';

const BADGE_COLORS: Record<string, 'orange' | 'amber' | 'green' | 'blue'> = {
  orange: 'orange',
  amber: 'amber',
  green: 'green',
  blue: 'blue',
};

const ACHIEVEMENTS = [
  { icon: '🔥', label: 'First Fire', desc: 'Hosted your first BBQ', earned: true },
  { icon: '👑', label: 'Pit Master', desc: 'Hosted 10+ BBQs', earned: true },
  { icon: '🌟', label: 'Social Spark', desc: '50+ guests attended your events', earned: true },
  { icon: '🥩', label: 'Smoke Lord', desc: 'Hosted 20+ BBQs', earned: false },
  { icon: '🏆', label: 'Legend', desc: '100+ guests across all events', earned: false },
  { icon: '🌶️', label: 'Spice Master', desc: 'Used 10+ different recipes', earned: false },
];

export function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'events' | 'achievements'>('events');
  const [allEvents, setAllEvents] = useState<Event[]>(EVENTS);

  useEffect(() => {
    fetchEvents().then(apiEvents => {
      if (apiEvents && apiEvents.length > 0) setAllEvents(apiEvents);
    });
  }, []);

  const hostedEvents = allEvents.filter(e => e.host.id === user.id);
  const attendedEvents = allEvents.filter(e =>
    e.guests.some(g => g.user.id === user.id)
  );

  return (
    <div className="min-h-screen bg-ember-bg pb-24 md:pb-8">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-glow-orange opacity-20" />
      </div>

      <div className="page-container relative z-10 pt-6">
        {/* Settings button */}
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="sm" icon={<Settings size={16} />}>
            Settings
          </Button>
        </div>

        {/* Profile hero */}
        <div className="glass-card p-6 mb-4">
          <div className="flex items-start gap-4 mb-5">
            <div className="relative">
              <Avatar src={user.avatar} name={user.name} size="xl" ring />
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-ember-orange rounded-full
                                 flex items-center justify-center shadow-ember">
                <Edit2 size={12} className="text-white" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-ember-cream leading-tight">{user.name}</h1>
              <p className="text-ember-muted text-sm mb-2">@{user.handle}</p>
              <p className="text-ember-muted text-sm leading-relaxed">{user.bio}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 divide-x divide-ember-border/50 text-center mb-4">
            <div className="px-2">
              <p className="text-xl font-black fire-text">{user.eventsHosted}</p>
              <p className="text-ember-subtle text-xs">Hosted</p>
            </div>
            <div className="px-2">
              <p className="text-xl font-black text-ember-cream">{user.eventsAttended}</p>
              <p className="text-ember-subtle text-xs">Attended</p>
            </div>
            <div className="px-2">
              <p className="text-xl font-black text-ember-cream">{user.followers}</p>
              <p className="text-ember-subtle text-xs">Followers</p>
            </div>
            <div className="px-2">
              <p className="text-xl font-black text-ember-cream">{user.following}</p>
              <p className="text-ember-subtle text-xs">Following</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {user.badges.map(badge => (
              <Badge
                key={badge.id}
                variant={BADGE_COLORS[badge.color] ?? 'ghost'}
                icon={<span>{badge.icon}</span>}
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Streak card */}
        <div className="glass-card p-4 mb-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-fire-gradient rounded-xl flex items-center justify-center shadow-ember animate-pulse-ember">
            <Flame size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-ember-cream font-bold">12-week streak 🔥</p>
            <p className="text-ember-muted text-xs">You've attended or hosted an event every week for 12 weeks!</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-ember-surface rounded-xl p-1 mb-5">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold
                        transition-all duration-200 ${
              activeTab === 'events'
                ? 'bg-ember-surface2 text-ember-cream'
                : 'text-ember-muted hover:text-ember-cream'
            }`}
          >
            <Calendar size={14} /> Events
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold
                        transition-all duration-200 ${
              activeTab === 'achievements'
                ? 'bg-ember-surface2 text-ember-cream'
                : 'text-ember-muted hover:text-ember-cream'
            }`}
          >
            <Award size={14} /> Achievements
          </button>
        </div>

        {/* Events tab */}
        {activeTab === 'events' && (
          <div className="space-y-6 animate-fade-in">
            {hostedEvents.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-ember-cream font-bold flex items-center gap-1.5">
                    <Flame size={14} className="text-ember-orange" />
                    Hosted
                  </h2>
                  <Badge variant="orange">{hostedEvents.length}</Badge>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {hostedEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            )}

            {attendedEvents.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-ember-cream font-bold flex items-center gap-1.5">
                    <Users size={14} className="text-ember-muted" />
                    Attended
                  </h2>
                  <Badge variant="ghost">{attendedEvents.length}</Badge>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 opacity-70">
                  {attendedEvents.map(event => (
                    <EventCard key={event.id} event={event} compact />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Achievements tab */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
            {ACHIEVEMENTS.map(({ icon, label, desc, earned }) => (
              <div
                key={label}
                className={`glass-card p-4 transition-all duration-300 ${
                  earned
                    ? 'border-ember-orange/30 hover:shadow-ember'
                    : 'opacity-40'
                }`}
              >
                <div className={`text-3xl mb-2 ${earned ? '' : 'grayscale'}`}>{icon}</div>
                <p className={`font-bold text-sm mb-1 ${earned ? 'text-ember-cream' : 'text-ember-muted'}`}>
                  {label}
                </p>
                <p className="text-ember-subtle text-xs leading-relaxed">{desc}</p>
                {earned && (
                  <div className="mt-2">
                    <Badge variant="orange" size="sm">Earned</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
