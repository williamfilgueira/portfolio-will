import { cn } from '@/lib/cn';

type CornerMarksProps = {
  className?: string;
  tone?: 'cyber' | 'accent' | 'onLight';
  size?: string;
};

const tones = {
  cyber: 'border-cyber',
  accent: 'border-accent',
  onLight: 'border-on-light/40',
} as const;

/** Quatro cantos em "L", como mira de HUD. */
export function CornerMarks({ className, tone = 'cyber', size = 'size-4' }: CornerMarksProps) {
  const color = tones[tone];
  return (
    <span aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      <span className={cn('absolute top-0 left-0 border-t border-l', size, color)} />
      <span className={cn('absolute top-0 right-0 border-t border-r', size, color)} />
      <span className={cn('absolute bottom-0 left-0 border-b border-l', size, color)} />
      <span className={cn('absolute right-0 bottom-0 border-r border-b', size, color)} />
    </span>
  );
}
