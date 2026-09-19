/** Mockup de navegador inclinado (Solução 01 — Websites). Puramente decorativo. */
export function BrowserMockup() {
  return (
    <div aria-hidden="true" className="w-full max-w-[520px] [perspective:1400px]">
      <div className="overflow-hidden rounded-2xl border border-line-strong bg-graphite shadow-lift [transform:rotateY(-12deg)_rotateX(6deg)_rotate(-2deg)]">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="size-2.5 rounded-full bg-ink-dim/40" />
          <span className="size-2.5 rounded-full bg-ink-dim/40" />
          <span className="size-2.5 rounded-full bg-accent/80" />
          <span className="ml-3 flex-1 truncate rounded-full bg-surface px-3 py-1 font-mono text-[0.625rem] text-ink-dim">
            seunegocio.com.br
          </span>
        </div>

        <div className="space-y-5 p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <span className="h-2.5 w-14 rounded-full bg-ink/80" />
            <span className="flex gap-2">
              <span className="h-2 w-8 rounded-full bg-ink-dim/30" />
              <span className="h-2 w-8 rounded-full bg-ink-dim/30" />
              <span className="h-2 w-10 rounded-full bg-accent" />
            </span>
          </div>
          <div className="space-y-2.5 pt-2">
            <div className="h-5 w-4/5 rounded bg-ink/85" />
            <div className="h-5 w-3/5 rounded bg-ink/85" />
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded bg-ink-dim/25" />
            <div className="h-2 w-5/6 rounded bg-ink-dim/25" />
          </div>
          <div className="flex gap-2 pt-1">
            <div className="h-8 w-28 rounded-full bg-accent" />
            <div className="h-8 w-20 rounded-full border border-line-strong" />
          </div>
          <div className="grid grid-cols-3 gap-3 pt-3">
            <div className="aspect-[4/3] rounded-lg border border-line bg-surface" />
            <div className="aspect-[4/3] rounded-lg border border-line bg-surface" />
            <div className="aspect-[4/3] rounded-lg border border-accent-line bg-accent-veil" />
          </div>
        </div>
      </div>
    </div>
  );
}
