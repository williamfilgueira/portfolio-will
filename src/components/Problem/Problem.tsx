import { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { problems } from '@/data/problems';
import { gsap, MQ, useGSAP } from '@/animations/gsap';

/*
 * 02 — O Problema (dark).
 * Cada item é "processado": a barra ████░░ preenche em 16 passos, o título entra
 * da esquerda e o número pulsa em âmbar uma única vez.
 */
export function Problem() {
  const listRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOK, () => {
        gsap.utils.toArray<HTMLElement>('[data-problem]', listRef.current).forEach((item) => {
          const bar = item.querySelector('[data-bar]');
          const title = item.querySelector('[data-title]');
          const number = item.querySelector('[data-num]');
          const description = item.querySelector('[data-desc]');

          gsap
            .timeline({
              scrollTrigger: { trigger: item, start: 'top 82%', toggleActions: 'play none none none' },
            })
            .fromTo(
              bar,
              { clipPath: 'inset(0% 100% 0% 0%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'steps(16)' },
            )
            .fromTo(
              title,
              { autoAlpha: 0.12, x: -24 },
              { autoAlpha: 1, x: 0, duration: 0.7, ease: 'expo.out' },
              0.35,
            )
            .fromTo(
              number,
              { textShadow: '0 0 0px rgba(255,176,32,0)' },
              {
                textShadow: '0 0 16px rgba(255,176,32,0.9)',
                duration: 0.3,
                yoyo: true,
                repeat: 1,
              },
              0.35,
            )
            .fromTo(
              description,
              { autoAlpha: 0, y: 12 },
              { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
              0.5,
            );
        });
      });
    },
    { scope: listRef },
  );

  return (
    <section id="problema" className="relative bg-graphite py-24 md:py-36">
      <Container>
        <div className="max-w-4xl">
          <Reveal>
            <Eyebrow>02 · O problema</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-display-l font-semibold">
              Seu negócio não precisa de mais tecnologia.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-4 font-display text-display-l font-semibold text-accent">
              Precisa da tecnologia certa.
            </p>
          </Reveal>
        </div>

        <ol ref={listRef} className="mt-16 border-t border-line md:mt-24">
          {problems.map((problem) => (
            <li
              key={problem.number}
              data-problem
              className="grid gap-5 border-b border-line py-9 md:grid-cols-[96px_minmax(0,1fr)_minmax(0,22rem)] md:items-center md:gap-10 md:py-11"
            >
              <span data-num className="font-mono text-sm text-accent">
                {problem.number}
              </span>

              <div>
                <h3
                  data-title
                  className="font-display text-[clamp(1.5rem,3.4vw,2.75rem)] leading-none font-semibold uppercase tracking-[-0.015em]"
                >
                  {problem.title}
                </h3>
                <div
                  aria-hidden="true"
                  className="relative mt-5 h-2 w-[284px] max-w-full bg-[repeating-linear-gradient(90deg,var(--color-line-strong)_0_14px,transparent_14px_18px)]"
                >
                  <div
                    data-bar
                    className="absolute inset-0 bg-[repeating-linear-gradient(90deg,var(--color-accent)_0_14px,transparent_14px_18px)]"
                  />
                </div>
              </div>

              <p data-desc className="max-w-[40ch] text-ink-dim">
                {problem.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
