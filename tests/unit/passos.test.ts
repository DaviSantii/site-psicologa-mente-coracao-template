import { describe, it, expect } from "vitest";
import { proximaParada, paradaMaisProxima, estaEmParada, PARADAS } from "../../src/passos";
import { beatState } from "../../src/beats";

describe("paradas do topo", () => {
  it("avança para a parada seguinte e volta para a anterior", () => {
    expect(proximaParada(0, 1)).toBe(0.32);
    expect(proximaParada(0.4, 1)).toBe(0.55);
    expect(proximaParada(0.55, -1)).toBe(0.32);
    expect(proximaParada(0.6, -1)).toBe(0.55);
  });

  it("devolve null fora das pontas", () => {
    expect(proximaParada(1, 1)).toBeNull();
    expect(proximaParada(0, -1)).toBeNull();
  });

  it("acha a parada mais próxima", () => {
    expect(paradaMaisProxima(0.2)).toBe(0.32);
    expect(paradaMaisProxima(0.9)).toBe(1);
    expect(estaEmParada(0.551)).toBe(true);
    expect(estaEmParada(0.5)).toBe(false);
  });

  it("cada parada mostra uma frase inteira", () => {
    const beats: [number, number][] = [
      [0, 0.18],
      [0.24, 0.4],
      [0.46, 0.64],
      [0.7, 0.84],
      [0.9, 1],
    ];
    PARADAS.forEach((p, i) => {
      expect(beatState(p, ...beats[i]).opacity).toBe(1);
      beats.forEach((b, j) => j !== i && expect(beatState(p, ...b).opacity).toBe(0));
    });
  });
});
