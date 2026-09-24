/*
 * Contrato compartilhado pelos desenhos do avatar no mesmo <canvas> 2D:
 *  - scanPortrait.ts  retrato "3D scan" (quando existe src/assets/avatar-scan.*)
 *  - lowPolyBust.ts   busto low-poly gerado por código (padrão, sem arquivo)
 * Os dois recebem o mesmo "frame" e reagem igual ao scroll (dissolve 0 → 1).
 */

export type Frame = {
  now: number;
  /** Progresso do dissolve (0 = inteiro, 1 = desfeito). */
  dissolve: number;
  /** Cursor suavizado, -1..1. */
  px: number;
  py: number;
  reduced: boolean;
  width: number;
  height: number;
  dpr: number;
};

export type Renderer = (ctx: CanvasRenderingContext2D, frame: Frame) => void;
