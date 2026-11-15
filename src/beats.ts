export function beatState(progress: number, from: number, to: number, fade = 0.04) {
  if (progress <= from - fade || progress >= to + fade) return { opacity: 0, y: 24 };
  const inP = from <= 0 ? 1 : Math.min(1, (progress - (from - fade)) / fade);
  const outP = to >= 1 ? 1 : Math.min(1, (to + fade - progress) / fade);
  const v = Math.max(0, Math.min(inP, outP, 1));
  return { opacity: v, y: (1 - v) * 24 };
}

export function applyBeats(progress: number, els: HTMLElement[]) {
  for (const el of els) {
    const s = beatState(progress, Number(el.dataset.from), Number(el.dataset.to));
    el.style.opacity = String(s.opacity);
    el.style.transform = `translate3d(0, ${s.y}px, 0)`;
    el.style.pointerEvents = s.opacity > 0.5 ? "auto" : "none";
  }
}
