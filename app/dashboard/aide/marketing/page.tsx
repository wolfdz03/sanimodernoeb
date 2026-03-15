import Link from "next/link";
import { Megaphone, ArrowLeft } from "lucide-react";

export default function DashboardAideMarketingPage() {
  return (
    <div className="max-w-3xl">
      <Link
        href="/dashboard/aide"
        className="inline-flex items-center gap-2 text-sm text-[var(--dash-text-muted)] hover:text-[var(--dash-primary)] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à Aide
      </Link>
      <h1 className="font-bold text-2xl text-[var(--dash-text-main)] mb-6 flex items-center gap-2">
        <Megaphone className="w-7 h-7 text-[var(--dash-primary)]" />
        Marketing et suivi
      </h1>
      <div className="space-y-6 text-[var(--dash-text-main)] text-[15px] leading-relaxed">
        <p>
          Cette page explique comment configurer les outils de suivi (pixels et analytics) depuis le tableau de bord, sans modifier le code.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-[var(--dash-text-main)] mt-6 mb-2">
            Où configurer les IDs ?
          </h2>
          <p className="text-sm text-[var(--dash-text-main)]">
            Allez dans <Link href="/dashboard/marketing" className="text-[var(--dash-primary)] hover:text-[var(--dash-primary-hover)] hover:underline">Dashboard → Marketing</Link>. Vous y trouverez trois champs et un interrupteur&nbsp;:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm text-[var(--dash-text-main)] mt-2">
            <li><strong>Meta Pixel ID</strong> : copiez l’identifiant du pixel depuis le Gestionnaire d’événements Meta (Facebook). Format numérique (ex. 1234567890123456).</li>
            <li><strong>Google Analytics 4 – Measurement ID</strong> : dans GA4, Admin → Flux de données → votre flux → Identifiant de mesure (ex. G-XXXXXXXXXX).</li>
            <li><strong>Google Tag Manager – Container ID</strong> : dans GTM, l’ID du conteneur (ex. GTM-XXXXXXX).</li>
            <li><strong>Activer le suivi</strong> : si désactivé, aucun script de suivi n’est chargé sur le site (utile pour tests ou conformité).</li>
          </ul>
          <p className="mt-2 text-sm text-[var(--dash-text-main)]">
            Enregistrez le formulaire. Les scripts ne sont chargés que si le suivi est activé et que l’ID correspondant est renseigné.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--dash-text-main)] mt-6 mb-2">
            Quels événements sont envoyés ?
          </h2>
          <p className="text-sm text-[var(--dash-text-main)]">
            Le site envoie automatiquement les événements e-commerce suivants vers Meta et GA4 (et dans le dataLayer pour GTM)&nbsp;:
          </p>
          <table className="w-full text-sm text-[var(--dash-text-main)] border border-[var(--dash-border)] rounded-lg overflow-hidden mt-2">
            <thead>
              <tr className="bg-[var(--dash-surface)]">
                <th className="text-left p-2 border-b border-[var(--dash-border)] font-semibold">Événement</th>
                <th className="text-left p-2 border-b border-[var(--dash-border)] font-semibold">Meta</th>
                <th className="text-left p-2 border-b border-[var(--dash-border)] font-semibold">GA4</th>
                <th className="text-left p-2 border-b border-[var(--dash-border)] font-semibold">Déclencheur</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b border-[var(--dash-border)]">Vue produit</td>
                <td className="p-2 border-b border-[var(--dash-border)]">ViewContent</td>
                <td className="p-2 border-b border-[var(--dash-border)]">view_item</td>
                <td className="p-2 border-b border-[var(--dash-border)]">Page produit (/produit/[id])</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-[var(--dash-border)]">Ajout au panier</td>
                <td className="p-2 border-b border-[var(--dash-border)]">AddToCart</td>
                <td className="p-2 border-b border-[var(--dash-border)]">add_to_cart</td>
                <td className="p-2 border-b border-[var(--dash-border)]">Clic « Ajouter au panier »</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-[var(--dash-border)]">Début du checkout</td>
                <td className="p-2 border-b border-[var(--dash-border)]">InitiateCheckout</td>
                <td className="p-2 border-b border-[var(--dash-border)]">begin_checkout</td>
                <td className="p-2 border-b border-[var(--dash-border)]">Page checkout (/checkout)</td>
              </tr>
              <tr>
                <td className="p-2">Achat</td>
                <td className="p-2">Purchase</td>
                <td className="p-2">purchase</td>
                <td className="p-2">Page de succès après commande (?success=...)</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-sm text-[var(--dash-text-main)]">
            Chaque événement envoie notamment : product_id, product_name, category, variant, price, currency (DZD), quantity, order_value selon le cas.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--dash-text-main)] mt-6 mb-2">
            Comment vérifier que le suivi fonctionne ?
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-sm text-[var(--dash-text-main)]">
            <li><strong>Meta</strong> : Gestionnaire d’événements Meta → Test des événements (ou « Test des événements » dans Paramètres du pixel). Visitez le site et effectuez des actions (voir un produit, ajouter au panier, etc.).</li>
            <li><strong>Google Analytics 4</strong> : Rapport en temps réel (Temps réel). Ouvrez le site dans un onglet, naviguez et vérifiez les événements (view_item, add_to_cart, begin_checkout, purchase).</li>
            <li><strong>Google Tag Assistant</strong> : Installez l’extension Tag Assistant (Chrome). Chargez le site et ouvrez l’extension pour voir les tags déclenchés (GTM, GA4, Meta si présents).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--dash-text-main)] mt-6 mb-2">
            En cas de problème
          </h2>
          <p className="text-sm text-[var(--dash-text-main)]">
            Vérifiez que le suivi est activé dans <Link href="/dashboard/marketing" className="text-[var(--dash-primary)] hover:text-[var(--dash-primary-hover)] hover:underline">Marketing</Link>, que les IDs sont corrects (sans espaces en trop), et que vous testez sur le site en production ou en préproduction avec les scripts chargés. Pour les blocages de cookies ou pare-feu, les outils peuvent ne pas recevoir les événements ; dans ce cas, les tests en navigation privée ou avec les extensions désactivées peuvent aider.
          </p>
        </section>
      </div>
    </div>
  );
}
