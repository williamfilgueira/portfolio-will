# Portfólio — William Filgueira

Versão atual (v0.5): **Fase 1 completa** (layout, tipografia, cores, responsivo, conteúdo),
a **base da Fase 2** (animações de entrada, scroll cinematográfico e smooth scroll) e a
**camada cyberpunk** (ciano de HUD, cantos chanfrados, scanlines).

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
| Avatar do hero                            | `src/assets/avatar-scan.webp` (ver abaixo) |
| Foto da seção Sobre                       | `src/assets/foto-sobre.webp` (ver abaixo) |
| Logos dos clientes (seção 06)             | `src/assets/logos/<id>.svg` (ver abaixo)  |
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

É o **retrato "3D scan"** (`src/assets/avatar-scan.webp` + `src/components/Avatar3D/scanPortrait.ts`).

O arquivo **não é a arte colorida**: é só um **mapa de brilho em tons de cinza** (branco = ponto
aceso, preto = vazio). A cor — o gradiente ciano → âmbar — é aplicada em runtime. Isso deixa o
arquivo ~3× mais leve (139 KB em vez de ~475 KB) e a cor passa a acompanhar o design system: mudou
o token, mudou o retrato.

O que se move:

| Momento | Animação                                                                     |
| ------- | ---------------------------------------------------------------------------- |
| Entrada | uma linha de varredura desce revelando o retrato (1,3s, uma vez)             |
| Repouso | paralaxe 3D com o cursor, flutuação, pontos piscando e varredura a cada ~7s  |
| Scroll  | vira partículas que se espalham, sobem e esquentam para âmbar (dissolve)     |

Ajustes em `scanPortrait.ts`: `RAMP_START` (onde a cor vira âmbar), `SAMPLE` (quantas partículas no
dissolve), `ENTRY_MS` e `SWEEP_MS` (tempos), `CYAN`/`AMBER` (cores).

**Para trocar o retrato:** gere a arte (fundo preto, 1:1), converta para tons de cinza — o brilho
vira o mapa — e salve como `src/assets/avatar-scan.webp`, ~860px. Sem esse arquivo, o hero cai no
**busto low-poly gerado por código** (`lowPolyBust.ts`: icosfera deformada em cabeça, ombros por
anéis de revolução, facetas que viram cacos no scroll) — ajustável por `headShape()`, `buildBust()`,
`icosphere(1)` → `2` e as constantes de cor.

### Foto da seção Sobre

Salve como `src/assets/foto-sobre.webp` (`.jpg` / `.png` também), retrato 4:5, ~1000×1250.
Entra sozinha na moldura chanfrada. Sem o arquivo, aparece o bloco "WF".

### Logos dos clientes

Salve cada logo com fundo transparente em `src/assets/logos/<id do projeto>.svg` (ou `.png` / `.webp`) —
os ids estão em `src/data/projects.ts` (ex.: `tapa-na-pantera.svg`). O logo entra no lugar do nome em
texto e fica monocromático (preto; branco no hover). Sem o arquivo, o quadro mostra o nome.

### Camada cyberpunk

Três peças, todas em `src/styles/index.css` e `src/components/ui/`:

| Peça                         | O que é                                                                     |
| ---------------------------- | --------------------------------------------------------------------------- |
| `cut-corner` / `cut-corner-sm` | Corta o canto superior direito e o inferior esquerdo (14px / 8px)           |
| `cut-edge` / `cut-edge-sm`     | Desenha a diagonal do chanfro — use **junto** em elementos com borda, senão a borda fica aberta. Cor: `[--cut-line:…]` |
| `HudOverlay`                 | Scanlines + granulado + vinheta das seções escuras (decorativo, sem clique) |
| `CornerMarks`                | Colchetes de HUD nos quatro cantos                                          |

O ciano (`text-cyber` no escuro, `text-cyber-ink` no claro) é só para **dados**: labels, números,
`//`. O âmbar continua sendo o destaque da marca.

### Pendências de conteúdo

- [ ] Logos dos 5 clientes em `src/assets/logos/`
- [ ] Descrição do site da Letícia Coutinho em `src/data/projects.ts`
- [ ] GitHub em `src/data/site.ts` (aparece no rodapé quando preenchido)

---

## Estrutura

```
src/
├── components/
│   ├── Navbar/  Hero/  Avatar3D/  Bridge/  Problem/  Solutions/
│   ├── Process/  TechStack/  Cases/  About/  Contact/  Footer/
│   ├── ScrollProgress/
│   └── ui/            Container, Eyebrow, ButtonLink, Pill, Reveal, SectionIntro,
│                      HudOverlay, CornerMarks
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
| Avatar     | Retrato de scan: varredura na entrada, paralaxe no cursor, vira partículas no scroll |
| Ponte      | Fundo CLARO → ÂMBAR → DARK no scroll, código subindo, duas frases                 |
| Problema   | Barra "processando" em 16 passos + título entrando da esquerda                    |
| Soluções   | Palco fixo de 420vh: painel SOLUTIONS atravessa a tela e 3 cards em sequência     |
| Processo   | Linha desenhada no scroll; cada etapa acende quando a linha chega                 |
| Tecnologia | Diagrama se conecta (linhas + nós) e barras dos grupos preenchem                  |
| Cases      | Grade de logos dos clientes; no hover o quadro escurece e o logo fica branco      |
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
- O retrato do hero é um mapa de brilho em tons de cinza (139 KB) colorido em runtime — a arte
  colorida equivalente pesaria ~475 KB.
- As seções fixas usam `position: sticky` em vez de pin do GSAP (menos reflow).

---

## Próximas fases

- **Fase 3 — Avatar:** retrato de scan animado no ar. Se um dia quiser 3D de verdade (360°,
  materiais, sombras), dá para trocar o renderer por React Three Fiber com um GLB, mantendo o mesmo
  contrato: o componente só precisa de `dissolve` (0 → 1) e da posição do cursor.
- **Fase 4 — Cinematic:** partículas que viram elementos de interface, shaders, transições 3D.
- **Fase 5 — Otimização:** SEO (meta/OG image, sitemap), analytics, medições de Core Web Vitals,
  testes em aparelhos reais.
