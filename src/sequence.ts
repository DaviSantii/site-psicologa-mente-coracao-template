import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function frameIndexFromProgress(progress: number, frameCount: number): number {
  const p = Math.min(1, Math.max(0, progress));
  return Math.round(p * (frameCount - 1));
}

export function coverRect(imgW: number, imgH: number, boxW: number, boxH: number, focusX = 0.5) {
  const scale = Math.max(boxW / imgW, boxH / imgH);
  const w = imgW * scale;
  const h = imgH * scale;
  return { x: (boxW - w) * focusX, y: (boxH - h) / 2, w, h };
}

export function loadOrder(n: number): number[] {
  const seen = new Set<number>();
  const order: number[] = [];
  const push = (i: number) => {
    if (i >= 0 && i < n && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  push(0);
  push(n - 1);
  for (let step = 16; step >= 1; step /= 2) {
    for (let i = 0; i < n; i += step) push(i);
  }
  return order;
}

export function nearestLoaded<T>(index: number, frames: (T | undefined)[]): T | undefined {
  for (let d = 0; d < frames.length; d++) {
    if (frames[index - d]) return frames[index - d];
    if (frames[index + d]) return frames[index + d];
  }
  return undefined;
}

type Options = {
  canvas: HTMLCanvasElement;
  section: HTMLElement;
  frameCount: number;
  src: (i: number) => string;
  focusX?: number;
  onProgress?: (p: number) => void;
  onFirstFrame?: () => void;
  // manual: o progresso vem de setProgress (botão no celular), sem ligação com a rolagem
  manual?: boolean;
};

export function initSequence(o: Options) {
  const ctx = o.canvas.getContext("2d", { alpha: false })!;
  const frames: (ImageBitmap | undefined)[] = new Array(o.frameCount);
  let current = 0;
  let queued = false;

  const draw = () => {
    queued = false;
    const f = nearestLoaded(current, frames);
    if (!f) return;
    const r = coverRect(f.width, f.height, o.canvas.width, o.canvas.height, o.focusX ?? 0.5);
    ctx.drawImage(f, r.x, r.y, r.w, r.h);
  };
  const requestDraw = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(draw);
    }
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    o.canvas.width = Math.round(o.canvas.clientWidth * dpr);
    o.canvas.height = Math.round(o.canvas.clientHeight * dpr);
    requestDraw();
  };
  new ResizeObserver(resize).observe(o.canvas);
  resize();

  const queue = loadOrder(o.frameCount);
  const worker = async () => {
    while (queue.length) {
      const i = queue.shift()!;
      try {
        const res = await fetch(o.src(i));
        if (!res.ok) continue;
        frames[i] = await createImageBitmap(await res.blob());
        if (i === 0) o.onFirstFrame?.();
        if (Math.abs(i - current) < 8) requestDraw();
      } catch {
        // quadro ausente: o vizinho carregado mais próximo cobre a falha
      }
    }
  };
  for (let k = 0; k < 6; k++) worker();

  const setProgress = (p: number) => {
    const i = frameIndexFromProgress(p, o.frameCount);
    if (i !== current) {
      current = i;
      requestDraw();
    }
    o.onProgress?.(p);
  };

  if (!o.manual) {
    ScrollTrigger.create({
      trigger: o.section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => setProgress(self.progress),
    });
  }

  return { setProgress };
}
