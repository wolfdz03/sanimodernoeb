"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { LangToggle } from "./LangToggle";
import { CartDrawer } from "./CartDrawer";
import { SearchAutocomplete } from "./SearchAutocomplete";
import type { SiteSettings } from "@/lib/site-settings";

interface NavProps {
  settings?: SiteSettings | null;
}

const navLinkKeys = [
  { key: "nav_products" as const, href: "/produits" },
  { key: "nav_categories" as const, href: "#categories" },
  { key: "nav_about" as const, href: "#about" },
  { key: "nav_contact" as const, href: "#footer" },
];

export function Nav({ settings }: NavProps) {
  const logoUrl = settings?.logo_url?.trim() || "/logo.png";
  const siteTitle = settings?.site_title?.trim() || "Sani Modern OEB";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { t } = useLanguage();
  const { totalItems } = useCart();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleOpenCart = () => setCartOpen(true);
    window.addEventListener("open-cart", handleOpenCart);

    return () => {
      window.removeEventListener("open-cart", handleOpenCart);
    };
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={reduceMotion ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-3 top-3 z-50 h-16 rounded-2xl border border-white/65 bg-white/88 shadow-[0_14px_50px_-28px_rgba(70,22,27,0.45)] backdrop-blur-2xl sm:inset-x-5 lg:inset-x-7"
      >
        <div className="mx-auto flex h-full max-w-[1500px] items-center px-4 sm:px-6 lg:px-8">
            <div className="flex w-full items-center justify-between gap-6">
              <Link href="/" className="flex items-center gap-3 group">
                <Image
                  src={logoUrl}
                  alt={siteTitle}
                  width={220}
                  height={70}
                  className="h-9 w-auto object-contain sm:h-10"
                  priority
                  unoptimized={logoUrl.startsWith("http")}
                />
              </Link>

              <div className="hidden items-center gap-7 lg:flex">
                {navLinkKeys.map((link) =>
                  link.href.startsWith("#") ? (
                    <button
                      key={link.key}
                      onClick={() => handleNavClick(link.href)}
                      className="group relative text-sm font-semibold text-[#514649] transition-colors duration-200 hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
                    >
                      {t(link.key)}
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[var(--primary)] transition-all duration-200 group-hover:w-full" />
                    </button>
                  ) : (
                    <Link
                      key={link.key}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="group relative text-sm font-semibold text-[#514649] transition-colors duration-200 hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
                    >
                      {t(link.key)}
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[var(--primary)] transition-all duration-200 group-hover:w-full" />
                    </Link>
                  )
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <SearchAutocomplete />

                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="relative rounded-xl p-2 text-[var(--text-muted)] transition duration-200 hover:bg-[#fff0f0] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                  aria-label="Voir le panier"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                      {totalItems}
                    </span>
                  )}
                </button>

                <LangToggle />

                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0f0] text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 lg:hidden"
                  aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                  aria-expanded={mobileOpen}
                >
                  {mobileOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#fff8f7] px-6 pt-28 lg:hidden"
          >
            <div className="mb-10">
              <SearchAutocomplete mobile onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="flex flex-col gap-6">
              {navLinkKeys.map((link, index) =>
                link.href.startsWith("#") ? (
                  <motion.button
                    key={link.key}
                    initial={reduceMotion ? false : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleNavClick(link.href)}
                    className="text-[var(--text)] font-bold text-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-lg"
                  >
                    {t(link.key)}
                  </motion.button>
                ) : (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                  >
                    <motion.span
                      initial={reduceMotion ? false : { opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-[var(--text)] font-bold text-2xl block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-lg"
                    >
                      {t(link.key)}
                    </motion.span>
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
