import { getSiteContent } from "@/lib/site-content";
import { ContentForm } from "./ContentForm";

const EDITABLE_KEYS = [
  { key: "hero_title_image", label: "Hero titre", section: "Page d'accueil" },
  { key: "hero_subtitle_image", label: "Hero sous-titre", section: "Page d'accueil" },
  { key: "collection_title_short", label: "Collection titre", section: "Page d'accueil" },
  { key: "collection_see_all", label: "Collection « voir tout »", section: "Page d'accueil" },
  { key: "collection_btn", label: "Collection bouton", section: "Page d'accueil" },
  { key: "categories_badge", label: "Catégories badge", section: "Page d'accueil" },
  { key: "categories_title", label: "Catégories titre", section: "Page d'accueil" },
  { key: "categories_subtitle", label: "Catégories sous-titre", section: "Page d'accueil" },
  { key: "about_title_full", label: "À propos titre", section: "Page d'accueil" },
  { key: "about_para1", label: "À propos paragraphe", section: "Page d'accueil" },
  { key: "products_page_badge", label: "Produits badge", section: "Page produits" },
  { key: "products_page_title", label: "Produits titre", section: "Page produits" },
  { key: "products_page_subtitle", label: "Produits sous-titre", section: "Page produits" },
  { key: "products_page_empty", label: "Produits vide", section: "Page produits" },
] as const;

export default async function DashboardContenuPage() {
  const content = await getSiteContent();
  const items = EDITABLE_KEYS.map(({ key, label, section }) => ({
    key,
    label,
    section,
    value_fr: content[key]?.value_fr ?? null,
    value_ar: content[key]?.value_ar ?? null,
  }));

  return (
    <div>
      <h1 className="font-bold text-2xl text-[#1E293B] dark:text-white mb-6" title="Modifiez les textes de la page d'accueil et de la page produits. Laissez vide pour utiliser la valeur par défaut.">
        Contenu du site
      </h1>
      <ContentForm items={items} />
    </div>
  );
}
