"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const navLinks = [
  { key: "nav_products" as const, href: "/produits" },
  { key: "footer_showrooms" as const, href: "#" },
  { key: "nav_about" as const, href: "#about" },
  { key: "nav_contact" as const, href: "#footer" },
];

const supportLinks = [
  { key: "footer_delivery_returns" as const, href: "#" },
  { key: "footer_faq" as const, href: "#" },
  { key: "footer_guarantee" as const, href: "#" },
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      id="footer"
      className="bg-white border-t border-[var(--border)] pt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-lg"
            >
              <Image
                src="/logo.png"
                alt="Sani Modern OEB"
                width={180}
                height={56}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed">
              {t("footer_tagline")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h5 className="font-bold text-[var(--text)] mb-6 uppercase text-sm tracking-widest">
              {t("footer_nav_title")}
            </h5>
            <ul className="space-y-4 text-sm">
              {navLinks.map((item) =>
                item.href.startsWith("#") ? (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded"
                    >
                      {t(item.key)}
                    </a>
                  </li>
                ) : (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded"
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="font-bold text-[var(--text)] mb-6 uppercase text-sm tracking-widest">
              {t("footer_support_title")}
            </h5>
            <ul className="space-y-4 text-sm">
              {supportLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-bold text-[var(--text)] mb-6 uppercase text-sm tracking-widest">
              {t("footer_contact_title")}
            </h5>
            <ul className="space-y-4 text-sm text-[var(--text-muted)]">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                <a
                  href={`tel:${t("footer_phone").replace(/\s/g, "")}`}
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  {t("footer_phone")}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                <span>{t("footer_address")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            {t("footer_copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
