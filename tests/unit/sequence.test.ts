import { describe, it, expect } from "vitest";
import { frameIndexFromProgress, coverRect, loadOrder, nearestLoaded } from "../../src/sequence";
import { beatState } from "../../src/beats";

describe("sequência", () => {
  it("mapeia progresso nos limites", () => {
    expect(frameIndexFromProgress(0, 160)).toBe(0);
    expect(frameIndexFromProgress(1, 160)).toBe(159);
    expect(frameIndexFromProgress(-1, 160)).toBe(0);
    expect(frameIndexFromProgress(2, 160)).toBe(159);
    expect(frameIndexFromProgress(0.5, 160)).toBe(80);
  });

  it("cobre a área sem distorcer", () => {
    const r = coverRect(1920, 1080, 1000, 1000);
    expect(r.h).toBeCloseTo(1000);
    expect(r.w / r.h).toBeCloseTo(1920 / 1080);
    expect(r.x).toBeCloseTo((1000 - r.w) / 2);
  });

  it("respeita o foco horizontal", () => {
    const esquerda = coverRect(1920, 1080, 400, 1000, 0);
    const direita = coverRect(1920, 1080, 400, 1000, 1);
    expect(esquerda.x).toBeCloseTo(0);
    expect(direita.x + direita.w).toBeCloseTo(400);
  });

  it("carrega todos os quadros uma vez, começando pelas pontas", () => {
    const o = loadOrder(160);
    expect(o.slice(0, 2)).toEqual([0, 159]);
    expect(new Set(o).size).toBe(160);
    expect(o.length).toBe(160);
  });

  it("usa o vizinho carregado mais próximo", () => {
    const f = [undefined, "a", undefined, undefined, "b"];
    expect(nearestLoaded(3, f)).toBe("b");
    expect(nearestLoaded(0, f)).toBe("a");
    expect(nearestLoaded(2, [undefined, undefined])).toBeUndefined();
  });
});

describe("frases", () => {
  it("fica visível dentro do intervalo e some fora", () => {
    expect(beatState(0.3, 0.2, 0.4).opacity).toBe(1);
    expect(beatState(0.9, 0.2, 0.4).opacity).toBe(0);
    expect(beatState(0.1, 0.2, 0.4).opacity).toBe(0);
  });

  it("primeira frase começa visível e a última fica até o fim", () => {
    expect(beatState(0, 0, 0.2).opacity).toBe(1);
    expect(beatState(1, 0.8, 1).opacity).toBe(1);
  });

  it("faz a transição de forma gradual", () => {
    const meio = beatState(0.18, 0.2, 0.4);
    expect(meio.opacity).toBeGreaterThan(0);
    expect(meio.opacity).toBeLessThan(1);
    expect(meio.y).toBeGreaterThan(0);
  });
});
