/**
 * Hero artifact — a stylized SMS thread + RSVP card preview.
 * Inline SVG only. Smoke wisps drift up behind. No images.
 */
export function HeroVisual() {
  return (
    <div className="relative w-full max-w-md mx-auto md:mx-0">
      {/* drifting smoke behind the card */}
      <div className="absolute inset-x-0 -top-10 h-40 pointer-events-none" aria-hidden="true">
        <span className="smoke-drift smoke-a" />
        <span className="smoke-drift smoke-b" />
        <span className="smoke-drift smoke-c" />
      </div>

      {/* the device-ish card */}
      <div className="relative rounded-2xl bg-paper border border-line shadow-2 overflow-hidden">
        {/* faux SMS chrome */}
        <div className="px-5 py-3 border-b border-line flex items-center justify-between bg-ash-2/40">
          <div className="flex items-center gap-2">
            <span className="block w-1.5 h-1.5 rounded-pill bg-ember" />
            <span className="mono text-ink-soft">Ember · 11:42 PM</span>
          </div>
          <span className="mono text-ink-soft">SMS</span>
        </div>

        {/* the message bubbles */}
        <div className="px-5 py-5 space-y-3 text-base">
          <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-ash-2 px-4 py-3 text-ink">
            Marin lit a fire. <span className="font-display italic text-ember">Sunday brisket</span>, 4 PM, Logan Square.
          </div>
          <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-ash-2 px-4 py-3 text-ink-mid">
            Tap to claim a dish. No app, no account.
          </div>
          {/* RSVP cluster */}
          <div className="rounded-xl border border-line bg-surface-raised p-3">
            <p className="mono text-ink-soft mb-2">RSVP · 3 spots left</p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center h-9 px-4 rounded-pill bg-ember text-ink-inverse text-sm">
                Yes
              </span>
              <span className="inline-flex items-center h-9 px-4 rounded-pill border border-line text-ink-soft text-sm">
                Maybe
              </span>
              <span className="inline-flex items-center h-9 px-4 rounded-pill border border-line text-ink-soft text-sm">
                No
              </span>
            </div>
          </div>
          {/* dish row */}
          <div className="rounded-xl border border-line bg-surface-raised p-3">
            <p className="mono text-ink-soft mb-2">The menu</p>
            <ul className="space-y-1.5">
              <li className="flex items-center justify-between gap-3 text-sm">
                <span className="text-ink">Brisket, hot and fast</span>
                <span className="mono text-ember">Marin</span>
              </li>
              <li className="flex items-center justify-between gap-3 text-sm">
                <span className="text-ink">Charred shishitos</span>
                <span className="mono text-ink-soft">open</span>
              </li>
              <li className="flex items-center justify-between gap-3 text-sm">
                <span className="text-ink">Sumac slaw</span>
                <span className="mono text-ink-soft">open</span>
              </li>
              <li className="flex items-center justify-between gap-3 text-sm">
                <span className="text-ink">Stone fruit cobbler</span>
                <span className="mono text-ember">Jules</span>
              </li>
            </ul>
          </div>
        </div>

        {/* paper-edge texture stripe */}
        <div className="h-2 bg-gradient-to-r from-ember/0 via-ember/30 to-ember/0" aria-hidden="true" />
      </div>

      {/* tiny ember sparks */}
      <span className="absolute -top-3 left-10 block w-1.5 h-1.5 rounded-pill bg-ember-hot animate-pulse" />
      <span className="absolute -top-6 right-16 block w-1 h-1 rounded-pill bg-ember opacity-70 animate-pulse" />
    </div>
  );
}
