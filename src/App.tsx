import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import { Portfolio } from '@/pages/Portfolio';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export function App() {
  useSmoothScroll();

  return (
    // LazyMotion + domAnimation: carrega só o necessário do motion (componentes "m.*").
    // "strict" acusa erro se alguém usar "motion.*" e puxar o pacote inteiro de volta.
    <LazyMotion features={domAnimation} strict>
      {/* "user": respeita o "reduzir movimento" do sistema em todas as animações do motion. */}
      <MotionConfig reducedMotion="user">
        <Portfolio />
      </MotionConfig>
    </LazyMotion>
  );
}
