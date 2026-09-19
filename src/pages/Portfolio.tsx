import { About } from '@/components/About/About';
import { Bridge } from '@/components/Bridge/Bridge';
import { Cases } from '@/components/Cases/Cases';
import { Contact } from '@/components/Contact/Contact';
import { Footer } from '@/components/Footer/Footer';
import { Hero } from '@/components/Hero/Hero';
import { Navbar } from '@/components/Navbar/Navbar';
import { Problem } from '@/components/Problem/Problem';
import { Process } from '@/components/Process/Process';
import { ScrollProgress } from '@/components/ScrollProgress/ScrollProgress';
import { Solutions } from '@/components/Solutions/Solutions';
import { TechStack } from '@/components/TechStack/TechStack';

/*
 * Roteiro do scroll:
 * CLARO (ideia) → ponte → DARK (problema) → ÂMBAR/DARK (solução) → CLARO (processo)
 * → DARK (tecnologia) → CLARO (prova) → DARK (quem sou) → ÂMBAR (vamos construir)
 */
export function Portfolio() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-mono focus:text-sm focus:text-on-accent"
      >
        Pular para o conteúdo
      </a>
      <ScrollProgress />
      <Navbar />
      <main id="conteudo" className="overflow-x-clip">
        <Hero />
        <Bridge />
        <Problem />
        <Solutions />
        <Process />
        <TechStack />
        <Cases />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
