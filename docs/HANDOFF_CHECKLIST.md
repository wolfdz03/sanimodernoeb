# Checklist de remise (handoff)

À compléter avant ou lors de la remise du site au client.

## Déploiement

- [ ] **Hébergement** : où le site est hébergé (ex. Vercel). URL de production : ________________
- [ ] **Gestion** : qui gère les déploiements et la config (développeur / équipe) : ________________

## Environnement

- [ ] Variables d’environnement en production (voir `env.example`) :
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SESSION_SECRET` (min. 32 caractères, valeur sécurisée)
  - Optionnel : `NEXT_PUBLIC_FB_PIXEL_ID`, `RESEND_API_KEY`, `ADMIN_NOTIFICATION_EMAIL`, `EMAIL_FROM`, `NEXT_PUBLIC_SITE_URL`
- [ ] Le client n’a pas besoin de modifier ces variables ; elles sont gérées côté hébergeur / équipe.

## Supabase

- [ ] Projet Supabase utilisé : ________________
- [ ] Migrations exécutées (00001 à 00009) dans l’ordre.
- [ ] Bucket Storage **product-images** créé et rendu **Public** (pour les images produits).
- [ ] Sauvegardes : gérées par Supabase ; optionnel : exporter les données (commandes, produits) périodiquement.

## Premier administrateur

- [ ] Exécuter `supabase/admin_setup.sql` dans l’éditeur SQL Supabase en remplaçant l’email et le mot de passe par ceux du client.
- [ ] Remettre au client l’URL de connexion (ex. `https://site.com/connexion`) et les identifiants (email + mot de passe temporaire).
- [ ] Indiquer au client comment **changer son mot de passe** : Paramètres → Sécurité.

## Documentation client

- [ ] **Guide propriétaire** : remis au client (lien vers `docs/GUIDE_PROPRIETAIRE.md` ou version PDF).
- [ ] Court passage en revue avec le client : connexion, commandes, produits, paramètres.

## Identifiants et accès

- [ ] Où le client conserve ses identifiants de connexion au tableau de bord : ________________
- [ ] Où l’équipe conserve les accès Supabase / hébergeur (ne pas donner la clé service role ni les secrets au client) : ________________
