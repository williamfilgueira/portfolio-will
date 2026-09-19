/**
 * Espelho das cores do @theme (src/styles/index.css) para uso em JavaScript/GSAP,
 * onde as animações interpolam cores diretamente. Mantenha os dois em sincronia.
 */
export const palette = {
  accent: '#ffb020',
  accentDeep: '#3d2e12',
  graphite: '#131210',
  surface: '#1d1b17',
  light: '#eeebe6',
  lightSoft: '#f6f4f0',
  ink: '#f5f3ef',
  inkDim: '#a8a29a',
  onAccent: '#2a1c05',
  onLight: '#221e17',
  lineStrong: 'rgba(245, 243, 239, 0.16)',
} as const;
