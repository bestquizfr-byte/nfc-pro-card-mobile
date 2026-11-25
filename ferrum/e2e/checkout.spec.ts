import { expect, test } from "@playwright/test";

test("parcours complet : panier → FORCE10 → commande démo → admin", async ({ page }) => {
  // 1. Fiche produit : taille obligatoire puis ajout
  await page.goto("/product/sangles-figure-8");
  await expect(page.getByTestId("add-to-cart")).toHaveText(/Choisis ta taille/);
  await page.getByTestId("size-M").click();
  await page.getByTestId("add-to-cart").click();

  // 2. Drawer : ouvert, quantité, barre livraison
  const drawer = page.getByTestId("cart-drawer");
  await expect(drawer).toBeVisible();
  await expect(page.getByTestId("cart-count")).toHaveText("1");
  await page.getByTestId("cart-qty-plus").click();
  await expect(page.getByTestId("cart-qty")).toHaveText("2");
  await expect(page.getByTestId("cart-total")).toHaveText("44,70 €"); // 2 × 19,90 + 4,90
  await expect(page.getByTestId("free-shipping-message")).toContainText("20,20 €");

  // 3. Code promo invalide puis FORCE10
  await drawer.getByText("J'ai un code promo").click();
  await page.getByTestId("promo-input").fill("FAUX");
  await page.getByTestId("promo-submit").click();
  await expect(drawer.getByRole("alert")).toContainText("n'existe pas");
  await page.getByTestId("promo-input").fill("force10");
  await page.getByTestId("promo-submit").click();
  await expect(page.getByTestId("promo-applied")).toContainText("FORCE10");
  await expect(page.getByTestId("cart-discount")).toHaveText("−3,98 €");
  await expect(page.getByTestId("cart-total")).toHaveText("40,72 €"); // 39,80 − 3,98 + 4,90

  // 4. Checkout : validation Zod puis commande
  await page.getByTestId("checkout-link").click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByTestId("demo-banner")).toBeVisible();
  await expect(page.getByTestId("checkout-total")).toHaveText("40,72 €");
  await page.getByTestId("place-order").click();
  await expect(page.getByText("Adresse e-mail invalide")).toBeVisible();
  await expect(page.getByText("Code postal à 5 chiffres")).toBeVisible();

  const form = page.getByTestId("checkout-form");
  await form.getByLabel("E-mail").fill("test.e2e@ferrum.fr");
  await form.getByLabel("Prénom").fill("Alex");
  await form.getByLabel("Nom", { exact: true }).fill("Durand");
  await form.getByLabel("Adresse", { exact: true }).fill("8 avenue Jean Jaurès");
  await form.getByLabel("Code postal").fill("69007");
  await form.getByLabel("Ville").fill("Lyon");
  await page.getByTestId("place-order").click();

  // 5. Confirmation
  await expect(page).toHaveURL(/\/checkout\/success\?order=FER-\d+/);
  const number = (await page.getByTestId("order-number").textContent())!.trim();
  await expect(page.getByTestId("order-total")).toHaveText("40,72 €");
  await expect(page.getByTestId("order-status")).toHaveText("Payée");
  await expect(page.getByTestId("cart-count")).toHaveCount(0); // panier vidé

  // 6. Admin : la commande apparaît, on la passe en "Expédiée"
  await page.goto("/admin/login");
  await page.getByLabel("Mot de passe").fill("mauvais");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByText("Mot de passe incorrect.")).toBeVisible();
  await page.getByLabel("Mot de passe").fill("admin123");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByTestId("kpis")).toContainText("Chiffre d'affaires TTC");

  await page.goto("/admin/orders");
  const row = page.locator(`[data-number="${number}"]`);
  await expect(row).toContainText("Alex Durand");
  await expect(row).toContainText("Code FORCE10");
  await row.getByTestId("order-status-select").selectOption("SHIPPED");
  await expect(row.getByTestId("order-status-badge")).toHaveText("Expédiée");
  await page.reload();
  await expect(page.locator(`[data-number="${number}"]`).getByTestId("order-status-badge")).toHaveText("Expédiée");
});

test("upsell : ajout groupé « Souvent acheté ensemble »", async ({ page }) => {
  await page.goto("/product/magnesie-liquide");
  await page.getByTestId("upsell-add").click();
  await expect(page.getByTestId("cart-drawer")).toBeVisible();
  await expect(page.getByTestId("cart-items").locator("li")).toHaveCount(3);
});

test("ajout rapide depuis la grille (produit à variante unique) @mobile", async ({ page }) => {
  await page.goto("/shop?categorie=lest");
  await page.getByRole("button", { name: /Ajouter Kit 5 bandes de traction au panier/ }).click();
  await expect(page.getByTestId("cart-drawer")).toBeVisible();
  await expect(page.getByTestId("cart-items")).toContainText("Kit 5 bandes de traction");
});
