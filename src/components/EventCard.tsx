import { MapPin, Clock } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { AvatarStack } from './ui/AvatarStack';
import { SatelliteMap } from './SatelliteMap';
import { cn } from '../lib/cn';

interface Props {
  title: string;
  host: string;
  when: string;
  where: string;
  going: { name: string; src?: string }[];
  spotsLeft?: number;
  pinX?: number;
  pinY?: number;
  className?: string;
  onClick?: () => void;
}

export function EventCard({
  title, host, when, where, going, spotsLeft, pinX, pinY, className, onClick,
}: Props) {
  return (
    <Card variant="raised" interactive onClick={onClick} className={cn('p-0 overflow-hidden flex flex-col', className)}>
      <div className="h-32 relative">
        <SatelliteMap width={400} height={128} pinX={pinX ?? 80} pinY={pinY ?? 60} className="w-full h-full" />
        {spotsLeft !== undefined && (
          <Badge tone="ember" className="absolute top-3 right-3">
            {spotsLeft} spots left
          </Badge>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div>
          <p className="mono text-ink-soft mb-1">Hosted by {host}</p>
          <h3 className="text-xl">{title}</h3>
        </div>
        <div className="flex flex-col gap-1 text-sm text-ink-mid">
          <span className="inline-flex items-center gap-2">
            <Clock size={14} strokeWidth={1.5} className="text-ink-soft" /> {when}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin size={14} strokeWidth={1.5} className="text-ink-soft" /> {where}
          </span>
        </div>
        <div className="mt-auto pt-3 border-t border-line flex items-center justify-between">
          <AvatarStack people={going} size="sm" />
          <span className="mono text-ink-soft">{going.length} going</span>
        </div>
      </div>
    </Card>
  );
}
