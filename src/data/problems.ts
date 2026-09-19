export type ProblemItem = {
  number: string;
  title: string;
  description: string;
};

export const problems: ProblemItem[] = [
  {
    number: '01',
    title: 'Processos manuais',
    description: 'Planilhas, retrabalho e tarefas repetitivas consumindo o tempo do time.',
  },
  {
    number: '02',
    title: 'Sistemas desatualizados',
    description: 'Ferramentas lentas, difíceis de manter e que travam o crescimento.',
  },
  {
    number: '03',
    title: 'Dados desconectados',
    description: 'Informação espalhada em lugares diferentes, sem uma visão do todo.',
  },
  {
    number: '04',
    title: 'Ideias que não saem do papel',
    description: 'Produtos que ficam no plano por falta de quem os transforme em software.',
  },
];
