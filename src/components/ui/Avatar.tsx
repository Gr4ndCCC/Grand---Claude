import clsx from 'clsx';

interface AvatarProps {
  src: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  ring?: boolean;
  ringColor?: 'orange' | 'amber' | 'green';
  className?: string;
}

const SIZES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

const RINGS = {
  orange: 'ring-2 ring-ember-orange ring-offset-2 ring-offset-ember-bg',
  amber: 'ring-2 ring-ember-amber ring-offset-2 ring-offset-ember-bg',
  green: 'ring-2 ring-ember-green ring-offset-2 ring-offset-ember-bg',
};

export function Avatar({ src, name, size = 'md', ring = false, ringColor = 'orange', className }: AvatarProps) {
  return (
    <div
      className={clsx(
        'rounded-full overflow-hidden bg-ember-surface2 flex-shrink-0',
        SIZES[size],
        ring && RINGS[ringColor],
        className,
      )}
      title={name}
    >
      <img src={src} alt={name} className="w-full h-full object-cover" loading="lazy" />
    </div>
  );
}

interface AvatarGroupProps {
  users: Array<{ name: string; avatar: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md';
}

export function AvatarGroup({ users, max = 4, size = 'sm' }: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const extra = users.length - max;

  return (
    <div className="flex items-center">
      {visible.map((u, i) => (
        <div key={i} className={clsx('rounded-full border-2 border-ember-bg -ml-2 first:ml-0', SIZES[size])}>
          <img src={u.avatar} alt={u.name} className="w-full h-full object-cover rounded-full" />
        </div>
      ))}
      {extra > 0 && (
        <div
          className={clsx(
            'rounded-full border-2 border-ember-bg -ml-2 bg-ember-surface2 flex items-center justify-center',
            'text-ember-muted font-semibold',
            size === 'xs' && 'w-6 h-6 text-[9px]',
            size === 'sm' && 'w-8 h-8 text-xs',
            size === 'md' && 'w-10 h-10 text-sm',
          )}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
