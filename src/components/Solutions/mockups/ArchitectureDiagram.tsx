const LAYERS = [
  { name: 'Frontend', tech: 'React · TypeScript' },
  { name: 'API', tech: 'REST · JWT' },
  { name: 'Backend', tech: 'Java · Spring Boot' },
  { name: 'Database', tech: 'MySQL · PostgreSQL' },
];

/** Camadas Frontend → API → Backend → Database (Solução 03 — Sistemas). */
export function ArchitectureDiagram() {
  return (
    <ol aria-label="Arquitetura: Frontend, API, Backend e Database" className="w-full max-w-[440px]">
      {LAYERS.map((layer, i) => (
        <li key={layer.name}>
          <div
            className={`flex items-center justify-between gap-4 rounded-xl border bg-graphite px-5 py-4 ${
              i === 0 ? 'border-accent-line shadow-glow-sm' : 'border-line-strong'
            }`}
          >
            <span className="font-display text-lg font-semibold">{layer.name}</span>
            <span className="font-mono text-[0.6875rem] text-ink-dim">{layer.tech}</span>
          </div>
          {i < LAYERS.length - 1 ? (
            <div aria-hidden="true" className="relative mx-auto h-8 w-px bg-linear-to-b from-accent to-accent/10">
              <span className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-glow-sm" />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
