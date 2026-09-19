# Portfólio — William Filgueira

Primeira versão (v0.1) do portfólio: **Fase 1 completa** (layout, tipografia, cores, responsivo, conteúdo)
e a **base da Fase 2** (animações de entrada, scroll cinematográfico e smooth scroll).

Stack: **Vite 8 · React 19 · TypeScript · Tailwind CSS 4 · motion · GSAP + ScrollTrigger · Lenis**

---

## Como rodar

Requisito: **Node.js 20.19+ ou 22.12+** (confira com `node -v`).

```bash
npm install
npm run dev
```

Abre sozinho em http://localhost:5173.

| Script              | O que faz                                            |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento com hot reload           |
| `npm run build`     | Checa os tipos e gera a versão de produção em `dist/` |
| `npm run preview`   | Serve o `dist/` localmente, como ficaria publicado   |
| `npm run typecheck` | Só a checagem de tipos                               |

No VS Code, instale as extensões **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) e
**Prettier** (`esbenp.prettier-vscode`) — o projeto já tem um `.prettierrc`.

---

## Onde editar

| Quero mudar…                              | Arquivo                                   |
| ----------------------------------------- | ----------------------------------------- |
| Contatos, WhatsApp, LinkedIn, GitHub, foto | `src/data/site.ts`                        |
| Avatar do hero                            | `src/assets/avatar.webp` (ver abaixo)     |
| Problemas (seção 02)                      | `src/data/problems.ts`                    |
| Soluções (seção 03)                       | `src/data/services.ts`                    |
| Etapas do processo (seção 04)             | `src/data/process.ts`                     |
| Tecnologias e diagrama (seção 05)         | `src/data/technologies.ts`                |
| Cases (seção 06)                          | `src/data/projects.ts`                    |
| Cores, fontes, tamanhos, easings          | `src/styles/index.css` (bloco `@theme`)   |
| Durações e curvas das animações           | `src/animations/tokens.ts`                |

> Se mudar uma cor no `@theme`, atualize também `src/styles/palette.ts` — o GSAP usa esse arquivo
> para interpolar as cores de fundo nas transições.

### Avatar do hero

O avatar atual está em `src/assets/avatar.webp`. Para trocar, salve outra imagem (PNG/WebP **com fundo
transparente de verdade**, busto, 4:5) como `src/assets/avatar.webp` ou `avatar.png` — só um dos dois.
Ela entra sozinha: flutua, inclina em 3D com o cursor, recebe a luz âmbar e se desfaz em partículas
no scroll. Sem o arquivo, o hero mostra o busto em nuvem de pontos.

### Logos dos clientes

A seção Cases é uma grade de logos. Salve cada logo (SVG/PNG **com fundo transparente**) em
`src/assets/logos/` com o id do projeto como nome — ex.: `tapa-na-pantera.svg`. A lista de nomes está
em `src/assets/logos/LEIA-ME.md`. Sem logo, o quadro mostra o nome do cliente em texto.

### Pendências de conteúdo

- [x] Avatar estilo Pixar (`src/assets/avatar.webp`, fundo removido)
- [ ] Animação de virar a cabeça (vídeo no Higgsfield → sequência de quadros)
- [ ] Logos dos 5 clientes em `src/assets/logos/`
- [ ] Descrição do site da Letícia Coutinho em `src/data/projects.ts`
- [ ] GitHub em `src/data/site.ts` (aparece no rodapé quando preenchido)
- [ ] Foto da seção Sobre: coloque em `public/` (ex.: `public/william.jpg`) e defina `photo: '/william.jpg'`

---

## Estrutura

```
src/
├── components/
│   ├── Navbar/  Hero/  Avatar3D/  Bridge/  Problem/  Solutions/
│   ├── Process/  TechStack/  Cases/  About/  Contact/  Footer/
│   ├── ScrollProgress/
│   └── ui/            Container, Eyebrow, ButtonLink, Pill, Reveal, SectionIntro
├── animations/        gsap.ts (plugins + media queries) · tokens.ts (durações, easings)
├── hooks/             useMediaQuery · useReducedMotion · useScrollProgress · useSmoothScroll
├── integrations/      contact.ts (links de WhatsApp e e-mail)
├── data/              todo o conteúdo do site
├── styles/            index.css (design system) · palette.ts
└── pages/             Portfolio.tsx (ordem das seções)
```

As timelines de scroll ficam junto de cada seção (ex.: `Solutions.tsx`) para facilitar a manutenção.
`animations/` guarda só o que é compartilhado.

---

## Roteiro de animações implementado

| Seção      | Animação                                                                          |
| ---------- | --------------------------------------------------------------------------------- |
| Hero       | Entrada em sequência, título subindo de máscaras, marca-texto âmbar               |
| Avatar     | Imagem (ou busto de pontos) com tilt 3D e luz âmbar; vira partículas ao sair da tela |
| Ponte      | Fundo CLARO → ÂMBAR → DARK no scroll, código subindo, duas frases                 |
| Problema   | Barra "processando" em 16 passos + título entrando da esquerda                    |
| Soluções   | Palco fixo de 420vh: painel SOLUTIONS atravessa a tela e 3 cards em sequência     |
| Processo   | Linha desenhada no scroll; cada etapa acende quando a linha chega                 |
| Tecnologia | Diagrama se conecta (linhas + nós) e barras dos grupos preenchem                  |
| Cases      | Grade de logos (3×2): logo monocromático, hover escuro com logo branco + quadro CTA  |
| Contato    | Fundo vira de DARK para ÂMBAR ao entrar                                           |
| Global     | Barra de progresso no topo · smooth scroll (Lenis)                                |

**Acessibilidade:** com "reduzir movimento" ligado no sistema, o smooth scroll, os pins e os scrubs
são desligados, o avatar fica estático e todo o conteúdo aparece no estado final. No mobile e em
telas menores que 1024px, a seção de Soluções vira uma lista normal (sem pin).

---

## Performance

- Fontes **self-hosted** via Fontsource (sem requisição ao Google Fonts; o navegador baixa só o
  subconjunto latino).
- `motion` carregado com `LazyMotion` + `domAnimation` (só os recursos usados).
- React, GSAP e motion em chunks separados: ficam em cache entre deploys.
- O avatar é canvas 2D (sem WebGL), limitado a 2× de densidade de pixel e pausado fora da tela.
- As seções fixas usam `position: sticky` em vez de pin do GSAP (menos reflow).

---

## Próximas fases

- **Fase 3 — Avatar:** avatar estilo Pixar em `src/assets/avatar.png` (já suportado). Se um dia
  quiser 3D de verdade, dá para gerar um GLB a partir dessa mesma imagem (Tripo, Meshy, TRELLIS)
  e trocar o renderer em `components/Avatar3D/renderers.ts`, mantendo o gatilho `dissolve`.
- **Fase 4 — Cinematic:** partículas que viram elementos de interface, shaders, transições 3D.
- **Fase 5 — Otimização:** SEO (meta/OG image, sitemap), analytics, medições de Core Web Vitals,
  testes em aparelhos reais.
