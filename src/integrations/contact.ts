import { site } from '@/data/site';

/** Link do WhatsApp com mensagem pré-preenchida. */
export function whatsappHref(message: string = site.whatsappMessage): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Link mailto com assunto pré-preenchido. */
export function mailtoHref(subject = 'Projeto via portfólio'): string {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
}

/** Link para ligar direto do celular. */
export function telHref(): string {
  return `tel:+${site.whatsapp}`;
}
