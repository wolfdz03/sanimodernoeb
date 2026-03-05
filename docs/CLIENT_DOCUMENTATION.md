# Documentation client — Sani Modern

**Site e‑commerce Sani Modern**  
Version du document : 1.0  
Public : client / équipe technique

---

## Table des matières

1. [Vue d’ensemble](#1-vue-densemble)
2. [Démarrage rapide (connexion et premier lancement)](#2-démarrage-rapide-connexion-et-premier-lancement)
3. [Stack technique](#3-stack-technique)
4. [Variables d’environnement et connexion](#4-variables-denvironnement-et-connexion)
5. [Authentification](#5-authentification)
6. [Base de données (Supabase)](#6-base-de-données-supabase)
7. [Flux utilisateur principaux](#7-flux-utilisateur-principaux)
8. [Structure du projet](#8-structure-du-projet)
9. [Déploiement en production](#9-déploiement-en-production)
10. [Annexes](#10-annexes)

---

## 1. Vue d’ensemble

### 1.1 Qu’est-ce que Sani Modern ?

**Sani Modern** est un site e‑commerce dédié aux équipements sanitaires et salles de bain, ciblant notamment le marché algérien (ex. Oum El Bouaghi).

### 1.2 Fonctionnalités principales

**Côté public (visiteurs et acheteurs) :**

- **Accueil** : hero, présentation, collection, catégories, expérience client, pied de page.
- **Catalogue** : liste des produits par catégorie, filtres, recherche.
- **Fiche produit** : détails, variantes (options/attributs), prix, ajout au panier.
- **Panier** : tiroir (drawer) avec récapitulatif et lien vers checkout.
- **Checkout** : formulaire (nom, téléphone, wilaya, ville, adresse) ; création de commande (produit unique ou panier).
- **Suivi de commande** : page `/suivi` : saisie du numéro de commande pour voir le statut et les infos de livraison.
- **Contenu** : textes en français et arabe ; couleurs du thème configurables via les paramètres du site.

**Côté administration (dashboard) :**

- **Connexion** : page `/connexion` (email + mot de passe, réservée aux comptes avec rôle `admin`).
- **Tableau de bord** : vue d’ensemble, commandes en attente, statistiques.
- **Produits** : création, modification, suppression ; variantes, options, attributs ; upload d’images.
- **Catégories** : CRUD des catégories.
- **Commandes** : liste, détail, mise à jour du statut, export.
- **Contenu du site** : édition des textes (FR/AR).
- **Analytics** : indicateurs et rapports.
- **Paramètres** : site (titre, logo, contact), couleurs, pied de page, intégrations (email, URL, Resend, Mistral), livraison.
- **Assistant IA** : bot d’aide dans le dashboard (Mistral) ; optionnel.

---

## 2. Démarrage rapide (connexion et premier lancement)

### 2.1 Prérequis

- **Node.js** 18+ (recommandé 20+).
- **Compte Supabase** : [https://supabase.com](https://supabase.com).
- **Accès au dépôt** du projet (code source).

### 2.2 Étapes en bref

1. **Cloner le projet** et installer les dépendances :
   ```bash
   npm install
   ```

2. **Configurer les variables d’environnement**  
   Copier `env.example` vers `.env.local` et renseigner au minimum :
   - `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase → Project Settings → API).
   - `SUPABASE_SERVICE_ROLE_KEY` (même page, clé **service_role**).
   - `SESSION_SECRET` (au moins 32 caractères, ex. : `openssl rand -base64 32`).

3. **Créer le projet Supabase** (si ce n’est pas déjà fait) et récupérer l’URL et les clés.

4. **Exécuter les migrations SQL** dans l’ordre, dans le Supabase SQL Editor :
   - Tous les fichiers de `supabase/migrations/` dans l’ordre numérique : `00001_initial_schema.sql` → … → `00016_site_settings_primary_color.sql`.

5. **Créer le premier administrateur**  
   Exécuter le script `supabase/admin_setup.sql` dans le SQL Editor en remplaçant l’email et le mot de passe par les vôtres (voir section 6).

6. **Lancer l’application** :
   ```bash
   npm run dev
   ```
   Ouvrir [http://localhost:3000](http://localhost:3000).

7. **Se connecter au dashboard** : aller sur `/connexion`, saisir l’email et le mot de passe de l’admin créé, puis accéder à `/dashboard`.

8. **Stockage des images** : les images produits sont stockées dans un bucket Supabase nommé `product-images`. Le bucket peut être créé automatiquement au premier upload (avec la clé service role) ou manuellement dans Supabase → Storage → New bucket → nom `product-images`, **Public**.

---

## 3. Stack technique

| Composant | Détail |
|-----------|--------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, Tailwind CSS 4, Motion, Lucide React |
| **Backend / BDD** | Supabase (PostgreSQL, Storage, Realtime) |
| **Auth** | Custom : table `public.users` (email + mot de passe hashé bcrypt), session JWT en cookie HTTP-only (jose), pas de Supabase Auth |
| **Emails** | Resend (notifications de commande) |
| **Assistant dashboard** | Mistral AI (optionnel) |
| **Autres** | bcrypt, jose (JWT), sonner (toasts), clsx / tailwind-merge |

---

## 4. Variables d’environnement et connexion

### 4.1 Fichier utilisé

- En développement : **`.env.local`** (à créer à partir de `env.example`).
- En production : définir les mêmes variables dans l’hébergeur (Vercel, etc.).

### 4.2 Variables obligatoires

| Variable | Description | Où la trouver |
|----------|-------------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase (ex. `https://xxx.supabase.co`) | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme (publique) | Supabase → Project Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé **service_role** (accès total, serveur uniquement) | Supabase → Project Settings → API → service_role. **Ne jamais exposer côté client.** |
| `SESSION_SECRET` | Secret pour signer le JWT de session (min. 32 caractères) | Générer par ex. : `openssl rand -base64 32` |

**Important :** En production, ne pas garder la valeur par défaut de `SESSION_SECRET` fournie dans `env.example`.

### 4.3 Variables optionnelles

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FB_PIXEL_ID` | Facebook / Meta Pixel pour le suivi des conversions et publicités |
| `NEXT_PUBLIC_SITE_URL` | URL de base du site (ex. pour les liens dans les e-mails) |
| `RESEND_API_KEY` | Clé API Resend pour l’envoi d’e-mails (notifications de commande) |
| `EMAIL_FROM` | Adresse d’envoi des e-mails (ex. `Sani Modern <noreply@votredomaine.com>`) |
| `ADMIN_NOTIFICATION_EMAIL` | Adresse qui reçoit les notifications de nouvelle commande (peut aussi être définie dans Paramètres du site) |
| `MISTRAL_API_KEY` | Clé API Mistral pour l’assistant du dashboard ; sans elle, l’assistant peut renvoyer une erreur 503 |

Certaines de ces options peuvent aussi être configurées dans le dashboard (Paramètres → intégrations / site).

### 4.4 Résumé connexion Supabase

1. Créer un projet sur [Supabase](https://supabase.com/dashboard).
2. Aller dans **Project Settings → API**.
3. Copier **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`.
4. Copier **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Copier **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (uniquement dans `.env.local` ou variables serveur, jamais dans le code client).

---

## 5. Authentification

### 5.1 Modèle

- **Pas de Supabase Auth** : l’application utilise une table **`public.users`** avec email et mot de passe hashé (bcrypt, 10 rounds).
- **Rôles** : `customer` ou `admin`. Seuls les comptes **admin** peuvent accéder au dashboard.
- **Inscription** : il n’y a pas d’inscription publique ; la page d’inscription redirige vers la page de connexion. Les comptes sont créés manuellement (SQL ou via un processus interne).

### 5.2 Connexion

- **URL** : `/connexion`.
- **Processus** : l’utilisateur saisit email et mot de passe ; le serveur vérifie les identifiants via la clé **service_role** dans la table `users`, vérifie que `role = 'admin'` pour l’accès dashboard, puis crée une session (JWT dans un cookie HTTP-only) et redirige vers `/dashboard`.
- **Déconnexion** : action qui supprime le cookie de session et redirige vers `/connexion`.

### 5.3 Session

- **Stockage** : cookie nommé `session`, contenu = JWT signé (HS256) avec `SESSION_SECRET`, durée de vie typique 7 jours.
- **Contenu du JWT** : `id`, `email`, `full_name`, `role`.
- **Vérification** : côté serveur, lecture et vérification du JWT dans `lib/session.ts` ; les routes protégées utilisent `requireAuth()` puis vérifient `role === 'admin'` (ex. dans `app/dashboard/layout.tsx`).

### 5.4 Routes protégées

- **Dashboard** (`/dashboard/*`) : protégé par `requireAdmin()` ; en l’absence de session ou si le rôle n’est pas admin, redirection vers `/connexion` ou `/`.

### 5.5 Changement de mot de passe / email

- Disponibles dans le dashboard (paramètres compte) ; ils demandent le mot de passe actuel et mettent à jour la table `public.users` via le client Supabase **service_role**.

---

## 6. Base de données (Supabase)

### 6.1 Ordre des migrations

Exécuter dans le **Supabase SQL Editor** les fichiers de `supabase/migrations/` **dans l’ordre** :

| Migration | Résumé |
|-----------|--------|
| `00001_initial_schema.sql` | Catégories, produits, profils (auth.users), commandes, order_items ; RLS ; trigger profil à l’inscription (legacy). |
| `00002_admins_table.sql` | Table `admins` (email, nom) ; RLS admin. |
| `00003_admin_policies_from_admins_table.sql` | Politiques admin basées sur `public.is_admin()` (admins). |
| `00004_users_table_all_auth.sql` | Table `public.users` (email, password_hash, full_name, role) ; suppression auth Supabase/admins ; orders.user_id → users(id) ; profils(user_id). |
| `00005_orders_wilaya_city.sql` | Champs `shipping_wilaya`, `shipping_city` sur `orders`. |
| `00006_products_price_old.sql` | Champ `price_old_dzd` sur `products`. |
| `00006_product_image_urls.sql` | Champ `image_urls` (jsonb) sur `products`. |
| `00007_realtime_orders.sql` | Ajout de `orders` à la publication Realtime. |
| `00008_site_settings.sql` | Table `site_settings` (id=1, contact, tagline, copyright, seuil livraison gratuite, etc.) + ligne par défaut. |
| `00009_site_settings_admin_email.sql` | Champ `admin_notification_email` dans `site_settings`. |
| `00010_site_settings_integrations.sql` | Champs email_from, site_url, resend_api_key, mistral_api_key. |
| `00011_site_settings_colors.sql` | Champs primary_color, primary_hover_color. |
| `00012_site_content.sql` | Table `site_content` (key, value_fr, value_ar) + clés de contenu. |
| `00013_site_settings_footer.sql` | Champ `footer_sections` (jsonb) dans `site_settings`. |
| `00014_product_variants_and_attributes.sql` | Tables options/variantes/attributs ; order_items.variant_id, variant_label. |
| `00015_site_settings_logo_title.sql` | Champs site_title, logo_url dans site_settings. |
| `00016_site_settings_primary_color.sql` | Assurance que primary_color (et champs liés) existent. |

### 6.2 Tables principales (schéma actuel)

- **users** : id, email, password_hash, full_name, role ('customer'|'admin'), created_at. RLS activé ; accès en pratique via **service_role**.
- **profiles** : user_id (FK users), phone, address, updated_at.
- **categories** : id, name, slug, icon_name, color, bg_color, text_color, sort_order, created_at. RLS : lecture anonyme ; écriture via service_role.
- **products** : id, category_id, name, slug, description, price_dzd, price_old_dzd, image_url, image_urls (jsonb), badge, badge_color, stock, created_at. Même logique RLS.
- **product_option_types**, **product_option_values**, **product_variants**, **product_variant_options**, **product_attributes** : modèle variantes/options/attributs ; RLS en lecture pour tous.
- **orders** : id, user_id (nullable), status (pending|paid|shipped|delivered|cancelled), total_dzd, shipping_*, created_at. RLS : insertion anonyme possible ; lecture/mise à jour via service_role dans l’app.
- **order_items** : order_id, product_id, product_name, quantity, unit_price_dzd, variant_id, variant_label.
- **site_settings** : une seule ligne (id=1) ; contact, thème, footer, intégrations, etc.
- **site_content** : clés de contenu avec value_fr, value_ar.

### 6.3 Création du premier administrateur

**Après** avoir exécuté au moins les migrations 00001 à 00004 :

1. Ouvrir `supabase/admin_setup.sql`.
2. Option A : générer un hash bcrypt en local : `npx bcrypt-cli "VotreMotDePasse" 10` et remplacer dans le script.
3. Option B : utiliser la version SQL avec `crypt('VotreMotDePasse', gen_salt('bf'))` (extension pgcrypto).
4. Remplacer `admin@example.com` par l’email souhaité et exécuter le script dans le SQL Editor.
5. Se connecter sur `/connexion` avec cet email et le mot de passe choisi.

Exemple (Option B) :

```sql
insert into public.users (email, password_hash, full_name, role)
values (
  'votre-email@exemple.com',
  crypt('VotreMotDePasse', gen_salt('bf')),
  'Admin',
  'admin'
)
on conflict (email) do nothing;
```

### 6.4 Stockage (Storage)

- **Bucket** : `product-images` (création manuelle ou automatique au premier upload).
- **Visibilité** : Public pour l’affichage des images sur le site.
- L’application utilise la clé **service_role** pour les uploads depuis le dashboard.

---

## 7. Flux utilisateur principaux

### 7.1 Connexion admin

1. Aller sur `/connexion`.
2. Saisir email et mot de passe d’un compte `users` avec `role = 'admin'`.
3. Soumission → vérification côté serveur → création de session → redirection vers `/dashboard`.

### 7.2 Parcours achat (client)

1. **Accueil** → **Produits** → choix d’une catégorie / filtre.
2. **Fiche produit** : choix des variantes (options/attributs), quantité, ajout au panier (contexte panier + tiroir).
3. **Panier** : récapitulatif dans le tiroir ; lien vers checkout.
4. **Checkout** (`/checkout`) : formulaire (nom, téléphone, wilaya, ville, adresse). Création de la commande (`orders` + `order_items`), envoi optionnel d’un e-mail de notification (Resend).
5. Redirection avec `?success=<orderId>&total=...` ou page de confirmation.
6. **Suivi** : `/suivi` → saisie du numéro de commande → affichage du statut et des infos de livraison.

### 7.3 Dashboard (admin)

- **Layout** : chargement avec `requireAdmin()`, récupération des paramètres et du nombre de commandes en attente.
- **Menu** : Vue d’ensemble, Produits, Commandes, Catégories, Contenu, Analytics, Paramètres, Aide (assistant).
- **Commandes** : liste, détail, mise à jour du statut, export.
- **Produits / Catégories / Contenu / Paramètres** : CRUD et configuration ; uploads vers le bucket `product-images`.

---

## 8. Structure du projet

- **`app/`** : routes et UI (App Router).
  - `(auth)/` : connexion, inscription (redirection).
  - `dashboard/` : layout et pages admin (overview, produits, commandes, catégories, contenu, analytics, paramètres, aide).
  - `api/` : routes API (ex. export commandes, assistant).
  - `checkout/`, `panier/`, `produits/`, `prodit/[id]/`, `suivi/` : pages publiques.
  - `components/` : composants partagés (Nav, Hero, Footer, CartDrawer, ProductCard, etc.).
  - `actions/` : server actions (auth, orders, products, categories, content, settings, upload, variants, shipping).
  - `layout.tsx`, `page.tsx`, `globals.css`.
- **`lib/`** : logique partagée (supabase client/serveur/service/middleware, session, auth, site-settings, site-content, email, product-images, wilayas, types, etc.).
- **`context/`** : CartContext, LanguageContext.
- **`supabase/`** : `migrations/`, `seed.sql`, `admin_setup.sql`.

---

## 9. Déploiement en production

### 9.1 Commandes

- **Développement** : `npm run dev`
- **Build** : `npm run build`
- **Démarrage (production)** : `npm run start`
- **Lint** : `npm run lint`

### 9.2 Variables en production

Définir sur la plateforme (ex. Vercel) :

- **Obligatoires** : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET`.
- **Optionnelles** : `NEXT_PUBLIC_FB_PIXEL_ID`, `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_NOTIFICATION_EMAIL`, `MISTRAL_API_KEY`.

Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` ni `SESSION_SECRET` côté client.

### 9.3 Base de données et admin

- Exécuter toutes les migrations (00001 à 00016) sur la base Supabase de production.
- Exécuter `admin_setup.sql` avec l’email et le mot de passe du premier admin.
- Vérifier que le bucket `product-images` existe et est Public.

### 9.4 Déploiement sur Vercel

- Connecter le dépôt Git à Vercel.
- Configurer les variables d’environnement listées ci-dessus.
- Build command : `npm run build` (ou `next build`).
- Les détails sont dans la [documentation Next.js](https://nextjs.org/docs/app/building-your-application/deploying) et Vercel.

---

## 10. Annexes

### 10.1 Fichiers de référence

- **Auth / session** : `app/actions/auth.ts`, `lib/session.ts`, `lib/auth.ts`
- **Supabase** : `lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/supabase/service.ts`, `lib/supabase/middleware.ts`
- **Connexion** : `app/(auth)/connexion/ConnexionForm.tsx`
- **Dashboard** : `app/dashboard/layout.tsx`, `app/dashboard/page.tsx`
- **Commandes** : `app/actions/orders.ts`, `app/checkout/CheckoutForm.tsx`, `app/suivi/page.tsx`
- **Upload** : `app/actions/upload.ts`
- **Email** : `lib/email.ts`
- **Exemple d’env** : `env.example`

### 10.2 Génération d’un PDF à partir de ce document

- **Option 1** : Ouvrir ce fichier `.md` dans VS Code / Cursor et utiliser une extension « Markdown PDF » pour exporter en PDF.
- **Option 2** : Copier le contenu dans un éditeur en ligne (ex. Google Docs, Notion) puis « Imprimer » → « Enregistrer au format PDF ».
- **Option 3** : Avec Pandoc : `pandoc docs/CLIENT_DOCUMENTATION.md -o docs/CLIENT_DOCUMENTATION.pdf`.
- **Option 4** : Ouvrir le Markdown dans un lecteur qui affiche le rendu (ex. GitHub, VS Code preview) puis imprimer la page en PDF.

---

*Fin du document — Sani Modern, documentation client.*
