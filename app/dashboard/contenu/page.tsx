import { getSiteContent } from "@/lib/site-content";
import { ContentForm } from "./ContentForm";

const EDITABLE_KEYS = [
  { key: "hero_title_image", label: "Hero — titre", section: "hero", longText: false },
  { key: "hero_subtitle_image", label: "Hero — sous-titre", section: "hero", longText: true },
  { key: "collection_title_short", label: "Titre de la collection", section: "collection", longText: false },
  { key: "collection_see_all", label: "Lien « voir tout »", section: "collection", longText: false },
  { key: "collection_btn", label: "Bouton d'action", section: "collection", longText: false },
  { key: "categories_badge", label: "Badge", section: "categories", longText: false },
  { key: "categories_title", label: "Titre", section: "categories", longText: false },
  { key: "categories_subtitle", label: "Sous-titre", section: "categories", longText: true },
  { key: "about_title_full", label: "Titre complet", section: "about", longText: false },
  { key: "about_para1", label: "Paragraphe principal", section: "about", longText: true },
  { key: "products_page_badge", label: "Badge", section: "products", longText: false },
  { key: "products_page_title", label: "Titre", section: "products", longText: false },
  { key: "products_page_subtitle", label: "Sous-titre", section: "products", longText: true },
  { key: "products_page_empty", label: "Message quand vide", section: "products", longText: false },
] as const;

const SECTIONS = [
  { id: "hero", label: "Hero", description: "Section d'en-tête de la page d'accueil" },
  { id: "collection", label: "Collection", description: "Section de la collection vedette" },
  { id: "categories", label: "Catégories", description: "Section des catégories de produits" },
  { id: "about", label: "À propos", description: "Section de présentation de l'entreprise" },
  { id: "products", label: "Page Produits", description: "Textes de la page catalogue produits" },
] as const;

export default async function DashboardContenuPage() {
  const content = await getSiteContent();
  const items = EDITABLE_KEYS.map(({ key, label, section, longText }) => ({
    key,
    label,
    section,
    longText,
    value_fr: content[key]?.value_fr ?? null,
    value_ar: content[key]?.value_ar ?? null,
  }));

  return <ContentForm items={items} sections={SECTIONS as unknown as { id: string; label: string; description: string }[]} />;
}
