"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Mail, ArrowUp, Heart } from "lucide-react";
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="footer"
      className="relative bg-gradient-to-b from-slate-50 to-white pt-20 pb-8 overflow-hidden"
    >
      {/* Decorative top divider */}
      <div className="absolute top-0 left-0 right-0">
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
        <div className="h-px mt-px bg-gradient-to-r from-transparent via-[var(--primary)]/10 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row flex-wrap gap-12 mb-16">
          {/* Brand */}
          <div className="min-w-0 md:max-w-[260px] flex-shrink-0">
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

            {/* Social icons placeholder */}
            <div className="flex items-center gap-3 mt-6">
              {["facebook", "instagram", "twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-[var(--primary)] flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
                  aria-label={social}
                >
                  <span className="text-xs font-bold uppercase">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Custom link sections from settings */}
          {sections.map((section, idx) => (
            <div key={idx} className="min-w-0 flex-1 md:min-w-[140px]">
              <h5 className="font-bold text-[var(--text)] mb-6 uppercase text-sm tracking-widest">
                {sectionTitle(section)}
              </h5>
              <ul className="space-y-3.5 text-sm">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    {link.url.startsWith("http") || link.url.startsWith("#") ? (
                      <a
                        href={link.url}
                        target={link.url.startsWith("http") ? "_blank" : undefined}
                        rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded inline-flex items-center gap-1.5 group"
                      >
                        <span className="w-0 h-0.5 bg-[var(--primary)] group-hover:w-3 transition-all duration-300 rounded-full" />
                        {linkLabel(link)}
                      </a>
                    ) : (
                      <Link
                        href={link.url}
                        className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded inline-flex items-center gap-1.5 group"
                      >
                        <span className="w-0 h-0.5 bg-[var(--primary)] group-hover:w-3 transition-all duration-300 rounded-full" />
                        {linkLabel(link)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="min-w-0 md:max-w-[260px] flex-shrink-0">
            <h5 className="font-bold text-[var(--text)] mb-6 uppercase text-sm tracking-widest">
              {t("footer_contact_title")}
            </h5>
            <ul className="space-y-4 text-sm text-[var(--text-muted)]">
              {phone && (
                <li className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-xl bg-[var(--primary-muted)]/60 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary)] transition-colors duration-300">
                    <Phone className="w-4 h-4 text-[var(--primary)] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="hover:text-[var(--primary)] transition-colors font-medium"
                  >
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors duration-300">
                    <Mail className="w-4 h-4 text-blue-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-[var(--primary)] transition-colors font-medium"
                  >
                    {email}
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 transition-colors duration-300">
                    <MapPin className="w-4 h-4 text-emerald-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="font-medium">{address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            {copyrightText}
            <Heart className="w-3 h-3 text-[var(--primary)] inline" />
          </p>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
          >
            <span className="font-medium">Retour en haut</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[var(--primary)] flex items-center justify-center transition-all duration-300">
              <ArrowUp className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
