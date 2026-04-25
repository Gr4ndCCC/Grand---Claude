import { useState } from 'react';
import { Flame, ArrowRight } from 'lucide-react';
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

export function Landing() {
  const [rsvp, setRsvp] = useState<'yes' | 'maybe' | 'no'>();
  const [email, setEmail] = useState('');
  const { push } = useToast();

  return (
    <div className="bg-surface text-ink relative">
      <Nav />

      {/* ── Sticky activity bar (appears after hero) ───────────── */}
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

      {/* ════════════════════════════════════════════════════════════
         01 — HERO
         A/B variants kept as comments per handoff.
         ════════════════════════════════════════════════════════════ */}
      <section className="pt-32 pb-20">
        <div className="page-container">
          <p className="mono text-ember mb-5">Backyard BBQ · Quietly coordinated</p>

          {/* H1 — variant A (active) */}
          <h1 className="font-display text-5xl md:text-display leading-[1.02] tracking-tight max-w-4xl">
            Three people <span className="italic-accent">flaked</span> last time.
            <br />
            Tonight, nobody does.
          </h1>

          {/* H1 — variant B (commented per handoff)
            <h1>Less group chat. <em>More charcoal.</em></h1>
          */}

          {/* H1 — variant C (commented per handoff)
            <h1>The grill is the point. <em>Everything else is plumbing.</em></h1>
          */}

          <p className="text-ink-mid text-lg max-w-xl mt-6 mb-8">
            Ember is for the friend who hosts the BBQ — and for the eight people
            who keep saying they'll bring something. RSVP, claim a dish, show up.
            That's the whole app.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-10">
            <Button size="lg" iconRight={<ArrowRight size={18} strokeWidth={1.75} />}>
              Start a fire
            </Button>
            <Button size="lg" variant="secondary">See how it works</Button>
            <span className="mono text-ink-soft ml-2">No app to download.</span>
          </div>

          <div className="flex items-center gap-3">
            <AvatarStack people={PEOPLE} max={5} />
            <span className="mono text-ink-soft">
              <LiveCounter to={2841} /> hosts this season
            </span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         02 — THE PROBLEM (specific, punchy)
         ════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-surface-sunk border-y border-line">
        <div className="page-container grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5">
            <p className="mono text-ember mb-3">02 · The problem</p>
            <h2 className="text-4xl mb-4">
              You said <span className="italic-accent">"I'll bring sides"</span>
              <br /> and then so did three other people.
            </h2>
            <p className="text-ink-mid">
              Every group chat ends the same way. Six dishes nobody claimed,
              two coolers of beer, one sad bag of buns. Ember exists because
              the host shouldn't be the project manager.
            </p>
          </div>
          <div className="md:col-span-7 grid sm:grid-cols-3 gap-3">
            {[
              { k: '3 people',  v: 'who said yes and ghosted' },
              { k: '6 sides',   v: 'and zero proteins' },
              { k: '2 hours',   v: 'wasted texting on Friday' },
            ].map(({ k, v }) => (
              <Card key={k} variant="raised" className="text-center">
                <p className="font-display text-3xl text-ember">{k}</p>
                <p className="mono text-ink-soft mt-1">{v}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         03 — HOW IT WORKS (3 steps)
         ════════════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="page-container">
          <p className="mono text-ember mb-3">03 · How it works</p>
          <h2 className="text-4xl mb-12 max-w-2xl">
            Three steps. <span className="italic-accent">No group chat.</span>
          </h2>
          <ol className="grid md:grid-cols-3 gap-6">
            {[
              { n: '01', t: 'Pick a date',       b: 'Set the time and place. We send a single text — no app to download.' },
              { n: '02', t: 'Friends claim',     b: 'They tap a dish. Six different things show up. Nothing doubled.' },
              { n: '03', t: 'Light the charcoal',b: 'Show up to a full table. We remind the flakes the morning of.' },
            ].map(({ n, t, b }) => (
              <li key={n} className="border-l-2 border-ember pl-5">
                <p className="mono text-ember mb-2">{n}</p>
                <h3 className="text-2xl mb-2">{t}</h3>
                <p className="text-ink-mid">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         04 — LIVE PRODUCT (event cards)
         ════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-surface-sunk border-y border-line">
        <div className="page-container">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="mono text-ember mb-3">04 · Live this week</p>
              <h2 className="text-4xl">
                Real grills, <span className="italic-accent">real people.</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Tag>backyard</Tag>
              <Tag>weeknight</Tag>
              <Tag>charcoal</Tag>
              <Tag>kid-friendly</Tag>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <EventCard
              title="Sunday brisket, hot &amp; fast"
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

      {/* ════════════════════════════════════════════════════════════
         05 — RSVP DEMO + MENU CLAIM
         ════════════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="page-container grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="mono text-ember mb-3">05 · The interaction</p>
            <h2 className="text-4xl mb-4">
              Tap once. <span className="italic-accent">You're in.</span>
            </h2>
            <p className="text-ink-mid mb-6">
              No accounts, no profiles, no notifications begging for attention.
              Three buttons and a list. The whole product fits in a text message.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <span className="mono text-ink-soft w-14">RSVP</span>
              <RSVPPill value={rsvp} onChange={(s) => { setRsvp(s); push(s === 'yes' ? "You're in." : `Marked ${s}.`, 'positive'); }} />
            </div>
            <div className="flex items-center gap-3">
              <span className="mono text-ink-soft w-14">SCORE</span>
              <EmberScore score={84} label="Reliable host" size="md" />
            </div>
          </div>
          <Card variant="raised" className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl">The menu so far</h3>
              <Badge tone="ember">Live</Badge>
            </div>
            <p className="mono text-ink-soft">Tap "I'll bring this" to claim a dish.</p>
            <MenuItem name="Brisket, hot &amp; fast"   category="Main" />
            <MenuItem name="Charred shishitos"          category="Veg" claimedBy={{ name: 'Marin K.' }} />
            <MenuItem name="Sumac slaw"                  category="Side" />
            <MenuItem name="Smoked stone fruit cobbler" category="Sweet" />
          </Card>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         06 — TESTIMONIALS
         ════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-surface-sunk border-y border-line">
        <div className="page-container">
          <p className="mono text-ember mb-3">06 · From hosts</p>
          <h2 className="text-4xl mb-12 max-w-2xl">
            Quiet wins. <span className="italic-accent">Full tables.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { q: 'Six people brought six different things. First time in years no one brought hummus.', n: 'Marin K.', c: 'Logan Square' },
              { q: "Stopped chasing RSVPs in the group chat. The text reminders are the entire reason it works.", n: 'Jules R.',  c: 'Greenpoint' },
              { q: "I host two grills a month now. It used to be two a year. The friction was the chat.",          n: 'Tomás A.',  c: 'Highland' },
            ].map(({ q, n, c }) => (
              <Card key={n} variant="raised" className="flex flex-col gap-4">
                <p className="font-display italic text-xl text-ink leading-snug">"{q}"</p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-line">
                  <Avatar name={n} size="sm" />
                  <div>
                    <p className="text-ink">{n}</p>
                    <p className="mono text-ink-soft">{c}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         07 — STATS / ANTI-BRAG
         ════════════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="page-container">
          <p className="mono text-ember mb-3">07 · By the numbers</p>
          <h2 className="text-4xl mb-12 max-w-3xl">
            Specific. <span className="italic-accent">Not impressive on purpose.</span>
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-line">
            {[
              { v: 142,    s: '',   l: 'RSVPs this week' },
              { v: 2841,   s: '',   l: 'Hosts this season' },
              { v: 87,     s: '%',  l: 'Of dishes claimed' },
              { v: 0,      s: '',   l: 'Push notifications sent' },
            ].map((x) => (
              <div key={x.l} className="bg-surface p-8">
                <p className="text-5xl">
                  <LiveCounter to={x.v} format={(n) => `${n.toLocaleString()}${x.s}`} />
                </p>
                <p className="mono text-ink-soft mt-2">{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         08 — FAQ
         ════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-surface-sunk border-y border-line">
        <div className="page-container max-w-3xl">
          <p className="mono text-ember mb-3">08 · Plainly</p>
          <h2 className="text-4xl mb-12">
            Questions, <span className="italic-accent">answered.</span>
          </h2>
          <dl className="divide-y divide-line">
            {[
              { q: 'Is there an app?',
                a: 'No. Ember sends a single SMS per event. Your friends tap a link and claim a dish. That is the entire interface.' },
              { q: 'Do my friends need an account?',
                a: 'No accounts. They get a text. They tap "I\'ll bring slaw." They show up. The host sees who claimed what.' },
              { q: 'Why not Partiful or Paperless Post?',
                a: 'Those are invitations. Ember is the menu, the reminder, and the gentle nudge to the flake. Different problem.' },
              { q: 'How much does it cost?',
                a: 'Free for hosts under ten guests. $4 per event over that. We do not sell ads or your contacts.' },
            ].map(({ q, a }) => (
              <div key={q} className="py-5">
                <dt className="text-xl mb-2 flex items-start gap-3">
                  <Flame size={18} strokeWidth={1.5} className="text-ember mt-1.5 shrink-0" />
                  {q}
                </dt>
                <dd className="text-ink-mid pl-7">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         09 — JOIN / FINAL CTA
         ════════════════════════════════════════════════════════════ */}
      <section id="join" className="py-24 bg-char-0 text-ink-inverse">
        <div className="page-container max-w-3xl text-center">
          <p className="mono text-ember mb-4">09 · Light it</p>
          <h2 className="font-display text-5xl md:text-6xl mb-4 leading-tight">
            Your next BBQ has a date.
            <br />
            <span className="italic text-ember">Pick the night.</span>
          </h2>
          <p className="text-ash-1 max-w-xl mx-auto mb-8">
            Drop your email. We text you a link to start your first fire — no
            account, no setup. If it's not better than your group chat,
            ignore us.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); push("Sent. Check your inbox.", 'positive'); setEmail(''); }}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <div className="flex-1 [&_input]:bg-char-1 [&_input]:text-ink-inverse [&_span]:border-char-3 [&_span]:bg-char-1">
              <Input
                placeholder="you@somewhere"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email"
              />
            </div>
            <Button type="submit" size="md">Get the link</Button>
          </form>
          <p className="mono text-char-5 mt-4">No spam. One text per event. Cancel any time.</p>
        </div>
      </section>

      <footer className="py-10">
        <div className="page-container flex items-center justify-between flex-wrap gap-3">
          <p className="mono text-ink-soft">Ember · backyard BBQ, quietly coordinated</p>
          <p className="mono text-ink-soft">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
