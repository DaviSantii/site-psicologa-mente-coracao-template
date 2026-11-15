import { gsap } from "gsap";

export function proximaEtapa(atual: number, total: number): number {
  return (atual + 1) % total;
}

export function initEtapas(reduce: boolean, duracao = 6) {
  const botoes = [...document.querySelectorAll<HTMLButtonElement>(".etapa")];
  const img = document.querySelector<HTMLImageElement>(".etapas__img img");
  const grade = document.querySelector<HTMLElement>(".etapas__grade");
  if (!botoes.length || !img || !grade) return;

  let atual = 0;
  let barra: gsap.core.Tween | undefined;
  let visivel = false;
  let pausado = false;

  const trocaImagem = (b: HTMLButtonElement) => {
    const src = b.dataset.img!;
    if (img.getAttribute("src") === src) return;
    img.classList.add("is-trocando");
    window.setTimeout(() => {
      img.src = src;
      img.alt = b.dataset.alt ?? "";
      img.classList.remove("is-trocando");
    }, reduce ? 0 : 300);
  };

  const roda = () => {
    barra?.kill();
    if (reduce || !visivel) return;
    barra = gsap.to(botoes[atual].querySelector(".etapa__barra span"), {
      scaleX: 1,
      duration: duracao,
      ease: "none",
      paused: pausado,
      onComplete: () => ativa(proximaEtapa(atual, botoes.length)),
    });
  };

  const ativa = (i: number) => {
    atual = i;
    botoes.forEach((b, k) => {
      b.classList.toggle("is-ativa", k === i);
      b.setAttribute("aria-selected", String(k === i));
      gsap.set(b.querySelector(".etapa__barra span"), { scaleX: 0 });
    });
    trocaImagem(botoes[i]);
    roda();
  };

  botoes.forEach((b, i) => b.addEventListener("click", () => ativa(i)));

  grade.addEventListener("pointerenter", () => {
    pausado = true;
    barra?.pause();
  });
  grade.addEventListener("pointerleave", () => {
    pausado = false;
    barra?.resume();
  });

  new IntersectionObserver(
    ([e]) => {
      visivel = e.isIntersecting;
      if (!visivel) barra?.pause();
      else if (barra && !pausado) barra.resume();
      else if (!barra) roda();
    },
    { threshold: 0.35 },
  ).observe(grade);
}
