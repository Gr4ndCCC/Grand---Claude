import { useState } from 'react';
import { Flame, ArrowRight, Check } from 'lucide-react';
import { Nav } from '../components/Nav';
import { StickyBar } from '../components/StickyBar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tag } from '../components/ui/Tag';
import { AvatarStack } from '../components/ui/AvatarStack';
import { Avatar } from '../components/ui/Avatar';
import { EventCard } from '../components/EventCard';
import { MenuItem } from '../components/MenuItem';
import { RSVPPill } from '../components/RSVPPill';
import { EmberScore } from '../components/EmberScore';
import { LiveCounter } from '../components/LiveCounter';
import { useToast } from '../components/ui/Toast';

const PEOPLE = [
  { name: 'Marin K.' },
  { name: 'Jules R.' },
  { name: 'Tomás A.' },
  { name: 'Esme P.' },
  { name: 'Niko V.' },
  { name: 'Sade L.' },
  { name: 'Owen B.' },
];

const CITIES = [
  'Brooklyn', 'Logan Square', 'Highland Park', 'Mission District',
  'Greenpoint', 'East Nashville', 'Silver Lake', 'Wicker Park',
  'Capitol Hill', 'Bushwick', 'Oak Cliff', 'Pilsen',
];

/* ── inline SMS mockup ──────────────────────────────────────────── */
function HeroPhone() {
  return (
    <div className="relative w-full max-w-xs mx-auto lg:mx-0 select-none" aria-hidden="true">
      {/* smoke drifts behind phone */}
      <span className="smoke-drift smoke-a" />
      <span className="smoke-drift smoke-b" />
      <span className="smoke-drift smoke-c" />

      {/* phone shell */}
      <div
        className="relative z-10 rounded-[2.5rem] border border-line bg-white shadow-3 overflow-hidden"
        style={{ aspectRatio: '9/19' }}
      >
        {/* status bar */}
        <div className="flex justify-between items-center px-6 pt-4 pb-2">
          <span className="mono text-xs text-char-4">9:41</span>
          <span className="w-14 h-5 rounded-pill bg-char-0 mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
          <div className="flex gap-1 items-center">
            <span className="block w-3 h-2 rounded-sm bg-char-3" />
            <span className="block w-3 h-2 rounded-sm bg-char-3" />
          </div>
        </div>

        {/* sms header */}
        <div className="bg-surface-sunk border-b border-line px-5 py-3 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-ember flex items-center justify-center shrink-0">
            <Flame size={14} strokeWidth={1.5} className="text-paper" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Ember</p>
            <p className="mono text-xs text-ink-soft">Today</p>
          </div>
        </div>

        {/* messages */}
        <div className="p-4 space-y-3 flex-1">
          {/* incoming */}
          <div className="flex justify-start">
            <div className="bg-surface-sunk rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
              <p className="text-sm text-ink leading-snug">
                Marin's throwing a brisket night — Sunday at 4pm. You in?
              </p>
            </div>
          </div>
          {/* incoming */}
          <div className="flex justify-start">
            <div className="bg-surface-sunk rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
              <p className="text-sm text-ink leading-snug">
                <strong>3 spots left.</strong> Reply with what you're bringing or tap: <span className="text-ember underline">ember.app/b7k2</span>
              </p>
            </div>
          </div>
          {/* outgoing */}
          <div className="flex justify-end">
            <div className="bg-ember rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
              <p className="text-sm text-paper leading-snug">Yes! I'll bring sumac slaw 🥗</p>
            </div>
          </div>
          {/* incoming confirm */}
          <div className="flex justify-start">
            <div className="bg-surface-sunk rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
              <p className="text-sm text-ink leading-snug flex items-center gap-2">
                <Check size={14} className="text-ember shrink-0" />
                <span>Locked in. See you Sunday.</span>
              </p>
            </div>
          </div>
          {/* morning reminder */}
          <div className="flex justify-start">
            <div className="bg-surface-sunk rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
              <p className="text-sm text-ink leading-snug">
                <em>Reminder:</em> Brisket night is tonight at 4pm. 6 people confirmed. You're on slaw.
              </p>
            </div>
          </div>
        </div>

        {/* input */}
        <div className="px-4 pb-6 pt-2 border-t border-line flex items-center gap-2">
          <div className="flex-1 bg-ash-2 rounded-pill h-9" />
          <div className="w-9 h-9 rounded-full bg-ember flex items-center justify-center shrink-0">
            <ArrowRight size={14} strokeWidth={2} className="text-paper" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ember-rule heading helper ─────────────────────────────────── */
function SectionHead({ label, title, light = false }: { label: string; title: React.ReactNode; light?: boolean }) {
  return (
    <div className="mb-10">
      <p className={`mono mb-1 ${light ? 'text-ember-hot' : 'text-ember'}`}>{label}</p>
      <span className="ember-rule" />
      <h2 className={`text-4xl md:text-5xl max-w-2xl ${light ? 'text-ink-inverse' : ''}`}>{title}</h2>
    </div>
  );
}

export function Landing() {
  const [rsvp, setRsvp] = useState<'yes' | 'maybe' | 'no'>();
  const [email, setEmail] = useState('');
  const { push } = useToast();

  return (
    <div className="bg-surface text-ink relative">
      <Nav />

      {/* sticky bar */}
      <StickyBar position="top" appearAt={520}>
        <div className="bg-paper/90 backdrop-blur border-b border-line">
          <div className="page-container h-12 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="block w-2 h-2 rounded-pill bg-ember animate-pulse" />
              <p className="mono text-ink-soft truncate">
                <LiveCounter to={142} /> RSVPs this week · 9 grills lit tonight
              </p>
            </div>
            <a href="#join" className="ember-focus mono text-ember whitespace-nowrap">
              Get the next invite →
            </a>
          </div>
        </div>
      </StickyBar>

      {/* ── hero ────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* background glow */}
        <div className="hero-glow" />

        <div className="page-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* left */}
            <div>
              <p className="mono text-ember mb-5">Backyard BBQ, quietly coordinated</p>

              <h1 className="font-display text-5xl md:text-6xl lg:text-display leading-[1.02] tracking-tight max-w-2xl">
                Three people{' '}
                <em className="italic-accent">flaked</em>{' '}
                last time.
                <br />
                Tonight, nobody does.
              </h1>

              <p className="text-ink-mid text-lg max-w-xl mt-6 mb-8 leading-relaxed">
                Ember is for the friend who hosts the BBQ, and for the eight
                people who keep saying they'll bring something.{' '}
                <strong>RSVP, claim a dish, show up.</strong>{' '}
                That's the whole product.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-10">
                <Button size="lg" iconRight={<ArrowRight size={18} strokeWidth={1.75} />}>
                  Start a fire
                </Button>
                <Button size="lg" variant="secondary">See how it works</Button>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <AvatarStack people={PEOPLE} max={5} />
                <div>
                  <p className="text-ink font-semibold">
                    <LiveCounter to={2841} /> hosts this season
                  </p>
                  <p className="mono text-ink-soft">across 14 cities · no app required</p>
                </div>
              </div>
            </div>

            {/* right — phone mockup */}
            <HeroPhone />
          </div>
        </div>
      </section>

      {/* grill divider */}
      <div className="grill-grate" />

      {/* ── cities strip ─────────────────────────────────────────── */}
      <div className="border-b border-line bg-surface-sunk py-4 overflow-hidden">
        <div className="page-container flex items-center gap-2 flex-wrap">
          <span className="mono text-ink-soft shrink-0">Hosts in</span>
          {CITIES.map((city, i) => (
            <span key={city} className="mono text-ink flex items-center gap-2">
              {city}
              {i < CITIES.length - 1 && <span className="text-ember">·</span>}
            </span>
          ))}
        </div>
      </div>

      {/* ── the problem ──────────────────────────────────────────── */}
      <section className="py-24 bg-surface-sunk border-b border-line">
        <div className="page-container">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-5">
              <SectionHead
                label="The problem"
                title={<>You said "I'll bring sides," and then so did three other people.</>}
              />
              <p className="text-ink-mid text-lg leading-relaxed">
                Every group chat ends the same way. Six dishes nobody claimed,
                two coolers of beer, one sad bag of buns. The host shouldn't
                also be the project manager.
              </p>
            </div>

            <div className="md:col-span-7 grid sm:grid-cols-3 gap-4">
              {[
                { k: '3 people',  v: 'who said yes and ghosted' },
                { k: '6 sides',   v: 'and zero proteins' },
                { k: '2 hours',   v: 'wasted chasing RSVPs' },
              ].map(({ k, v }) => (
                <Card key={k} variant="raised" className="text-center py-8">
                  <p className="font-display text-4xl text-ember mb-2">{k}</p>
                  <p className="mono text-ink-soft">{v}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* grill divider */}
      <div className="grill-grate" />

      {/* ── how it works ─────────────────────────────────────────── */}
      <section className="py-24">
        <div className="page-container">
          <SectionHead label="How it works" title="Three steps, no group chat." />
          <ol className="grid md:grid-cols-3 gap-8">
            {[
              { n: '01', t: 'Pick a date',        b: 'Set the time and the place. We send one text. No app to download, no account required.' },
              { n: '02', t: 'Friends claim',      b: 'They tap a dish. Six different things show up. Nothing doubled up, nobody texting "what are you bringing?"' },
              { n: '03', t: 'Light the charcoal', b: 'Show up to a full table. We remind the flakes the morning of, so you don\'t have to.' },
            ].map(({ n, t, b }) => (
              <li key={n} className="border-l-2 border-ember pl-6 py-1">
                <p className="mono text-ember mb-3">{n}</p>
                <h3 className="text-2xl mb-3">{t}</h3>
                <p className="text-ink-mid leading-relaxed">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* grill divider */}
      <div className="grill-grate" />

      {/* ── live this week ───────────────────────────────────────── */}
      <section className="py-24 bg-surface-sunk border-y border-line">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-6">
            <SectionHead label="Live this week" title="Nine grills lit, three open seats." />
            <div className="flex flex-wrap gap-2 pb-2">
              <Tag>backyard</Tag>
              <Tag>weeknight</Tag>
              <Tag>charcoal</Tag>
              <Tag>kid-friendly</Tag>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <EventCard
              title="Sunday brisket, hot and fast"
              host="Marin K." when="Sun · 4:00 PM"
              where="Backyard, Logan Square"
              going={PEOPLE.slice(0, 5)} spotsLeft={3} pinX={120} pinY={70}
            />
            <EventCard
              title="Weeknight pork shoulder"
              host="Jules R." when="Thu · 6:30 PM"
              where="Roof, Greenpoint"
              going={PEOPLE.slice(0, 3)} spotsLeft={6} pinX={220} pinY={50}
            />
            <EventCard
              title="Charred-everything potluck"
              host="Tomás A." when="Sat · 5:00 PM"
              where="Park grill, Highland"
              going={PEOPLE.slice(2, 7)} spotsLeft={2} pinX={80} pinY={130}
            />
          </div>
        </div>
      </section>

      {/* grill divider */}
      <div className="grill-grate" />

      {/* ── rsvp + menu demo ─────────────────────────────────────── */}
      <section className="py-24">
        <div className="page-container grid md:grid-cols-2 gap-14 items-center">
          <div>
            <SectionHead label="The interaction" title="Tap once. You're in." />
            <p className="text-ink-mid text-lg mb-8 leading-relaxed">
              No accounts, no profiles, no notifications begging for attention.
              Three buttons and a list. The whole product fits in a text message.
            </p>
            <div className="flex items-center gap-4 mb-5">
              <span className="mono text-ink-soft w-16 shrink-0">RSVP</span>
              <RSVPPill
                value={rsvp}
                onChange={(s) => {
                  setRsvp(s);
                  push(s === 'yes' ? "You're in." : `Marked ${s}.`, 'positive');
                }}
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="mono text-ink-soft w-16 shrink-0">SCORE</span>
              <EmberScore score={84} label="Reliable host" size="md" />
            </div>
          </div>

          <Card variant="raised" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl">The menu so far</h3>
              <Badge tone="ember">Live</Badge>
            </div>
            <p className="mono text-ink-soft">Tap "I'll bring this" to claim a dish.</p>
            <div className="space-y-2">
              <MenuItem name="Brisket, hot and fast"      category="Main" />
              <MenuItem name="Charred shishitos"          category="Veg" claimedBy={{ name: 'Marin K.' }} />
              <MenuItem name="Sumac slaw"                 category="Side" />
              <MenuItem name="Smoked stone fruit cobbler" category="Sweet" />
            </div>
          </Card>
        </div>
      </section>

      {/* grill divider */}
      <div className="grill-grate" />

      {/* ── testimonials ─────────────────────────────────────────── */}
      <section className="py-24 bg-surface-sunk border-y border-line">
        <div className="page-container">
          <SectionHead label="From hosts" title="What changed for them." />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                q: 'Six people brought six different things. First time in years no one brought hummus.',
                n: 'Marin K.', c: 'Logan Square', score: 91,
              },
              {
                q: "Stopped chasing RSVPs in the group chat. The text reminders are the entire reason it works.",
                n: 'Jules R.', c: 'Greenpoint', score: 88,
              },
              {
                q: "I host two grills a month now. Used to be two a year. The friction was the chat.",
                n: 'Tomás A.', c: 'Highland Park', score: 84,
              },
            ].map(({ q, n, c, score }) => (
              <Card key={n} variant="raised" className="flex flex-col gap-5">
                <div className="flex gap-2 pt-1">
                  {[...Array(5)].map((_, i) => (
                    <Flame key={i} size={14} strokeWidth={1.5} className="text-ember" />
                  ))}
                </div>
                <p className="font-display italic text-xl text-ink leading-snug flex-1">
                  "{q}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-line">
                  <Avatar name={n} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-ink font-medium">{n}</p>
                    <p className="mono text-ink-soft">{c}</p>
                  </div>
                  <EmberScore score={score} size="sm" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* grill divider */}
      <div className="grill-grate" />

      {/* ── by the numbers ───────────────────────────────────────── */}
      <section className="py-24">
        <div className="page-container">
          <SectionHead label="By the numbers" title={<>A small site doing a <em className="italic-accent">small</em> thing.</>} />
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-line rounded-lg overflow-hidden">
            {[
              { v: 142,  s: '',  l: 'RSVPs this week' },
              { v: 2841, s: '',  l: 'Hosts this season' },
              { v: 87,   s: '%', l: 'Dishes claimed on time' },
              { v: 14,   s: '',  l: 'Cities with active hosts' },
            ].map((x) => (
              <div key={x.l} className="bg-surface p-10">
                <p className="font-display text-5xl md:text-6xl text-ember">
                  <LiveCounter to={x.v} format={(n) => `${n.toLocaleString()}${x.s}`} />
                </p>
                <p className="mono text-ink-soft mt-3">{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* grill divider */}
      <div className="grill-grate" />

      {/* ── pricing ──────────────────────────────────────────────── */}
      <section className="py-24 bg-surface-sunk border-y border-line">
        <div className="page-container">
          <SectionHead label="Pricing" title="One price. No tricks." />
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
            {/* free */}
            <Card variant="raised" className="space-y-5">
              <div>
                <p className="mono text-ink-soft mb-1">Free forever</p>
                <p className="font-display text-5xl">$0</p>
              </div>
              <ul className="space-y-3">
                {[
                  'Up to 10 guests per event',
                  'Dish claim + RSVP',
                  'One SMS per event',
                  'Morning-of reminder',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-ink-mid">
                    <Check size={15} strokeWidth={2} className="text-ember shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full">Start for free</Button>
            </Card>

            {/* per event */}
            <Card variant="raised" className="space-y-5 border-ember" style={{ borderColor: 'var(--ember)' }}>
              <div>
                <p className="mono text-ember mb-1">Per event, 10+ guests</p>
                <div className="flex items-baseline gap-2">
                  <p className="font-display text-5xl">$4</p>
                  <p className="text-ink-mid">per event</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  'Unlimited guests',
                  'Everything in free',
                  'Priority SMS delivery',
                  'No subscription required',
                  'We do not sell your contacts',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-ink-mid">
                    <Check size={15} strokeWidth={2} className="text-ember shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" iconRight={<ArrowRight size={16} strokeWidth={2} />}>
                Start a fire
              </Button>
            </Card>
          </div>

          <p className="mono text-ink-soft mt-6 max-w-lg">
            Pay only when you host a big one. No monthly fee. No annual contract.
            No ads. No selling your contacts. That is the entire business model.
          </p>
        </div>
      </section>

      {/* grill divider */}
      <div className="grill-grate" />

      {/* ── faq ──────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="page-container max-w-3xl">
          <SectionHead label="FAQ" title="Questions we keep getting." />
          <dl className="divide-y divide-line">
            {[
              {
                q: 'Is there an app?',
                a: 'No. Ember sends one SMS per event. Your friends tap the link and claim a dish. That is the entire interface.',
              },
              {
                q: 'Do my friends need an account?',
                a: "No accounts. They get a text. They tap \"I'll bring slaw.\" They show up. The host sees who claimed what.",
              },
              {
                q: 'Why not Partiful or Paperless Post?',
                a: 'Those are invitations. Ember is the menu, the reminder, and the nudge to the flake. Different problem.',
              },
              {
                q: 'How much does it cost?',
                a: 'Free for hosts with fewer than ten guests. $4 per event above that. We do not sell ads or your contacts.',
              },
              {
                q: 'What if someone changes their dish?',
                a: 'They tap the link again and update it. The host sees the change in real time. No chasing, no group chat.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="py-6">
                <dt className="text-xl mb-3 flex items-start gap-3">
                  <Flame size={18} strokeWidth={1.5} className="text-ember mt-1 shrink-0" />
                  {q}
                </dt>
                <dd className="text-ink-mid text-lg leading-relaxed pl-8">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* grill divider */}
      <div className="grill-grate" />

      {/* ── final cta ────────────────────────────────────────────── */}
      <section id="join" className="relative py-28 bg-char-0 text-ink-inverse overflow-hidden">
        {/* background ember glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(50% 60% at 50% 100%, rgba(184,83,50,0.28) 0%, transparent 70%)',
          }}
        />

        <div className="page-container max-w-3xl text-center relative z-10">
          <p className="mono text-ember-hot mb-4">Get the next invite</p>
          <span className="ember-rule mx-auto mb-2" />
          <h2 className="font-display text-5xl md:text-6xl mb-4 leading-tight">
            Your next BBQ has a{' '}
            <em style={{ color: 'var(--ember-hot)', fontStyle: 'italic' }}>date.</em>
          </h2>
          <p className="text-ash-1 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
            Drop your email. We text you a link to start your first fire. No
            account, no setup. If it's not better than your group chat,
            ignore us.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              push("Sent. Check your inbox.", 'positive');
              setEmail('');
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="flex-1 [&_input]:bg-char-1 [&_input]:text-ink-inverse [&_input]:border-char-3">
              <Input
                placeholder="you@somewhere"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
            </div>
            <Button type="submit" size="md">Get the link</Button>
          </form>
          <p className="mono text-char-5 mt-5">
            No spam · One text per event · Cancel any time
          </p>
        </div>
      </section>

      {/* ── footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-line bg-surface-sunk py-16">
        <div className="page-container">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-md bg-ember flex items-center justify-center">
                  <Flame size={16} strokeWidth={1.5} className="text-paper" />
                </span>
                <span className="font-display text-xl text-ink">Ember</span>
              </div>
              <p className="text-ink-mid max-w-xs leading-relaxed">
                Backyard BBQ, quietly coordinated. RSVP, claim a dish, show up.
                The grill is the point.
              </p>
              <p className="mono text-ink-soft mt-4">No app · No ads · No selling your contacts</p>
            </div>

            {/* product */}
            <div>
              <p className="mono text-ink-soft mb-4">Product</p>
              <ul className="space-y-3">
                {['How it works', 'Pricing', 'FAQ', 'Design system'].map((l) => (
                  <li key={l}>
                    <a href={l === 'Design system' ? '/design-system' : '#'} className="text-ink-mid hover:text-ink transition-colors ember-focus">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* hosts */}
            <div>
              <p className="mono text-ink-soft mb-4">For hosts</p>
              <ul className="space-y-3">
                {['Start a fire', 'Invite guests', 'Build a menu', 'Track RSVPs'].map((l) => (
                  <li key={l}>
                    <a href="#join" className="text-ink-mid hover:text-ink transition-colors ember-focus">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-line pt-8 flex items-center justify-between flex-wrap gap-4">
            <p className="mono text-ink-soft">
              © {new Date().getFullYear()} Ember · backyard BBQ coordinator
            </p>
            <div className="flex gap-6">
              <a href="#" className="mono text-ink-soft hover:text-ink transition-colors ember-focus">Privacy</a>
              <a href="#" className="mono text-ink-soft hover:text-ink transition-colors ember-focus">Terms</a>
              <a href="mailto:hello@ember.app" className="mono text-ink-soft hover:text-ink transition-colors ember-focus">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
