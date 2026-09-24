export type Project = {
  /** Também é o nome do arquivo do logo: src/assets/logos/<id>.svg|png|webp */
  id: string;
  title: string;
  /** Área do cliente + tipo de entrega. */
  category: string;
  /** Uma frase sobre o projeto (aparece como dica ao passar o mouse). */
  description: string;
  /** Site no ar (abre em nova aba). */
  url: string;
};

export const projects: Project[] = [
  {
    id: 'tapa-na-pantera',
    title: 'Tapa na Pantera',
    category: 'E-commerce · Tabacaria',
    description:
      'Tabacaria e headshop online: catálogo por categorias, carrinho, verificação de idade e pedido pelo WhatsApp.',
    url: 'https://www.tapanapantera.store/',
  },
  {
    id: 'vitor-hugo-gomes',
    title: 'Vitor Hugo Gomes',
    category: 'Site · Advocacia criminal',
    description:
      'Site do advogado criminalista em Teresópolis (RJ): áreas de atuação, trajetória, depoimentos e plantão 24h.',
    url: 'https://advogadovitorhugomes.com.br/',
  },
  {
    id: 'leticia-coutinho',
    title: 'Letícia Coutinho',
    category: 'Site · Psicologia',
    description: 'Site profissional da psicóloga Letícia Coutinho.',
    url: 'https://www.psileticiacoutinho.com/',
  },
  {
    id: 'diagnosis-vet',
    title: 'Diagnosis Vet',
    category: 'Site · Diagnóstico veterinário',
    description:
      'Centro de diagnóstico veterinário por imagem em Teresópolis (RJ): serviços, equipe, agendamento e portal de laudos.',
    url: 'https://www.diagnosisvet.com.br/',
  },
  {
    id: 'ana-carms',
    title: 'Ana Carms Expedições',
    category: 'Site · Turismo de aventura',
    description:
      'Expedições em pequenos grupos pelo Brasil e Peru: roteiros com datas de saída, site bilíngue e reserva pelo WhatsApp.',
    url: 'https://www.anacarms.com.br/',
  },
];
