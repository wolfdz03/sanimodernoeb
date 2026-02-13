import { getSiteSettings } from "@/lib/site-settings";

function hexToRgba(hex: string, alpha: number): string {
  const m = hex.slice(1).match(/.{2}/g);
  if (!m) return `rgba(220, 38, 38, ${alpha})`;
  const [r, g, b] = m.map((x) => parseInt(x, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export async function ThemeStyles() {
  const settings = await getSiteSettings();
  const primary = settings.primary_color ?? "#DC2626";
  const hover = settings.primary_hover_color ?? "#B91C1C";
  const muted = hexToRgba(primary, 0.15);
  const subtle = hexToRgba(primary, 0.08);

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root {
  --primary: ${primary};
  --primary-hover: ${hover};
  --primary-muted: ${muted};
  --primary-subtle: ${subtle};
}`,
      }}
    />
  );
}
