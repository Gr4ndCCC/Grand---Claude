import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-0">
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <button
            className="w-full flex items-center justify-between py-5 text-left group"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span
              className="text-base font-medium pr-8 transition-colors"
              style={{
                fontFamily: 'Georgia, serif',
                color: open === i ? '#FFFFFF' : '#E4CFB3',
              }}
            >
              {item.q}
            </span>
            <ChevronDown
              size={18}
              className="flex-shrink-0 transition-all duration-300"
              style={{
                color: '#800000',
                transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>

          <div
            className="overflow-hidden transition-all duration-300"
            style={{
              maxHeight: open === i ? '400px' : '0px',
              opacity:   open === i ? 1 : 0,
            }}
          >
            <p
              className="pb-5 text-sm leading-relaxed"
              style={{ color: '#A0A0A0' }}
            >
              {item.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
