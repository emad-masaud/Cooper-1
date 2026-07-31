import React from "react";
import { Search as SearchIcon, ExternalLink, Tag, Book, Zap, LayoutGrid, FileText, Car, Home, Briefcase, Wrench, Smartphone, Bed, Shirt, MapPin } from "lucide-react";

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
  Bed,
  Shirt,
  MapPin,
  Tag
};

export default function DevSearchModal({ onClose, labels, popularLinks, lang = "en" }) {
  const POPULAR_LINKS = [
    { label: "Getting Started", href: "/docs/getting-started/", iconName: "Book", localize: false },
    { label: "Features", href: "/features/", iconName: "Zap" },
    { label: "Design System", href: "/design/", iconName: "LayoutGrid" },
    { label: "Blog", href: "/blog/", iconName: "FileText" },
  ];

  const localizedLinks = POPULAR_LINKS.map(link => {
    if (link.localize === false || link.href.startsWith('http')) {
        return link;
    }
    return {
        ...link,
        href: `/${lang}${link.href}`.replace(/\/+/g, '/')
    };
  });

  return (
    <div className="p-8 sm:p-12 text-center flex flex-col items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2 ring-8 ring-primary/5">
        <SearchIcon className="text-primary w-10 h-10" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold tracking-tight">{labels?.title || "Search is a Production Superpower! 🚀"}</h3>
        <p className="text-foreground/60 max-w-sm mx-auto leading-relaxed">
          {labels?.description || "To enable our lightning-fast search, Pagefind needs a static build index. Run the following command to see it in action:"}
        </p>
      </div>

      <div className="w-full bg-foreground/5 p-4 rounded-xl border border-foreground/5 font-mono text-sm relative group overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <code className="relative z-10 text-primary font-bold">npm run build</code>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button
            onClick={onClose}
            className="px-8 py-3 bg-primary text-white rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all text-sm font-semibold active:scale-95"
        >
            {labels?.gotIt || "Got it, thanks!"}
        </button>
        <a 
            href="https://pagefind.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-3 bg-foreground/5 text-foreground/70 rounded-xl hover:bg-foreground/10 transition-all text-sm font-semibold flex items-center justify-center gap-2"
        >
            {labels?.doc || "Documentation"} <ExternalLink size={14} />
        </a>
      </div>

      <div className="w-full border-t border-foreground/10 pt-6 text-left">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-4">
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
  );
}
