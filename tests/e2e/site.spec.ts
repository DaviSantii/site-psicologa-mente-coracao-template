import { test, expect } from "@playwright/test";

test("topo carrega, desenha e rola sem erros", async ({ page }, info) => {
  const erros: string[] = [];
  page.on("console", (m) => m.type() === "error" && erros.push(m.text()));
  page.on("pageerror", (e) => erros.push(e.message));

  await page.goto("/");
  await expect(page.locator("#hero")).toHaveClass(/is-ready/, { timeout: 15000 });

  // o quadro é pintado no requestAnimationFrame seguinte ao is-ready
  await expect.poll(() => page.evaluate(() => {
    const c = document.querySelector<HTMLCanvasElement>(".hero__canvas")!;
    const d = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
    let soma = 0;
    for (let i = 0; i < d.length; i += 4 * 97) soma += d[i] + d[i + 1] + d[i + 2];
    return soma > 0;
  }), { timeout: 5000 }).toBe(true);

  const altura = await page.evaluate(() => {
    const h = document.querySelector<HTMLElement>("#hero")!;
    return h.offsetHeight - window.innerHeight;
  });
  for (const f of [0, 0.35, 0.65, 0.95]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(altura * f));
    await page.waitForTimeout(900);
    await page.screenshot({ path: `test-results/hero-${info.project.name}-${Math.round(f * 100)}.png` });
  }

  // percorre a página para disparar as animações de entrada
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = altura; y < total; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `test-results/pagina-${info.project.name}.png`, fullPage: true });

  expect(erros).toEqual([]);
});

test("com movimento reduzido mostra pôster e frases", async ({ browser }, info) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:4174/`);
  await expect(page.locator(".hero__poster")).toBeVisible();
  await expect(page.locator(".beat").first()).toHaveCSS("opacity", "1");
  await expect(page.locator(".beat--cta")).toBeVisible();
  await page.screenshot({ path: `test-results/reduzido-${info.project.name}.png` });
  await ctx.close();
});

test("todos os botões de contato têm destino válido", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator("[data-cta]").evaluateAll((els) => els.map((e) => e.getAttribute("href") ?? ""));
  expect(hrefs.length).toBeGreaterThan(2);
  for (const h of hrefs) expect(h).toMatch(/^https:\/\/(wa\.me\/55\d{10,11}\?text=|www\.doctoralia\.com\.br\/)/);
});

test("todas as imagens existem", async ({ page, request }) => {
  await page.goto("/");
  const srcs = await page.locator("img").evaluateAll((els) => els.map((e) => (e as HTMLImageElement).getAttribute("src")!));
  for (const s of new Set(srcs)) {
    const r = await request.get(s);
    expect(r.status(), s).toBe(200);
  }
});

test("etapas trocam ao clicar", async ({ page }) => {
  await page.goto("/");
  await page.locator("#etapas").scrollIntoViewIfNeeded();
  const terceira = page.locator(".etapa").nth(2);
  await terceira.click();
  await expect(terceira).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".etapas__img img")).toHaveAttribute("src", "/img/cerebro.webp");
});

test("cada gesto no topo para numa frase inteira", async ({ page }, info) => {
  await page.goto("/");
  await expect(page.locator("#hero")).toHaveClass(/is-ready/, { timeout: 15000 });

  if (info.project.name !== "desktop") {
    const botao = page.locator(".hero__avancar");
    await expect(botao).toBeVisible();
    // botão inteiro dentro da tela e nada por cima dele (o WhatsApp escondido ficava sobre o contador)
    const livre = await page.evaluate(() => {
      const r = document.querySelector(".hero__avancar")!.getBoundingClientRect();
      const pontos = [r.left + 12, r.left + r.width / 2, r.right - 12];
      return r.bottom <= innerHeight && pontos.every((x) => document.elementFromPoint(x, r.top + r.height / 2)?.closest(".hero__avancar"));
    });
    expect(livre).toBe(true);
    await expect(botao).toContainText("1 / 5");
    await botao.click();
    await expect(botao).toContainText("2 / 5", { timeout: 4000 });
    await expect(page.locator(".beat").nth(1)).toHaveCSS("opacity", "1");
    for (let i = 3; i <= 5; i++) {
      await page.waitForTimeout(200);
      await botao.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `test-results/botao-${info.project.name}-${i}.png` });
    }
    await expect(botao).toContainText("Conhecer a avaliação");
    await expect(page.locator(".beat--cta")).toHaveCSS("opacity", "1");
    await page.screenshot({ path: `test-results/botao-${info.project.name}.png` });
    return;
  }

  const fim = await page.evaluate(() => document.querySelector<HTMLElement>("#hero")!.offsetHeight - innerHeight);
  await page.mouse.move(700, 450);
  for (const esperado of [0.32, 0.55, 0.795]) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(1800);
    const y = await page.evaluate(() => scrollY);
    expect(Math.abs(y / fim - esperado)).toBeLessThan(0.01);
    await page.screenshot({ path: `test-results/passo-desktop-${Math.round(esperado * 1000)}.png` });
  }
  await page.mouse.wheel(0, -120);
  await page.waitForTimeout(1800);
  await page.mouse.wheel(0, -120);
  await page.waitForTimeout(1800);
  const volta = await page.evaluate(() => scrollY);
  expect(Math.abs(volta / fim - 0.32)).toBeLessThan(0.01);

  // parada no meio pela barra de rolagem completa até a frase mais próxima
  await page.evaluate((v) => window.scrollTo(0, v), Math.round(fim * 0.62));
  await page.waitForTimeout(2200);
  const solto = await page.evaluate(() => scrollY);
  expect(Math.abs(solto / fim - 0.55)).toBeLessThan(0.01);
});
