import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'dark' | 'ghost' | 'ghostOnLight' | 'ghostOnAccent';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-on-accent shadow-glow-sm hover:-translate-y-0.5 hover:shadow-glow-md',
  dark: 'bg-graphite text-light hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-8px_rgb(19_18_16/0.45)]',
  ghost:
    'border border-line-strong text-ink hover:border-accent hover:text-accent hover:shadow-glow-sm',
  ghostOnLight:
    'border border-on-light/25 text-on-light hover:border-on-light hover:bg-on-light/5',
  ghostOnAccent:
    'border border-on-accent/30 text-on-accent hover:border-on-accent hover:bg-on-accent/5',
};

const sizes: Record<Size, string> = {
  sm: 'h-11 px-5 text-[0.75rem]',
  md: 'h-12 px-6 text-[0.8125rem]',
  lg: 'h-14 px-8 text-[0.875rem]',
};

type ButtonLinkProps = ComponentPropsWithoutRef<'a'> & {
  href: string;
  variant?: Variant;
  size?: Size;
  /** Seta decorativa (ex.: '↗' ou '→'), anima no hover. */
  arrow?: ReactNode;
};

/** Link com cara de botão (todos os CTAs do site navegam). Altura mínima de 44px. */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  arrow,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const isExternal = /^https?:\/\//.test(href);

  return (
    <a
      href={href}
      className={cn(
        'group inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-mono font-medium tracking-[0.04em]',
        'transition-[transform,box-shadow,background-color,color,border-color] duration-300 ease-standard',
        variants[variant],
        sizes[size],
        className,
      )}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      <span>{children}</span>
      {arrow ? (
        <span
          aria-hidden="true"
          className="transition-transform duration-300 ease-standard group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          {arrow}
        </span>
      ) : null}
    </a>
  );
}
