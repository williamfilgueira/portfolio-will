import { cn } from '@/lib/cn';

/* Ruído gerado em SVG (sem arquivo, sem requisição). */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")";

type HudOverlayProps = {
  className?: string;
  /** Escurece as bordas. Desligue em blocos pequenos. */
  vignette?: boolean;
};

/**
 * Camada de "tela antiga" das seções escuras: scanlines + granulado + vinheta.
 * Só enfeite: fica atrás do conteúdo e não recebe clique.
 */
export function HudOverlay({ className, vignette = true }: HudOverlayProps) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="absolute inset-0 hud-scanlines" />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: NOISE, backgroundSize: '140px 140px' }}
      />
      {vignette ? (
        <div className="absolute inset-0 bg-[radial-gradient(125%_100%_at_50%_45%,transparent_55%,rgb(0_0_0/0.45))]" />
      ) : null}
    </div>
  );
}
