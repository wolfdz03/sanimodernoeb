import { NavWithSettings } from "../components/NavWithSettings";
import { Footer } from "../components/Footer";
import { getSiteSettings } from "@/lib/site-settings";
import { FAQPageContent } from "./FAQPageContent";

export const metadata = {
  title: "FAQ | Sani Modern OEB",
  description:
    "Questions fréquentes : livraison, retours, suivi de commande. Sani Modern OEB, équipement sanitaire.",
};

export default async function FAQPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <NavWithSettings />
      <main className="public-page public-enter">
        <FAQPageContent />
      </main>
      <Footer settings={settings} />
    </>
  );
}
