import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapPin, Clock, Users, Lock, Globe, Share2, ChevronLeft,
  Check, Minus, X, Utensils, MessageCircle, Flame
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { EVENTS, CURRENT_USER } from '../data/mock';

type RsvpStatus = 'going' | 'maybe' | 'declined' | null;

const RSVP_CONFIG = {
  going: {
    label: 'Going',
    icon: Check,
    active: 'bg-ember-green/20 text-ember-green border-ember-green/40',
    inactive: 'bg-ember-surface2 text-ember-muted border-ember-border hover:border-ember-green/40',
  },
  maybe: {
    label: 'Maybe',
    icon: Minus,
    active: 'bg-ember-amber/20 text-ember-amber border-ember-amber/40',
    inactive: 'bg-ember-surface2 text-ember-muted border-ember-border hover:border-ember-amber/40',
  },
  declined: {
    label: 'Can\'t go',
    icon: X,
    active: 'bg-red-500/20 text-red-400 border-red-400/40',
    inactive: 'bg-ember-surface2 text-ember-muted border-ember-border hover:border-red-400/40',
  },
};

const MENU_CAT_ICONS: Record<string, string> = {
  meat: '🥩', veggie: '🥦', side: '🥗', drink: '🍺', dessert: '🍨',
};

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = EVENTS.find(e => e.id === id) ?? EVENTS[0];

  const [rsvp, setRsvp] = useState<RsvpStatus>('going');
  const [activeSection, setActiveSection] = useState<'about' | 'guests' | 'menu'>('about');
  const [bringingText, setBringingText] = useState('');

  const goingGuests = event.guests.filter(g => g.rsvp === 'going');
  const maybeGuests = event.guests.filter(g => g.rsvp === 'maybe');
  const spotsLeft = event.maxGuests - goingGuests.length;
  const isHost = event.host.id === CURRENT_USER.id;

  const groupedMenu = event.menu.reduce<Record<string, typeof event.menu>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-ember-bg pb-24 md:pb-8">
      {/* Hero cover */}
      <div className={`relative h-56 md:h-72 bg-gradient-to-br ${event.coverGradient} overflow-hidden`}>
        {/* Noise */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ember-bg via-transparent to-transparent" />

        {/* Emoji */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl drop-shadow-2xl">{event.coverEmoji}</span>
        </div>

        {/* Top controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-ember-bg/70 backdrop-blur-sm rounded-full flex items-center justify-center
                       text-ember-cream hover:bg-ember-bg/90 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            <button
              className="w-9 h-9 bg-ember-bg/70 backdrop-blur-sm rounded-full flex items-center justify-center
                         text-ember-cream hover:bg-ember-bg/90 transition-colors"
            >
              <Share2 size={16} />
            </button>
            {isHost && (
              <Button variant="primary" size="sm">Edit</Button>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="absolute bottom-4 left-4">
          {event.status === 'live' && (
            <div className="flex items-center gap-1.5 bg-ember-orange/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              <Flame size={12} className="animate-pulse" /> Live now
            </div>
          )}
        </div>
      </div>

      <div className="page-container relative z-10 -mt-4">
        {/* Event header card */}
        <div className="glass-card p-5 mb-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-2xl font-black text-ember-cream leading-tight">{event.title}</h1>
            <Badge variant={event.isPublic ? 'green' : 'ghost'}
              icon={event.isPublic ? <Globe size={10}/> : <Lock size={10}/>}>
              {event.isPublic ? 'Public' : 'Private'}
            </Badge>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 gap-2 mb-4">
            <div className="flex items-center gap-2 text-ember-muted text-sm">
              <Clock size={14} className="text-ember-orange flex-shrink-0" />
              <span className="text-ember-cream font-medium">
                {format(new Date(event.date), 'EEEE, MMMM d, yyyy')} · {event.time}
              </span>
            </div>
            <div className="flex items-center gap-2 text-ember-muted text-sm">
              <MapPin size={14} className="text-ember-orange flex-shrink-0" />
              <span>{event.location}</span>
              {event.address && (
                <span className="text-ember-subtle">· {event.address}</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-ember-muted text-sm">
              <Users size={14} className="text-ember-orange flex-shrink-0" />
              <span>
                <span className="text-ember-cream font-medium">{goingGuests.length} going</span>
                {' '}·{' '}
                {spotsLeft > 0
                  ? <span className={spotsLeft <= 3 ? 'text-ember-orange font-medium' : ''}>{spotsLeft} spots left</span>
                  : <span className="text-red-400">Full</span>
                }
                {' '}· {event.maxGuests} max
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {event.tags.map(tag => (
              <Badge key={tag} variant="ghost" size="sm">#{tag}</Badge>
            ))}
          </div>

          {/* Host */}
          <div className="flex items-center gap-3 p-3 bg-ember-surface2 rounded-xl">
            <Avatar src={event.host.avatar} name={event.host.name} size="md" ring />
            <div className="flex-1">
              <p className="text-ember-cream font-semibold text-sm">{event.host.name}</p>
              <p className="text-ember-muted text-xs">@{event.host.handle} · Host</p>
            </div>
            <Button variant="outline" size="sm" icon={<MessageCircle size={14}/>}>
              Message
            </Button>
          </div>
        </div>

        {/* RSVP card */}
        {!isHost && (
          <div className="glass-card p-5 mb-4">
            <p className="text-ember-cream font-bold mb-3">Are you coming?</p>
            <div className="flex gap-2 mb-4">
              {(Object.entries(RSVP_CONFIG) as Array<[keyof typeof RSVP_CONFIG, typeof RSVP_CONFIG[keyof typeof RSVP_CONFIG]]>).map(
                ([key, config]) => {
                  const Icon = config.icon;
                  const isActive = rsvp === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setRsvp(key)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                                  text-sm font-semibold border transition-all duration-200 ${
                        isActive ? config.active : config.inactive
                      }`}
                    >
                      <Icon size={14} />
                      {config.label}
                    </button>
                  );
                }
              )}
            </div>

            {rsvp === 'going' && (
              <div className="animate-fade-in">
                <label className="block text-ember-muted text-xs font-semibold mb-1.5">
                  What are you bringing? (optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Coleslaw & corn"
                    value={bringingText}
                    onChange={e => setBringingText(e.target.value)}
                    className="ember-input flex-1 text-sm"
                  />
                  <Button variant="primary" size="md">
                    <Check size={14} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section tabs */}
        <div className="flex gap-1 bg-ember-surface rounded-xl p-1 mb-4">
          {(['about', 'guests', 'menu'] as const).map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                activeSection === section
                  ? 'bg-ember-surface2 text-ember-cream'
                  : 'text-ember-muted hover:text-ember-cream'
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        {/* About */}
        {activeSection === 'about' && (
          <div className="glass-card p-5 animate-fade-in">
            <p className="text-ember-muted leading-relaxed">{event.description}</p>
            {event.rsvpDeadline && (
              <div className="mt-4 pt-4 border-t border-ember-border/50 flex items-center gap-2 text-xs text-ember-subtle">
                <Clock size={12} />
                RSVP by {format(new Date(event.rsvpDeadline), 'MMM d, yyyy')}
              </div>
            )}
          </div>
        )}

        {/* Guests */}
        {activeSection === 'guests' && (
          <div className="space-y-3 animate-fade-in">
            {goingGuests.length > 0 && (
              <div>
                <p className="text-ember-muted text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Check size={12} className="text-ember-green" /> Going · {goingGuests.length}
                </p>
                <div className="space-y-2">
                  {goingGuests.map(({ user, bringing }) => (
                    <div key={user.id} className="glass-card p-3 flex items-center gap-3">
                      <Avatar src={user.avatar} name={user.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-ember-cream font-semibold text-sm">{user.name}</p>
                        {bringing && (
                          <p className="text-ember-muted text-xs truncate">Bringing: {bringing}</p>
                        )}
                      </div>
                      {user.id === event.host.id && (
                        <Badge variant="orange" size="sm">Host</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {maybeGuests.length > 0 && (
              <div>
                <p className="text-ember-muted text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Minus size={12} className="text-ember-amber" /> Maybe · {maybeGuests.length}
                </p>
                <div className="space-y-2">
                  {maybeGuests.map(({ user }) => (
                    <div key={user.id} className="glass-card p-3 flex items-center gap-3 opacity-70">
                      <Avatar src={user.avatar} name={user.name} size="sm" />
                      <p className="text-ember-cream font-semibold text-sm">{user.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Menu */}
        {activeSection === 'menu' && (
          <div className="space-y-4 animate-fade-in">
            {Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category} className="glass-card p-4">
                <p className="text-ember-cream font-bold text-sm mb-3 flex items-center gap-2">
                  <span>{MENU_CAT_ICONS[category]}</span>
                  <span className="capitalize">{category}</span>
                  <Badge variant="ghost" size="sm">{items.length}</Badge>
                </p>
                <div className="space-y-2">
                  {items.map(item => {
                    const claimedUser = item.claimedBy
                      ? event.guests.find(g => g.user.id === item.claimedBy)?.user
                        ?? (event.host.id === item.claimedBy ? event.host : null)
                      : null;

                    return (
                      <div key={item.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          <Utensils size={12} className="text-ember-subtle" />
                          <span className="text-ember-cream text-sm">{item.name}</span>
                        </div>
                        {claimedUser ? (
                          <div className="flex items-center gap-1.5">
                            <Avatar src={claimedUser.avatar} name={claimedUser.name} size="xs" />
                            <span className="text-ember-muted text-xs">{claimedUser.name}</span>
                          </div>
                        ) : (
                          <Button variant="outline" size="sm">Claim</Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {Object.keys(groupedMenu).length === 0 && (
              <div className="text-center py-12 text-ember-subtle">
                <div className="text-4xl mb-2">🍽️</div>
                <p className="text-sm">No menu set yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
