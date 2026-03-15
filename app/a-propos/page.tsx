import { NavWithSettings } from "../components/NavWithSettings";
import { Footer } from "../components/Footer";
import { getSiteSettings } from "@/lib/site-settings";
import { AboutPageContent } from "./AboutPageContent";

export const metadata = {
  title: "À propos | Sani Modern OEB",
  description:
    "Sani Modern OEB, votre partenaire de confiance pour l'équipement sanitaire et les salles de bain en Algérie. Qualité, innovation et service.",
};

export default async function AProposPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <NavWithSettings />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-16">
        <AboutPageContent />
      </main>
      <Footer settings={settings} />
    </>
  );
}
