import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, MapPin, Tag, SlidersHorizontal, MessageSquare, ExternalLink,
  Car, Building2, Briefcase, Wrench, Smartphone, Armchair, 
  Shirt, Baby, Dog, Trophy, Factory, Utensils, Plane, Package, Map
} from 'lucide-react';
import { categoriesStructure } from '~/utils/categories';
import { siteConfig } from '~/site.config';
import { useTranslations } from '~/i18n/utils';

interface AdItem {
  id: string;
  title: string;
  price: number;
  categoryKey: string;
  categoryEn: string;
  categoryAr: string;
  cityKey?: string;
  cityEn?: string;
  cityAr?: string;
  image: string;
  sellerPhone: string;
  descriptionEn: string;
  descriptionAr: string;
  titleEn: string;
  titleAr: string;
}

interface ReactAdBannerProps {
  lang: string;
  className?: string;
}

function ReactAdBanner({ lang, className }: ReactAdBannerProps) {
  const isAr = lang === 'ar';
  const t = useTranslations(lang);
  const bannerConfig = siteConfig.banners?.inFeedMarketplace;
  const bannersEnabled = siteConfig.banners?.enabled;

  if (!bannersEnabled || !bannerConfig) return null;

  const { type, imageAr, imageEn, titleAr, titleEn, link, html, adsense } = bannerConfig;
  const langContent = isAr
    ? { image: imageAr, title: titleAr }
    : { image: imageEn, title: titleEn };
  const { image, title } = langContent;
  const targetLink = link ? (link.startsWith('http') ? link : `/${lang}${link}`) : '#';

  return (
    <div className={`overflow-hidden transition-all duration-300 w-full ${className || ''}`}>
      {type === 'custom_image' && image && (
        <a 
          href={targetLink}
          className="group relative block w-full overflow-hidden rounded-3xl border border-zinc-200/50 bg-white/40 p-5 shadow-xs transition-all duration-300 hover:border-zinc-300/80 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900/40"
        >
          <div className="absolute inset-0 bg-linear-to-tr from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 space-y-2 text-center sm:text-right">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary dark:bg-primary/20 dark:text-primary-foreground">
                {t['ad.banner.sponsored']}
              </span>
              {title && (
                <h4 className="text-sm md:text-base font-bold text-zinc-900 dark:text-white leading-snug">
                  {title}
                </h4>
              )}
            </div>
            {image && (
              <div className="relative w-full sm:w-48 aspect-video overflow-hidden rounded-full border border-zinc-200/20 shadow-xs">
                <img 
                  src={image} 
                  alt={title || 'Ad Banner'} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </a>
      )}

      {type === 'custom_html' && html && (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      )}

      {type === 'google_adsense' && adsense?.client && adsense?.slot && (
        <div className="flex flex-col items-center justify-center p-4 rounded-3xl border border-zinc-200/30 bg-zinc-50/50 dark:border-zinc-800/30 dark:bg-zinc-950/50 min-h-25 text-center">
          <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
            {t['ad.banner.advertisement']}
          </span>
          <ins 
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center' }}
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client={adsense.client}
            data-ad-slot={adsense.slot}
          ></ins>
        </div>
      )}
    </div>
  );
}

interface AdFiltersProps {
  ads: AdItem[];
  lang: string;
}

const getCategoryIcon = (categoryKey: string) => {
  const parentGroup = categoriesStructure.find(g => g.children.some(c => c.key === categoryKey));
  const groupKey = parentGroup ? parentGroup.key : 'buy-sell-misc';

  switch (groupKey) {
    case 'cars': return Car;
    case 'real-estate': return Building2;
    case 'jobs': return Briefcase;
    case 'services': return Wrench;
    case 'electronics': return Smartphone;
    case 'home-furniture': return Armchair;
    case 'fashion-beauty': return Shirt;
    case 'mother-baby': return Baby;
    case 'pets-animals': return Dog;
    case 'sports-hobbies': return Trophy;
    case 'business-industry': return Factory;
    case 'food-home-kitchens': return Utensils;
    case 'travel-tourism': return Plane;
    case 'places-venues': return Map;
    default: return Package;
  }
};

const getCategoryGradient = (categoryKey: string) => {
  const parentGroup = categoriesStructure.find(g => g.children.some(c => c.key === categoryKey));
  const groupKey = parentGroup ? parentGroup.key : 'buy-sell-misc';

  switch (groupKey) {
    case 'cars': return 'from-blue-500 to-cyan-400';
    case 'real-estate': return 'from-emerald-500 to-teal-400';
    case 'jobs': return 'from-indigo-500 to-purple-500';
    case 'services': return 'from-orange-500 to-amber-400';
    case 'electronics': return 'from-slate-700 to-zinc-500';
    case 'home-furniture': return 'from-rose-500 to-pink-400';
    case 'fashion-beauty': return 'from-fuchsia-500 to-purple-400';
    case 'mother-baby': return 'from-pink-400 to-rose-300';
    case 'pets-animals': return 'from-yellow-500 to-orange-400';
    case 'sports-hobbies': return 'from-green-500 to-emerald-400';
    case 'business-industry': return 'from-gray-600 to-slate-500';
    case 'food-home-kitchens': return 'from-red-500 to-orange-500';
    case 'travel-tourism': return 'from-sky-500 to-blue-400';
    case 'places-venues': return 'from-violet-500 to-fuchsia-500';
    default: return 'from-zinc-400 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600';
  }
};

export default function AdFilters({ ads, lang }: AdFiltersProps) {
  const isAr = lang === 'ar';
  const t = useTranslations(lang);

  const formatPrice = (price: number) => {
    let locale = 'en-US';
    if (isAr) locale = 'ar-SA';
    const formattedAmount = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0
    }).format(price);
    if (isAr) return `${formattedAmount} ⃁`;
    return `⃁ ${formattedAmount}`;
  };
  
  // State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');

  // Load initial filter states from URL search params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      const city = params.get('city');
      const q = params.get('q');
      if (cat) setSelectedCategory(cat);
      if (city) setSelectedCity(city);
      if (q) setSearch(q);
    }
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const keys = new Set<string>();
    const list: { key: string; label: string }[] = [];
    ads.forEach(ad => {
      if (!keys.has(ad.categoryKey)) {
        keys.add(ad.categoryKey);
        list.push({
          key: ad.categoryKey,
          label: isAr ? ad.categoryAr : ad.categoryEn
        });
      }
    });
    return list;
  }, [ads, isAr]);

  // Extract unique cities
  const cities = useMemo(() => {
    const list = new Set<string>();
    ads.forEach(ad => {
      const city = ad.cityAr || ad.cityEn || ad.cityKey;
      if (city) {
        list.add(city.trim());
      }
    });
    return Array.from(list);
  }, [ads]);

  // Filtered ads
  const filteredAds = useMemo(() => {
    return ads.filter(ad => {
      const matchesSearch = 
        ad.title.toLowerCase().includes(search.toLowerCase()) ||
        (isAr ? ad.descriptionAr : ad.descriptionEn).toLowerCase().includes(search.toLowerCase());
      
      let matchesCategory = false;
      if (selectedCategory === 'all') {
        matchesCategory = true;
      } else if (ad.categoryKey === selectedCategory) {
        matchesCategory = true;
      } else {
        const group = categoriesStructure.find(g => g.key === selectedCategory);
        if (group) {
          matchesCategory = group.children.some(child => child.key === ad.categoryKey);
        }
      }
      
      const adCity = ad.cityAr || ad.cityEn || ad.cityKey || '';
      const matchesCity = selectedCity === 'all' || adCity.trim() === selectedCity.trim();

      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [ads, search, selectedCategory, selectedCity, isAr]);

  return (
    <div className="space-y-8">
      {/* Filter controls panel */}
      <div className="rounded-3xl border border-zinc-200/50 bg-white/40 p-6 shadow-xs backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/40">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* Search input */}
          <div className="relative">
            <label className="block text-xs font-semibold text-zinc-500 mb-2 dark:text-zinc-400">
              {t['ad.filters.search.label']}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={t['ad.filters.search.placeholder']}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-full border border-zinc-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950/80 dark:focus:border-zinc-600"
              />
              <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-zinc-400" />
            </div>
          </div>

          {/* Category select */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-2 dark:text-zinc-400">
              {t['ad.filters.category.label']}
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full rounded-full border border-zinc-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm appearance-none outline-hidden focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950/80 dark:focus:border-zinc-600"
              >
                <option value="all">{t['ad.filters.category.all']}</option>
                {categories.map(cat => (
                  <option key={cat.key} value={cat.key}>{cat.label}</option>
                ))}
              </select>
              <Tag className="absolute left-3 top-3 h-4.5 w-4.5 text-zinc-400" />
            </div>
          </div>

          {/* City select */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-2 dark:text-zinc-400">
              {t['ad.filters.city.label']}
            </label>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="w-full rounded-full border border-zinc-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm appearance-none outline-hidden focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950/80 dark:focus:border-zinc-600"
              >
                <option value="all">{t['ad.filters.city.all']}</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <MapPin className="absolute left-3 top-3 h-4.5 w-4.5 text-zinc-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Classified Ads Grid */}
      {filteredAds.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700">
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
            <SlidersHorizontal className="w-8 h-8 text-zinc-400" />
          </div>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            {t['ad.filters.empty']}
          </p>
        </div>
      ) : (() => {
        const renderedElements: React.ReactNode[] = [];
        filteredAds.forEach((ad, idx) => {
          const cardSlug = `/${lang}/ads/${ad.id}`;
          const whatsappBotNumber = siteConfig.chatbot.phoneNumber;
          const rawId = ad.id.match(/-(\d+)$/) ? ad.id.match(/-(\d+)$/)![1] : ad.id;
          const shortId = (typeof rawId === 'string' && rawId.includes('-')) ? rawId.split('-')[0].toUpperCase() : String(rawId).slice(0, 8).toUpperCase();
          const whatsappMsg = t['ad.whatsapp.msg'].replace('{id}', shortId);
          const whatsappUrl = `https://wa.me/${whatsappBotNumber}?text=${encodeURIComponent(
            whatsappMsg
          )}`;


          renderedElements.push(
            <div 
              key={ad.id}
              className="group relative overflow-hidden rounded-3xl border border-zinc-200/50 bg-white/60 p-4 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300/80 hover:shadow-lg dark:border-zinc-800/50 dark:bg-zinc-900/60 dark:hover:border-zinc-700/80 dark:hover:shadow-2xl flex flex-col h-full justify-between"
            >
              {/* Image Container */}
              <div className="relative aspect-video w-full overflow-hidden rounded-2x1 bg-zinc-100 dark:bg-zinc-850">
                {ad.image && ad.image.trim() !== '' ? (
                  <img 
                    src={ad.image.startsWith('http') ? ad.image : `/${ad.image}`}
                    alt={isAr ? (ad.titleAr || ad.title) : (ad.titleEn || ad.title)}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (() => {
                  const Icon = getCategoryIcon(ad.categoryKey);
                  const gradient = getCategoryGradient(ad.categoryKey);
                  return (
                    <div className={`h-full w-full bg-linear-to-br ${gradient} flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}>
                      <Icon className="w-32 h-32 text-white/25 drop-shadow-md" strokeWidth={1} />
                    </div>
                  );
                })()}
                
                <div className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                  {isAr ? ad.categoryAr : ad.categoryEn}
                </div>
                <div className="absolute bottom-3 right-3 rounded-full bg-primary px-3.5 py-1 text-sm font-bold text-white shadow-md backdrop-blur-xs">
                  {formatPrice(ad.price)}
                </div>
              </div>

              {/* Details Content */}
              <div className="mt-4 flex flex-col justify-between flex-1">
                <div className="space-y-2 mb-4">
                  <h3 className="line-clamp-1 font-display text-lg font-bold text-zinc-900 transition-colors group-hover:text-primary dark:text-zinc-50">
                    <a href={cardSlug}>
                      {isAr ? (ad.titleAr || ad.title) : (ad.titleEn || ad.title)}
                    </a>
                  </h3>
                  <p className="line-clamp-3 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {isAr ? ad.descriptionAr : ad.descriptionEn}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2">
                  <a 
                    href={cardSlug}
                    className="flex-1 text-center py-2.5 text-xs font-semibold rounded-full border border-zinc-200/60 bg-white/80 hover:bg-zinc-50 text-zinc-900 transition dark:border-zinc-800 dark:bg-zinc-950/80 dark:hover:bg-zinc-800 dark:text-zinc-100"
                  >
                    {t['ad.filters.actions.details']}
                  </a>
                  <a 
                    href={whatsappUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md transition-all hover:bg-emerald-600 hover:scale-105 active:scale-95"
                    title={t['ad.filters.actions.whatsapp']}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" xmlns="http://www.w3.org/2500/svg" style={{margin: '0'}}>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          );

          if ((idx + 1) % 3 === 0) {
            const isEvery6 = (idx + 1) % 6 === 0;
            renderedElements.push(
              <ReactAdBanner 
                key={`banner-${idx}`}
                lang={lang} 
                className={isEvery6 ? 'col-span-full my-4' : 'col-span-full md:hidden my-4'} 
              />
            );
          }
        });

        return (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {renderedElements}
          </div>
        );
      })()}
    </div>
  );
}
