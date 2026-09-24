import { Container } from '@/components/ui/Container';
import { CornerMarks } from '@/components/ui/CornerMarks';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { HudOverlay } from '@/components/ui/HudOverlay';
import { Pill } from '@/components/ui/Pill';
import { Reveal } from '@/components/ui/Reveal';
import { site } from '@/data/site';

const INDICATORS = ['Full stack', 'Backend', 'Frontend', 'Database', 'Architecture'];

/* Foto: salve em src/assets/foto-sobre.webp (ou .jpg/.png). Entra sozinha. */
const photoFiles = import.meta.glob<string>('/src/assets/foto-sobre.{webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const PHOTO_URL: string | undefined = Object.values(photoFiles)[0] ?? (site.photo || undefined);

function Portrait() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] lg:mx-0">
      <div className="cut-corner relative aspect-[4/5] overflow-hidden border border-line bg-surface">
        {PHOTO_URL ? (
          <img
            src={PHOTO_URL}
            alt={`Foto de ${site.name}`}
            width={1000}
            height={1250}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgb(255_176_32/0.14)_1px,transparent_1px)] [background-size:22px_22px]" />
            <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_30%_20%,rgb(255_176_32/0.16),transparent_70%)]" />
            <span
              aria-hidden="true"
              className="absolute inset-0 grid place-items-center font-display text-[clamp(7rem,18vw,11rem)] leading-none font-bold tracking-[-0.06em] text-accent"
            >
              WF
            </span>
          </>
        )}

        <HudOverlay vignette={false} />
        {/* diagonal do chanfro por cima da foto */}
        <span aria-hidden="true" className="cut-edge pointer-events-none absolute inset-0" />

        <span className="absolute inset-x-5 bottom-4 flex items-center justify-between gap-3 font-mono text-[0.625rem] uppercase tracking-[0.16em]">
          <span className="text-cyber">// {site.name}</span>
          <span className="text-ink-dim">Dev</span>
        </span>
      </div>
      <CornerMarks tone="cyber" className="-inset-2" size="size-5" />
    </div>
  );
}

/* 07 — Sobre (dark). */
export function About() {
  return (
    <section id="sobre" className="relative bg-graphite py-24 md:py-36">
      <HudOverlay />
      <Container className="grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <Portrait />
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>07 // Sobre</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-display-l font-semibold">
              Construo sistemas pensando além do código.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-[52ch] text-lg text-ink-dim">
              Sou desenvolvedor de sistemas com experiência em backend, frontend, bancos de dados, APIs
              e arquitetura de software.
            </p>
            <p className="mt-4 max-w-[52ch] text-lg text-ink-dim">
              Do banco de dados à interface, cuido de cada camada para que a tecnologia sirva ao
              negócio — e não o contrário.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className="mt-10 flex flex-wrap gap-2">
              {INDICATORS.map((indicator) => (
                <li key={indicator}>
                  <Pill tone="accent">{indicator}</Pill>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
