"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Search } from "lucide-react";
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
                      className="text-[var(--text-muted)] hover:text-[var(--primary)] font-medium text-sm transition-colors duration-300 relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-md"
                    >
                      {t(link.key)}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary)] group-hover:w-full transition-all duration-300" />
                    </button>
                  ) : (
                    <Link
                      key={link.key}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-[var(--text-muted)] hover:text-[var(--primary)] font-medium text-sm transition-colors duration-300 relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-md"
                    >
                      {t(link.key)}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary)] group-hover:w-full transition-all duration-300" />
                    </Link>
                  )
                )}
              </div>

              <div className="flex items-center gap-3">
                <LangToggle />
                <button className="hidden sm:flex w-10 h-10 rounded-xl bg-[#E2E8F0] hover:bg-[#CBD5E1] items-center justify-center text-[var(--text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">
                  <Search className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden w-10 h-10 rounded-xl bg-[#E2E8F0] flex items-center justify-center text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
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
                      initial={{ opacity: 0, x: -20 }}
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
    </>
  );
}
