"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { LangToggle } from "./LangToggle";

const navLinkKeys = [
  { key: "nav_products" as const, href: "/produits" },
  { key: "nav_categories" as const, href: "#categories" },
  { key: "nav_about" as const, href: "#about" },
  { key: "nav_contact" as const, href: "#footer" },
  { key: "nav_login" as const, href: "/connexion" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div
            className={`px-6 py-3 transition-all duration-500 ${
              scrolled
                ? "bg-white/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] rounded-2xl"
                : "bg-white/80 backdrop-blur-sm rounded-2xl"
            }`}
          >
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <Image
                  src="/logo.png"
                  alt="SaniModern OEB"
                  width={220}
                  height={70}
                  className="h-12 sm:h-14 w-auto object-contain"
                  priority
                />
              </Link>

              <div className="hidden md:flex items-center gap-8">
                {navLinkKeys.map((link) =>
                  link.href.startsWith("#") ? (
                    <button
                      key={link.key}
                      onClick={() => handleNavClick(link.href)}
                      className="text-[#475569] hover:text-[#DC2626] font-medium text-sm transition-colors duration-300 relative group"
                    >
                      {t(link.key)}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#DC2626] group-hover:w-full transition-all duration-300" />
                    </button>
                  ) : (
                    <Link
                      key={link.key}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-[#475569] hover:text-[#DC2626] font-medium text-sm transition-colors duration-300 relative group"
                    >
                      {t(link.key)}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#DC2626] group-hover:w-full transition-all duration-300" />
                    </Link>
                  )
                )}
              </div>

              <div className="flex items-center gap-3">
                <LangToggle />
                <button className="hidden sm:flex w-10 h-10 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] items-center justify-center text-[#475569] transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <Link
                  href="/panier"
                  className="relative hidden sm:flex w-10 h-10 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] items-center justify-center text-white transition-colors shadow-lg shadow-blue-500/30"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#DC2626] text-white text-xs font-bold flex items-center justify-center">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-[#475569]"
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
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinkKeys.map((link, index) =>
                link.href.startsWith("#") ? (
                  <motion.button
                    key={link.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleNavClick(link.href)}
                    className="text-[#1E293B] font-bold text-2xl text-left"
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
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-[#1E293B] font-bold text-2xl block"
                    >
                      {t(link.key)}
                    </motion.span>
                  </Link>
                )
              )}
              <Link href="/panier">
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 px-8 py-4 rounded-xl bg-[#DC2626] text-white font-semibold w-fit"
                >
                  {t("nav_cart")} {totalItems > 0 ? `(${totalItems})` : ""}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
