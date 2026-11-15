# Como personalizar para uma nova cliente

Este é o modelo base: mesma estrutura do site entregue, com profissional, textos, contatos e fotos fictícios. Para uma cliente nova, copie o projeto para uma pasta própria e troque tudo da lista abaixo.

```bash
cp -r site-psicologa-mente-coracao-template site-nome-da-cliente
cd site-nome-da-cliente
npm ci
```

## O que é fictício e precisa ser trocado

| Onde | O que está no modelo | Trocar por |
|---|---|---|
| `index.html`, `<title>`, descrição, Open Graph | Helena Duarte, Rio de Janeiro | nome, cidade e bairros reais (ajuda no SEO local) |
| `index.html`, JSON-LD | nome, telefone, endereços de exemplo, redes genéricas, `exemplo.com.br` | dados reais e domínio definitivo |
| `index.html`, `canonical` | `https://exemplo.com.br/` | domínio definitivo |
| Cabeçalho, topo e rodapé | "Helena Duarte", CRP 00/00000 | nome e CRP reais |
| Sobre | `public/img/profissional.webp` e `profissional-consultorio.webp` (painéis marcando o lugar), formação e publicações de exemplo | fotos da profissional (com autorização) e a trajetória real |
| Opiniões | número 40 e qualidades citadas, ilustrativos | número e qualidades reais do perfil dela; nunca copiar depoimentos (Código de Ética do psicólogo) |
| Atendimento | "Rua de Exemplo, 100" e "Avenida de Exemplo, 200", CEP 00000-000, mapa genérico | endereços reais e link exato do Google Maps |
| Links `data-cta` e telefone | `5500000000000`, (00) 00000-0000 e "Olá, Helena!" | número com DDI e DDD e o nome como ela quer ser chamada |
| Links do Doctoralia, Instagram e LinkedIn | páginas iniciais dos sites | perfis dela (ou tirar o que ela não usa) |
| `package.json` e `wrangler.jsonc` | `site-psicologa-...-template` | nome do projeto e do Worker da cliente |
| `index.html` e `public/robots.txt` | `noindex` e `Disallow: /`, para a demonstração não aparecer no Google | tirar os dois quando o site for ao ar no domínio definitivo |

Os vídeos do topo e as imagens de apoio não identificam ninguém e podem ficar, ou ser trocados (veja o README).

Depois de trocar, rode `npm test` e `npm run test:e2e`, e confira as capturas em `test-results/`. Por fim procure sobras do modelo:

```bash
grep -rnE "Helena|Duarte|00000|Exemplo|exemplo" index.html src public/robots.txt
```
