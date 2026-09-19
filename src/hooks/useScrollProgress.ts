import { useScroll, useSpring, type MotionValue } from 'motion/react';

/** Progresso do scroll da página (0 → 1), suavizado com spring. */
export function useScrollProgress(): MotionValue<number> {
  const { scrollYProgress } = useScroll();
  return useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });
}
