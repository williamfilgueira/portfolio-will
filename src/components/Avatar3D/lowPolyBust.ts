import type { Frame, Renderer } from './renderers';

/*
 * Busto low-poly facetado, gerado por código (sem modelo 3D, sem imagem).
 *
 * Malha: icosfera subdividida deformada em cabeça + "lathe" de anéis para pescoço e ombros.
 * Luz: uma key neutra (dá o volume de pedra) + borda ciano à esquerda e âmbar à direita.
 * Dissolve: cada face vira um caco que encolhe, esquenta e sobe — o topo se desfaz primeiro.
 *
 * Tudo em canvas 2D com pintura por profundidade (painter's algorithm): ~160 triângulos
 * por quadro, mais barato que WebGL e sem dependência nova.
 */

type Vec3 = { x: number; y: number; z: number };
type Mesh = { verts: Vec3[]; faces: [number, number, number][] };

const V = (x: number, y: number, z: number): Vec3 => ({ x, y, z });
const sub = (a: Vec3, b: Vec3): Vec3 => V(a.x - b.x, a.y - b.y, a.z - b.z);
const cross = (a: Vec3, b: Vec3): Vec3 =>
  V(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
const dot = (a: Vec3, b: Vec3) => a.x * b.x + a.y * b.y + a.z * b.z;
const norm = (a: Vec3): Vec3 => {
  const l = Math.hypot(a.x, a.y, a.z) || 1;
  return V(a.x / l, a.y / l, a.z / l);
};
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

/* ───────────────────────────────── malha ───────────────────────────────── */

function icosphere(subdiv: number): Mesh {
  const t = (1 + Math.sqrt(5)) / 2;
  const verts: Vec3[] = (
    [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
    ] as const
  ).map(([x, y, z]) => norm(V(x, y, z)));

  let faces: [number, number, number][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  for (let s = 0; s < subdiv; s++) {
    const cache = new Map<string, number>();
    const midpoint = (i: number, j: number) => {
      const key = i < j ? `${i}_${j}` : `${j}_${i}`;
      const hit = cache.get(key);
      if (hit !== undefined) return hit;
      const a = verts[i];
      const b = verts[j];
      verts.push(norm(V((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2)));
      cache.set(key, verts.length - 1);
      return verts.length - 1;
    };
    const next: [number, number, number][] = [];
    for (const [a, b, c] of faces) {
      const ab = midpoint(a, b);
      const bc = midpoint(b, c);
      const ca = midpoint(c, a);
      next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = next;
  }
  return { verts, faces };
}

/** Deforma a esfera em cabeça: crânio, mandíbula, plano do rosto, órbitas, nariz e queixo. */
function headShape(p: Vec3): Vec3 {
  let x = p.x * 0.78;
  let y = p.y * 0.92;
  let z = p.z * 0.76;

  const up = smooth(0.3, 1, y);
  x *= 1 - 0.17 * up;
  z *= 1 - 0.1 * up;

  const jaw = smooth(-0.2, -0.95, y);
  x *= 1 - 0.26 * jaw;
  z *= 1 - 0.18 * jaw;

  if (z < 0) z *= 1.18; // nuca mais cheia
  x *= 1 - 0.1 * clamp(Math.abs(x) / 0.6, 0, 1); // laterais achatadas

  // achata a frente num plano — é o que faz ler como rosto, e não como ovo
  const faceMask =
    clamp(z / 0.42, 0, 1) * clamp(1 - Math.abs(x) / 0.62, 0, 1) * smooth(-0.95, -0.45, y);
  z += (0.47 - 0.05 * y - z) * 0.38 * faceMask;

  const front = clamp(z / 0.42, 0, 1);
  const eye = Math.exp(-(((y - 0.16) ** 2) / 0.012 + ((Math.abs(x) - 0.26) ** 2) / 0.016)) * front;
  z -= eye * 0.06;

  const brow =
    Math.exp(-((y - 0.31) ** 2) / 0.007) * front * clamp(1 - Math.abs(x) / 0.5, 0, 1);
  z += brow * 0.07;

  const bridge = Math.exp(-(((y - 0.12) ** 2) / 0.05 + (x * x) / 0.006)) * front;
  const tip = Math.exp(-(((y + 0.1) ** 2) / 0.008 + (x * x) / 0.01)) * front;
  z += bridge * 0.1 + tip * 0.22;

  const chin = Math.exp(-(((y + 0.66) ** 2) / 0.024 + (x * x) / 0.05));
  z += chin * 0.1;

  return V(x, y, z);
}

type Ring = { y: number; rx: number; rz: number; dz: number };

/** Sólido de revolução por anéis (pescoço + ombros). */
function lathe(rings: Ring[], segments: number): Mesh {
  const verts: Vec3[] = [];
  const faces: [number, number, number][] = [];
  for (const r of rings) {
    for (let s = 0; s < segments; s++) {
      const a = (s / segments) * Math.PI * 2;
      verts.push(V(Math.cos(a) * r.rx, r.y, Math.sin(a) * r.rz + r.dz));
    }
  }
  for (let i = 0; i < rings.length - 1; i++) {
    for (let s = 0; s < segments; s++) {
      const s2 = (s + 1) % segments;
      const a = i * segments + s;
      const b = i * segments + s2;
      const c = (i + 1) * segments + s;
      const d = (i + 1) * segments + s2;
      faces.push([a, c, d], [a, d, b]);
    }
  }
  return { verts, faces };
}

function buildBust(): Mesh {
  const sphere = icosphere(1);
  const head: Mesh = { verts: sphere.verts.map(headShape), faces: sphere.faces };
  const body = lathe(
    [
      { y: -0.72, rx: 0.3, rz: 0.27, dz: -0.04 },
      { y: -1.0, rx: 0.33, rz: 0.29, dz: -0.06 },
      { y: -1.14, rx: 0.62, rz: 0.4, dz: -0.06 },
      { y: -1.3, rx: 1.0, rz: 0.48, dz: -0.06 },
      { y: -1.62, rx: 1.22, rz: 0.52, dz: -0.06 },
    ],
    10,
  );
  const offset = head.verts.length;
  return {
    verts: [...head.verts, ...body.verts],
    faces: [
      ...head.faces,
      ...body.faces.map((f) => f.map((i) => i + offset) as [number, number, number]),
    ],
  };
}

/* ─────────────────────────────── renderer ─────────────────────────────── */

// Espelho do @theme (src/styles/index.css).
const BASE = [24, 22, 19];
const FILL = [214, 209, 200];
const CYAN = [80, 224, 196];
const AMBER = [255, 176, 32];

const KEY = norm(V(-0.42, 0.55, 0.72)); // luz principal, neutra
const RIM_C = norm(V(-0.9, 0.1, 0.3)); // borda ciano (esquerda)
const RIM_A = norm(V(0.9, 0.05, 0.25)); // borda âmbar (direita)

/** Ruído determinístico por face (mesmo caco, mesmo caminho, a cada quadro). */
function hash(i: number) {
  const x = Math.sin(i * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

type Shard = {
  pa: { x: number; y: number };
  pb: { x: number; y: number };
  pc: { x: number; y: number };
  z: number;
  fill: string;
  stroke: string;
  alpha: number;
};

export function createLowPolyRenderer(): Renderer {
  const mesh = buildBust();
  const rotated: Vec3[] = mesh.verts.map(() => V(0, 0, 0));
  const shards: Shard[] = [];
  const start = performance.now();

  return (ctx: CanvasRenderingContext2D, f: Frame) => {
    const t = f.now - start;
    // segura o busto inteiro no começo do scroll e desfaz no resto
    const s = f.reduced ? 0 : clamp((f.dissolve - 0.1) / 0.9, 0, 1);

    // repouso em 3/4: de frente o busto vira máscara, de lado lê como escultura
    const yaw = f.reduced
      ? -0.3
      : -0.26 + Math.sin(t * 0.00028) * 0.1 + f.px * 0.4 + s * 0.5;
    const pitch = f.reduced ? -0.06 : -0.06 + f.py * 0.18 + Math.sin(t * 0.0009) * 0.015;

    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);

    for (let i = 0; i < mesh.verts.length; i++) {
      const p = mesh.verts[i];
      const x = p.x * cy + p.z * sy;
      const z = -p.x * sy + p.z * cy;
      const out = rotated[i];
      out.x = x;
      out.y = p.y * cp - z * sp;
      out.z = p.y * sp + z * cp;
    }

    const size = Math.min(f.width, f.height);
    const scale = size * 0.285;
    const ox = f.width / 2;
    const oy = f.height * 0.45 + (f.reduced ? 0 : Math.sin(t * 0.0012) * size * 0.008);
    const focal = 3.6;

    ctx.clearRect(0, 0, f.width, f.height);
    shards.length = 0;

    for (let i = 0; i < mesh.faces.length; i++) {
      const face = mesh.faces[i];
      let a = rotated[face[0]];
      let b = rotated[face[1]];
      let c = rotated[face[2]];
      const n = norm(cross(sub(b, a), sub(c, a)));
      if (n.z <= 0.02) continue; // costas do busto

      let alpha = 1;
      let d = 0;

      if (s > 0) {
        const r = hash(i);
        const r2 = hash(i + 977);
        const hy = clamp(((a.y + b.y + c.y) / 3 + 1.7) / 2.9, 0, 1);
        d = clamp((s - ((1 - hy) * 0.42 + r * 0.16)) / 0.46, 0, 1);
        if (d > 0) {
          const e = d * d;
          const lift = e * (1 + r2 * 1.5);
          const drift = (r2 - 0.5) * 1.1 * d;
          const push = 0.22 * d;
          const k = 1 - 0.6 * d; // encolhe até virar caco
          const mx = (a.x + b.x + c.x) / 3;
          const my = (a.y + b.y + c.y) / 3;
          const mz = (a.z + b.z + c.z) / 3;
          const move = (p: Vec3) =>
            V(
              mx + (p.x - mx) * k + n.x * push + drift,
              my + (p.y - my) * k + lift,
              mz + (p.z - mz) * k + n.z * push,
            );
          a = move(a);
          b = move(b);
          c = move(c);
          alpha = 1 - d * d;
        }
      }
      if (alpha <= 0.02) continue;

      const project = (p: Vec3) => {
        const k = focal / (focal + p.z);
        return { x: ox + p.x * k * scale, y: oy - p.y * k * scale };
      };

      const key = Math.max(0, dot(n, KEY)) ** 1.5;
      const rim = (1 - Math.min(1, Math.abs(n.z))) ** 3.1;
      const rimC = rim * Math.max(0, dot(n, RIM_C));
      const rimA = rim * Math.max(0, dot(n, RIM_A));

      const col = [0, 1, 2].map((ch) => {
        const v =
          BASE[ch] + FILL[ch] * key * 0.42 + CYAN[ch] * rimC * 0.62 + AMBER[ch] * rimA * 0.62;
        return Math.round(clamp(v + (AMBER[ch] - v) * d * 0.85, 0, 255));
      });

      shards.push({
        pa: project(a),
        pb: project(b),
        pc: project(c),
        z: (a.z + b.z + c.z) / 3,
        fill: `rgb(${col[0]} ${col[1]} ${col[2]})`,
        stroke: `rgb(80 224 196 / ${(0.08 + rim * 0.5).toFixed(3)})`,
        alpha,
      });
    }

    shards.sort((p, q) => p.z - q.z); // do fundo para a frente

    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(1, f.dpr * 0.75);
    for (let i = 0; i < shards.length; i++) {
      const sh = shards[i];
      ctx.globalAlpha = sh.alpha;
      ctx.beginPath();
      ctx.moveTo(sh.pa.x, sh.pa.y);
      ctx.lineTo(sh.pb.x, sh.pb.y);
      ctx.lineTo(sh.pc.x, sh.pc.y);
      ctx.closePath();
      ctx.fillStyle = sh.fill;
      ctx.fill();
      ctx.strokeStyle = sh.stroke;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };
}
