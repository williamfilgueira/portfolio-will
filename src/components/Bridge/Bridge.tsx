import { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { gsap, MQ, useGSAP } from '@/animations/gsap';
import { palette } from '@/styles/palette';

/*
 * Transição Hero → Problema.
 * Seção alta com um "palco" sticky: o fundo vai de CLARO → ÂMBAR → DARK conforme o scroll,
 * pedaços de código sobem e somem, e as duas frases entram em tempos diferentes.
 * Sem animação (menos movimento), o palco já nasce escuro com as duas frases visíveis.
 */

const GLYPHS = [
  { text: '</>', x: 7, y: 18 },
  { text: '{ }', x: 84, y: 14 },
  { text: '[ ]', x: 44, y: 10 },
  { text: '=>', x: 91, y: 40 },
  { text: 'fn()', x: 4, y: 72 },
  { text: 'API', x: 76, y: 76 },
  { text: '01', x: 22, y: 86 },
  { text: 'SQL', x: 54, y: 88 },
  { text: '0x1F', x: 64, y: 22 },
  { text: '&&', x: 88, y: 88 },
];

export function Bridge() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOK, () => {
        const q = gsap.utils.selector(root);
        const stage = q('[data-stage]');
        const first = q('[data-line="1"]');
        const second = q('[data-line="2"]');
        const glyphs = q('[data-glyph]');

        gsap.set(stage, { backgroundColor: palette.light, color: palette.onLight });
        gsap.set([first, second], { autoAlpha: 0, y: 48 });
        gsap.set(glyphs, { autoAlpha: 0, y: 40 });

        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1,
            },
          })
          .to(stage, { backgroundColor: palette.accent, color: palette.onAccent, duration: 1 }, 0)
          .to(first, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.25)
          .to(glyphs, { autoAlpha: 0.7, y: 0, duration: 0.5, stagger: 0.03 }, 0.2)
          .to(glyphs, { y: -140, duration: 1.4, stagger: 0.02 }, 0.7)
          .to(glyphs, { autoAlpha: 0, duration: 0.4 }, 1.5)
          .to(stage, { backgroundColor: palette.graphite, color: palette.ink, duration: 1 }, 1.1)
          .to(second, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.6)
          .to({}, { duration: 0.5 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative motion-safe:h-[240vh]">
      <div
        data-stage
        className="flex min-h-[70svh] items-center overflow-hidden bg-graphite py-24 text-ink motion-safe:sticky motion-safe:top-0 motion-safe:h-svh motion-safe:py-0"
      >
        {GLYPHS.map((glyph) => (
          <span
            key={glyph.text}
            data-glyph
            aria-hidden="true"
            className="absolute font-mono text-sm opacity-0 motion-reduce:hidden md:text-base"
            style={{ left: `${glyph.x}%`, top: `${glyph.y}%` }}
          >
            {glyph.text}
          </span>
        ))}

        <Container className="relative">
          <p data-line="1" className="font-display text-display-l font-semibold">
            Tecnologia não é o objetivo.
          </p>
          <p data-line="2" className="mt-3 font-display text-display-l font-semibold text-accent">
            Resolver o problema é.
          </p>
        </Container>
      </div>
    </section>
  );
}
