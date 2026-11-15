// pontos do topo onde a rolagem pode parar; cada um deixa uma frase inteira na tela
export const PARADAS = [0, 0.32, 0.55, 0.795, 1];

const FOLGA = 0.005;

// próxima parada na direção do gesto, ou null quando já passou da última nesse sentido
export function proximaParada(p: number, direcao: 1 | -1, paradas = PARADAS): number | null {
  if (direcao > 0) {
    const alvo = paradas.find((s) => s > p + FOLGA);
    return alvo ?? null;
  }
  for (let i = paradas.length - 1; i >= 0; i--) {
    if (paradas[i] < p - FOLGA) return paradas[i];
  }
  return null;
}

export function paradaMaisProxima(p: number, paradas = PARADAS): number {
  return paradas.reduce((a, b) => (Math.abs(b - p) < Math.abs(a - p) ? b : a));
}

export function estaEmParada(p: number, paradas = PARADAS): boolean {
  return paradas.some((s) => Math.abs(s - p) <= FOLGA);
}
