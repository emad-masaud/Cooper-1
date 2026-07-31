import React, { useState, useEffect } from "react";
import { Search as SearchIcon, X, Book, Zap, LayoutGrid, FileText, Car, Home, Briefcase, Wrench, Smartphone, Sofa, ShoppingBag, Baby, PawPrint, Dumbbell, Building2, UtensilsCrossed, Plane, Package, MapPin, Tag, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DevSearchModal from "./DevSearchModal";

const iconMap = {
  Book,
  Zap,
  LayoutGrid,
  FileText,
  Car,
  Home,
  Briefcase,
  Wrench,
  Smartphone,
  Sofa,
  ShoppingBag,
  Baby,
  PawPrint,
  Dumbbell,
  Building2,
  UtensilsCrossed,
  Plane,
  Package,
  MapPin,
  Tag,
  QrCode
};

const POPULAR_LINKS = [
  { label: "Getting Started", href: "/docs/getting-started/", iconName: "Book", localize: false },
  { label: "Features", href: "/features/", iconName: "Zap" },
  { label: "Design System", href: "/design/", iconName: "LayoutGrid" },
  { label: "Blog", href: "/blog/", iconName: "FileText" },
];

export default function Search({ placeholder = "Search...", devModalLabels, lang = "en", variant = "header", popularLinks }) {
  const [open, setOpen] = useState(false);

  // Localize default links
  const localizedLinks = POPULAR_LINKS.map(link => {
    // Return explicit non-localized or external links as is
    if (link.localize === false || link.href.startsWith('http')) {
        return link;
    }
    
    // Otherwise localize
    return {
        ...link,
        href: `/${lang}${link.href}`.replace(/\/+/g, '/')
    };
  });

  // Helper to dynamically load Pagefind assets
  const loadPagefind = async () => {
    if (window.PagefindUI) return;

    return new Promise((resolve, reject) => {
      // 1. Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/pagefind/pagefind-ui.css';
      document.head.appendChild(link);

      // 2. Load JS
      const script = document.createElement('script');
      script.src = '/pagefind/pagefind-ui.js';
      script.async = true;
      script.onload = () => {
        if (window.PagefindUI) resolve(true);
        else reject(new Error('PagefindUI failed to load'));
      };
      script.onerror = () => reject(new Error('Failed to load Pagefind scripts'));
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        if (!open) loadPagefind();
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  useEffect(() => {
    if (open && !import.meta.env.DEV) {
      const initSearch = async () => {
        try {
          await loadPagefind();
          setTimeout(() => {
            if (window.PagefindUI) {
              const container = document.getElementById("search-container");
              if (container) {
                container.innerHTML = "";
                new PagefindUI({ 
                  element: "#search-container", 
                  showSubResults: true,
                  autofocus: true,
                  baseUrl: "/",
                  bundlePath: "/pagefind/",
                  showImages: true,
                  translations: {
                    placeholder: placeholder
                  }
                });
              }
            }
          }, 50);
        } catch (error) {
          console.error('Search initialization failed:', error);
        }
      };
      initSearch();
    }
  }, [open, placeholder]);

  return (
    <>
      {variant === "hero" ? (
        <div className="w-full max-w-xl mx-auto">
          <div
            onClick={() => {
              setOpen(true);
              loadPagefind();
            }}
            className="mt-8 flex items-center gap-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-md cursor-pointer hover:border-primary/50 dark:hover:border-zinc-700 transition-colors"
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <div className={`flex-1 px-4 py-3 ${lang === "ar" ? "text-right" : "text-left"}`}>
              <span className={`block w-full ${lang === "ar" ? "text-right" : "text-left"} text-sm leading-6 text-zinc-500 dark:text-zinc-500`}>
                {placeholder}
              </span>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary/90 text-white p-3 text-sm font-bold shadow-sm transition mx-2"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Popular Links directly below Hero Search */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium">{lang === "ar" ? "روابط شائعة:" : "Popular Links:"}</span>
            {(popularLinks || localizedLinks).map((link) => {
              const IconComponent = iconMap[link.iconName] || Tag;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 text-zinc-750 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-800 transition-colors"
                >
                  <IconComponent size={12} className="text-zinc-400" />
                  <span>
                    {link.label} {link.count !== undefined && `(${link.count})`}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setOpen(true);
            loadPagefind();
          }}
          aria-label={placeholder}
          className="h-10 w-10 flex items-center justify-center rounded-full text-foreground/65 hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 transition-all shadow-xs shrink-0"
        >
          <SearchIcon size={16} />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[1000] flex items-start justify-center p-4 sm:p-6 md:p-20">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 shadow-2xl" 
              onClick={() => setOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-background border border-foreground/20 rounded-xl shadow-2xl ring-1 ring-foreground/20" 
              onClick={(e) => e.stopPropagation()}
            >
              {import.meta.env.DEV ? (
                <DevSearchModal 
                  onClose={() => setOpen(false)} 
                  labels={devModalLabels} 
                  popularLinks={popularLinks}
                  lang={lang}
                />
              ) : (
                <div className="relative">
                  <button 
                    onClick={() => setOpen(false)}
                    className="absolute right-4 top-4 p-2 rounded-xl text-foreground hover:bg-foreground/10 transition-colors z-20"
                    aria-label="Close Search"
                  >
                    <X size={18} />
                  </button>

                  <div className="p-4 pt-10" id="search-container">
                    {/* Pagefind UI will be injected here */}
                  </div>

                  {/* Empty State / Popular Links */}
                  <div className="px-6 pb-8 border-t border-foreground/10">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-4 mt-6">
                      {lang === "ar" ? "روابط شائعة" : "Popular Links"}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                       {(popularLinks || localizedLinks).map((link) => {
                         const IconComponent = iconMap[link.iconName] || Tag;
                         return (
                           <a 
                              key={link.href}
                              href={link.href}
                              className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors border border-foreground/5 group"
                           >
                              <div className="w-8 h-8 rounded-lg bg-background border border-foreground/10 flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
                                 <IconComponent size={16} />
                              </div>
                              <span className="text-sm font-bold text-foreground group-hover:text-primary">
                                {link.label} {link.count !== undefined && `(${link.count})`}
                              </span>
                           </a>
                         );
                       })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
