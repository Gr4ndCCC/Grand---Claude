import { useState, type ReactNode, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn';

interface Tab { id: string; label: string; content: ReactNode }
interface Props {
  tabs: Tab[];
  defaultId?: string;
  className?: string;
}

export function Tabs({ tabs, defaultId, className }: Props) {
  const [active, setActive] = useState(defaultId ?? tabs[0]?.id);
  const idx = tabs.findIndex(t => t.id === active);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') setActive(tabs[(idx + 1) % tabs.length].id);
    if (e.key === 'ArrowLeft')  setActive(tabs[(idx - 1 + tabs.length) % tabs.length].id);
  };

  return (
    <div className={className}>
      <div role="tablist" onKeyDown={onKey} className="flex gap-1 border-b border-line">
        {tabs.map(t => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(t.id)}
              className={cn(
                'ember-focus relative h-10 px-3 text-sm font-medium transition-colors',
                on ? 'text-ink' : 'text-ink-soft hover:text-ink',
              )}
            >
              {t.label}
              {on && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-ember" />
              )}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="pt-4">
        {tabs.find(t => t.id === active)?.content}
      </div>
    </div>
  );
}
