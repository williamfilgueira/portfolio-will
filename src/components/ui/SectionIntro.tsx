import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Eyebrow } from './Eyebrow';
import { Reveal } from './Reveal';

type SectionIntroProps = {
  label: string;
  title: ReactNode;
  children?: ReactNode;
  tone?: 'dark' | 'light';
  className?: string;
};

/** Eyebrow + título + texto de apoio, com o mesmo ritmo em todas as seções. */
export function SectionIntro({ label, title, children, tone = 'dark', className }: SectionIntroProps) {
  const onLight = tone === 'light';

  return (
    <div className={cn('max-w-3xl', className)}>
      <Reveal>
        <Eyebrow tone={onLight ? 'onLight' : 'accent'}>{label}</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-6 font-display text-display-l font-semibold">{title}</h2>
      </Reveal>
      {children ? (
        <Reveal delay={0.16}>
          <p
            className={cn(
              'mt-6 max-w-[52ch] text-lg',
              onLight ? 'text-on-light-dim' : 'text-ink-dim',
            )}
          >
            {children}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
