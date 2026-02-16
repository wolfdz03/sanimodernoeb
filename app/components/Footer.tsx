"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { SiteSettings } from "@/lib/site-settings";

interface FooterProps {
  settings?: SiteSettings | null;
}

export function Footer({ settings }: FooterProps) {
  const { t, lang } = useLanguage();
  const logoUrl = settings?.logo_url?.trim() || "/logo.png";
  const siteTitle = settings?.site_title?.trim() || "Sani Modern OEB";
  const phone = settings?.phone ?? t("footer_phone");
  const email = settings?.email ?? t("footer_email");
  const address = settings?.address ?? t("footer_address");
  const tagline = settings?.tagline ?? t("footer_tagline");
  const copyrightText = settings?.copyright_text ?? t("footer_copyright");
  const sections = settings?.footer_sections ?? [];

  const linkLabel = (link: { label_fr: string; label_ar?: string | null }) =>
    lang === "ar" && link.label_ar ? link.label_ar : link.label_fr;
  const sectionTitle = (s: { title_fr: string; title_ar?: string | null }) =>
    lang === "ar" && s.title_ar ? s.title_ar : s.title_fr;

  return (
    <footer
      id="footer"
      className="bg-white border-t border-[var(--border)] pt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row flex-wrap gap-12 mb-16">
          {/* Brand */}
          <div className="min-w-0 md:max-w-[220px] flex-shrink-0">
            <Link
              href="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-lg"
            >
              <Image
                src={logoUrl}
                alt={siteTitle}
                width={180}
                height={56}
                className="h-10 w-auto object-contain"
                unoptimized={logoUrl.startsWith("http")}
              />
            </Link>
            <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed">
              {tagline}
            </p>
          </div>

          {/* Custom link sections from settings */}
          {sections.map((section, idx) => (
            <div key={idx} className="min-w-0 flex-1 md:min-w-[140px]">
              <h5 className="font-bold text-[var(--text)] mb-6 uppercase text-sm tracking-widest">
                {sectionTitle(section)}
              </h5>
              <ul className="space-y-4 text-sm">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    {link.url.startsWith("http") || link.url.startsWith("#") ? (
                      <a
                        href={link.url}
                        target={link.url.startsWith("http") ? "_blank" : undefined}
                        rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded"
                      >
                        {linkLabel(link)}
                      </a>
                    ) : (
                      <Link
                        href={link.url}
                        className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded"
                      >
                        {linkLabel(link)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="min-w-0 md:max-w-[220px] flex-shrink-0">
            <h5 className="font-bold text-[var(--text)] mb-6 uppercase text-sm tracking-widest">
              {t("footer_contact_title")}
            </h5>
            <ul className="space-y-4 text-sm text-[var(--text-muted)]">
              {phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="hover:text-[var(--primary)] transition-colors"
                  >
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-[var(--primary)] transition-colors"
                  >
                    {email}
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                  <span>{address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
