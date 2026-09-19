import { useRef } from 'react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { site } from '@/data/site';
import { mailtoHref, telHref, whatsappHref } from '@/integrations/contact';
import { gsap, MQ, useGSAP } from '@/animations/gsap';
import { palette } from '@/styles/palette';

/*
 * 08 — CTA final (âmbar).
 * Ao entrar, o fundo vira de DARK para ÂMBAR (scrub) e o texto de claro para escuro.
 * Os textos herdam a cor da seção (currentColor) para acompanharem a virada.
 */
export function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOK, () => {
        gsap.fromTo(
          root.current,
          { backgroundColor: palette.graphite, color: palette.ink },
          {
            backgroundColor: palette.accent,
            color: palette.onAccent,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'top 35%', scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="contato" ref={root} className="relative bg-accent py-28 text-on-accent md:py-44">
      <Container>
        <Reveal>
          <Eyebrow tone="current">08 · Contato</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-8 max-w-[12ch] font-display text-[clamp(3.25rem,10vw,9rem)] leading-[0.9] font-bold tracking-[-0.045em]">
            Vamos construir algo?
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-8 max-w-[40ch] text-xl opacity-80 md:text-2xl">
            Tem uma ideia, problema ou projeto que precisa sair do papel?
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href={whatsappHref()} variant="dark" size="lg" arrow="↗">
              Falar com William
            </ButtonLink>
            <ButtonLink href={mailtoHref()} variant="ghostOnAccent" size="lg" arrow="→">
              Enviar e-mail
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-10 flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm tracking-[0.04em]">
            <a href={telHref()} className="underline-offset-4 opacity-80 hover:underline hover:opacity-100">
              {site.phoneDisplay}
            </a>
            <a href={mailtoHref()} className="underline-offset-4 opacity-80 hover:underline hover:opacity-100">
              {site.email}
            </a>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
