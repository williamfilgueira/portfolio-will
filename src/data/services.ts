export type ServiceVisual = 'browser' | 'dashboard' | 'architecture';

export type Service = {
  id: string;
  number: string;
  label: string;
  title: [string, string];
  description: string;
  points: string[];
  visual: ServiceVisual;
};

export const services: Service[] = [
  {
    id: 'websites',
    number: '01',
    label: 'Websites',
    title: ['Websites', 'that convert.'],
    description:
      'Sites institucionais e landing pages rápidos, bonitos e pensados para transformar visita em contato.',
    points: ['Performance', 'SEO', 'Conversão'],
    visual: 'browser',
  },
  {
    id: 'saas',
    number: '02',
    label: 'SaaS',
    title: ['Digital', 'products.'],
    description:
      'Aplicações SaaS do MVP ao produto em escala — painel, usuários, permissões e dados no lugar certo.',
    points: ['MVP', 'Multi-tenant', 'Dashboards'],
    visual: 'dashboard',
  },
  {
    id: 'sistemas',
    number: '03',
    label: 'Sistemas',
    title: ['Systems built', 'around your business.'],
    description:
      'Sistemas sob medida que automatizam processos e conectam os dados da operação de ponta a ponta.',
    points: ['APIs', 'Integrações', 'Automação'],
    visual: 'architecture',
  },
];
