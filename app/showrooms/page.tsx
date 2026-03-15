import { NavWithSettings } from "../components/NavWithSettings";
import { Footer } from "../components/Footer";
import { getSiteSettings } from "@/lib/site-settings";
import { ShowroomsPageContent } from "./ShowroomsPageContent";

export const metadata = {
  title: "Nos Showrooms | Sani Modern OEB",
  description:
    "Venez découvrir notre gamme en showroom. Sani Modern OEB vous accueille à Oum El Bouaghi pour vous conseiller.",
};

export default async function ShowroomsPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <NavWithSettings />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-16">
        <ShowroomsPageContent />
      </main>
      <Footer settings={settings} />
    </>
  );
}
