import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { projects, type Project } from '@/data/projects';
import { stagger } from '@/animations/tokens';

/*
 * Logos dos clientes: salve em  src/assets/logos/<id do projeto>.svg  (ou .png / .webp),
 * com fundo transparente. O arquivo entra sozinho no lugar do nome em texto.
 * Os ids estão em src/data/projects.ts (ex.: tapa-na-pantera.svg).
 */
const logoFiles = import.meta.glob<string>('/src/assets/logos/*.{svg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const logoById = new Map(
  Object.entries(logoFiles).map(([path, url]) => [
    path.slice(path.lastIndexOf('/') + 1).replace(/\.(svg|png|webp)$/, ''),
    url,
  ]),
);

const TILE =
  'group flex h-full min-h-44 flex-col justify-between gap-6 p-5 transition-colors duration-300 ease-standard md:min-h-52 md:p-7';

/** Quadro de um cliente: logo (ou nome) monocromático; no hover o quadro escurece e o logo fica branco. */
function LogoTile({ project }: { project: Project }) {
  const logo = logoById.get(project.id);

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      title={project.description}
      className={`${TILE} hover:bg-graphite focus-visible:bg-graphite`}
    >
      <span className="sr-only">
        {project.title} — {project.category} (abre em nova aba)
      </span>

      <span aria-hidden="true" className="flex flex-1 items-center justify-center">
        {logo ? (
          <img
            src={logo}
            alt=""
            loading="lazy"
            decoding="async"
            className="max-h-14 max-w-[75%] object-contain opacity-80 [filter:brightness(0)] transition-[filter,opacity] duration-300 ease-standard group-hover:opacity-100 group-hover:[filter:brightness(0)_invert(1)] group-focus-visible:opacity-100 group-focus-visible:[filter:brightness(0)_invert(1)] md:max-h-16"
          />
        ) : (
          <span className="text-center font-display text-[clamp(1.25rem,2.2vw,1.875rem)] leading-[1.05] font-bold tracking-[-0.025em] text-on-light transition-colors duration-300 group-hover:text-ink group-focus-visible:text-ink">
            {project.title}
          </span>
        )}
      </span>

      <span
        aria-hidden="true"
        className="flex items-end justify-between gap-3 font-mono text-[0.625rem] leading-snug uppercase tracking-[0.1em]"
      >
        <span className="text-on-light-dim transition-colors duration-300 group-hover:text-ink-dim group-focus-visible:text-ink-dim">
          {project.category}
        </span>
        <span className="shrink-0 text-sm text-accent transition-[opacity,translate] duration-300 ease-standard group-hover:translate-x-0.5 group-hover:-translate-y-0.5 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
          ↗
        </span>
      </span>
    </a>
  );
}

/** Sexto quadro: fecha a grade e leva ao contato. */
function NextProjectTile() {
  return (
    <a href="#contato" className={`${TILE} bg-accent text-on-accent`}>
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.1em] opacity-70">
        Próximo projeto
      </span>
      <span className="font-display text-[clamp(1.25rem,2.2vw,1.875rem)] leading-[1.05] font-bold tracking-[-0.025em]">
        Seu negócio pode ser o próximo.
      </span>
      <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em]">
        Vamos conversar
        <span
          aria-hidden="true"
          className="transition-transform duration-300 ease-standard group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          ↗
        </span>
      </span>
    </a>
  );
}

/* 06 — Cases (claro): grade compacta de clientes, estilo editorial. */
export function Cases() {
  return (
    <section id="cases" className="relative bg-light py-24 text-on-light md:py-32">
      <Container>
        <SectionIntro tone="light" label="06 · Cases" title="Selected Work">
          Projetos no ar, desenvolvidos para resolver problemas reais de negócios reais.
        </SectionIntro>

        <ul className="mt-14 grid grid-cols-2 border-t border-l border-on-light/15 md:mt-20 lg:grid-cols-3">
          {projects.map((project, i) => (
            <li key={project.id} className="border-r border-b border-on-light/15">
              <Reveal y={12} delay={(i % 3) * stagger.tight} className="h-full">
                <LogoTile project={project} />
              </Reveal>
            </li>
          ))}
          <li className="border-r border-b border-on-light/15">
            <Reveal y={12} delay={2 * stagger.tight} className="h-full">
              <NextProjectTile />
            </Reveal>
          </li>
        </ul>
      </Container>
    </section>
  );
}
