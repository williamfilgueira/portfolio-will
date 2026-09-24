import type { Renderer } from './renderers';

/*
 * Retrato "3D scan" animado (src/assets/avatar-scan.webp).
 *
 * O arquivo é só um MAPA DE BRILHO em tons de cinza (branco = ponto aceso, preto = vazio):
 * a cor é aplicada aqui, em runtime, com o gradiente ciano → âmbar do design system.
 * Sai 3× mais leve que a arte colorida e deixa a cor animável.
 *
 * O que se move:
 *   entrada   linha de varredura desce revelando o retrato (uma vez, ao aparecer)
 *   repouso   paralaxe 3D com o cursor, flutuação, faísca nos pontos e varredura a cada ~7s
 *   scroll    o retrato vira partículas que sobem e esquentam para âmbar (dissolve)
 */

const CYAN = [80, 224, 196] as const;
const AMBER = [255, 176, 32] as const;

/** Onde a cor vira âmbar (fração da largura) — acompanha a luz de borda da arte. */
const RAMP_START = 0.52;
const SHADES = 12;

type Particle = { u: number; v: number; level: number; warm: number; dx: number; dy: number; seed: number };

/** Amostragem do mapa: ~170 colunas → ~8 mil partículas no dissolve. */
const SAMPLE = 190;
const ENTRY_MS = 1300;
const SWEEP_MS = 7000;

function mixColor(warm: number, level: number) {
  const k = (level + 1) / SHADES;
  const c = [0, 1, 2].map((i) => Math.round((CYAN[i] * (1 - warm) + AMBER[i] * warm) * (0.35 + k * 0.65)));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

function createRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createScanRenderer(mask: HTMLImageElement): Renderer {
  const start = performance.now();

  // Partículas + faíscas, lidas uma única vez do mapa de brilho.
  const buckets: Particle[][] = Array.from({ length: SHADES * 2 }, () => []);
  const sparks: { u: number; v: number; seed: number; warm: number }[] = [];

  const sampler = document.createElement('canvas');
  sampler.width = SAMPLE;
  sampler.height = SAMPLE;
  const sctx = sampler.getContext('2d', { willReadFrequently: true });
  if (sctx) {
    sctx.drawImage(mask, 0, 0, SAMPLE, SAMPLE);
    const data = sctx.getImageData(0, 0, SAMPLE, SAMPLE).data;
    const random = createRandom(7);
    for (let y = 0; y < SAMPLE; y++) {
      for (let x = 0; x < SAMPLE; x++) {
        const v = data[(y * SAMPLE + x) * 4] / 255;
        if (v < 0.12) continue;
        const u = x / SAMPLE;
        const warm = Math.min(1, Math.max(0, (u - RAMP_START) / (1 - RAMP_START)));
        const level = Math.min(SHADES - 1, Math.floor(v * SHADES));
        const a = random() * Math.PI * 2;
        buckets[(warm > 0.5 ? SHADES : 0) + level].push({
          u,
          v: y / SAMPLE,
          level,
          warm,
          dx: Math.cos(a),
          dy: Math.sin(a),
          seed: random(),
        });
        if (v > 0.55 && random() < 0.006) sparks.push({ u, v: y / SAMPLE, seed: random(), warm });
      }
    }
  }

  /*
   * Colorização (uma vez só, no tamanho nativo do arquivo): o brilho do mapa vira o ALFA
   * e a cor sai da rampa ciano → âmbar; os pontos mais acesos puxam para o branco.
   * Depois é só desenhar essa cópia escalada — não precisa refazer ao redimensionar.
   */
  const tint = document.createElement('canvas');
  const tctx = tint.getContext('2d');
  let ready = false;

  const buildTint = () => {
    if (!tctx || ready) return;
    const w = mask.naturalWidth || 860;
    const h = mask.naturalHeight || 860;
    tint.width = w;
    tint.height = h;
    tctx.drawImage(mask, 0, 0, w, h);
    const image = tctx.getImageData(0, 0, w, h);
    const px = image.data;
    for (let i = 0, p = 0; i < px.length; i += 4, p++) {
      const v = px[i] / 255;
      if (v < 0.045) {
        px[i + 3] = 0;
        continue;
      }
      const u = (p % w) / w;
      const warm = Math.min(1, Math.max(0, (u - RAMP_START) / (1 - RAMP_START)));
      const hot = Math.min(1, Math.max(0, (v - 0.72) / 0.28)) ** 1.5;
      for (let c = 0; c < 3; c++) {
        const base = CYAN[c] * (1 - warm) + AMBER[c] * warm;
        px[i + c] = Math.round(base + (255 - base) * hot * 0.85);
      }
      px[i + 3] = Math.round(Math.min(1, v * 1.12) * 255);
    }
    tctx.putImageData(image, 0, 0);
    ready = true;
  };

  return (ctx, f) => {
    const t = f.now - start;
    const s = f.reduced ? 0 : f.dissolve;
    const { width: W, height: H } = f;

    ctx.clearRect(0, 0, W, H);
    buildTint();
    if (!ready) return;

    const entry = f.reduced ? 1 : Math.min(1, t / ENTRY_MS);
    const ease = 1 - (1 - entry) ** 3;
    const float = f.reduced ? 0 : Math.sin(t * 0.0011) * H * 0.008;
    const portrait = f.reduced ? 1 : Math.max(0, 1 - s * 3.2);

    if (portrait > 0.01) {
      ctx.save();
      ctx.translate(0, float);

      // Entrada: só o que a linha de varredura já passou aparece.
      if (ease < 1) {
        ctx.beginPath();
        ctx.rect(0, 0, W, H * ease);
        ctx.clip();
      }

      ctx.globalAlpha = portrait;
      ctx.drawImage(tint, 0, 0, W, H);

      // Varredura periódica: a faixa reacende os pontos por onde passa.
      if (!f.reduced) {
        const cycle = ((t % SWEEP_MS) / SWEEP_MS) * 1.35 - 0.2;
        if (cycle > -0.15 && cycle < 1.15) {
          const band = H * 0.16;
          const y = cycle * H;
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, y - band / 2, W, band);
          ctx.clip();
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 0.5 * portrait;
          ctx.drawImage(tint, 0, 0, W, H);
          ctx.restore();

          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 0.16 * portrait;
          ctx.fillStyle = `rgb(${CYAN[0]} ${CYAN[1]} ${CYAN[2]})`;
          ctx.fillRect(0, y - f.dpr, W, f.dpr * 2);
          ctx.globalCompositeOperation = 'source-over';
        }
      }

      // Faíscas: alguns pontos do scan piscando, como leitura em andamento.
      if (!f.reduced && ease > 0.6) {
        ctx.globalCompositeOperation = 'lighter';
        const dot = Math.max(1.5, f.dpr * 1.4);
        for (let i = 0; i < sparks.length; i++) {
          const p = sparks[i];
          const pulse = Math.sin(t * 0.0016 + p.seed * 42);
          if (pulse < 0.86) continue;
          ctx.globalAlpha = (pulse - 0.86) * 6 * portrait;
          ctx.fillStyle = p.warm > 0.5 ? `rgb(${AMBER[0]} ${AMBER[1]} ${AMBER[2]})` : '#d8fff5';
          ctx.fillRect(p.u * W - dot / 2, p.v * H - dot / 2, dot, dot);
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      // Linha da varredura de entrada.
      if (ease < 1) {
        const y = H * ease;
        const glow = ctx.createLinearGradient(0, y - H * 0.07, 0, y);
        glow.addColorStop(0, 'rgb(80 224 196 / 0)');
        glow.addColorStop(1, 'rgb(80 224 196 / 0.22)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = glow;
        ctx.fillRect(0, y - H * 0.07, W, H * 0.07);
        ctx.fillStyle = '#9dfbe6';
        ctx.fillRect(0, y - f.dpr, W, f.dpr * 2);
      }

      ctx.restore();
    }

    // Dissolve: o retrato vira partículas que sobem e esquentam.
    if (s > 0.01) {
      const alpha = Math.min(1, s * 6) * (1 - Math.min(1, Math.max(0, (s - 0.55) / 0.45)));
      const size = Math.max(1, (W / SAMPLE) * 0.92);
      const spread = s * s;

      for (let b = 0; b < buckets.length; b++) {
        const bucket = buckets[b];
        if (!bucket.length) continue;
        const level = b % SHADES;
        const warmSide = b >= SHADES ? 1 : 0;
        // conforme sobem, todas caminham para o âmbar
        ctx.fillStyle = mixColor(Math.min(1, warmSide * 0.8 + s * 0.9), level);
        ctx.globalAlpha = alpha * (0.4 + 0.6 * ((level + 1) / SHADES));
        for (let i = 0; i < bucket.length; i++) {
          const p = bucket[i];
          const k = spread * (0.2 + p.seed * 1.4) * W * 0.85;
          const x = p.u * W + p.dx * k;
          const y = p.v * H + float + p.dy * k - s * p.seed * H * 0.55;
          ctx.fillRect(x, y, size, size);
        }
      }
    }

    ctx.globalAlpha = 1;
  };
}
