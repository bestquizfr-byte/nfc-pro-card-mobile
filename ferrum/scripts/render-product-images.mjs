// Génère les visuels produits dans public/images/products/*.webp
// Usage : node scripts/render-product-images.mjs   (nécessite Playwright + Chromium)
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";
import * as A from "./art/products.mjs";

const OUT = path.resolve("public/images/products");
mkdirSync(OUT, { recursive: true });
const P = A.PALETTES;

/** [nom de fichier, svg intérieur, options de scène] */
const jobs = [];
const add = (name, inner, opts) => jobs.push([name, inner, opts]);

for (const col of ["noir", "rouge", "gris"]) {
  add(`sangles-figure-8-${col}`, A.figure8(P[col]), { floorW: 470 });
  add(`genouilleres-7mm-${col}`, A.kneeSleeves(P[col]), { floorY: 890, floorW: 400 });
}
add("sangles-figure-8-studio", A.figure8(P.noir), { theme: "light" });
add("genouilleres-7mm-studio", A.kneeSleeves(P.noir), { theme: "light", floorY: 890, floorW: 400 });

for (const col of ["noir", "rouge", "kaki"]) add(`sangles-lasso-${col}`, A.lasso(P[col]), { floorY: 990 });
add("sangles-lasso-studio", A.lasso(P.noir), { theme: "light", floorY: 990 });

add("ceinture-levier-noir", A.leverBelt(P.noir, "lb", "#8f1d22"), { floorY: 860, floorW: 430 });
add("ceinture-levier-marron", A.leverBelt(P.marron, "lb", "#2a1a12"), { floorY: 860, floorW: 430 });
add("ceinture-levier-rouge", A.leverBelt(P.rouge, "lb", "#1a1b1e"), { floorY: 860, floorW: 430 });
add("ceinture-levier-studio", A.leverBelt(P.noir, "lb", "#8f1d22"), { theme: "light", floorY: 860, floorW: 430 });

for (const col of ["noir", "rouge", "gris"]) add(`bandes-poignets-${col}`, A.wristWraps(P[col]), { floorY: 940 });
add("bandes-poignets-studio", A.wristWraps(P.noir), { theme: "light", floorY: 940 });

add("magnesie-liquide-100", A.liquidChalk(P.noir), { floorY: 960, floorW: 260 });
add("magnesie-liquide-duo", A.liquidChalk(P.noir, "lc", true), { floorY: 975, floorW: 380 });
add("magnesie-liquide-studio", A.liquidChalk(P.noir), { theme: "light", floorY: 960, floorW: 260 });

for (const col of ["noir", "sable", "rouge"]) add(`gourde-2l-${col}`, A.bottle2l(P[col]), { floorY: 1030, floorW: 260 });
add("gourde-2l-studio", A.bottle2l(P.noir), { theme: "light", floorY: 1030, floorW: 260 });

for (const col of ["noir", "kaki", "gris"]) add(`sac-de-sport-${col}`, A.gymBag(P[col]), { floorY: 880, floorW: 470 });
add("sac-de-sport-studio", A.gymBag(P.noir), { theme: "light", floorY: 880, floorW: 470 });

add("ceinture-lest-noir", A.dipBelt(P.noir), { floorY: 1110, floorW: 300 });
add("ceinture-lest-studio", A.dipBelt(P.noir), { theme: "light", floorY: 1110, floorW: 300 });

for (const col of ["noir", "rouge"]) add(`crochets-tirage-${col}`, A.liftingHooks(P[col]), { floorY: 860, floorW: 420 });
add("crochets-tirage-studio", A.liftingHooks(P.noir), { theme: "light", floorY: 860, floorW: 420 });

add("bandes-traction-kit", A.pullBands(), { floorY: 930, floorW: 470 });
add("bandes-traction-studio", A.pullBands(), { theme: "light", floorY: 930, floorW: 470 });

add("pack-full-pr", A.bundle(), { floorY: 1000, floorW: 520 });
add("pack-full-pr-studio", A.bundle(), { theme: "light", floorY: 1000, floorW: 520 });

const only = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 1200 } });
const fonts =
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@600&display=block">';
for (const [name, inner, opts] of jobs) {
  if (only && !name.includes(only)) continue;
  const svg = A.scene(inner, opts);
  await page.setContent(`<!doctype html><html><head>${fonts}<style>html,body{margin:0;background:#000}</style></head><body>${svg}</body></html>`, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.locator("svg").screenshot({ type: "png" });
  await sharp(png).webp({ quality: 86 }).toFile(path.join(OUT, `${name}.webp`));
  console.log("✓", name);
}
await browser.close();
