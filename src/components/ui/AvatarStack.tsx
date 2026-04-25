import { Avatar } from './Avatar';
import { cn } from '../../lib/cn';

interface Props {
  people: { name: string; src?: string }[];
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarStack({ people, max = 4, size = 'sm', className }: Props) {
  const visible = people.slice(0, max);
  const rest = people.length - visible.length;
  return (
    <div className={cn('flex items-center', className)}>
      <div className="flex -space-x-2">
        {visible.map((p) => (
          <Avatar key={p.name} name={p.name} src={p.src} size={size} ring />
        ))}
      </div>
      {rest > 0 && (
        <span className="mono ml-2 text-ink-soft">+{rest}</span>
      )}
    </div>
  );
}
