import { Container } from '@/components/ui/Container';
import { site } from '@/data/site';
import { mailtoHref, whatsappHref } from '@/integrations/contact';

type FooterLink = { label: string; href: string };

function footerLinks(): FooterLink[] {
  const links: FooterLink[] = [];
  if (site.linkedin) links.push({ label: 'LinkedIn', href: site.linkedin });
  if (site.github) links.push({ label: 'GitHub', href: site.github });
  links.push({ label: 'WhatsApp', href: whatsappHref() });
  links.push({ label: 'Email', href: mailtoHref() });
  return links;
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-graphite py-16 md:py-20">
      <Container>
        <p className="font-display text-[clamp(2.25rem,8vw,6rem)] leading-[0.9] font-bold tracking-[-0.04em]">
          {site.name.toUpperCase()}
          <span className="text-accent">.</span>
        </p>

        <div className="mt-12 flex flex-col gap-10 border-t border-line pt-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-xl font-semibold">{site.role}</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-ink-dim">{site.tagline}</p>
          </div>

          <ul className="flex flex-wrap gap-x-7 gap-y-1">
            {footerLinks().map((link) => {
              const external = link.href.startsWith('http');
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="inline-flex min-h-11 items-center gap-1.5 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-10 font-mono text-[0.6875rem] tracking-[0.08em] text-ink-dim">
          © {new Date().getFullYear()} {site.name}
        </p>
      </Container>
    </footer>
  );
}
