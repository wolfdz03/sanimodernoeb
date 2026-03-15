import { NavWithSettings } from "../components/NavWithSettings";
import { Footer } from "../components/Footer";
import { getSiteSettings } from "@/lib/site-settings";
import { GarantiePageContent } from "./GarantiePageContent";

export const metadata = {
  title: "Garantie | Sani Modern OEB",
  description:
    "Conditions de garantie Sani Modern OEB. Garantie fabricant sur nos produits d'équipement sanitaire.",
};

export default async function GarantiePage() {
  const settings = await getSiteSettings();
  return (
    <>
      <NavWithSettings />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-16">
        <GarantiePageContent />
      </main>
      <Footer settings={settings} />
    </>
  );
}
