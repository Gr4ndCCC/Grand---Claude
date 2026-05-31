import { supabase } from '../lib/supabase';
import type { User, Rank } from '../lib/auth';

export type { Rank };

export interface Attendee { id: string; name: string; rank: Rank }
export interface Contribution {
  id: string; userId: string; userName: string;
  item: string; quantity?: string; emoji?: string;
}
export interface ChatMsg {
  id: string; author: string; rank: Rank; text: string; time: string;
}
export interface JoinRequest {
  id: string; eventId: string; userId: string;
  displayName: string; status: 'pending' | 'accepted' | 'declined';
}

export interface EmberEvent {
  id: string;
  hostUserId: string;
  city: string;
  flag: string;
  title: string;
  host: string;
  hostRank: Rank;
  date: string;          // friendly display string
  rawDate: string;       // ISO yyyy-mm-dd
  time: string;
  guests: number;        // attendee count
  max: number;           // capacity
  isPublic: boolean;
  tags: string[];
  location: string;      // general area, always visible
  address?: string;      // full address, only when authorised (RLS-gated)
  latitude?: number;
  longitude?: number;
  description: string;
  theme: string;
  coverColor: string;
  weather: { temp: string; condition: string; wind: string; humidity: string; icon: string };
  attendees: Attendee[];
  contributions: Contribution[];
  chat: ChatMsg[];
  needed: string[];
}

export const COVER_PALETTE = [
  { name: 'Maroon',   value: '#800000' },
  { name: 'Ember',    value: '#B8460B' },
  { name: 'Sunset',   value: '#D97706' },
  { name: 'Forest',   value: '#1F4D2E' },
  { name: 'Midnight', value: '#1E1B4B' },
  { name: 'Charcoal', value: '#27272A' },
  { name: 'Beige',    value: '#A88B6A' },
  { name: 'Crimson',  value: '#9F1239' },
];

export const THEME_OPTIONS = [
  'Sunset BBQ', 'Rooftop Grill', 'Garden Party', 'Chill BBQ',
  'Smokehouse Night', 'Churrasco Night', 'Winter Fire-Pit',
  'Beach BBQ', 'Backyard Classic',
];

const PLACEHOLDER_WEATHER = {
  temp: '—', condition: 'Weather coming soon', wind: '—', humidity: '—', icon: '🌤️',
};

function friendlyDate(iso: string | null): string {
  if (!iso) return 'Date TBD';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

/* ── row mappers ─────────────────────────────────────────────── */

interface EventRow {
  id: string; host_user_id: string; host_display_name: string;
  title: string; description: string | null; city: string | null; flag: string | null;
  location_name: string | null; event_date: string | null; event_time: string | null;
  visibility: 'public' | 'private'; capacity: number; theme: string | null;
  cover_color: string | null; tags: string[]; needed: string[];
  event_attendees?: { user_id: string; display_name: string; tier: Rank }[] | { count: number }[];
  contributions?: { id: string; user_id: string; user_name: string; item: string; quantity: string | null; emoji: string | null }[];
  event_private_details?: { address: string | null; latitude: number | null; longitude: number | null } | { address: string | null; latitude: number | null; longitude: number | null }[] | null;
}

function attendeeCount(row: EventRow): number {
  const a = row.event_attendees;
  if (!a || a.length === 0) return 0;
  if ('count' in a[0]) return (a[0] as { count: number }).count;
  return a.length;
}

function mapEvent(row: EventRow): EmberEvent {
  const attendeesRaw = Array.isArray(row.event_attendees) && row.event_attendees.length && 'user_id' in row.event_attendees[0]
    ? (row.event_attendees as { user_id: string; display_name: string; tier: Rank }[])
    : [];
  const pd = Array.isArray(row.event_private_details) ? row.event_private_details[0] : row.event_private_details;

  return {
    id: row.id,
    hostUserId: row.host_user_id,
    city: row.city ?? '',
    flag: row.flag ?? '🔥',
    title: row.title,
    host: row.host_display_name,
    hostRank: 'Iron',
    date: friendlyDate(row.event_date),
    rawDate: row.event_date ?? '',
    time: row.event_time ?? '',
    guests: attendeeCount(row) || attendeesRaw.length,
    max: row.capacity,
    isPublic: row.visibility === 'public',
    tags: row.tags ?? [],
    location: row.location_name ?? '',
    address: pd?.address ?? undefined,
    latitude: pd?.latitude ?? undefined,
    longitude: pd?.longitude ?? undefined,
    description: row.description ?? '',
    theme: row.theme ?? '',
    coverColor: row.cover_color ?? '#800000',
    weather: PLACEHOLDER_WEATHER,
    attendees: attendeesRaw.map(a => ({ id: a.user_id, name: a.display_name, rank: a.tier })),
    contributions: (row.contributions ?? []).map(c => ({
      id: c.id, userId: c.user_id, userName: c.user_name,
      item: c.item, quantity: c.quantity ?? undefined, emoji: c.emoji ?? undefined,
    })),
    chat: [],
    needed: row.needed ?? [],
  };
}

/* ── reads ───────────────────────────────────────────────────── */

export async function getAllEvents(): Promise<EmberEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*, event_attendees(count)')
    .order('event_date', { ascending: true });
  if (error) { console.error('getAllEvents', error); return []; }
  return (data as EventRow[]).map(mapEvent);
}

export async function getEvent(id: string): Promise<EmberEvent | null> {
  const { data, error } = await supabase
    .from('events')
    .select(`*,
      event_attendees ( user_id, display_name, tier ),
      contributions ( id, user_id, user_name, item, quantity, emoji ),
      event_private_details ( address, latitude, longitude )`)
    .eq('id', id)
    .maybeSingle();
  if (error) { console.error('getEvent', error); return null; }
  if (!data) return null;
  const ev = mapEvent(data as EventRow);
  ev.chat = await getMessages(id);
  return ev;
}

export async function getMessages(eventId: string): Promise<ChatMsg[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('id, author, tier, text, created_at')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });
  if (error) return [];
  return (data ?? []).map(m => ({
    id: m.id, author: m.author, rank: m.tier as Rank, text: m.text,
    time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));
}

export function subscribeToMessages(eventId: string, onInsert: (msg: ChatMsg) => void) {
  const channel = supabase
    .channel(`messages:${eventId}`)
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `event_id=eq.${eventId}` },
      payload => {
        const m = payload.new as { id: string; author: string; tier: Rank; text: string; created_at: string };
        onInsert({
          id: m.id, author: m.author, rank: m.tier, text: m.text,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

/* ── account queries ─────────────────────────────────────────── */

export async function getHostedEvents(userId: string): Promise<EmberEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*, event_attendees(count)')
    .eq('host_user_id', userId)
    .order('event_date', { ascending: true });
  if (error) return [];
  return (data as EventRow[]).map(mapEvent);
}

export async function getAttendingEvents(userId: string): Promise<EmberEvent[]> {
  const { data, error } = await supabase
    .from('event_attendees')
    .select('events!inner ( *, event_attendees(count) )')
    .eq('user_id', userId);
  if (error) return [];
  const rows = (data ?? []) as unknown as { events: EventRow }[];
  return rows
    .map(r => mapEvent(r.events))
    .filter(e => e.hostUserId !== userId);
}

/* ── join request flow ───────────────────────────────────────── */

export async function getMyRequest(eventId: string, userId: string): Promise<JoinRequest | null> {
  const { data } = await supabase
    .from('join_requests')
    .select('*')
    .eq('event_id', eventId).eq('user_id', userId)
    .maybeSingle();
  if (!data) return null;
  return { id: data.id, eventId: data.event_id, userId: data.user_id, displayName: data.display_name, status: data.status };
}

export async function listRequests(eventId: string): Promise<JoinRequest[]> {
  const { data } = await supabase
    .from('join_requests')
    .select('*')
    .eq('event_id', eventId).eq('status', 'pending')
    .order('created_at', { ascending: true });
  return (data ?? []).map(d => ({ id: d.id, eventId: d.event_id, userId: d.user_id, displayName: d.display_name, status: d.status }));
}

export async function requestToJoin(eventId: string, user: User): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('join_requests')
    .insert({ event_id: eventId, user_id: user.id, display_name: user.name });
  return { error: error ? error.message : null };
}

export async function acceptRequest(requestId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('join_requests').update({ status: 'accepted' }).eq('id', requestId);
  return { error: error ? error.message : null };
}

export async function declineRequest(requestId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('join_requests').update({ status: 'declined' }).eq('id', requestId);
  return { error: error ? error.message : null };
}

/* ── mutations ───────────────────────────────────────────────── */

export async function joinEvent(eventId: string, user: User): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('event_attendees')
    .insert({ event_id: eventId, user_id: user.id, display_name: user.name, tier: user.tier });
  return { error: error ? error.message : null };
}

export async function leaveEvent(eventId: string, userId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('event_attendees')
    .delete()
    .eq('event_id', eventId).eq('user_id', userId);
  return { error: error ? error.message : null };
}

export async function addContribution(
  eventId: string, user: User, item: string, quantity?: string, emoji?: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('contributions').insert({
    event_id: eventId, user_id: user.id, user_name: user.name,
    item, quantity: quantity || null, emoji: emoji || null,
  });
  return { error: error ? error.message : null };
}

export async function postChat(eventId: string, user: User, text: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('messages').insert({
    event_id: eventId, user_id: user.id, author: user.name, tier: user.tier, text,
  });
  return { error: error ? error.message : null };
}

export interface CreateEventInput {
  title: string; description: string; city: string; flag?: string;
  locationName: string; address?: string; latitude?: number; longitude?: number;
  date: string; time: string; isPublic: boolean; max: number;
  theme: string; coverColor: string; tags: string[]; needed: string[];
}

export async function createEvent(input: CreateEventInput, user: User): Promise<{ id: string | null; error: string | null }> {
  const { data, error } = await supabase.from('events').insert({
    host_user_id: user.id,
    host_display_name: user.name,
    title: input.title,
    description: input.description,
    city: input.city,
    flag: input.flag || '🔥',
    location_name: input.locationName,
    event_date: input.date || null,
    event_time: input.time,
    visibility: input.isPublic ? 'public' : 'private',
    capacity: input.max,
    theme: input.theme,
    cover_color: input.coverColor,
    tags: input.tags,
    needed: input.needed,
  }).select('id').single();

  if (error || !data) return { id: null, error: error?.message ?? 'Could not create event' };
  const eventId = data.id;

  // full address / coordinates (RLS-gated table)
  if (input.address || input.latitude != null) {
    await supabase.from('event_private_details').insert({
      event_id: eventId,
      address: input.address || null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
    });
  }

  // host is automatically the first attendee
  await supabase.from('event_attendees').insert({
    event_id: eventId, user_id: user.id, display_name: user.name, tier: user.tier,
  });

  return { id: eventId, error: null };
}

export async function deleteEvent(eventId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('events').delete().eq('id', eventId);
  return { error: error ? error.message : null };
}

export function summarizeContributions(ev: EmberEvent) {
  const covered = ev.contributions.map(c => c.item);
  const stillMissing = ev.needed.filter(n => !covered.some(c => c.toLowerCase().includes(n.toLowerCase())));
  return { covered, stillMissing };
}
