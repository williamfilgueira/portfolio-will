# Imagens que entram sozinhas

Os arquivos abaixo são detectados por `import.meta.glob` — basta salvar com o nome certo,
sem mexer em código.

## `avatar-scan.webp` — avatar do hero

**Atenção: este arquivo não é a arte colorida.** É um **mapa de brilho em tons de cinza**
(branco = ponto aceso, preto = vazio). A cor — o gradiente ciano → âmbar — é aplicada em
tempo de execução, o que deixa o arquivo ~3× mais leve e amarrado aos tokens do design system.

Para trocar o retrato:

1. Gere a arte em **1:1, sobre fundo preto** (o retrato de scan/LiDAR atual saiu assim).
2. Converta para **tons de cinza** — o brilho vira o mapa.
3. Redimensione para **~860×860** e salve como `avatar-scan.webp` (WebP, qualidade ~66).

Sem este arquivo, o hero cai no busto low-poly gerado por código
(`src/components/Avatar3D/lowPolyBust.ts`).

## `foto-sobre.webp` — foto da seção Sobre

Retrato **4:5**, ~1000×1250, colorido normal (não é máscara). Entra na moldura chanfrada.
Sem o arquivo, aparece o bloco "WF".

## `logos/<id>.svg` — logos dos clientes

Um arquivo por cliente, com **fundo transparente**, nomeado com o id do projeto em
`src/data/projects.ts` (ex.: `tapa-na-pantera.svg`). Também aceita `.png` e `.webp`.
São exibidos monocromáticos: pretos na grade, brancos no hover.

## `avatar.webp`

Avatar antigo (estilo Pixar). **Não é mais usado** por nenhum glob — está aqui só como
histórico. Pode apagar quando quiser.
