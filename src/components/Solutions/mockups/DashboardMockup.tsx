const BARS = [34, 48, 42, 60, 54, 70, 58, 82, 66, 92];

const KPIS = [
  { label: 'Usuários', value: '12,4k' },
  { label: 'Receita', value: '+18%' },
  { label: 'Churn', value: '1,9%' },
];

/** Interface de dashboard ilustrativa (Solução 02 — SaaS). Números decorativos. */
export function DashboardMockup() {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-[540px] rounded-2xl border border-line-strong bg-graphite p-3 shadow-lift sm:p-4"
    >
      <div className="grid grid-cols-[72px_1fr] gap-3 sm:grid-cols-[92px_1fr] sm:gap-4">
        <div className="space-y-2.5 rounded-xl bg-surface p-3">
          <span className="mb-4 block size-5 rounded-md bg-accent" />
          <span className="block h-2 w-full rounded-full bg-accent/70" />
          <span className="block h-2 w-4/5 rounded-full bg-ink-dim/25" />
          <span className="block h-2 w-full rounded-full bg-ink-dim/25" />
          <span className="block h-2 w-3/5 rounded-full bg-ink-dim/25" />
          <span className="block h-2 w-4/5 rounded-full bg-ink-dim/25" />
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {KPIS.map((kpi, i) => (
              <div key={kpi.label} className="rounded-xl bg-surface p-2.5 sm:p-3">
                <p className="font-mono text-[0.5625rem] uppercase tracking-[0.08em] text-ink-dim">
                  {kpi.label}
                </p>
                <p
                  className={`mt-1.5 font-display text-base font-semibold sm:text-xl ${i === 1 ? 'text-accent' : 'text-ink'}`}
                >
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-surface p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="h-2 w-16 rounded-full bg-ink/70" />
              <span className="h-2 w-10 rounded-full bg-ink-dim/25" />
            </div>
            <div className="flex h-28 items-end gap-1.5 sm:h-32 sm:gap-2">
              {BARS.map((height, i) => (
                <span
                  key={i}
                  className={`flex-1 rounded-t-sm ${i === BARS.length - 1 ? 'bg-accent shadow-glow-sm' : 'bg-accent/30'}`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
