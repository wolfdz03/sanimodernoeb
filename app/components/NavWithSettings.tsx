import { getSiteSettings } from "@/lib/site-settings";
import { Nav } from "./Nav";

/** Fetches site settings and passes them to Nav (logo, title). */
export async function NavWithSettings() {
  const settings = await getSiteSettings();
  return <Nav settings={settings} />;
}
