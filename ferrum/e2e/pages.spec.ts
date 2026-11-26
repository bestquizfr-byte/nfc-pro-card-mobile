import { expect, test, type Page } from "@playwright/test";
import { PRODUCTS } from "../src/data/catalog";

const PAGES = ["/", "/shop", "/shop?categorie=grip", "/checkout", "/admin/login", "/livraison-retours", ...PRODUCTS.map((p) => `/product/${p.slug}`)];

async function assertImagesLoaded(page: Page) {
  // Fait défiler pour déclencher le lazy-loading puis vérifie chaque <img>.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForLoadState("networkidle");
  const broken = await page.$$eval("img", (imgs) =>
    imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
  );
  expect(broken, `images cassées : ${broken.join(", ")}`).toEqual([]);
}

for (const path of PAGES) {
  test(`page ${path} : 200, sans erreur console, images OK`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await assertImagesLoaded(page);
    expect(errors, errors.join("\n")).toEqual([]);
  });
}

test("/admin redirige vers la connexion", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("produit inconnu → 404", async ({ page }) => {
  const res = await page.goto("/product/n-existe-pas");
  expect(res?.status()).toBe(404);
});

test("SEO : sitemap, robots, metadata et JSON-LD produit", async ({ page, request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const xml = await sitemap.text();
  for (const p of PRODUCTS) expect(xml).toContain(`/product/${p.slug}`);
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /admin");

  await page.goto("/product/ceinture-levier-10mm");
  await expect(page).toHaveTitle("Ceinture à levier 10 mm Forge | FERRUM");
  const ld = await page.locator('script[type="application/ld+json"]').textContent();
  const json = JSON.parse(ld!);
  expect(json["@type"]).toBe("Product");
  expect(json.offers.price).toBe("74.90");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/product\/ceinture-levier-10mm$/);
});
