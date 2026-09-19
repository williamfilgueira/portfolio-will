export type ProcessStep = {
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  { title: 'Ideia', description: 'Entender o que você quer construir e por quê.' },
  { title: 'Descoberta', description: 'Mapear usuários, processos e o problema real.' },
  { title: 'Arquitetura', description: 'Desenhar a solução certa antes da primeira linha.' },
  { title: 'Desenvolvimento', description: 'Construir em ciclos curtos, com entregas visíveis.' },
  { title: 'Validação', description: 'Testar com gente real e ajustar o que importa.' },
  { title: 'Produto', description: 'No ar, medido e pronto para evoluir.' },
];
