import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'accent' | 'dim' | 'onLight' | 'onAccent';

const tones: Record<Tone, string> = {
  accent: 'border-accent-line text-accent [--cut-line:var(--color-accent-line)]',
  dim: 'border-line-strong text-ink-dim [--cut-line:var(--color-line-strong)]',
  onLight: 'border-on-light/20 text-on-light [--cut-line:rgb(34_30_23/0.2)]',
  onAccent: 'border-on-accent/30 text-on-accent [--cut-line:rgb(42_28_5/0.3)]',
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
        'cut-corner-sm cut-edge-sm inline-flex items-center border px-3 py-1.5 font-mono text-[0.6875rem] leading-none uppercase tracking-[0.06em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
