import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Lock } from 'lucide-react';
import { format } from 'date-fns';
import type { Event } from '../types';
import { Avatar, AvatarGroup } from './ui/Avatar';
import { Badge } from './ui/Badge';

interface EventCardProps {
  event: Event;
  compact?: boolean;
}

const STATUS_LABEL: Record<Event['status'], { label: string; variant: 'green' | 'orange' | 'ghost' }> = {
  live:     { label: 'Live now 🔥', variant: 'orange' },
  upcoming: { label: 'Upcoming',    variant: 'green' },
  past:     { label: 'Past',        variant: 'ghost' },
};

export function EventCard({ event, compact = false }: EventCardProps) {
  const navigate = useNavigate();
  const goingCount = event.guests.filter(g => g.rsvp === 'going').length;
  const spotsLeft = event.maxGuests - goingCount;
  const { label, variant } = STATUS_LABEL[event.status];

  return (
    <article
      onClick={() => navigate(`/events/${event.id}`)}
      className="group glass-card overflow-hidden cursor-pointer transition-all duration-300
                 hover:-translate-y-1 hover:shadow-card-hover hover:border-ember-border
                 animate-fade-in"
    >
      {/* Cover */}
      <div className={`relative h-36 bg-gradient-to-br ${event.coverGradient} flex items-center justify-center overflow-hidden`}>
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }}
        />
        <span className="text-6xl relative z-10 drop-shadow-xl group-hover:scale-110 transition-transform duration-300">
          {event.coverEmoji}
        </span>
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={variant}>{label}</Badge>
        </div>
        {/* Privacy */}
        {!event.isPublic && (
          <div className="absolute top-3 right-3">
            <Badge variant="ghost" icon={<Lock size={10} />}>Private</Badge>
          </div>
        )}
        {/* Date strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ember-bg/90 to-transparent px-4 py-2">
          <p className="text-ember-cream font-bold text-sm">
            {format(new Date(event.date), 'EEE, MMM d')} · {event.time}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-ember-cream text-base leading-tight line-clamp-1 group-hover:fire-text transition-all">
            {event.title}
          </h3>
          {spotsLeft <= 3 && spotsLeft > 0 && (
            <span className="text-xs text-ember-orange font-semibold whitespace-nowrap flex-shrink-0">
              {spotsLeft} left!
            </span>
          )}
          {spotsLeft <= 0 && (
            <span className="text-xs text-ember-muted font-semibold whitespace-nowrap flex-shrink-0">Full</span>
          )}
        </div>

        {!compact && (
          <p className="text-ember-muted text-sm line-clamp-2 mb-3 leading-relaxed">
            {event.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center gap-1.5 text-ember-muted text-xs">
            <MapPin size={12} className="text-ember-orange flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-ember-muted text-xs">
            <Users size={12} className="text-ember-orange flex-shrink-0" />
            <span>{goingCount} going · {event.maxGuests} max</span>
          </div>
        </div>

        {/* Tags */}
        {!compact && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {event.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="ghost" size="sm">#{tag}</Badge>
            ))}
          </div>
        )}

        {/* Footer: host + guests */}
        <div className="flex items-center justify-between pt-3 border-t border-ember-border/50">
          <div className="flex items-center gap-2">
            <Avatar src={event.host.avatar} name={event.host.name} size="xs" />
            <span className="text-xs text-ember-muted">
              by <span className="text-ember-cream font-medium">{event.host.name}</span>
            </span>
          </div>
          <AvatarGroup
            users={event.guests.map(g => ({ name: g.user.name, avatar: g.user.avatar }))}
            max={3}
            size="xs"
          />
        </div>
      </div>
    </article>
  );
}
