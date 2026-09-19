import { m, type HTMLMotionProps } from 'motion/react';
import { duration, ease } from '@/animations/tokens';

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number;
  /** Deslocamento inicial em px. */
  y?: number;
};

/**
 * Átomo de entrada do design system: opacity 0→1 + y 24→0 ao entrar na viewport.
 * Com "menos movimento" ativo, o MotionConfig global remove o deslocamento.
 */
export function Reveal({ delay = 0, y = 24, children, ...rest }: RevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: duration.slow, ease: ease.out, delay }}
      {...rest}
    >
      {children}
    </m.div>
  );
}
