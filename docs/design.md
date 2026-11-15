# Design: versão Mente e Coração

## Ideia

O vídeo mostra um cérebro feito de lã que se desfaz num fio, o fio desce e forma um coração, e o coração se desenrola num monte de fios. A leitura do site é que atenção, memória e linguagem não funcionam separadas do que se sente, e que a avaliação olha para os dois com calma. É uma versão mais quente e mais escura que a Novelo, com seções em azul-ardósia.

## Paleta

Tirada do vídeo (fundo creme e fios azul-acinzentados).

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| --bg | #E7E6DC | fundo creme, igual ao do vídeo | |
| --surface | #DCDACD | cartões dos consultórios | |
| --fg | #111618 | texto, quase preto | 14,54:1 sobre --bg |
| --muted | #3A454B | texto de apoio | 7,85:1 sobre --bg |
| --accent | #4A5A66 | rótulos e números | 5,69:1 sobre --bg |
| --deep | #253035 | seções escuras, botões, rodapé | |
| --deep-fg | #E7E6DC | texto sobre --deep | 10,79:1 |
| --deep-muted | #B7C3C9 | texto de apoio sobre --deep | 7,51:1 |

## Tipografia

Fraunces 300/400 (com itálico) para títulos; as frases do topo usam peso 400 em #0B0F10 (15,37:1) para ficarem bem escuras sobre o vídeo, Manrope 400/500/600 para o corpo.

## Frases do topo

| Progresso | Momento do vídeo | Frase | Lado |
|---|---|---|---|
| 0 a 0,18 | cérebro inteiro | Entender como a mente funciona. (h1) | esquerda |
| 0,24 a 0,40 | fio descendo | Cada fio conta uma parte da história: atenção, memória, linguagem. | esquerda |
| 0,46 a 0,64 | coração formado | E nenhuma mente funciona separada do que se sente. | direita |
| 0,70 a 0,84 | coração se desfazendo | Por isso a avaliação olha para os dois, com tempo e cuidado. | direita |
| 0,90 a 1 | monte de fios | Nome, CRP, público e botão de agendamento | esquerda |

O coração aparece no centro do quadro e ocupa a esquerda no desktop, por isso as frases desse trecho vão para a direita, em corpo menor e alinhadas à direita, e o véu claro troca de lado (classe is-direita entre 0,43 e 0,87). No celular todas as frases ficam embaixo, sobre um véu creme.

## Ordem das seções

1. Topo com a sequência (600vh no desktop com paradas por frase; no celular, uma tela com botão Próximo) e barra de progresso.
2. Quem conduz a avaliação: foto principal em arco (fixa ao lado do texto no desktop), foto menor no consultório sobreposta no canto, texto e linha do tempo da formação com o fio crescendo pela rolagem.
3. Apresentação: título que acende palavra por palavra, texto e imagem em arco.
4. Quando procurar (seção escura): seis sinais numerados.
5. Para quem: galeria horizontal fixada no desktop; carrossel com scroll-snap no celular.
6. Como funciona: quatro etapas que se alternam sozinhas a cada 6 s, com barra de tempo e imagem trocando; pausa com o mouse em cima e quando a seção sai da tela; dá para clicar.
7. Faixa com o coração de lã e a frase "Mente e emoção no mesmo fio."
8. Atendimento: dois consultórios e cartão do Doctoralia.
9. Dúvidas frequentes (details/summary, sem JavaScript).
10. Chamada final escura com o último quadro do vídeo.
11. Rodapé.

## Tom de voz e regras

Igual à versão Novelo: primeira pessoa quando a profissional fala de si, nada de números inventados, nada de depoimentos copiados, CRP visível no topo, na seção Sobre e no rodapé.
