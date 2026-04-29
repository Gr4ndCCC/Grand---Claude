export type Rank = 'Ember' | 'Iron' | 'Gold' | 'Legend';

export interface Attendee {
  id: string;
  name: string;
  rank: Rank;
}

export interface Contribution {
  id: string;
  userId: string;
  userName: string;
  item: string;
  quantity?: string;
  emoji?: string;
}

export interface ChatMsg {
  id: string;
  author: string;
  rank: Rank;
  text: string;
  time: string;
}

export interface EmberEvent {
  id: string;
  city: string;
  flag: string;
  title: string;
  host: string;
  hostRank: Rank;
  date: string;
  time: string;
  guests: number;
  max: number;
  isPublic: boolean;
  tags: string[];
  location: string;
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
  { name: 'Maroon',  value: '#800000' },
  { name: 'Ember',   value: '#B8460B' },
  { name: 'Sunset',  value: '#D97706' },
  { name: 'Forest',  value: '#1F4D2E' },
  { name: 'Midnight',value: '#1E1B4B' },
  { name: 'Charcoal',value: '#27272A' },
  { name: 'Beige',   value: '#A88B6A' },
  { name: 'Crimson', value: '#9F1239' },
];

export const THEME_OPTIONS = [
  'Sunset BBQ',
  'Rooftop Grill',
  'Garden Party',
  'Chill BBQ',
  'Smokehouse Night',
  'Churrasco Night',
  'Winter Fire-Pit',
  'Beach BBQ',
  'Backyard Classic',
];

const seedEvents: EmberEvent[] = [
  {
    id: 'e1',
    city: 'Amsterdam', flag: '🇳🇱',
    title: 'Amsterdam Sunset BBQ',
    host: 'Lars V.', hostRank: 'Gold',
    date: 'Sat, May 2', time: '18:00',
    guests: 8, max: 12, isPublic: true,
    tags: ['charcoal', 'brisket', 'rooftop'],
    location: 'Jordaan Rooftop, Amsterdam',
    description: 'Classic charcoal BBQ overlooking the canals. Brisket is the star — bring your best side and a great mood.',
    theme: 'Rooftop Grill',
    coverColor: '#800000',
    weather: { temp: '15°C', condition: 'Partly cloudy', wind: '12 km/h NW', humidity: '68%', icon: '⛅' },
    attendees: [
      { id: 'u1', name: 'Lars V.',  rank: 'Gold'   },
      { id: 'u2', name: 'Nina K.',  rank: 'Iron'   },
      { id: 'u3', name: 'Tom B.',   rank: 'Ember'  },
      { id: 'u4', name: 'Saar D.',  rank: 'Iron'   },
      { id: 'u5', name: 'Marco L.', rank: 'Gold'   },
      { id: 'u6', name: 'Eline P.', rank: 'Iron'   },
      { id: 'u7', name: 'Daan R.',  rank: 'Ember'  },
      { id: 'u8', name: 'Femke J.', rank: 'Iron'   },
    ],
    contributions: [
      { id: 'co1', userId: 'u1', userName: 'Lars V.',  item: 'Smoked brisket',   quantity: '5kg',  emoji: '🥩' },
      { id: 'co2', userId: 'u2', userName: 'Nina K.',  item: 'Dutch coleslaw',   quantity: 'big bowl', emoji: '🥗' },
      { id: 'co3', userId: 'u3', userName: 'Tom B.',   item: 'Cold Heineken',    quantity: '×24',  emoji: '🍺' },
      { id: 'co4', userId: 'u4', userName: 'Saar D.',  item: 'Potato salad',     quantity: '2kg',  emoji: '🥔' },
      { id: 'co5', userId: 'u5', userName: 'Marco L.', item: 'Chimichurri',      quantity: '500ml',emoji: '🌶️' },
      { id: 'co6', userId: 'u6', userName: 'Eline P.', item: 'Bread rolls',      quantity: '×20',  emoji: '🍞' },
      { id: 'co7', userId: 'u7', userName: 'Daan R.',  item: 'Charcoal',         quantity: '10kg', emoji: '⚫' },
      { id: 'co8', userId: 'u8', userName: 'Femke J.', item: 'Brownies',         quantity: '×24',  emoji: '🍫' },
    ],
    chat: [
      { id: 'm1', author: 'Lars V.',  rank: 'Gold',  text: 'Brisket on at 6am — perfect by 18:00. See you all there!', time: '08:14' },
      { id: 'm2', author: 'Nina K.',  rank: 'Iron',  text: 'Coleslaw already marinating 🥗',                            time: '09:32' },
      { id: 'm3', author: 'Tom B.',   rank: 'Ember', text: 'Bringing 12 extra beers, just in case 🍻',                  time: '10:05' },
      { id: 'm4', author: 'Marco L.', rank: 'Gold',  text: 'Anyone need fire starters? I can grab some',                time: '11:47' },
      { id: 'm5', author: 'Daan R.',  rank: 'Ember', text: 'Got charcoal AND starters covered. Just bring vibes',       time: '12:03' },
      { id: 'm6', author: 'Lars V.',  rank: 'Gold',  text: 'Rooftop access code: #1204. Elevator → floor 7 → stairs.',  time: '14:30' },
    ],
    needed: ['Wine', 'Veggie skewers', 'Chicken thighs'],
  },
  {
    id: 'e2',
    city: 'Tokyo', flag: '🇯🇵',
    title: 'Tokyo Garden Grill',
    host: 'Hiro M.', hostRank: 'Iron',
    date: 'Sun, May 3', time: '17:00',
    guests: 6, max: 10, isPublic: true,
    tags: ['yakitori', 'binchotan'],
    location: 'Shibuya Sky Garden, Tokyo',
    description: 'Yakitori over binchotan charcoal. Small group, big flavor.',
    theme: 'Garden Party',
    coverColor: '#9F1239',
    weather: { temp: '21°C', condition: 'Clear', wind: '6 km/h E', humidity: '52%', icon: '☀️' },
    attendees: [
      { id: 'u9',  name: 'Hiro M.',   rank: 'Iron'  },
      { id: 'u10', name: 'Aiko S.',   rank: 'Ember' },
      { id: 'u11', name: 'Ken T.',    rank: 'Gold'  },
      { id: 'u12', name: 'Yuna H.',   rank: 'Iron'  },
      { id: 'u13', name: 'Daisuke O.',rank: 'Ember' },
      { id: 'u14', name: 'Mei R.',    rank: 'Iron'  },
    ],
    contributions: [
      { id: 'co9',  userId: 'u9',  userName: 'Hiro M.',   item: 'Yakitori skewers', quantity: '×40', emoji: '🍢' },
      { id: 'co10', userId: 'u10', userName: 'Aiko S.',   item: 'Edamame',          quantity: '1kg', emoji: '🟢' },
      { id: 'co11', userId: 'u11', userName: 'Ken T.',    item: 'Asahi beer',       quantity: '×12', emoji: '🍺' },
      { id: 'co12', userId: 'u12', userName: 'Yuna H.',   item: 'Mochi dessert',    quantity: '×20', emoji: '🍡' },
    ],
    chat: [
      { id: 'm7', author: 'Hiro M.', rank: 'Iron', text: 'Binchotan lit at 16:30. Skewers ready to go.', time: '16:30' },
      { id: 'm8', author: 'Ken T.',  rank: 'Gold', text: 'On my way with the beers 🍺',                   time: '16:45' },
    ],
    needed: ['Sake', 'Pickled vegetables', 'Rice balls'],
  },
  {
    id: 'e3',
    city: 'New York', flag: '🇺🇸',
    title: 'Brooklyn Smokehouse Night',
    host: 'Marcus B.', hostRank: 'Legend',
    date: 'Fri, May 8', time: '19:00',
    guests: 14, max: 20, isPublic: true,
    tags: ['smoke', 'brisket', 'ribs'],
    location: 'Williamsburg Loft, Brooklyn NY',
    description: '14-hour smoked brisket and ribs. Bourbon optional but encouraged.',
    theme: 'Smokehouse Night',
    coverColor: '#1E1B4B',
    weather: { temp: '18°C', condition: 'Light rain', wind: '15 km/h SW', humidity: '78%', icon: '🌧️' },
    attendees: [
      { id: 'u15', name: 'Marcus B.', rank: 'Legend' },
      { id: 'u16', name: 'Jay T.',    rank: 'Gold'   },
      { id: 'u17', name: 'Sam K.',    rank: 'Iron'   },
      { id: 'u18', name: 'Diana R.',  rank: 'Gold'   },
      { id: 'u19', name: 'Mike P.',   rank: 'Iron'   },
      { id: 'u20', name: 'Carla W.',  rank: 'Ember'  },
      { id: 'u21', name: 'Vince M.',  rank: 'Iron'   },
    ],
    contributions: [
      { id: 'co13', userId: 'u15', userName: 'Marcus B.', item: 'Smoked brisket', quantity: '8kg',  emoji: '🥩' },
      { id: 'co14', userId: 'u16', userName: 'Jay T.',    item: 'Pork ribs',      quantity: '6 racks', emoji: '🍖' },
      { id: 'co15', userId: 'u17', userName: 'Sam K.',    item: 'Mac & cheese',   quantity: 'large pan', emoji: '🧀' },
      { id: 'co16', userId: 'u18', userName: 'Diana R.',  item: 'Bourbon',        quantity: '2 bottles', emoji: '🥃' },
      { id: 'co17', userId: 'u19', userName: 'Mike P.',   item: 'BBQ sauce',      quantity: 'homemade',  emoji: '🍯' },
    ],
    chat: [
      { id: 'm9',  author: 'Marcus B.', rank: 'Legend', text: 'Brisket has been on since 5am. Smelling unreal.', time: '11:00' },
      { id: 'm10', author: 'Jay T.',    rank: 'Gold',   text: 'Ribs prepped and rubbed. Bringing my 18-yr bourbon too.', time: '12:15' },
      { id: 'm11', author: 'Diana R.',  rank: 'Gold',   text: 'Light rain forecast — should we move under the awning?', time: '13:42' },
      { id: 'm12', author: 'Marcus B.', rank: 'Legend', text: 'Awning is up. We\'re covered. Smoker stays on the balcony.', time: '13:50' },
    ],
    needed: ['Coleslaw', 'Cornbread', 'Pickles', 'Soft drinks'],
  },
  {
    id: 'e4',
    city: 'Lisbon', flag: '🇵🇹',
    title: 'Lisbon Rooftop Grill',
    host: 'João C.', hostRank: 'Ember',
    date: 'Sat, May 9', time: '20:00',
    guests: 5, max: 15, isPublic: true,
    tags: ['piri-piri', 'outdoor'],
    location: 'Alfama Rooftop, Lisbon',
    description: 'Piri-piri chicken with Lisbon\'s skyline in the background.',
    theme: 'Sunset BBQ',
    coverColor: '#D97706',
    weather: { temp: '22°C', condition: 'Sunny', wind: '8 km/h W', humidity: '55%', icon: '☀️' },
    attendees: [
      { id: 'u22', name: 'João C.',  rank: 'Ember' },
      { id: 'u23', name: 'Sofia M.', rank: 'Iron'  },
      { id: 'u24', name: 'Tiago L.', rank: 'Gold'  },
      { id: 'u25', name: 'Rita F.',  rank: 'Iron'  },
      { id: 'u26', name: 'André P.', rank: 'Ember' },
    ],
    contributions: [
      { id: 'co18', userId: 'u22', userName: 'João C.',  item: 'Piri-piri chicken', quantity: '×8',     emoji: '🌶️' },
      { id: 'co19', userId: 'u23', userName: 'Sofia M.', item: 'Pastéis de nata',   quantity: '×24',    emoji: '🥮' },
      { id: 'co20', userId: 'u24', userName: 'Tiago L.', item: 'Vinho verde',       quantity: '4 bottles', emoji: '🍷' },
    ],
    chat: [
      { id: 'm13', author: 'João C.', rank: 'Ember', text: 'Marinade is on. Piri-piri all day.', time: '09:00' },
    ],
    needed: ['Bread', 'Salad', 'Olives', 'Sparkling water'],
  },
  {
    id: 'e5',
    city: 'Berlin', flag: '🇩🇪',
    title: 'Berlin Winter BBQ',
    host: 'Klaus R.', hostRank: 'Iron',
    date: 'Sat, May 16', time: '16:00',
    guests: 9, max: 18, isPublic: false,
    tags: ['fire-pit', 'bratwurst'],
    location: 'Kreuzberg Backyard, Berlin',
    description: 'Fire-pit bratwurst session. Wool sweaters mandatory.',
    theme: 'Winter Fire-Pit',
    coverColor: '#27272A',
    weather: { temp: '8°C', condition: 'Cloudy', wind: '20 km/h N', humidity: '72%', icon: '☁️' },
    attendees: [
      { id: 'u27', name: 'Klaus R.',  rank: 'Iron'  },
      { id: 'u28', name: 'Anna B.',   rank: 'Gold'  },
      { id: 'u29', name: 'Felix W.',  rank: 'Iron'  },
      { id: 'u30', name: 'Greta H.',  rank: 'Ember' },
      { id: 'u31', name: 'Otto L.',   rank: 'Iron'  },
      { id: 'u32', name: 'Lena S.',   rank: 'Gold'  },
    ],
    contributions: [
      { id: 'co21', userId: 'u27', userName: 'Klaus R.', item: 'Bratwurst',     quantity: '×30', emoji: '🌭' },
      { id: 'co22', userId: 'u28', userName: 'Anna B.',  item: 'Sauerkraut',    quantity: '2kg', emoji: '🥬' },
      { id: 'co23', userId: 'u29', userName: 'Felix W.', item: 'Berliner Pils', quantity: '×24', emoji: '🍺' },
      { id: 'co24', userId: 'u30', userName: 'Greta H.', item: 'Pretzels',      quantity: '×20', emoji: '🥨' },
      { id: 'co25', userId: 'u31', userName: 'Otto L.',  item: 'Firewood',      quantity: '20kg',emoji: '🪵' },
    ],
    chat: [
      { id: 'm14', author: 'Klaus R.', rank: 'Iron', text: 'Fire-pit is hot. Bring layers — 8°C tonight.', time: '15:00' },
    ],
    needed: ['Mustard', 'Potato salad', 'Glühwein'],
  },
  {
    id: 'e6',
    city: 'São Paulo', flag: '🇧🇷',
    title: 'São Paulo Churrasco Night',
    host: 'Bruno A.', hostRank: 'Gold',
    date: 'Sat, May 9', time: '14:00',
    guests: 12, max: 20, isPublic: true,
    tags: ['churrasco', 'outdoor'],
    location: 'Vila Madalena, São Paulo',
    description: 'Picanha on the spit. Caipirinhas on tap.',
    theme: 'Churrasco Night',
    coverColor: '#1F4D2E',
    weather: { temp: '26°C', condition: 'Sunny', wind: '10 km/h E', humidity: '60%', icon: '☀️' },
    attendees: [
      { id: 'u33', name: 'Bruno A.',   rank: 'Gold'   },
      { id: 'u34', name: 'Camila S.',  rank: 'Iron'   },
      { id: 'u35', name: 'Lucas D.',   rank: 'Ember'  },
      { id: 'u36', name: 'Júlia P.',   rank: 'Gold'   },
      { id: 'u37', name: 'Rafael C.',  rank: 'Iron'   },
      { id: 'u38', name: 'Beatriz V.', rank: 'Iron'   },
    ],
    contributions: [
      { id: 'co26', userId: 'u33', userName: 'Bruno A.',  item: 'Picanha',       quantity: '6kg', emoji: '🥩' },
      { id: 'co27', userId: 'u34', userName: 'Camila S.', item: 'Pão de queijo', quantity: '×30', emoji: '🧀' },
      { id: 'co28', userId: 'u35', userName: 'Lucas D.',  item: 'Cachaça',       quantity: '2 bottles', emoji: '🍾' },
      { id: 'co29', userId: 'u36', userName: 'Júlia P.',  item: 'Brigadeiros',   quantity: '×30', emoji: '🍫' },
    ],
    chat: [
      { id: 'm15', author: 'Bruno A.', rank: 'Gold', text: 'Picanha trimmed. Spit is ready.', time: '11:00' },
    ],
    needed: ['Limes', 'Farofa', 'Vinaigrete'],
  },
];

const STORAGE_KEY = 'ember_events_v1';

function loadStore(): EmberEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  saveStore(seedEvents);
  return seedEvents;
}

function saveStore(events: EmberEvent[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); } catch {}
}

export function getAllEvents(): EmberEvent[] {
  return loadStore();
}

export function getEvent(id: string): EmberEvent | undefined {
  return loadStore().find(e => e.id === id);
}

export function joinEvent(eventId: string, attendee: Attendee): EmberEvent | undefined {
  const events = loadStore();
  const ev = events.find(e => e.id === eventId);
  if (!ev) return undefined;
  if (!ev.attendees.some(a => a.id === attendee.id)) {
    ev.attendees.push(attendee);
    ev.guests = ev.attendees.length;
  }
  saveStore(events);
  return ev;
}

export function addContribution(eventId: string, contribution: Contribution): EmberEvent | undefined {
  const events = loadStore();
  const ev = events.find(e => e.id === eventId);
  if (!ev) return undefined;
  ev.contributions.push(contribution);
  saveStore(events);
  return ev;
}

export function postChat(eventId: string, msg: ChatMsg): EmberEvent | undefined {
  const events = loadStore();
  const ev = events.find(e => e.id === eventId);
  if (!ev) return undefined;
  ev.chat.push(msg);
  saveStore(events);
  return ev;
}

export function createEvent(input: Omit<EmberEvent, 'id' | 'attendees' | 'contributions' | 'chat' | 'guests' | 'flag' | 'weather'> & { hostId: string; flag?: string }): EmberEvent {
  const events = loadStore();
  const id = `e${Date.now()}`;
  const newEvent: EmberEvent = {
    id,
    city: input.city,
    flag: input.flag || '🔥',
    title: input.title,
    host: input.host,
    hostRank: input.hostRank,
    date: input.date,
    time: input.time,
    guests: 1,
    max: input.max,
    isPublic: input.isPublic,
    tags: input.tags,
    location: input.location,
    description: input.description,
    theme: input.theme,
    coverColor: input.coverColor,
    weather: { temp: '—', condition: 'Forecast loading', wind: '—', humidity: '—', icon: '🌤️' },
    attendees: [{ id: input.hostId, name: input.host, rank: input.hostRank }],
    contributions: [],
    chat: [],
    needed: input.needed,
  };
  events.unshift(newEvent);
  saveStore(events);
  return newEvent;
}

export function summarizeContributions(ev: EmberEvent) {
  const covered = ev.contributions.map(c => c.item);
  const stillMissing = ev.needed.filter(n => !covered.some(c => c.toLowerCase().includes(n.toLowerCase())));
  return { covered, stillMissing };
}
