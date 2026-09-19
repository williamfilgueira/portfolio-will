import { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionIntro } from '@/components/ui/SectionIntro';
import { techEdges, techGroups, techNodes, type TechNode } from '@/data/technologies';
import { gsap, MQ, useGSAP } from '@/animations/gsap';

const nodeById = new Map(techNodes.map((node) => [node.id, node]));

function labelPosition(node: TechNode) {
  if (node.labelAt === 'top') return { x: node.x, y: node.y - 18, anchor: 'middle' as const };
  if (node.labelAt === 'left') return { x: node.x - 16, y: node.y + 4, anchor: 'end' as const };
  return { x: node.x + 16, y: node.y + 4, anchor: 'start' as const };
}

/*
 * 05 — Tecnologia (dark).
 * O diagrama se conecta ao entrar (linhas desenhadas + nós surgindo) e cada grupo
 * de tecnologias ganha uma barra âmbar que preenche em sequência.
 */
export function TechStack() {
  const root = useRef<HTMLElement>(null);
  const hub = techNodes.find((node) => node.hub);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOK, () => {
        const q = gsap.utils.selector(root);
        const diagram = q('[data-diagram]')[0];
        const groups = q('[data-groups]')[0];

        gsap.fromTo(
          q('[data-edge]'),
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 0.9,
            ease: 'power2.inOut',
            stagger: 0.15,
            scrollTrigger: { trigger: diagram, start: 'top 75%' },
          },
        );
        gsap.fromTo(
          q('[data-node]'),
          { scale: 0, transformOrigin: '50% 50%' },
          {
            scale: 1,
            duration: 0.5,
            ease: 'back.out(2)',
            stagger: 0.1,
            delay: 0.2,
            scrollTrigger: { trigger: diagram, start: 'top 75%' },
          },
        );
        gsap.fromTo(
          q('[data-meter]'),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            ease: 'expo.out',
            stagger: 0.1,
            scrollTrigger: { trigger: groups, start: 'top 80%' },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="tecnologia" ref={root} className="relative bg-graphite py-24 md:py-36">
      <Container>
        <SectionIntro label="05 · Tecnologia" title="Por trás de cada solução existe uma arquitetura." />

        <div className="mt-16 grid items-center gap-16 md:mt-24 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex justify-center">
            <svg
              data-diagram
              viewBox="0 0 400 410"
              className="w-full max-w-[440px] overflow-visible"
              role="img"
              aria-label="Diagrama: Java, React e Spring ligados a um núcleo, que se conecta ao MySQL e à API."
            >
              {hub ? (
                <circle cx={hub.x} cy={hub.y} r="28" fill="none" className="stroke-accent/20" />
              ) : null}

              {techEdges.map(([from, to]) => {
                const a = nodeById.get(from);
                const b = nodeById.get(to);
                if (!a || !b) return null;
                return (
                  <path
                    key={`${from}-${to}`}
                    data-edge
                    d={`M${a.x} ${a.y} L${b.x} ${b.y}`}
                    pathLength={1}
                    strokeDasharray="1"
                    strokeDashoffset={0}
                    strokeWidth={1.5}
                    fill="none"
                    className="stroke-accent/50"
                  />
                );
              })}

              {techNodes.map((node) => {
                const label = labelPosition(node);
                return (
                  <g key={node.id}>
                    <circle
                      data-node
                      cx={node.x}
                      cy={node.y}
                      r={node.hub ? 10 : 6}
                      className="fill-accent"
                      style={{ filter: 'drop-shadow(0 0 6px rgb(255 176 32 / 0.7))' }}
                    />
                    {node.label ? (
                      <text
                        x={label.x}
                        y={label.y}
                        textAnchor={label.anchor}
                        className="fill-ink-dim font-mono text-[11px] uppercase tracking-[0.14em]"
                      >
                        {node.label}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </svg>
          </div>

          <div>
            <Reveal>
              <p className="font-display text-display-m font-semibold">
                Tecnologia é ferramenta.
                <br />
                <span className="text-accent">O problema vem primeiro.</span>
              </p>
            </Reveal>

            <div data-groups className="mt-10 grid gap-4 sm:grid-cols-2">
              {techGroups.map((group) => (
                <div key={group.name} className="rounded-2xl border border-line bg-surface p-6">
                  <p className="font-mono text-eyebrow font-medium uppercase text-accent">{group.name}</p>
                  <div className="mt-4 h-px w-full bg-line">
                    <div data-meter className="h-px w-full origin-left bg-accent" />
                  </div>
                  <ul className="mt-5 space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-ink">
                        <span aria-hidden="true" className="size-1 rounded-full bg-accent/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
