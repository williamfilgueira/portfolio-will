import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'accent' | 'dim' | 'onLight' | 'onAccent';

const tones: Record<Tone, string> = {
  accent: 'border-accent-line text-accent',
  dim: 'border-line-strong text-ink-dim',
  onLight: 'border-on-light/20 text-on-light',
  onAccent: 'border-on-accent/30 text-on-accent',
};

type PillProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

export function Pill({ children, tone = 'dim', className }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1.5 font-mono text-[0.6875rem] leading-none uppercase tracking-[0.06em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
