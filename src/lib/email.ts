import { supabase } from './supabase';

const API = (import.meta.env.VITE_EMAIL_API_URL ?? '/api').replace(/\/$/, '');

async function getToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function post(path: string, body: Record<string, unknown>) {
  if (!API) return;
  const token = await getToken();
  fetch(`${API}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  }).catch(() => {});
}

export function sendWelcomeEmail(name: string, email: string) {
  post('/email/welcome', { name, email });
}

export function sendEventRsvpEmail(params: {
  name: string;
  email: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventId: string;
}) {
  post('/email/event-rsvp', params);
}

export function sendEventHostEmail(params: {
  name: string;
  email: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventId: string;
  maxGuests: number;
}) {
  post('/email/event-host', params);
}

export function sendNewsletterEmail(email: string, name?: string) {
  post('/email/newsletter', { email, name: name ?? '' });
}
