# Guide propriétaire – Sani Modern OEB

Ce document décrit comment utiliser le tableau de bord et le site au quotidien.

## Qu’est-ce que le site ?

- **Site public** : vitrine des produits, panier, commande (sans compte client). Les visiteurs peuvent parcourir les produits, ajouter au panier et passer commande en renseignant leurs coordonnées.
- **Tableau de bord (admin)** : réservé aux administrateurs. Connexion à l’adresse **/connexion** (ex. `https://votre-site.com/connexion`).

## Connexion

1. Allez sur **/connexion**.
2. Saisissez l’**email** et le **mot de passe** fournis par le développeur.
3. Vous êtes redirigé vers le tableau de bord.

**Mot de passe oublié ?** Contacter le développeur ou l’équipe technique pour réinitialisation. Vous pouvez aussi changer vous-même le mot de passe une fois connecté : **Paramètres** → section **Sécurité** → **Changer le mot de passe**.

## Travail au quotidien

### Commandes

- Menu **Commandes** : liste de toutes les commandes.
- Cliquez sur une commande pour voir le détail (client, adresse, articles, total).
- **Statuts** : utilisez les boutons pour mettre à jour le statut :
  - **En attente** : commande reçue, pas encore traitée.
  - **Payée** : le client a réglé.
  - **Expédiée** : commande envoyée.
  - **Livrée** : le client a reçu.
  - **Annulée** : commande annulée.
- Vous pouvez **exporter les commandes** en CSV (bouton « Exporter le rapport ») pour la compta ou les archives.

### Produits

- Menu **Produits** : liste des produits. **Ajouter un produit** pour en créer un.
- Pour chaque produit : nom, catégorie, prix, description, **images** (upload ou URL), badge optionnel, stock.
- Créez d’abord des **Catégories** si besoin (menu **Catégories**).

### Paramètres

- Menu **Paramètres** : informations affichées en bas du site public et options.
  - **Contact** : téléphone, email, adresse, WhatsApp. Ces infos apparaissent dans le pied de page.
  - **Général** : slogan du site, texte de copyright, seuil de livraison gratuite (en DA).
  - **Email pour alertes nouvelles commandes** : si renseigné (et si l’envoi d’emails est configuré), vous recevrez un email à chaque nouvelle commande.
  - **Sécurité** : changer votre mot de passe (mot de passe actuel + nouveau + confirmation).

## Qui contacter ?

Pour tout problème technique, bug ou évolution du site (nouvelle fonctionnalité, modification), contacter le **développeur** ou l’équipe qui gère le projet. Les identifiants de connexion et la configuration (hébergement, base de données) sont gérés par cette équipe.
