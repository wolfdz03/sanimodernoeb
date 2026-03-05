# Documentation client — Sani Modern

## Fichiers

- **`CLIENT_DOCUMENTATION.md`** — Documentation client complète (comment tout fonctionne, connexion, base de données, déploiement, etc.).

## Générer le PDF

### Option 1 : Script npm (recommandé)

Après avoir installé les dépendances du projet :

```bash
npm run docs:pdf
```

Le fichier **`CLIENT_DOCUMENTATION.pdf`** sera créé dans le dossier `docs/`.  
*(La première exécution peut prendre du temps car `md-to-pdf` télécharge Chromium.)*

### Option 2 : Pandoc

Si [Pandoc](https://pandoc.org/) est installé :

```bash
pandoc docs/CLIENT_DOCUMENTATION.md -o docs/CLIENT_DOCUMENTATION.pdf
```

### Option 3 : Extension VS Code / Cursor

1. Installer une extension « Markdown PDF » (par ex. *Markdown PDF* par yzane).
2. Ouvrir `CLIENT_DOCUMENTATION.md`.
3. Clic droit → « Markdown PDF: Export (pdf) ».

### Option 4 : Navigateur

1. Ouvrir le fichier `.md` dans un lecteur qui rend le Markdown (GitHub, VS Code avec aperçu, etc.).
2. Imprimer (Ctrl+P) → « Enregistrer au format PDF ».

---

Pour toute question sur le contenu, se référer au document lui-même ou à l’équipe technique.
