export type TechGroup = {
  name: string;
  items: string[];
};

export const techGroups: TechGroup[] = [
  { name: 'Backend', items: ['Java', 'Spring Boot', 'APIs REST', 'Arquitetura'] },
  { name: 'Frontend', items: ['React', 'TypeScript', 'Angular'] },
  { name: 'Data', items: ['MySQL', 'PostgreSQL'] },
  { name: 'Infra', items: ['Docker', 'Git', 'CI/CD'] },
];

/** Nós do diagrama de arquitetura (coordenadas no viewBox 400×410 do SVG). */
export type TechNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  labelAt: 'top' | 'right' | 'left';
  hub?: boolean;
};

export const techNodes: TechNode[] = [
  { id: 'java', label: 'Java', x: 200, y: 48, labelAt: 'right' },
  { id: 'react', label: 'React', x: 56, y: 172, labelAt: 'top' },
  { id: 'core', label: '', x: 200, y: 172, labelAt: 'right', hub: true },
  { id: 'spring', label: 'Spring', x: 344, y: 172, labelAt: 'top' },
  { id: 'mysql', label: 'MySQL', x: 200, y: 280, labelAt: 'right' },
  { id: 'api', label: 'API', x: 200, y: 370, labelAt: 'right' },
];

export const techEdges: Array<[string, string]> = [
  ['java', 'core'],
  ['react', 'core'],
  ['core', 'spring'],
  ['core', 'mysql'],
  ['mysql', 'api'],
];
