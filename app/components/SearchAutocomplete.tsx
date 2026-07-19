"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Search } from "lucide-react";

interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  priceDzd: number;
  imageUrl: string | null;
  category: string | null;
}

interface SearchAutocompleteProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function SearchAutocomplete({ mobile = false, onNavigate }: SearchAutocompleteProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setSuggestions([]);
      setLoading(false);
      setOpen(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setOpen(true);
      try {
        const response = await fetch(`/api/search-suggestions?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as { suggestions?: SearchSuggestion[] };
        setSuggestions(data.suggestions ?? []);
        setActiveIndex(-1);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 120);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const navigateToSearch = () => {
    const term = query.trim();
    router.push(term ? `/produits?search=${encodeURIComponent(term)}` : "/produits");
    setOpen(false);
    onNavigate?.();
  };

  const navigateToProduct = (suggestion: SearchSuggestion) => {
    router.push(`/produit/${suggestion.slug || suggestion.id}`);
    setOpen(false);
    onNavigate?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1
      );
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      navigateToProduct(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${mobile ? "w-full" : "hidden w-[clamp(13rem,18vw,18rem)] xl:block"}`}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          navigateToSearch();
        }}
        className={`group flex items-center rounded-xl border border-[#eadfe1] bg-white shadow-inner shadow-red-950/[0.025] transition-all duration-200 focus-within:border-[var(--primary)] focus-within:shadow-[0_8px_24px_-14px_rgba(220,38,38,0.7)] focus-within:ring-3 focus-within:ring-[var(--primary)]/10 ${mobile ? "h-14 p-1.5" : "h-11"}`}
        role="search"
      >
        <Search className="ml-3 h-4 w-4 shrink-0 text-[#938588] transition-colors duration-200 group-focus-within:text-[var(--primary)]" />
        <input
          type="text"
          inputMode="search"
          role="combobox"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher un produit…"
          className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-sm text-[var(--text)] outline-none placeholder:text-[#938588]"
          aria-label="Rechercher des produits"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={open}
          aria-activedescendant={activeIndex >= 0 ? `search-suggestion-${activeIndex}` : undefined}
        />
        <button
          type="submit"
          className={`mr-1 flex shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-white transition duration-200 hover:bg-[var(--primary-hover)] active:scale-95 ${mobile ? "h-11 w-11" : "h-8 w-8"}`}
          aria-label="Rechercher"
        >
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </button>
      </form>

      <AnimatePresence>
        {open && (
          <motion.div
            id="search-suggestions"
            role="listbox"
            initial={reduceMotion ? false : { opacity: 0, y: -7, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5, scale: 0.99 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute top-[calc(100%+0.65rem)] z-[70] overflow-hidden rounded-2xl border border-[#eedfe1] bg-white/98 p-2 shadow-[0_24px_70px_-28px_rgba(70,22,27,0.42)] backdrop-blur-xl ${mobile ? "inset-x-0" : "right-0 w-[25rem]"}`}
          >
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
                Suggestions
              </span>
              {!loading && suggestions.length > 0 && (
                <span className="text-xs text-[var(--text-muted)]">{suggestions.length} résultats</span>
              )}
            </div>

            {loading ? (
              <div className="space-y-1 p-1" aria-label="Recherche en cours">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="flex animate-pulse items-center gap-3 rounded-xl p-2">
                    <div className="h-14 w-14 rounded-xl bg-[#f6eaec]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 rounded bg-[#f2e3e5]" />
                      <div className="h-3 w-1/3 rounded bg-[#f7edef]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    id={`search-suggestion-${index}`}
                    role="option"
                    aria-selected={activeIndex === index}
                    key={suggestion.id}
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => navigateToProduct(suggestion)}
                    className={`group/item flex w-full items-center gap-3 rounded-xl p-2 text-left transition duration-150 ${activeIndex === index ? "bg-[#fff0f0]" : "hover:bg-[#fff6f6]"}`}
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#f0e2e4] bg-[#fff1f1]">
                      <Image
                        src={suggestion.imageUrl || "/placeholder-product.png"}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover transition-transform duration-200 group-hover/item:scale-105"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      {suggestion.category && (
                        <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--primary)]">
                          {suggestion.category}
                        </span>
                      )}
                      <span className="mt-0.5 block truncate text-sm font-semibold text-[var(--text)]">
                        {suggestion.name}
                      </span>
                      <span className="mt-1 block text-sm font-bold text-[var(--primary)]">
                        {suggestion.priceDzd.toLocaleString("fr-DZ")} DA
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-[#b7a6a9] opacity-0 transition-all duration-150 group-hover/item:translate-x-0 group-hover/item:text-[var(--primary)] group-hover/item:opacity-100 rtl:rotate-180" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-7 text-center">
                <p className="text-sm font-semibold text-[var(--text)]">Aucun produit trouvé</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">Essayez un nom ou une catégorie.</p>
              </div>
            )}

            <button
              type="button"
              onClick={navigateToSearch}
              className="group/all mt-2 flex w-full items-center justify-between border-t border-[#f0e2e4] px-3 py-3 text-left text-sm font-bold text-[var(--text)] transition-colors hover:text-[var(--primary)]"
            >
              <span className="truncate">Voir tous les résultats pour « {query.trim()} »</span>
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover/all:translate-x-1 rtl:rotate-180 rtl:group-hover/all:-translate-x-1" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
