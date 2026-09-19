/**
 * Gera um "busto" em nuvem de pontos (cabeça + nariz + pescoço + ombros).
 * Coordenadas normalizadas, com y para baixo (como na tela) e z negativo = mais perto da câmera.
 * É o placeholder da Fase 3: depois dá para trocar por um GLB (Spline / React Three Fiber)
 * mantendo o mesmo comportamento de scroll.
 */

export type CloudPoint = {
  /** Posição base. */
  x: number;
  y: number;
  z: number;
  /** Normal aproximada (para a luz). */
  nx: number;
  ny: number;
  nz: number;
  /** Direção em que o ponto se espalha quando o avatar "dissolve". */
  dx: number;
  dy: number;
  dz: number;
  /** Número estável 0..1 por ponto (variação de dispersão e brilho). */
  seed: number;
};

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** PRNG determinístico (mulberry32): o busto sai sempre igual. */
export function createRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fibonacciSphere(i: number, n: number) {
  const y = 1 - (i / (n - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const theta = GOLDEN_ANGLE * i;
  return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
}

export function createBust(total = 1500): CloudPoint[] {
  const random = createRandom(7);
  const points: CloudPoint[] = [];

  const push = (x: number, y: number, z: number, nx: number, ny: number, nz: number) => {
    const u = random() * 2 - 1;
    const a = random() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    const len = Math.hypot(nx, ny, nz) || 1;
    points.push({
      x,
      y,
      z,
      nx: nx / len,
      ny: ny / len,
      nz: nz / len,
      dx: r * Math.cos(a),
      dy: u,
      dz: r * Math.sin(a),
      seed: random(),
    });
  };

  // Cabeça — elipsoide, sem a calota de baixo (onde entra o pescoço).
  const head = { cy: -0.38, rx: 0.6, ry: 0.78, rz: 0.66, count: Math.round(total * 0.56) };
  for (let i = 0; i < head.count; i++) {
    const p = fibonacciSphere(i, head.count);
    if (p.y > 0.86) continue;
    push(p.x * head.rx, head.cy + p.y * head.ry, p.z * head.rz, p.x / head.rx, p.y / head.ry, p.z / head.rz);
  }

  // Nariz — pequeno elipsoide na frente do rosto (dá orientação à cabeça).
  const nose = { cy: -0.3, cz: -0.64, rx: 0.07, ry: 0.15, rz: 0.09, count: 48 };
  for (let i = 0; i < nose.count; i++) {
    const p = fibonacciSphere(i, nose.count);
    if (p.z > 0.2) continue;
    push(p.x * nose.rx, nose.cy + p.y * nose.ry, nose.cz + p.z * nose.rz, p.x, p.y, p.z);
  }

  // Pescoço — cilindro.
  const neckCount = Math.round(total * 0.08);
  for (let i = 0; i < neckCount; i++) {
    const a = random() * Math.PI * 2;
    const y = 0.26 + random() * 0.42;
    push(Math.cos(a) * 0.25, y, Math.sin(a) * 0.23, Math.cos(a), 0, Math.sin(a));
  }

  // Ombros — metade de cima de um elipsoide largo.
  const shoulders = { cy: 1.08, rx: 1.3, ry: 0.55, rz: 0.62 };
  const remaining = Math.max(0, total - points.length);
  const pool = remaining * 2;
  let made = 0;
  for (let i = 0; i < pool && made < remaining; i++) {
    const p = fibonacciSphere(i, pool);
    if (p.y > -0.05) continue;
    push(
      p.x * shoulders.rx,
      shoulders.cy + p.y * shoulders.ry,
      p.z * shoulders.rz,
      p.x / shoulders.rx,
      p.y / shoulders.ry,
      p.z / shoulders.rz,
    );
    made++;
  }

  return points;
}
