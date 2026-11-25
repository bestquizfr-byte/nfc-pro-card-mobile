# Vmax 💪

> 🛒 **Nouveau : FERRUM**, boutique e-commerce d'accessoires de musculation → dossier [`ferrum/`](ferrum/), rapport dans [`REPORT.md`](REPORT.md).

Carnet de muscu entre potes : séries, progression, rangs (Ranked), minuteur de repos, compléments.
C'est une **app web installable (PWA)** : pas d'App Store. On ouvre un lien, on l'ajoute à l'écran
d'accueil, et elle se comporte comme une vraie app (plein écran, icône, marche sans réseau).

Tout le code de l'app est dans [`vmax/`](vmax/).

## Mettre l'app en ligne (une seule fois)

### Option A : Netlify Drop (le plus simple, 2 minutes, gratuit)
1. Va sur https://app.netlify.com/drop (crée un compte gratuit).
2. Glisse-dépose **le dossier `vmax`** dans la page.
3. Tu obtiens un lien du type `https://nom-au-hasard.netlify.app` : c'est ton app.
   Tu peux le renommer dans *Site configuration → Change site name*.

### Option B : GitHub Pages (déjà prêt dans ce dépôt)
1. Fusionne cette branche dans `main`.
2. Sur GitHub : *Settings → Pages → Build and deployment → Source : **GitHub Actions***.
3. Le workflow `.github/workflows/pages.yml` publie automatiquement `vmax/` à chaque modification.
   Lien : `https://<ton-pseudo>.github.io/<nom-du-depot>/`

> Les dépôts **privés** ont besoin d'un compte GitHub payant pour Pages. Si le dépôt est privé, prends l'option A.

## Envoyer l'app à tes potes
Envoie-leur le lien (ou utilise le bouton **Réglages → Envoyer l'app à un pote**).

- **iPhone** : ouvrir le lien dans **Safari** → bouton Partager → **Sur l'écran d'accueil**.
- **Android** : ouvrir dans Chrome → menu ⋮ → **Installer l'application** (ou le bouton dans Réglages).

## Confidentialité « entre nous »
- L'app n'est **pas référencée** sur Google (balise `noindex` + `robots.txt`) : seuls ceux qui ont le lien la trouvent.
- **Aucune donnée ne quitte le téléphone** : chaque pote a ses séries chez lui, personne ne voit celles des autres.
- Pour changer de téléphone : *Réglages → Exporter mes données*, puis *Importer une sauvegarde* sur le nouveau.

## Récupérer tes anciennes données (version Claude)
Dans l'ancienne version : *Réglages → Exporter mes données*. Dans la nouvelle app : *Réglages → Importer une sauvegarde*.
Les séries, profils, exercices perso et compléments sont repris.

## Mettre à jour l'app
Modifie les fichiers de `vmax/`, change `APP_VERSION` dans `index.html` **et** `CACHE` dans `sw.js`,
puis republie. Les téléphones récupèrent la nouvelle version à la prochaine ouverture avec du réseau.
