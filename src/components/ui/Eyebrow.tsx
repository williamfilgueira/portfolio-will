import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'accent' | 'dim' | 'onLight' | 'current';

const tones: Record<Tone, string> = {
  accent: 'text-accent',
  dim: 'text-ink-dim',
  onLight: 'text-on-light',
  current: 'text-current',
};

/** Os colchetes e a barra "//" usam o ciano de HUD (escuro nas seções claras). */
const brackets: Record<Tone, string> = {
  accent: 'text-cyber',
  dim: 'text-cyber',
  onLight: 'text-cyber-ink',
  current: 'text-current opacity-60',
};

type EyebrowProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

/** Rótulo de seção em HUD: [ 02 // O PROBLEMA ]. */
export function Eyebrow({ children, tone = 'accent', className }: EyebrowProps) {
  const mark = brackets[tone];
  const parts = typeof children === 'string' ? children.split('//') : null;

  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 font-mono text-eyebrow font-medium uppercase',
        tones[tone],
        className,
      )}
    >
      <span className={mark}>[</span>
      {parts && parts.length === 2 ? (
        <span className="inline-flex items-center gap-2">
          {parts[0].trim()}
          <span className={mark}>//</span>
          {parts[1].trim()}
        </span>
      ) : (
        children
      )}
      <span className={mark}>]</span>
    </p>
  );
}
