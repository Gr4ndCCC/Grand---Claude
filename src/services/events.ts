import { apiRequest } from '../lib/api';
import type { Event, User } from '../types';

// Mirror of COVER_OPTIONS in CreateEvent.tsx — index-matched
const COVER_OPTIONS = [
  { emoji: '🥩', gradient: 'from-ember-red via-ember-orange to-ember-amber',  color: '#800000' },
  { emoji: '🌆', gradient: 'from-purple-900 via-ember-red to-ember-orange',   color: '#7C3AED' },
  { emoji: '🌱', gradient: 'from-green-900 via-green-700 to-ember-amber',      color: '#16A34A' },
  { emoji: '🍗', gradient: 'from-yellow-800 via-ember-amber to-ember-gold',    color: '#B45309' },
  { emoji: '🦐', gradient: 'from-orange-900 via-ember-orange to-ember-amber',  color: '#EA580C' },
  { emoji: '🌽', gradient: 'from-yellow-900 via-yellow-600 to-ember-gold',     color: '#CA8A04' },
  { emoji: '🍖', gradient: 'from-red-900 via-ember-red to-ember-orange',       color: '#DC2626' },
  { emoji: '🔥', gradient: 'from-ember-bg via-ember-red to-ember-orange',      color: '#FF5C1A' },
];

// The cover color hex values CreateEvent uses, index-aligned with COVER_OPTIONS
export const COVER_COLORS = COVER_OPTIONS.map(o => o.color);

function getCover(hex: string) {
  return COVER_OPTIONS.find(o => o.color === hex) ?? COVER_OPTIONS[7];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptUser(u: any): User {
  return {
    id: u.id,
    name: u.full_name || u.username,
    handle: u.username,
    avatar:
      u.avatar_url ||
      `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(u.username)}&backgroundColor=FF5C1A`,
    bio: u.bio ?? '',
    eventsHosted: u.events_hosted ?? 0,
    eventsAttended: 0,
    followers: u.followers_count ?? 0,
    following: u.following_count ?? 0,
    badges: [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptEvent(e: any): Event {
  const cover = getCover(e.cover_color ?? '#FF5C1A');
  const dt = new Date(e.date_time);
  const timeStr = `${dt.getHours().toString().padStart(2, '0')}:${dt
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  return {
    id: e.id,
    title: e.title,
    description: e.description ?? '',
    date: e.date_time,
    time: timeStr,
    location: e.location_name ?? e.city ?? 'TBD',
    address: e.address ?? '',
    lat: e.lat,
    lng: e.lng,
    coverEmoji: cover.emoji,
    coverGradient: cover.gradient,
    host: adaptUser(e.host),
    guests: (e.participants ?? []).map((p: any) => ({
      user: adaptUser(p.user),
      rsvp: p.status === 'confirmed' ? ('going' as const) : ('maybe' as const),
    })),
    maxGuests: e.max_participants ?? 20,
    tags: [],
    isPublic: !e.is_private,
    menu: (e.contributions ?? []).map((c: any) => ({
      id: c.id,
      name: c.item_name,
      category: 'side' as const,
      claimedBy: c.user_id,
    })),
    rsvpDeadline: e.end_time ?? e.date_time,
    status: (e.status as 'upcoming' | 'live' | 'past') ?? 'upcoming',
  };
}

export async function fetchEvents(): Promise<Event[] | null> {
  const { data } = await apiRequest<{ events: unknown[] }>('/api/events');
  if (!data?.events) return null;
  return data.events.map(adaptEvent);
}

export async function fetchEvent(id: string): Promise<Event | null> {
  const { data } = await apiRequest<{ event: unknown }>(`/api/events/${id}`);
  if (!data?.event) return null;
  return adaptEvent(data.event);
}

export async function createEvent(payload: {
  title: string;
  description?: string;
  location_name: string;
  address?: string;
  date_time: string;
  max_participants: number;
  is_private: boolean;
  cover_color: string;
}): Promise<Event | null> {
  const { data } = await apiRequest<{ event: unknown }>('/api/events', {
    method: 'POST',
    body: payload,
  });
  if (!data?.event) return null;
  return adaptEvent(data.event);
}

export async function joinEvent(id: string): Promise<boolean> {
  const { error } = await apiRequest(`/api/events/${id}/join`, { method: 'POST' });
  return !error;
}

export async function leaveEvent(id: string): Promise<boolean> {
  const { error } = await apiRequest(`/api/events/${id}/join`, { method: 'DELETE' });
  return !error;
}
