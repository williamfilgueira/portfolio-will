import { useRef, type ComponentType } from 'react';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { HudOverlay } from '@/components/ui/HudOverlay';
import { Pill } from '@/components/ui/Pill';
import { Reveal } from '@/components/ui/Reveal';
import { services, type ServiceVisual } from '@/data/services';
import { gsap, MQ, useGSAP } from '@/animations/gsap';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { palette } from '@/styles/palette';
import { ArchitectureDiagram } from './mockups/ArchitectureDiagram';
import { BrowserMockup } from './mockups/BrowserMockup';
import { DashboardMockup } from './mockups/DashboardMockup';

const visuals: Record<ServiceVisual, ComponentType> = {
  browser: BrowserMockup,
  dashboard: DashboardMockup,
  architecture: ArchitectureDiagram,
};

/*
 * 03 — Soluções.
 * Desktop com movimento: seção de 420vh com palco sticky, controlada por scroll (scrub).
 *   "É aqui que eu entro." → painel âmbar SOLUTIONS atravessa a tela → 3 cards em sequência
 *   (entra: scale .8→1, rotate 4°→0, opacity 0→1 · sai: scale 1→.9, opacity 1→0).
 * Mobile ou "menos movimento": a mesma informação em fluxo normal, sem pin.
 */
export function Solutions() {
  const root = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery(MQ.lg);
  const reduced = useReducedMotion();
  const pinned = isDesktop && !reduced;

  useGSAP(
    () => {
      if (!pinned) return;
      const q = gsap.utils.selector(root);
      const intro = q('[data-intro]');
      const panel = q('[data-panel]');
      const cards = q('[data-card]');
      const dots = q('[data-dot]');
      const labels = q('[data-dot-label]');

      gsap.set(panel, { xPercent: -101 });
      gsap.set(cards, { autoAlpha: 0, scale: 0.8, rotate: 4 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      tl.to(panel, { xPercent: 0, duration: 1, ease: 'power2.inOut' })
        .set(intro, { autoAlpha: 0 })
        .to({}, { duration: 0.4 })
        .to(panel, { xPercent: 101, duration: 0.9, ease: 'power2.inOut' });

      cards.forEach((card, i) => {
        const at = 1.8 + i * 1.6;
        tl.to(card, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.6, ease: 'power2.out' }, at)
          .to(dots[i], { backgroundColor: palette.accent, scale: 1.5, duration: 0.2 }, at)
          .to(labels[i], { color: palette.ink, duration: 0.2 }, at);

        if (i < cards.length - 1) {
          tl.to(card, { autoAlpha: 0, scale: 0.9, duration: 0.5, ease: 'power2.in' }, at + 1.2)
            .to(dots[i], { backgroundColor: palette.lineStrong, scale: 1, duration: 0.2 }, at + 1.2)
            .to(labels[i], { color: palette.inkDim, duration: 0.2 }, at + 1.2);
        }
      });

      tl.to({}, { duration: 0.6 });
    },
    { dependencies: [pinned], scope: root, revertOnUpdate: true },
  );

  return (
    <section
      id="solucoes"
      ref={root}
      className={cn('relative bg-graphite', pinned ? 'h-[420vh]' : 'py-24 md:py-36')}
    >
      <div className={cn('relative', pinned && 'sticky top-0 h-svh overflow-hidden')}>
        <HudOverlay />
        {/* Intro */}
        <div data-intro className={cn(pinned && 'absolute inset-0 flex items-center')}>
          <Container>
            <Reveal>
              <Eyebrow>03 // Soluções</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 max-w-[14ch] font-display text-display-xl font-bold">
                É aqui que eu entro.
              </h2>
            </Reveal>
            {pinned ? (
              <p className="mt-8 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-dim">
                Continue rolando ↓
              </p>
            ) : null}
          </Container>
        </div>

        {/* Painel âmbar */}
        <div
          data-panel
          className={cn(
            'bg-accent text-on-accent',
            pinned ? 'absolute inset-0 z-20 flex items-center' : 'mt-14 md:mt-20',
          )}
        >
          <Container className={cn(!pinned && 'py-14 md:py-20')}>
            <p className="font-mono text-eyebrow font-medium uppercase">Sites · SaaS · Sistemas</p>
            <p className="mt-4 font-display text-[clamp(3.5rem,15vw,14rem)] leading-[0.85] font-bold tracking-[-0.045em]">
              Solutions
            </p>
          </Container>
        </div>

        {/* Cards */}
        <div className={cn(pinned ? 'absolute inset-0 z-10' : 'mt-14 md:mt-20')}>
          <Container className={cn(pinned && 'h-full')}>
            <div className={cn(pinned ? 'relative h-full' : 'space-y-6')}>
              {services.map((service) => {
                const Visual = visuals[service.visual];
                return (
                  <div
                    key={service.id}
                    data-card
                    className={cn(pinned && 'absolute inset-0 flex items-center')}
                  >
                    <article className="cut-corner cut-edge w-full border border-line bg-surface p-7 md:p-10 lg:p-12">
                      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
                        <div>
                          <p className="flex items-center gap-3 font-mono text-eyebrow font-medium uppercase text-accent">
                            <span>{service.number}</span>
                            <span className="h-px w-8 bg-accent" />
                            <span>{service.label}</span>
                          </p>
                          <h3 className="mt-6 font-display text-[clamp(2rem,4.2vw,3.5rem)] leading-[0.95] font-bold uppercase tracking-[-0.03em]">
                            {service.title[0]}
                            <br />
                            {service.title[1]}
                          </h3>
                          <p className="mt-6 max-w-[44ch] text-lg text-ink-dim">
                            {service.description}
                          </p>
                          <ul className="mt-6 flex flex-wrap gap-2">
                            {service.points.map((point) => (
                              <li key={point}>
                                <Pill tone="accent">{point}</Pill>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex justify-center lg:justify-end">
                          <Visual />
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </Container>
        </div>

        {/* Indicador de progresso (só no modo pinned) */}
        {pinned ? (
          <ol
            aria-hidden="true"
            className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-7"
          >
            {services.map((service) => (
              <li key={service.id} className="flex items-center gap-2.5">
                <span data-dot className="size-2 rounded-full bg-line-strong" />
                <span
                  data-dot-label
                  className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-dim"
                >
                  {service.number} {service.label}
                </span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
}
