import Link from "next/link";
import { HelpCircle } from "lucide-react";

export default function DashboardAidePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-bold text-2xl text-[#1E293B] dark:text-white mb-6 flex items-center gap-2">
        <HelpCircle className="w-7 h-7 text-[#13ecec]" />
        Aide
      </h1>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-[#1E293B] dark:text-slate-200">
        <p>
          Ce guide décrit comment utiliser le tableau de bord et le site au quotidien.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-[#1E293B] dark:text-white mt-6 mb-2">
            Qu’est-ce que le site ?
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li><strong>Site public</strong> : vitrine des produits, panier, commande (sans compte client).</li>
            <li><strong>Tableau de bord</strong> : réservé aux administrateurs. Connexion à <strong>/connexion</strong>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1E293B] dark:text-white mt-6 mb-2">
            Connexion
          </h2>
          <ol className="list-decimal pl-6 space-y-1 text-sm">
            <li>Allez sur <strong>/connexion</strong>.</li>
            <li>Saisissez l’email et le mot de passe fournis.</li>
            <li>Vous êtes redirigé vers le tableau de bord.</li>
          </ol>
          <p className="mt-2 text-sm">
            <strong>Mot de passe oublié ?</strong> Contacter le développeur. Une fois connecté, vous pouvez changer votre mot de passe : <Link href="/dashboard/parametres" className="text-teal-700 dark:text-[#13ecec] hover:underline">Paramètres</Link> → section <strong>Sécurité</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1E293B] dark:text-white mt-6 mb-2">
            Travail au quotidien
          </h2>

          <h3 className="text-base font-medium mt-4 mb-1">Commandes</h3>
          <p className="text-sm">
            Menu <strong>Commandes</strong> : liste et détail des commandes. Utilisez les boutons de statut (En attente, Payée, Expédiée, Livrée, Annulée) pour mettre à jour. Export CSV disponible pour la compta.
          </p>

          <h3 className="text-base font-medium mt-4 mb-1">Produits</h3>
          <p className="text-sm">
            Menu <strong>Produits</strong> : ajouter, modifier les produits (nom, catégorie, prix, images, stock). Créez d’abord des <strong>Catégories</strong> si besoin.
          </p>

          <h3 className="text-base font-medium mt-4 mb-1">Paramètres</h3>
          <p className="text-sm">
            Menu <strong>Paramètres</strong> : contact (téléphone, email, adresse), slogan, copyright, seuil livraison gratuite, email pour alertes nouvelles commandes, et changement de mot de passe (Sécurité).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1E293B] dark:text-white mt-6 mb-2">
            Qui contacter ?
          </h2>
          <p className="text-sm">
            Pour tout problème technique ou évolution du site, contacter le développeur ou l’équipe qui gère le projet.
          </p>
        </section>

        <p className="mt-8 text-sm text-slate-600 dark:text-slate-400">
          Utilisez le bouton assistant (en bas à droite) pour poser des questions sur le tableau de bord.
        </p>
      </div>
    </div>
  );
}
