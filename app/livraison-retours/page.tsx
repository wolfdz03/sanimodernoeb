import { NavWithSettings } from "../components/NavWithSettings";
import { Footer } from "../components/Footer";
import { getSiteSettings } from "@/lib/site-settings";
import { LivraisonRetoursContent } from "./LivraisonRetoursContent";

export const metadata = {
  title: "Livraison & Retours | Sani Modern OEB",
  description:
    "Conditions de livraison et de retour Sani Modern OEB. Livraison dans toute l'Algérie, retours sous 7 jours.",
};

export default async function LivraisonRetoursPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <NavWithSettings />
      <main className="public-page public-enter">
        <LivraisonRetoursContent />
      </main>
      <Footer settings={settings} />
    </>
  );
}
