import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Mot de passe").fill("admin123");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/admin$/);
});

test("KPIs et stock faible", async ({ page }) => {
  await expect(page.getByTestId("kpis")).toContainText("Commandes");
  await expect(page.getByTestId("low-stock-list")).toContainText("Genouillères 7 mm Squat Armor");
});

test("CRUD produit : créer, modifier, supprimer", async ({ page }) => {
  const slug = `shaker-test-${Date.now()}`;
  await page.goto("/admin/products");
  await page.getByTestId("new-product").click();
  await page.getByLabel("Nom", { exact: true }).fill("Shaker test 700 ml");
  await page.getByLabel("Slug (URL)").fill(slug);
  await page.getByLabel("Accroche").fill("Le shaker anti-grumeaux.");
  await page.getByLabel("Description").fill("Un shaker de test créé par la suite Playwright pour valider le CRUD.");
  await page.getByLabel("Prix de vente TTC (€)").fill("14.90");
  await page.getByLabel("Prix d'achat (€)").fill("3.20");
  await page.getByLabel("Lien fournisseur").fill("https://fr.aliexpress.com/item/1005007346773400.html");
  await page.getByTestId("variant-0-name").fill("Noir");
  await page.getByTestId("variant-0-stock").fill("15");
  await page.getByTestId("save-product").click();
  await expect(page).toHaveURL(/\/admin\/products\?cree=1/);
  await expect(page.getByTestId("products-table")).toContainText("Shaker test 700 ml");

  // visible côté boutique
  const res = await page.goto(`/product/${slug}`);
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Shaker test 700 ml");

  // modification du prix + validations (navigateur puis serveur) conservant la saisie
  await page.goto("/admin/products");
  await page.getByRole("link", { name: "Modifier Shaker test 700 ml" }).click();
  const url = page.getByLabel("Lien fournisseur");
  await url.fill("pas-une-url");
  await page.getByTestId("save-product").click();
  expect(await url.evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(false);
  await url.fill("https://fr.aliexpress.com/item/1005007346773400.html");
  await page.getByLabel("Prix de vente TTC (€)").fill("16.90");
  await page.getByLabel("Slug (URL)").fill("Slug Invalide!");
  await page.getByTestId("save-product").click();
  await expect(page.getByText("Slug : minuscules, chiffres et tirets", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Prix de vente TTC (€)")).toHaveValue("16.90"); // saisie conservée
  await page.getByLabel("Slug (URL)").fill(slug);
  await page.getByTestId("save-product").click();
  await expect(page.getByTestId("form-message")).toHaveText("Produit enregistré.");
  await page.goto(`/product/${slug}`);
  await expect(page.getByTestId("product-price")).toContainText("16,90 €");

  // suppression
  await page.goto("/admin/products");
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Supprimer Shaker test 700 ml" }).click();
  await expect(page).toHaveURL(/supprime=1/);
  await expect(page.getByTestId("products-table")).not.toContainText("Shaker test 700 ml");
  expect((await page.goto(`/product/${slug}`))?.status()).toBe(404);
});
