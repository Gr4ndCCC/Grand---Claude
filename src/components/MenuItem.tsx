import { useState } from 'react';
import { Check } from 'lucide-react';
import { Avatar } from './ui/Avatar';
import { cn } from '../lib/cn';

interface Props {
  name: string;
  category?: string;
  claimedBy?: { name: string; src?: string } | null;
  onClaim?: () => void;
  className?: string;
}

export function MenuItem({ name, category, claimedBy: initialClaim, onClaim, className }: Props) {
  const [claimed, setClaimed] = useState<{ name: string; src?: string } | null>(initialClaim ?? null);
  const [flipped, setFlipped] = useState(false);

  const handleClaim = () => {
    if (claimed) return;
    setFlipped(true);
    setTimeout(() => {
      setClaimed({ name: 'You' });
      onClaim?.();
    }, 320);
  };

  return (
    <div className={cn('flip-card w-full', flipped && 'flipped', className)}>
      <div className="flip-card-inner">
        {/* front */}
        <div className="flip-face bg-surface-raised border border-line rounded-md p-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            {category && <p className="mono text-ink-soft mb-1">{category}</p>}
            <p className="text-ink truncate">{name}</p>
          </div>
          {claimed ? (
            <div className="flex items-center gap-2">
              <Avatar name={claimed.name} src={claimed.src} size="sm" />
              <span className="mono text-ink-soft">{claimed.name === 'You' ? 'YOU GOT IT' : claimed.name}</span>
            </div>
          ) : (
            <button
              onClick={handleClaim}
              className="ember-focus spark inline-flex items-center gap-1.5 h-9 px-3 rounded-md
                         bg-ember text-ink-inverse text-sm font-medium hover:bg-ember-hot
                         active:bg-ember-deep transition-colors"
            >
              I'll bring this
            </button>
          )}
        </div>
        {/* back */}
        <div className="flip-face flip-back bg-ember text-ink-inverse border border-ember-deep rounded-md p-4 flex items-center justify-center gap-2">
          <Check size={18} strokeWidth={2} />
          <span className="mono">CLAIMED</span>
        </div>
      </div>
    </div>
  );
}
