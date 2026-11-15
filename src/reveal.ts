import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function separaPalavras(texto: string): string[] {
  return texto.trim().split(/\s+/).filter(Boolean);
}

export function initReveals(reduce: boolean) {
  if (reduce) return;

  gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
    gsap.from(el, {
      y: 32,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 86%", once: true },
    });
  });

  // título da apresentação: as palavras acendem com a rolagem
  document.querySelectorAll<HTMLElement>("[data-palavras]").forEach((el) => {
    const texto = (el.textContent ?? "").trim();
    el.setAttribute("aria-label", texto);
    el.innerHTML = separaPalavras(texto)
      .map((p) => `<span class="palavra" aria-hidden="true">${p}</span>`)
      .join(" ");
    gsap.fromTo(
      el.querySelectorAll(".palavra"),
      { opacity: 0.15 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
      },
    );
  });

  gsap.from(".apresenta__img", {
    clipPath: "inset(30% 10% 0% 10% round 200px 200px 12px 12px)",
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: { trigger: ".apresenta__img", start: "top 80%", once: true },
  });
  gsap.fromTo(".apresenta__img img", { scale: 1.15 }, {
    scale: 1,
    ease: "none",
    scrollTrigger: { trigger: ".apresenta__img", start: "top bottom", end: "bottom top", scrub: true },
  });

  // fotos da seção sobre
  gsap.from(".sobre__foto", {
    clipPath: "inset(25% 10% 0% 10% round 999px 999px 14px 14px)",
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: { trigger: ".sobre__fotos", start: "top 80%", once: true },
  });
  gsap.from(".sobre__foto-menor", {
    y: 60,
    opacity: 0,
    duration: 1.2,
    delay: 0.4,
    ease: "power3.out",
    scrollTrigger: { trigger: ".sobre__fotos", start: "top 80%", once: true },
  });

  ScrollTrigger.batch(".sinais li", {
    start: "top 90%",
    once: true,
    onEnter: (els) => gsap.from(els, { x: -24, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }),
  });
  gsap.fromTo(".quando__fios", { yPercent: -10 }, {
    yPercent: 10,
    ease: "none",
    scrollTrigger: { trigger: ".quando", start: "top bottom", end: "bottom top", scrub: true },
  });

  // galeria horizontal fixada no desktop; no celular vira rolagem nativa
  const mm = gsap.matchMedia();
  mm.add("(min-width: 769px)", () => {
    const trilho = document.querySelector<HTMLElement>(".trilho")!;
    const distancia = () => Math.max(0, trilho.scrollWidth - window.innerWidth);
    gsap.to(trilho, {
      x: () => -distancia(),
      ease: "none",
      scrollTrigger: {
        trigger: ".publico__fixo",
        start: "top top",
        end: () => `+=${distancia()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
  });

  gsap.from(".etapas__img", {
    y: 48,
    opacity: 0,
    duration: 1.1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".etapas__grade", start: "top 80%", once: true },
  });

  gsap.fromTo(".faixa__img", { yPercent: -7 }, {
    yPercent: 7,
    ease: "none",
    scrollTrigger: { trigger: ".faixa", start: "top bottom", end: "bottom top", scrub: true },
  });
  gsap.from(".faixa__frase", {
    y: 40,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: { trigger: ".faixa", start: "top 60%", once: true },
  });

  // o fio da linha do tempo cresce com a rolagem
  const linha = document.querySelector<HTMLElement>(".linha-tempo");
  if (linha) {
    gsap.fromTo(linha, { "--fio": 0 }, {
      "--fio": 1,
      ease: "none",
      scrollTrigger: { trigger: linha, start: "top 80%", end: "bottom 60%", scrub: true },
    });
    ScrollTrigger.batch(".linha-tempo li", {
      start: "top 88%",
      once: true,
      onEnter: (els) => gsap.from(els, { y: 20, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }),
    });
  }

  ScrollTrigger.batch(".local, .cartao-doc", {
    start: "top 88%",
    once: true,
    onEnter: (els) => gsap.from(els, { y: 40, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.1 }),
  });

  gsap.fromTo(".final__img", { scale: 1.12 }, {
    scale: 1,
    ease: "none",
    scrollTrigger: { trigger: ".final", start: "top bottom", end: "center center", scrub: true },
  });
}
