# Contexte application – Sani Modern OEB

Document utilisé par l’assistant du tableau de bord pour répondre aux questions de l’admin sur l’application.

## Site public (visiteurs)

- **/** (accueil) : page d’accueil avec hero, catégories, produits en vedette, à propos, pied de page avec contact.
- **/produits** : liste de tous les produits.
- **/produit/[id]** : fiche d’un produit (détail, prix, images, bouton commander).
- **/panier** : panier d’achat. L’utilisateur peut modifier les quantités et aller au checkout.
- **/checkout** : formulaire de commande (nom, téléphone, wilaya, ville, adresse). Pas de compte client requis. Après validation, la commande est enregistrée.

Les coordonnées affichées en pied de page (téléphone, email, adresse) viennent des **Paramètres** du tableau de bord (section Contact).

## Tableau de bord (admin)

Accès : **/connexion** (email + mot de passe). Réservé aux administrateurs.

- **/dashboard** (Vue d’ensemble) : chiffres (chiffre d’affaires, commandes du jour, en attente, cette semaine), alertes stock faible, dernières commandes, catégories. Bouton « Exporter le rapport » pour télécharger les commandes en CSV. Bouton « Ajouter un produit ».
- **/dashboard/commandes** : liste des commandes avec filtres par statut (toutes, en attente, payée, expédiée, livrée, annulée). Colonnes : date, client, total, statut. Lien « Exporter le rapport » pour CSV. Cliquer sur « Détail » pour une commande.
- **/dashboard/commandes/[id]** : détail d’une commande (infos livraison, boutons pour changer le statut : En attente, Payée, Expédiée, Livrée, Annulée), liste des articles (produit, quantité, prix unitaire).
- **/dashboard/produits** : liste des produits (image, nom, catégorie, prix). Lien « Modifier » vers la fiche produit. Bouton « Ajouter un produit ».
- **/dashboard/produits/nouveau** : formulaire pour créer un produit (nom, slug, catégorie, description, ancien prix, prix, images produit par upload ou URL, badge, stock).
- **/dashboard/produits/[id]** : formulaire pour modifier ou supprimer un produit (mêmes champs que la création).
- **/dashboard/categories** : liste des catégories (ordre, nom, slug). Bouton « Ajouter une catégorie ». Lien « Modifier » pour chaque catégorie.
- **/dashboard/categories/nouveau** : création de catégorie (nom, slug, couleur, icône, ordre).
- **/dashboard/categories/[id]** : modification ou suppression d’une catégorie.
- **/dashboard/parametres** : paramètres du site. Section **Contact** : téléphone, email, adresse, WhatsApp, et **Email pour alertes nouvelles commandes**. Section **Général** : slogan (tagline), texte de copyright, seuil de livraison gratuite (DA). Section **Sécurité** : formulaire pour changer le mot de passe (mot de passe actuel, nouveau, confirmation).
- **/dashboard/aide** : page d’aide avec le guide propriétaire (résumé de l’utilisation du tableau de bord) et l’assistant conversationnel.

## Concepts clés

- **Statuts de commande** : En attente (par défaut), Payée (client a payé), Expédiée (envoi effectué), Livrée (client a reçu), Annulée.
- **Produits** : ont un nom, slug, catégorie, description, prix (et ancien prix optionnel), une ou plusieurs images (upload vers le stockage ou URL), badge optionnel, stock. Les images sont gérées dans le formulaire produit (upload ou collage d’URL).
- **Catégories** : nom, slug, couleur, icône, ordre d’affichage. À créer avant d’assigner des produits à une catégorie.
- **Paramètres du site** : les champs Contact (téléphone, email, adresse, WhatsApp) et le slogan, le copyright sont affichés sur le site public (pied de page, etc.). L’email « alertes nouvelles commandes » reçoit un email à chaque nouvelle commande si l’envoi d’emails est configuré (Resend).

Répondre toujours en français, de façon courte et précise, en indiquant où se trouve la fonctionnalité dans le tableau de bord (menu et chemin ou section).
