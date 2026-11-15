# Arquitetura: versão Mente e Coração

## Stack

Vite + TypeScript sem framework, GSAP 3 com ScrollTrigger, Lenis, Vitest e Playwright. Site estático.

## Sequência do topo

- Abordagem: quadros em WebP desenhados num canvas.
- Vídeo de origem: 1920x1080, 24 fps, 10 s, 240 quadros. Extraídos 160 quadros (16 por segundo de vídeo), suficiente para a rolagem ficar contínua sem dobrar o peso.
- Desktop: 1920 px, qualidade 78, 7,0 MB. Celular: recorte retrato 9:16 com foco 0,58, 606 px de largura, qualidade 74, 4,6 MB. O conjunto do celular passa um pouco do alvo de 4 MB; se precisar cortar, o primeiro passo é baixar para 130 quadros.
- No desktop o canvas usa foco horizontal 0,62 para manter o cérebro à direita do texto.
- Carregamento: pontas, depois passos de 16, 8, 4, 2 e 1, com 6 downloads simultâneos; quadro que falhar é coberto pelo vizinho carregado.
- Rolagem em passos no desktop: cada gesto da roda do mouse ou do trackpad dentro do topo leva até a próxima frase inteira (paradas em 0, 0,32, 0,55, 0,795 e 1 do progresso; a quarta cai no quadro 127, só com o fio solto), numa animação de 1,15 s com a rolagem travada. O callback virtualScroll do Lenis intercepta a roda só enquanto a página está dentro do topo; depois da última frase a rolagem volta ao normal. Se a página parar entre duas frases por outro meio (barra de rolagem, teclado), ela completa até a frase mais próxima.
- Celular: o topo ocupa uma tela só e não depende da rolagem. A altura do topo é a área visível medida pela menor entre window.innerHeight, visualViewport e a altura do documento (variável --altura-tela), porque no Chrome do iPhone a barra de baixo cobre parte de 100svh e escondia o botão; ela só é recalculada quando a tela gira. Um botão "Próximo" com contador passa as frases animando o progresso da sequência; na última frase ele vira "Conhecer a avaliação" e desce para o conteúdo. A rolagem da página continua livre.
- Movimento reduzido: sem Lenis, sem canvas, topo parado com pôster, título e botão; etapas não se alternam sozinhas.

## Arquivos

- src/sequence.ts e src/beats.ts: base igual à da versão Novelo; aqui initSequence aceita manual: true e devolve setProgress, usado pelo botão do celular.
- src/passos.ts: paradas do topo e cálculo da próxima parada.
- src/reveal.ts: entradas, título palavra por palavra, galeria horizontal (gsap.matchMedia, só acima de 768 px), linha do tempo, parallax.
- src/etapas.ts: troca automática das etapas com GSAP e IntersectionObserver.
- src/main.ts: Lenis, sequência, cabeçalho em pílula, botão flutuante, âncoras.
- scripts/extrair-quadros.sh: quadros, pôsteres, último quadro e og.jpg.

## Cache

public/_headers com Cache-Control de um ano, imutável, para /frames/* e /img/*.

## Testes

- npm test: 14 testes unitários (sequência, frases, paradas do topo, etapas, separação de palavras).
- npm run test:e2e: build + preview na porta 4174, desktop 1440x900 e iPhone 13. Canvas pintando, rolagem sem erros, movimento reduzido, destinos dos botões, imagens existentes, troca das etapas por clique e paradas do topo (roda do mouse no desktop, botão no celular).

## Desempenho

Ver a seção de auditoria no fim deste arquivo.

## Auditoria de desempenho (15/11/2026)

O Lighthouse não abriu o Chrome nesta máquina (erro "spawn UNKNOWN"), então a medição foi feita com Playwright e PerformanceObserver sobre o build de produção servido localmente, sem CDN. Rodar o Lighthouse ou o PageSpeed Insights de novo depois de publicar.

| Cenário | FCP | LCP | CLS | Canvas com 1º quadro | Transferido até 3 s depois |
|---|---|---|---|---|---|
| iPhone 13, 1,6 Mbps, 150 ms, CPU 4x mais lenta | 936 ms | 2292 ms | 0,000 | 3822 ms | 1,05 MB |
| Desktop 1440x900, 10 Mbps, 40 ms | 320 ms | 612 ms | 0,000 | 867 ms | 4,08 MB |

No celular lento o pôster cobre o tempo até o canvas ficar pronto, então a pessoa não vê tela vazia; a sequência fica disponível conforme os quadros chegam.

## Publicação

Cloudflare Workers com arquivos estáticos: `wrangler.jsonc` aponta para `dist/` e `npm run deploy` faz o build e publica. Se for publicar uma demonstração, ela sai com `noindex` e `robots.txt` bloqueando buscadores até o lançamento. 
