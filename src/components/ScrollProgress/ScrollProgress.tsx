import { m } from 'motion/react';
import { useScrollProgress } from '@/hooks/useScrollProgress';

/** Barra fina âmbar no topo que acompanha o progresso da leitura. */
export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX: progress }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-accent shadow-glow-sm"
    />
  );
}
