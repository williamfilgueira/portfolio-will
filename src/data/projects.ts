export type Project = {
  id: string;
  title: string;
  /** Área do cliente + tipo de entrega. */
  category: string;
  description: string;
  tags: string[];
  /** Site no ar (abre em nova aba). */
  url: string;
  /**
   * Captura da página inicial em /public/cases, 1440×900 de preferência
   * (ex.: '/cases/tapa-na-pantera.webp'). Vazio = capa gerada.
   */
  image?: string;
};

export const projects: Project[] = [
  {
    id: 'tapa-na-pantera',
    title: 'Tapa na Pantera',
    category: 'E-commerce · Tabacaria',
    description:
      'Tabacaria e headshop online: catálogo por categorias, carrinho, verificação de idade e pedido pelo WhatsApp, com entrega para todo o Brasil.',
    tags: ['Loja Integrada', 'E-commerce', 'WhatsApp'],
    url: 'https://www.tapanapantera.store/',
  },
  {
    id: 'vitor-hugo-gomes',
    title: 'Vitor Hugo Gomes',
    category: 'Site · Advocacia criminal',
    description:
      'Site do advogado criminalista em Teresópolis (RJ): áreas de atuação, trajetória, depoimentos e plantão 24h pelo WhatsApp.',
    tags: ['WordPress', 'SEO', 'WhatsApp'],
    url: 'https://advogadovitorhugomes.com.br/',
  },
  {
    id: 'leticia-coutinho',
    title: 'Letícia Coutinho',
    category: 'Site · Psicologia',
    // TODO(Will): descrever o site em uma frase (serviços, público, agendamento).
    description: 'Site profissional da psicóloga Letícia Coutinho.',
    tags: ['Site institucional'],
    url: 'https://www.psileticiacoutinho.com/',
  },
  {
    id: 'diagnosis-vet',
    title: 'Diagnosis Vet',
    category: 'Site · Diagnóstico veterinário',
    description:
      'Centro de diagnóstico veterinário por imagem em Teresópolis (RJ): serviços, equipe, depoimentos, agendamento e acesso ao portal de laudos.',
    tags: ['Institucional', 'Agendamento', 'Portal de laudos'],
    url: 'https://www.diagnosisvet.com.br/',
  },
  {
    id: 'ana-carms',
    title: 'Ana Carms Expedições',
    category: 'Site · Turismo de aventura',
    description:
      'Expedições em pequenos grupos pelo Brasil e Peru: roteiros com datas de saída, site bilíngue (PT/EN) e reserva pelo WhatsApp.',
    tags: ['Bilíngue', 'Roteiros', 'WhatsApp'],
    url: 'https://www.anacarms.com.br/',
  },
];
