import { describe, it, expect } from "vitest";
import { proximaEtapa } from "../../src/etapas";
import { separaPalavras } from "../../src/reveal";

describe("etapas", () => {
  it("avança e volta ao começo depois da última", () => {
    expect(proximaEtapa(0, 4)).toBe(1);
    expect(proximaEtapa(3, 4)).toBe(0);
  });
});

describe("palavras do título", () => {
  it("separa por espaços e ignora espaços repetidos", () => {
    expect(separaPalavras("  Um retrato   cuidadoso\n de como ")).toEqual(["Um", "retrato", "cuidadoso", "de", "como"]);
  });
});
