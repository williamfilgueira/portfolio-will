import { m } from 'motion/react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { navLinks, site } from '@/data/site';
import { duration, ease } from '@/animations/tokens';

/** Navbar flutuante em pílula escura: funciona sobre as seções claras e escuras. */
export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[max(env(safe-area-inset-top),0.875rem)]">
      <Container>
        <m.nav
          aria-label="Principal"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: duration.base, ease: ease.standard }}
          className="flex h-14 items-center gap-4 rounded-full border border-line bg-graphite/80 pr-1.5 pl-5 backdrop-blur-xl"
        >
          <a href="#inicio" className="font-display text-lg font-bold tracking-[-0.02em] text-ink">
            {site.brand}
            <span className="text-accent">.</span>
          </a>

          <ul className="ml-auto hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex h-11 items-center rounded-full px-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-dim transition-colors duration-200 hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <ButtonLink href="#contato" size="sm" arrow="↗" className="ml-auto md:ml-2">
            Let's talk
          </ButtonLink>
        </m.nav>
      </Container>
    </header>
  );
}
