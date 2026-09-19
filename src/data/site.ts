export type SiteConfig = {
  name: string;
  brand: string;
  role: string;
  tagline: string;
  email: string;
  /** Só números, com DDI e DDD. */
  whatsapp: string;
  /** Como o telefone aparece escrito no site. */
  phoneDisplay: string;
  whatsappMessage: string;
  linkedin: string;
  github: string;
  /** Caminho de uma foto em /public (ex.: '/william.jpg'). Vazio = placeholder. */
  photo: string;
};

export const site: SiteConfig = {
  name: 'William Filgueira',
  brand: 'WILLIAM',
  role: 'Digital Solutions',
  tagline: 'Web • SaaS • Systems',
  email: 'williamfilgueira@gmail.com',
  whatsapp: '5521983504764',
  phoneDisplay: '(21) 98350-4764',
  whatsappMessage: 'Olá, William! Vim pelo seu portfólio e quero conversar sobre um projeto.',
  linkedin: 'https://www.linkedin.com/in/william-filgueira/',
  // Preencha para o GitHub aparecer no rodapé.
  github: '',
  photo: '',
};

export const navLinks = [
  { label: 'Work', href: '#cases' },
  { label: 'Services', href: '#solucoes' },
  { label: 'About', href: '#sobre' },
] as const;
