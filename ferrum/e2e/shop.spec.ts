import { expect, test } from "@playwright/test";

test("recherche instantanée", async ({ page }) => {
  await page.goto("/shop");
  await page.getByTestId("shop-search").fill("ceinture");
  const cards = page.getByTestId("product-card");
  await expect(cards).toHaveCount(3); // 2 ceintures + le Pack Full PR (accroche « Ceinture, genouillères… »)
  await expect(cards.first()).toContainText(/Ceinture/);
  await expect(page).toHaveURL(/q=ceinture/);
  await page.getByTestId("shop-search").fill("zzzz");
  await expect(page.getByText("Aucun résultat")).toBeVisible();
});

test("filtre catégorie, prix et tri", async ({ page }) => {
  await page.goto("/shop");
  await page.getByTestId("cat-grip").click();
  await expect(page.getByTestId("product-card")).toHaveCount(4);
  await page.getByTestId("cat-grip").click();
  await page.getByLabel("Plus de 50 €").check();
  await expect(page.getByTestId("product-card")).toHaveCount(4); // ceinture, sac, kit bandes, pack
  await page.getByLabel("Tous les prix").check();
  await page.getByTestId("shop-sort").selectOption("prix-asc");
  const prices = await page.getByTestId("product-card").evaluateAll((cards) =>
    cards.map((c) => Number(c.querySelector("span.font-display")!.textContent!.replace(/[^\d,]/g, "").replace(",", "."))),
  );
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});

test("lien catégorie depuis l'URL", async ({ page }) => {
  await page.goto("/shop?categorie=lest");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lest & résistance");
  await expect(page.getByTestId("product-card")).toHaveCount(2);
});
