import type { Variants } from 'motion/react';

/** Durações em segundos (motion e GSAP usam segundos). */
export const duration = {
  instant: 0.1,
  fast: 0.2,
  base: 0.35,
  slow: 0.6,
  slower: 0.9,
  cinematic: 1.2,
} as const;

/** Curvas cubic-bezier do design system. */
export const ease = {
  standard: [0.4, 0, 0.2, 1],
  out: [0.16, 1, 0.3, 1],
  in: [0.7, 0, 0.84, 0],
  inOut: [0.65, 0, 0.35, 1],
  pop: [0.34, 1.56, 0.64, 1],
} as const;

/** Intervalo entre irmãos numa sequência (máx. ~6 itens por sequência). */
export const stagger = {
  tight: 0.06,
  base: 0.1,
  loose: 0.12,
} as const;

/** Átomo de entrada: opacity 0→1 + y 24→0, dur slow, ease out. */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } },
};
