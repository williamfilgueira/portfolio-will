import type { ReactNode } from 'react';
import { m, type Variants } from 'motion/react';
import { Avatar3D } from '@/components/Avatar3D/Avatar3D';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { duration, ease, stagger } from '@/animations/tokens';

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: stagger.base, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } },
};

const line: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: duration.slower, ease: ease.out } },
};

const mark: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: duration.slow, ease: ease.out, delay: 0.5 } },
};

/** Linha do título que "sobe" de dentro de uma máscara. */
function Line({ children }: { children: ReactNode }) {
  return (
    <span className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
      <m.span className="block" variants={line}>
        {children}
      </m.span>
    </span>
  );
}

/** Palavra com marca-texto âmbar desenhada por baixo. */
function Marked({ children }: { children: ReactNode }) {
  return (
    <span className="relative isolate inline-block">
      {children}
      <m.span
        aria-hidden="true"
        variants={mark}
        className="absolute inset-x-[-0.04em] bottom-[0.1em] -z-10 h-[0.3em] origin-left rounded-[2px] bg-accent"
      />
    </span>
  );
}

export function Hero() {
  return (
    <section id="inicio" className="relative bg-light text-on-light">
      <Container className="grid min-h-svh items-center gap-14 pt-32 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pt-28 lg:pb-20">
        <m.div variants={list} initial="hidden" animate="show">
          <m.div variants={item}>
            <Eyebrow tone="onLight">Design • Development • Technology</Eyebrow>
          </m.div>

          <h1 className="mt-8 font-display text-display-xl font-bold">
            <Line>Transformo</Line>
            <Line>ideias em</Line>
            <Line>
              <Marked>produtos</Marked>
            </Line>
            <Line>
              <Marked>digitais.</Marked>
            </Line>
          </h1>

          <m.p
            variants={item}
            className="mt-8 max-w-[42ch] text-lg text-on-light-dim md:text-xl"
          >
            Sites, aplicações SaaS e sistemas sob medida para transformar problemas em soluções.
          </m.p>

          <m.div variants={item} className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="#contato" variant="dark" size="lg" arrow="↗">
              Vamos conversar
            </ButtonLink>
            <ButtonLink href="#cases" variant="ghostOnLight" size="lg" arrow="→">
              Ver trabalhos
            </ButtonLink>
          </m.div>
        </m.div>

        <m.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: ease.out, delay: 0.2 }}
          className="mx-auto w-full max-w-[520px] lg:mr-0"
        >
          <Avatar3D />
        </m.div>
      </Container>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-6 hidden md:block">
        <Container className="flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-on-light-dim">
          <span className="h-8 w-px bg-on-light/30" />
          Role para explorar
        </Container>
      </div>
    </section>
  );
}
