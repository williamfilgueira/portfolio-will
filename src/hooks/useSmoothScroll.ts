import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/animations/gsap';

/**
 * Smooth scroll com Lenis, sincronizado com o ticker do GSAP para que o ScrollTrigger
 * leia sempre a mesma posição. Desligado quando o usuário prefere menos movimento.
 */
export function useSmoothScroll(): void {
  useEffect(() => {
    // Recalcula os gatilhos depois que as fontes carregam (a altura do texto muda).
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.12 });
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}
