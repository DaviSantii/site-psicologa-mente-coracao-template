import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initSequence } from "./sequence";
import { applyBeats } from "./beats";
import { initReveals } from "./reveal";
import { initEtapas } from "./etapas";
import { PARADAS, proximaParada, paradaMaisProxima, estaEmParada } from "./passos";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile = matchMedia("(max-width: 768px)").matches;
const FRAMES = 160; // igual ao total usado no script de extração

const hero = document.querySelector<HTMLElement>("#hero")!;
const beats = [...hero.querySelectorAll<HTMLElement>(".beat")];
const barra = hero.querySelector<HTMLElement>(".hero__progresso span");
const topo = document.querySelector<HTMLElement>("#topo")!;
const whats = document.querySelector<HTMLElement>(".whats");
const avancar = hero.querySelector<HTMLButtonElement>(".hero__avancar");

document.querySelectorAll<HTMLElement>("[data-ano]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

let lenis: Lenis | undefined;

const suave = (t: number) => 1 - Math.pow(1 - t, 3);

if (reduce) {
  hero.classList.add("hero--estatico");
} else {
  // no desktop cada gesto de rolagem dentro do topo leva até a próxima frase inteira
  const fimHero = () => hero.offsetHeight - window.innerHeight;
  let andando = false;
  let pausaAte = 0;
  const irPara = (p: number) => {
    andando = true;
    lenis!.scrollTo(p * fimHero(), {
      duration: 1.15,
      easing: suave,
      lock: true,
      force: true,
      onComplete: () => {
        andando = false;
        pausaAte = performance.now() + 350;
      },
    });
  };

  lenis = new Lenis({
    lerp: 0.09,
    virtualScroll: ({ deltaY, event }) => {
      if (mobile || !(event instanceof WheelEvent) || event.ctrlKey) return true;
      const fim = fimHero();
      const y = lenis!.scroll;
      const noTopo = y < fim - 1 || (y <= fim + 1 && deltaY < 0);
      if (!noTopo) return true;
      if (event.cancelable) event.preventDefault();
      if (andando || performance.now() < pausaAte || Math.abs(deltaY) < 4) return false;
      const alvo = proximaParada(y / fim, deltaY > 0 ? 1 : -1);
      if (alvo === null) return deltaY > 0;
      irPara(alvo);
      return false;
    },
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // se a rolagem parar entre duas frases (barra de rolagem, teclado, inércia), completa até a mais próxima
  if (!mobile) {
    let espera = 0;
    lenis.on("scroll", () => {
      clearTimeout(espera);
      espera = window.setTimeout(() => {
        const fim = fimHero();
        const y = lenis!.scroll;
        if (andando || lenis!.isScrolling || y <= 0 || y >= fim - 1) return;
        const p = y / fim;
        if (!estaEmParada(p)) irPara(paradaMaisProxima(p));
      }, 160);
    });
  }

  const seq = initSequence({
    canvas: hero.querySelector("canvas")!,
    section: hero,
    frameCount: FRAMES,
    focusX: mobile ? 0.5 : 0.62,
    manual: mobile,
    src: (i) => `/frames/${mobile ? "mobile" : "desktop"}/${String(i + 1).padStart(4, "0")}.webp`,
    onFirstFrame: () => hero.classList.add("is-ready"),
    onProgress: (p) => {
      applyBeats(p, beats);
      hero.classList.toggle("is-rolando", p > 0.03);
      hero.classList.toggle("is-direita", p > 0.43 && p < 0.87);
      if (barra) barra.style.transform = `scaleX(${p})`;
    },
  });
  applyBeats(0, beats);

  // no celular o topo ocupa uma tela e um botão passa as frases antes da rolagem da página
  if (mobile && avancar) {
    hero.classList.add("hero--botao");
    // altura visível de verdade: no Chrome do iPhone a barra de baixo cobre parte de 100svh
    const ajustaAltura = () => {
      // menor das medidas disponíveis, para nada ficar atrás das barras do navegador
      const medidas = [window.innerHeight, window.visualViewport?.height, document.documentElement.clientHeight].filter((n): n is number => !!n);
      document.documentElement.style.setProperty("--altura-tela", `${Math.floor(Math.min(...medidas))}px`);
    };
    ajustaAltura();
    let largura = window.innerWidth;
    window.addEventListener("resize", () => {
      // só recalcula quando gira a tela; a barra do navegador recolhendo não mexe no topo
      if (window.innerWidth === largura) return;
      largura = window.innerWidth;
      ajustaAltura();
      ScrollTrigger.refresh();
    });
    const estado = { p: 0 };
    const rotulo = avancar.querySelector<HTMLElement>(".hero__avancar-texto")!;
    const contador = avancar.querySelector<HTMLElement>(".hero__avancar-conta")!;
    const atualiza = () => {
      const i = PARADAS.indexOf(paradaMaisProxima(estado.p));
      const ultima = i === PARADAS.length - 1;
      rotulo.textContent = ultima ? "Conhecer a avaliação" : "Próximo";
      contador.textContent = ultima ? "↓" : `${i + 1} / ${PARADAS.length}`;
      avancar.classList.toggle("is-ultima", ultima);
    };
    atualiza();
    avancar.addEventListener("click", () => {
      if (gsap.isTweening(estado)) return;
      const alvo = proximaParada(estado.p, 1);
      if (alvo === null) {
        const conteudo = document.querySelector<HTMLElement>("#conteudo")!;
        lenis!.scrollTo(conteudo, { offset: -60 });
        return;
      }
      gsap.to(estado, {
        p: alvo,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => seq.setProgress(estado.p),
        onComplete: atualiza,
      });
    });
  }
}

ScrollTrigger.create({
  trigger: hero,
  start: "bottom 90px",
  end: "max",
  onToggle: (self) => topo.classList.toggle("is-solido", self.isActive),
});
ScrollTrigger.create({
  start: () => window.innerHeight * 0.8,
  end: "max",
  onToggle: (self) => whats?.classList.toggle("is-visivel", self.isActive),
});

document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const alvo = a.getAttribute("href")!;
    if (alvo.length < 2) return;
    const el = document.querySelector<HTMLElement>(alvo);
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { offset: alvo === "#hero" ? 0 : -80 });
    else el.scrollIntoView();
  });
});

initReveals(reduce);
initEtapas(reduce);
document.fonts.ready.then(() => ScrollTrigger.refresh());
