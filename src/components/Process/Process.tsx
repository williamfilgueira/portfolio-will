import { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { processSteps } from '@/data/process';
import { gsap, MQ, useGSAP } from '@/animations/gsap';
import { palette } from '@/styles/palette';

/*
 * 04 — Processo (claro).
 * A "linha de produção" se desenha conforme o scroll (scrub) e cada etapa acende
 * quando a linha chega nela. Horizontal no desktop, vertical no mobile.
 */
export function Process() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ isMd: MQ.md, motionOK: MQ.motionOK }, (context) => {
        const { isMd, motionOK } = context.conditions as { isMd: boolean; motionOK: boolean };
        if (!motionOK) return;

        const q = gsap.utils.selector(trackRef);
        const fill = q('[data-fill]');
        const nodes = q('[data-node]');
        const bodies = q('[data-step-body]');

        gsap.set(fill, isMd ? { scaleX: 0 } : { scaleY: 0 });
        gsap.set(nodes, { scale: 0.55, backgroundColor: palette.light });
        gsap.set(bodies, { autoAlpha: 0.3 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: trackRef.current,
            start: 'top 80%',
            end: isMd ? 'top 25%' : 'bottom 65%',
            scrub: 1,
          },
        });

        tl.to(fill, isMd ? { scaleX: 1, duration: 1 } : { scaleY: 1, duration: 1 }, 0);

        const last = Math.max(1, nodes.length - 1);
        nodes.forEach((node, i) => {
          const at = Math.max(0, i / last - 0.04);
          tl.to(node, { scale: 1, backgroundColor: palette.accent, duration: 0.06, ease: 'back.out(2)' }, at).to(
            bodies[i],
            { autoAlpha: 1, duration: 0.08 },
            at,
          );
        });
      });
    },
    { scope: trackRef },
  );

  return (
    <section id="processo" className="relative bg-light py-24 text-on-light md:py-36">
      <Container>
        <SectionIntro tone="light" label="04 · Processo" title="Do problema ao produto.">
          Uma linha de produção digital: cada etapa existe para reduzir risco antes de escrever mais
          código.
        </SectionIntro>

        <div ref={trackRef} className="relative mt-16 md:mt-24">
          {/* trilho + preenchimento (a linha que se desenha) */}
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-24 left-[7px] w-0.5 bg-on-light/10 md:top-[7px] md:right-[calc((100%_-_7.5rem)/6_-_0.5rem)] md:bottom-auto md:left-2 md:h-0.5 md:w-auto"
          />
          <div
            aria-hidden="true"
            data-fill
            className="absolute top-2 bottom-24 left-[7px] w-0.5 origin-top bg-on-light md:top-[7px] md:right-[calc((100%_-_7.5rem)/6_-_0.5rem)] md:bottom-auto md:left-2 md:h-0.5 md:w-auto md:origin-left"
          />

          <ol className="relative grid gap-10 md:grid-cols-6 md:gap-6">
            {processSteps.map((step, i) => (
              <li key={step.title} className="relative pl-10 md:pt-12 md:pl-0">
                <span
                  data-node
                  aria-hidden="true"
                  className="absolute top-0 left-0 size-4 rounded-full border-2 border-on-light bg-accent"
                />
                <div data-step-body>
                  <span className="font-mono text-xs text-on-light-dim">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-on-light-dim">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
