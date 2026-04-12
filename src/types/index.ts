export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  eventsHosted: number;
  eventsAttended: number;
  followers: number;
  following: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  color: 'orange' | 'amber' | 'green' | 'blue';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;       // ISO string
  time: string;
  location: string;
  address: string;
  lat?: number;
  lng?: number;
  coverEmoji: string;
  coverGradient: string;
  host: User;
  guests: EventGuest[];
  maxGuests: number;
  tags: string[];
  isPublic: boolean;
  menu: MenuItem[];
  rsvpDeadline: string;
  status: 'upcoming' | 'live' | 'past';
}

export interface EventGuest {
  user: User;
  rsvp: 'going' | 'maybe' | 'declined';
  bringing?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'meat' | 'veggie' | 'side' | 'drink' | 'dessert';
  claimedBy?: string; // user id
}

export type Tab = 'discover' | 'my-events' | 'invited';
