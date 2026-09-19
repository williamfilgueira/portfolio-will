import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'accent' | 'dim' | 'onLight' | 'current';

const tones: Record<Tone, string> = {
  accent: 'text-accent before:bg-accent',
  dim: 'text-ink-dim before:bg-ink-dim',
  onLight: 'text-on-light before:bg-on-light',
  current: 'text-current before:bg-current',
};

type EyebrowProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

/** Rótulo mono em caixa alta com traço à esquerda (eyebrow / label de seção). */
export function Eyebrow({ children, tone = 'accent', className }: EyebrowProps) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-3 font-mono text-eyebrow font-medium uppercase',
        'before:h-px before:w-7 before:shrink-0',
        tones[tone],
        className,
      )}
    >
      {children}
    </p>
  );
}
