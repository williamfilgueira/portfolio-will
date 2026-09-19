import { createBust, createRandom } from './pointCloud';

/*
 * Dois jeitos de desenhar o avatar no mesmo <canvas> 2D:
 *  - bust:  busto em nuvem de pontos (placeholder, sem imagem)
 *  - image: avatar ilustrado (src/assets/avatar.png) que se desfaz em partículas âmbar
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

type RGB = readonly [number, number, number];
export const SHADES = 24;
const DIM: RGB = [70, 55, 28];
const AMBER: RGB = [255, 176, 32];
const HOT: RGB = [255, 228, 176];

/** Escala de 24 tons: âmbar escuro → âmbar → quase branco. */
export function buildShades(): string[] {
  const shades: string[] = [];
  for (let i = 0; i < SHADES; i++) {
    const t = i / (SHADES - 1);
    const low = t < 0.78;
    const from = low ? DIM : AMBER;
    const to = low ? AMBER : HOT;
    const k = low ? t / 0.78 : (t - 0.78) / 0.22;
    const c = from.map((v, j) => Math.round(v + (to[j] - v) * k));
    shades.push(`rgb(${c[0]}, ${c[1]}, ${c[2]})`);
  }
  return shades;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/* ─────────────────────────── Busto em nuvem de pontos ─────────────────────────── */

export function createBustRenderer(): Renderer {
  const points = createBust(1800);
  const shades = buildShades();
  const start = performance.now();

  return (ctx, f) => {
    const t = f.now - start;
    const s = f.reduced ? 0 : f.dissolve;

    const rotY = f.reduced ? -0.42 : Math.sin(t * 0.00032) * 0.5 + f.px * 0.35 + s * 1.4;
    const rotX = f.reduced ? 0.05 : 0.05 + f.py * 0.14;

    // Luz vindo da direita / frente / cima, varrendo devagar.
    const la = f.reduced ? 0.55 : 0.55 + Math.sin(t * 0.00022) * 0.75;
    let lx = Math.cos(la);
    let ly = -0.5;
    let lz = -Math.abs(Math.sin(la)) - 0.35;
    const ll = Math.hypot(lx, ly, lz);
    lx /= ll;
    ly /= ll;
    lz /= ll;

    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cx = f.width / 2;
    const cy = f.height * 0.53;
    const radius = Math.min(f.width, f.height) * 0.34;
    const fade = 1 - s * 0.92;

    ctx.clearRect(0, 0, f.width, f.height);
    if (fade <= 0.01) return;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      let x = p.x;
      let y = p.y;
      let z = p.z;

      if (s > 0) {
        const k = s * s * (0.5 + p.seed * 2.4);
        x += p.dx * k;
        y += p.dy * k - s * p.seed * 1.1;
        z += p.dz * k;
      }

      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const nx1 = p.nx * cosY + p.nz * sinY;
      const nz1 = -p.nx * sinY + p.nz * cosY;
      const ny1 = p.ny * cosX - nz1 * sinX;
      const nz2 = p.ny * sinX + nz1 * cosX;

      const persp = 3.4 / (3.4 + z2);
      const sx = cx + x1 * persp * radius;
      const sy = cy + y1 * persp * radius;

      const diffuse = Math.max(0, nx1 * lx + ny1 * ly + nz2 * lz);
      const edge = 1 - Math.abs(nz2);
      const rim = edge * edge * edge * (nx1 * lx > 0 ? 0.9 : 0.15);
      const light = Math.min(1, 0.05 + diffuse * 0.8 + rim);

      const depth = Math.min(1, Math.max(0, (z2 + 1.4) / 2.8));
      const twinkle = 0.88 + 0.12 * Math.sin(t * 0.002 + p.seed * 40);
      const alpha = (0.16 + 0.84 * (1 - depth)) * (0.3 + 0.7 * light) * fade * twinkle;
      if (alpha < 0.02) continue;

      const size = (0.8 + (1 - depth) * 1.6) * f.dpr;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = shades[Math.min(SHADES - 1, (light * SHADES) | 0)];
      ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
  };
}

/* ──────────────────────── Avatar ilustrado → partículas ──────────────────────── */

type Particle = { u: number; v: number; dx: number; dy: number; seed: number };

/** Amostragem horizontal da imagem (quantidade de partículas ~ SAMPLE_W² × área visível). */
const SAMPLE_W = 150;

export function createImageRenderer(img: HTMLImageElement): Renderer {
  const ratio = img.naturalHeight / img.naturalWidth;
  const sw = SAMPLE_W;
  const sh = Math.max(1, Math.round(SAMPLE_W * ratio));
  const shades = buildShades();
  const start = performance.now();

  // Lê os pixels da imagem uma vez e agrupa as partículas por tom (menos trocas de cor ao desenhar).
  const buckets: Particle[][] = Array.from({ length: SHADES }, () => []);
  const sampler = document.createElement('canvas');
  sampler.width = sw;
  sampler.height = sh;
  const sctx = sampler.getContext('2d', { willReadFrequently: true });
  if (sctx) {
    sctx.drawImage(img, 0, 0, sw, sh);
    const data = sctx.getImageData(0, 0, sw, sh).data;
    const random = createRandom(11);
    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const i = (y * sw + x) * 4;
        if (data[i + 3] < 140) continue; // só onde a imagem tem conteúdo (fundo transparente)
        const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
        const shade = Math.min(SHADES - 1, Math.floor((0.18 + lum * 0.82) * SHADES));
        const a = random() * Math.PI * 2;
        buckets[shade].push({ u: x / sw, v: y / sh, dx: Math.cos(a), dy: Math.sin(a), seed: random() });
      }
    }
  }

  return (ctx, f) => {
    const t = f.now - start;
    const s = f.reduced ? 0 : f.dissolve;
    const { width: W, height: H } = f;

    ctx.clearRect(0, 0, W, H);

    // Busto encostado na base do painel, ocupando ~90% da altura.
    let dh = H * 0.9;
    let dw = dh / ratio;
    if (dw > W * 0.96) {
      dw = W * 0.96;
      dh = dw * ratio;
    }
    const float = f.reduced ? 0 : Math.sin(t * 0.0012) * H * 0.006;
    const dx = (W - dw) / 2;
    const dy = H - dh + H * 0.02 + float;

    // 1) A imagem, que some conforme o dissolve avança.
    const imageAlpha = f.reduced ? 1 : Math.max(0, 1 - s * 2.4);
    if (imageAlpha > 0.01) {
      ctx.globalAlpha = imageAlpha;
      ctx.drawImage(img, dx, dy, dw, dh);

      // Luz âmbar varrendo a lateral ("light moves"); source-atop pinta só sobre o avatar.
      const sweep = f.reduced ? 0.7 : 0.5 + Math.sin(t * 0.00035) * 0.5;
      const gx = dx + dw * (0.55 + sweep * 0.5);
      const gy = dy + dh * 0.32;
      const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, dw * 0.75);
      glow.addColorStop(0, 'rgba(255, 176, 32, 0.30)');
      glow.addColorStop(1, 'rgba(255, 176, 32, 0)');
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = glow;
      ctx.fillRect(dx, dy, dw, dh);
      ctx.globalCompositeOperation = 'source-over';
    }

    // 2) As partículas âmbar, que surgem no lugar da imagem e se espalham subindo.
    if (s > 0.01) {
      const particlesAlpha = Math.min(1, s * 5) * (1 - smoothstep(0.55, 1, s));
      const size = Math.max(1, (dw / sw) * 0.95);
      const spread = s * s;

      for (let b = 0; b < SHADES; b++) {
        const bucket = buckets[b];
        if (!bucket.length) continue;
        ctx.fillStyle = shades[b];
        ctx.globalAlpha = particlesAlpha * (0.35 + 0.65 * (b / (SHADES - 1)));
        for (let i = 0; i < bucket.length; i++) {
          const p = bucket[i];
          const k = spread * (0.25 + p.seed * 1.5) * dw * 0.9;
          const x = dx + p.u * dw + p.dx * k;
          const y = dy + p.v * dh + p.dy * k - s * p.seed * dh * 0.5;
          ctx.fillRect(x, y, size, size);
        }
      }
    }
    ctx.globalAlpha = 1;
  };
}
