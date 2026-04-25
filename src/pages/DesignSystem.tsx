import { useState } from 'react';
import { Plus, Search, Flame, MapPin } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tag } from '../components/ui/Tag';
import { Avatar } from '../components/ui/Avatar';
import { AvatarStack } from '../components/ui/AvatarStack';
import { Tabs } from '../components/ui/Tabs';
import { Tooltip } from '../components/ui/Tooltip';
import { Skeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { EventCard } from '../components/EventCard';
import { MenuItem } from '../components/MenuItem';
import { RSVPPill } from '../components/RSVPPill';
import { EmberScore } from '../components/EmberScore';
import { LiveCounter } from '../components/LiveCounter';
import { SatelliteMap } from '../components/SatelliteMap';

function Section({ n, title, lede, children }: { n: number; title: string; lede?: string; children: React.ReactNode }) {
  return (
    <section className="py-14 border-b border-line last:border-b-0">
      <div className="page-container">
        <div className="mb-6">
          <p className="mono text-ember mb-2">{String(n).padStart(2, '0')}</p>
          <h2 className="text-3xl mb-2">{title}</h2>
          {lede && <p className="text-ink-mid max-w-xl">{lede}</p>}
        </div>
        <div className="bg-surface-raised border border-line rounded-lg p-6 shadow-1">
          {children}
        </div>
      </div>
    </section>
  );
}

function Row({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-wrap items-center gap-3 ${className}`}>{children}</div>;
}

const SAMPLE_PEOPLE = [
  { name: 'Marin K.' },
  { name: 'Jules R.' },
  { name: 'Tomás A.' },
  { name: 'Esme P.' },
  { name: 'Niko V.' },
  { name: 'Sade L.' },
];

export function DesignSystem() {
  const [rsvp, setRsvp] = useState<'yes' | 'maybe' | 'no'>();
  const [modal, setModal] = useState(false);
  const { push } = useToast();

  return (
    <div className="bg-surface min-h-screen">
      <Nav />
      <header className="page-container pt-28 pb-6">
        <p className="mono text-ember mb-2">Ember · Design system</p>
        <h1 className="text-4xl md:text-5xl mb-3">
          Every primitive on one page.
        </h1>
        <p className="text-ink-mid max-w-2xl">
          The components used on the landing page, in the order they appear
          in the handoff. If it looks right here, it looks right everywhere.
        </p>
      </header>

      {/* 01 — Foundations */}
      <Section n={1} title="Foundations" lede="Type, color, motion. The brand is two colors and one serif.">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="mono text-ink-soft mb-3">Type</p>
            <p className="font-display text-5xl mb-1">Newsreader</p>
            <p className="font-display italic text-2xl text-ember mb-1">Italic, used sparingly</p>
            <p className="mono">JetBrains Mono · system voice</p>
          </div>
          <div>
            <p className="mono text-ink-soft mb-3">Brand</p>
            <Row>
              <span className="block w-14 h-14 rounded-md bg-ember"      title="ember #b85332" />
              <span className="block w-14 h-14 rounded-md bg-ember-hot"  title="ember-hot" />
              <span className="block w-14 h-14 rounded-md bg-ember-deep" title="ember-deep" />
              <span className="block w-14 h-14 rounded-md bg-maroon"     title="maroon #550000" />
              <span className="block w-14 h-14 rounded-md bg-maroon-deep"title="maroon-deep" />
            </Row>
            <p className="mono text-ink-soft mt-4 mb-3">Char neutrals</p>
            <Row>
              {['char-0', 'char-2', 'char-4', 'char-5', 'ash-1', 'ash-2', 'paper'].map(c => (
                <span key={c} className={`block w-10 h-10 rounded-sm border border-line bg-${c}`} title={c} />
              ))}
            </Row>
          </div>
        </div>
      </Section>

      {/* 02 — Buttons */}
      <Section n={2} title="Buttons" lede="Spark traces the cursor on hover. Ember pulse on keyboard focus.">
        <Row>
          <Button>Start a fire</Button>
          <Button variant="secondary">Add a dish</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="link">Read the FAQ</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </Row>
        <Row className="mt-4">
          <Button size="sm" iconLeft={<Plus size={14} strokeWidth={2} />}>Small</Button>
          <Button size="md" iconLeft={<Plus size={16} strokeWidth={2} />}>Medium</Button>
          <Button size="lg" iconLeft={<Plus size={18} strokeWidth={2} />}>Large</Button>
        </Row>
      </Section>

      {/* 03 — Inputs */}
      <Section n={3} title="Inputs" lede="Bordered, pale paper. The whole field gets the ember focus ring.">
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
          <Input label="Your name"   placeholder="Jules Rivera" />
          <Input label="Email"       type="email" placeholder="jules@…" iconLeft={<Search size={14} />} />
          <Input label="With hint"   placeholder="—" hint="We never share this." />
          <Input label="With error"  placeholder="—" error="That email looks off." />
          <Select label="Distance"   options={[
            { value: '5',  label: 'Within 5 miles' },
            { value: '15', label: 'Within 15 miles' },
            { value: '50', label: 'Within 50 miles' },
          ]} />
        </div>
      </Section>

      {/* 04 — Cards & elevation */}
      <Section n={4} title="Cards" lede="Three elevations: plain, raised, sunk. Use sparingly.">
        <div className="grid md:grid-cols-3 gap-4">
          <Card variant="plain"><p className="mono text-ink-soft mb-2">Plain</p><p>On paper, no shadow.</p></Card>
          <Card variant="raised"><p className="mono text-ink-soft mb-2">Raised</p><p>Default surface for content.</p></Card>
          <Card variant="sunk"><p className="mono text-ink-soft mb-2">Sunk</p><p>Inset blocks, supporting copy.</p></Card>
        </div>
      </Section>

      {/* 05 — Badges, tags, avatars */}
      <Section n={5} title="Badges, tags, avatars">
        <Row>
          <Badge>Neutral</Badge>
          <Badge tone="ember">Lit</Badge>
          <Badge tone="maroon">Member</Badge>
          <Badge tone="positive">Going</Badge>
        </Row>
        <Row className="mt-4">
          <Tag>backyard</Tag>
          <Tag>charcoal</Tag>
          <Tag removable onRemove={() => push('Tag removed', 'neutral')}>weeknight</Tag>
        </Row>
        <Row className="mt-6">
          <Avatar name="Marin K." size="xs" />
          <Avatar name="Jules R." size="sm" />
          <Avatar name="Tomás A." size="md" />
          <Avatar name="Esme P." size="lg" ring />
          <AvatarStack people={SAMPLE_PEOPLE} max={4} />
        </Row>
      </Section>

      {/* 06 — Tabs, tooltip */}
      <Section n={6} title="Tabs and tooltip">
        <Tabs
          tabs={[
            { id: 'about', label: 'About', content: <p className="text-ink-mid">Quiet, dependable potlucks. No more guessing what to bring.</p> },
            { id: 'menu',  label: 'Menu',  content: <p className="text-ink-mid">Six dishes claimed, three open. Nothing doubled up.</p> },
            { id: 'crew',  label: 'Crew',  content: <p className="text-ink-mid">Eight RSVPs. Three regulars, five new faces.</p> },
          ]}
        />
        <Row className="mt-6">
          <Tooltip label="Hosted by Ember regular">
            <Avatar name="Marin K." size="md" />
          </Tooltip>
          <Tooltip label="Average score · last 6 events">
            <EmberScore score={84} size="sm" />
          </Tooltip>
        </Row>
      </Section>

      {/* 07 — Skeleton, toast, modal */}
      <Section n={7} title="Skeleton, toast, modal" lede="Grill-mark shimmer. Toast at bottom-right. Modal traps focus.">
        <div className="space-y-2 max-w-md">
          <Skeleton h={28} w="60%" />
          <Skeleton h={14} />
          <Skeleton h={14} w="80%" />
        </div>
        <Row className="mt-6">
          <Button onClick={() => push("Logged. We'll text you Friday.", 'neutral')}>Toast · neutral</Button>
          <Button variant="secondary" onClick={() => push('Saved.', 'positive')}>Toast · positive</Button>
          <Button variant="secondary" onClick={() => push('Could not reach the network.', 'ember')}>Toast · ember</Button>
          <Button onClick={() => setModal(true)}>Open modal</Button>
        </Row>
        <Modal open={modal} onClose={() => setModal(false)} title="Bring something specific">
          <p className="text-ink-mid mb-4">Three people flaked last time. Pick a dish so the host doesn't have to chase.</p>
          <Row className="justify-end">
            <Button variant="ghost" onClick={() => setModal(false)}>Maybe later</Button>
            <Button onClick={() => { setModal(false); push('Locked in.', 'positive'); }}>Pick a dish</Button>
          </Row>
        </Modal>
      </Section>

      {/* 08 — RSVP, EmberScore, LiveCounter */}
      <Section n={8} title="RSVP, score, live counter" lede="Smoke wisp on yes. Arrow keys move between options.">
        <div className="grid md:grid-cols-3 gap-6 items-center">
          <div>
            <p className="mono text-ink-soft mb-3">RSVP</p>
            <RSVPPill value={rsvp} onChange={setRsvp} />
            {rsvp && <p className="mono mt-2 text-ink-soft">Selected: {rsvp.toUpperCase()}</p>}
          </div>
          <div>
            <p className="mono text-ink-soft mb-3">Ember score</p>
            <EmberScore score={84} label="Reliable host" size="lg" />
          </div>
          <div>
            <p className="mono text-ink-soft mb-3">Live counter</p>
            <p className="text-5xl">
              <LiveCounter to={142} />
            </p>
            <p className="mono text-ink-soft mt-1">RSVPs this week</p>
          </div>
        </div>
      </Section>

      {/* 09 — SatelliteMap */}
      <Section n={9} title="Satellite map" lede="Inline SVG. Stays cheap, stays crisp.">
        <SatelliteMap width={640} height={220} pinX={200} pinY={110} className="w-full max-w-2xl rounded-lg border border-line" />
      </Section>

      {/* 10 — MenuItem */}
      <Section n={10} title="Menu item" lede="Click to claim. 600ms flip-card.">
        <div className="grid md:grid-cols-2 gap-3 max-w-2xl">
          <MenuItem name="Brisket, hot and fast"      category="Main" />
          <MenuItem name="Charred shishitos"          category="Veg" claimedBy={{ name: 'Marin K.' }} />
          <MenuItem name="Smoked stone fruit cobbler" category="Sweet" />
          <MenuItem name="Sumac slaw"                 category="Side" />
        </div>
      </Section>

      {/* 11 — EventCard */}
      <Section n={11} title="Event card" lede="The atom that the landing list is built from.">
        <div className="grid md:grid-cols-2 gap-4">
          <EventCard
            title="Sunday brisket, hot and fast"
            host="Marin K."
            when="Sun · 4:00 PM"
            where="Backyard, Logan Square"
            going={SAMPLE_PEOPLE.slice(0, 5)}
            spotsLeft={3}
            pinX={120}
            pinY={70}
          />
          <EventCard
            title="Weeknight pork shoulder"
            host="Jules R."
            when="Thu · 6:30 PM"
            where="Roof, Greenpoint"
            going={SAMPLE_PEOPLE.slice(0, 3)}
            spotsLeft={6}
            pinX={240}
            pinY={50}
          />
        </div>
        <Row className="mt-6">
          <span className="mono text-ink-soft">Icons in use</span>
          <Flame size={16} strokeWidth={1.5} />
          <MapPin size={16} strokeWidth={1.5} />
        </Row>
      </Section>

      <footer className="page-container py-12 text-center">
        <p className="mono text-ink-soft">Ember · v0.1 · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
