import Link from "next/link";
import { HelpCircle } from "lucide-react";

export default function DashboardAidePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-bold text-2xl text-[var(--dash-text-main)] mb-6 flex items-center gap-2">
        <HelpCircle className="w-7 h-7 text-[var(--dash-primary)]" />
        Aide
      </h1>
      <div className="space-y-6 text-[var(--dash-text-main)] text-[15px] leading-relaxed">
        <p>
          Ce guide décrit comment utiliser le tableau de bord et le site au quotidien.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-[var(--dash-text-main)] mt-6 mb-2">
            Qu’est-ce que le site ?
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-sm text-[var(--dash-text-main)]">
            <li><strong>Site public</strong> : vitrine des produits, panier, commande (sans compte client).</li>
            <li><strong>Tableau de bord</strong> : réservé aux administrateurs. Connexion à <strong>/connexion</strong>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--dash-text-main)] mt-6 mb-2">
            Connexion
          </h2>
          <ol className="list-decimal pl-6 space-y-1 text-sm text-[var(--dash-text-main)]">
            <li>Allez sur <strong>/connexion</strong>.</li>
            <li>Saisissez l’email et le mot de passe fournis.</li>
            <li>Vous êtes redirigé vers le tableau de bord.</li>
          </ol>
          <p className="mt-2 text-sm text-[var(--dash-text-main)]">
            <strong>Mot de passe oublié ?</strong> Contacter le développeur. Une fois connecté, vous pouvez changer votre mot de passe : <Link href="/dashboard/parametres" className="text-[var(--dash-primary)] hover:text-[var(--dash-primary-hover)] hover:underline">Paramètres</Link> → section <strong>Sécurité</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--dash-text-main)] mt-6 mb-2">
            Travail au quotidien
          </h2>

          <h3 className="text-base font-medium text-[var(--dash-text-main)] mt-4 mb-1">Commandes</h3>
          <p className="text-sm text-[var(--dash-text-main)]">
            Menu <strong>Commandes</strong> : liste et détail des commandes. Utilisez les boutons de statut (En attente, Payée, Expédiée, Livrée, Annulée) pour mettre à jour. Export CSV disponible pour la compta.
          </p>

          <h3 className="text-base font-medium text-[var(--dash-text-main)] mt-4 mb-1">Produits</h3>
          <p className="text-sm text-[var(--dash-text-main)]">
            Menu <strong>Produits</strong> : ajouter, modifier les produits (nom, catégorie, prix, images, stock). Créez d’abord des <strong>Catégories</strong> si besoin.
          </p>

          <h3 className="text-base font-medium text-[var(--dash-text-main)] mt-4 mb-1">Paramètres</h3>
          <p className="text-sm text-[var(--dash-text-main)]">
            Menu <strong>Paramètres</strong> : contact (téléphone, email, adresse), slogan, copyright, seuil livraison gratuite, email pour alertes nouvelles commandes, et changement de mot de passe (Sécurité).
          </p>

          <h3 className="text-base font-medium text-[var(--dash-text-main)] mt-4 mb-1">Marketing et suivi</h3>
          <p className="text-sm text-[var(--dash-text-main)]">
            Menu <strong>Marketing</strong> : configuration des outils de suivi (Meta Pixel, Google Analytics 4, Google Tag Manager) sans toucher au code. Voir le guide dédié : <Link href="/dashboard/aide/marketing" className="text-[var(--dash-primary)] hover:text-[var(--dash-primary-hover)] hover:underline">Marketing et suivi</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--dash-text-main)] mt-6 mb-2">
            Qui contacter ?
          </h2>
          <p className="text-sm text-[var(--dash-text-main)]">
            Pour tout problème technique ou évolution du site, contacter le développeur ou l’équipe qui gère le projet.
          </p>
        </section>

        <p className="mt-8 text-sm text-[var(--dash-text-muted)]">
          Utilisez le bouton assistant (en bas à droite) pour poser des questions sur le tableau de bord.
        </p>
      </div>
    </div>
  );
}
