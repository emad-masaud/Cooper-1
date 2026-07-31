import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Tag, SlidersHorizontal, ShoppingBag, Eye, Star } from 'lucide-react';
import { siteConfig } from '~/site.config';
import { getCityLabel } from '~/utils/cities';
import { useTranslations } from '~/i18n/utils';

interface ProductItem {
  id: number;
  name: string;
  price: number;
  sku: string;
  image: string;
  images: string[];
  description: string;
  categories: { id: number; name: string; slug: string }[];
  sellerPhone: string;
  sellerName: string;
  city: string;
  brand?: string;
  brandImage?: string;
  supplier?: string;
  supplierImage?: string;
  attributes?: { name: string; options: string[] }[];
}

interface ProductFiltersProps {
  products: ProductItem[];
  lang: string;
  sellerResolved?: boolean;
}

export default function ProductFilters({ products, lang, sellerResolved = false }: ProductFiltersProps) {
  const isAr = lang === 'ar';
  const t = useTranslations(lang);
  
  // State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  // Load initial filter states from URL search params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      const city = params.get('city');
      const q = params.get('q');
      const brandVal = params.get('brand');
      const supplierVal = params.get('supplier');
      
      if (cat) setSelectedCategory(cat);
      if (city) setSelectedCity(city);
      if (q) setSearch(q);
      if (brandVal) setSelectedBrand(brandVal);
      if (supplierVal) setSelectedSupplier(supplierVal);
    }
  }, []);

  // Extract unique categories from the products
  const categories = useMemo(() => {
    const map = new Map<number, { id: number; name: string; slug: string }>();
    products.forEach(p => {
      if (p.categories) {
        p.categories.forEach(cat => {
          map.set(cat.id, cat);
        });
      }
    });
    return Array.from(map.values());
  }, [products]);

  // Extract unique cities
  const cities = useMemo(() => {
    const list = new Set<string>();
    products.forEach(p => {
      if (p.city) {
        list.add(p.city.trim());
      }
    });
    return Array.from(list);
  }, [products]);

  // Extract unique brands
  const brands = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach(p => {
      if (p.brand) {
        map.set(p.brand.trim(), p.brandImage || '');
      }
    });
    return Array.from(map.entries()).map(([name, image]) => ({ name, image }));
  }, [products]);

  // Extract unique suppliers
  const suppliers = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach(p => {
      if (p.supplier) {
        map.set(p.supplier.trim(), p.supplierImage || '');
      }
    });
    return Array.from(map.entries()).map(([name, image]) => ({ name, image }));
  }, [products]);

  // Extract unique variation attributes
  const dynamicAttributes = useMemo(() => {
    const map = new Map<string, Set<string>>();
    products.forEach(p => {
      if (p.attributes) {
        p.attributes.forEach(attr => {
          if (attr.name && attr.options) {
            const name = attr.name.trim();
            if (!map.has(name)) {
              map.set(name, new Set<string>());
            }
            attr.options.forEach(opt => map.get(name)!.add(opt.trim()));
          }
        });
      }
    });
    return Array.from(map.entries()).map(([name, optionsSet]) => ({
      name,
      options: Array.from(optionsSet)
    }));
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'all' || 
        (p.categories && p.categories.some(cat => String(cat.id) === selectedCategory || cat.slug === selectedCategory));
      
      const matchesCity = 
        selectedCity === 'all' || 
        p.city.trim() === selectedCity.trim();

      const matchesBrand =
        selectedBrand === 'all' ||
        (p.brand && p.brand.trim() === selectedBrand.trim());

      const matchesSupplier =
        selectedSupplier === 'all' ||
        (p.supplier && p.supplier.trim() === selectedSupplier.trim());

      // Match dynamic attributes selection
      const matchesAttrs = Object.entries(selectedAttributes).every(([attrName, attrValue]) => {
        if (attrValue === 'all') return true;
        if (!p.attributes) return false;
        return p.attributes.some(attr => 
          attr.name.trim() === attrName && 
          attr.options.some(opt => opt.trim() === attrValue.trim())
        );
      });

      return matchesSearch && matchesCategory && matchesCity && matchesBrand && matchesSupplier && matchesAttrs;
    });
  }, [products, search, selectedCategory, selectedCity, selectedBrand, selectedSupplier, selectedAttributes]);

  // Format price
  const formatPrice = (price: number) => {
    let locale = 'en-US';
    if (isAr) locale = 'ar-SA';
    const formattedAmount = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0
    }).format(price);
    if (isAr) return `${formattedAmount} ﷼`;
    return `﷼ ${formattedAmount}`;
  };

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="rounded-3xl border border-zinc-200/50 bg-white/40 p-6 shadow-xs backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/40">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          
          {/* Search */}
          <div className="relative">
            <label className="block text-xs font-semibold text-zinc-500 mb-2 dark:text-zinc-400">
              {t['product.filters.search.label']}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={t['product.filters.search.placeholder']}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-full border border-zinc-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950/80 dark:focus:border-zinc-600"
              />
              <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-zinc-400" />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-2 dark:text-zinc-400">
              {t['product.filters.category.label']}
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full rounded-full border border-zinc-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm appearance-none outline-hidden focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950/80 dark:focus:border-zinc-600"
              >
                <option value="all">{t['product.filters.category.all']}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                ))}
              </select>
              <Tag className="absolute left-3 top-3 h-4.5 w-4.5 text-zinc-400" />
            </div>
          </div>

          {/* Brand */}
          {brands.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-2 dark:text-zinc-400">
                {t['product.filters.brand.label']}
              </label>
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={e => setSelectedBrand(e.target.value)}
                  className="w-full rounded-full border border-zinc-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm appearance-none outline-hidden focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950/80 dark:focus:border-zinc-600"
                >
                  <option value="all">{t['product.filters.brand.all']}</option>
                  {brands.map(b => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
                <Tag className="absolute left-3 top-3 h-4.5 w-4.5 text-zinc-400" />
              </div>
            </div>
          )}

          {/* Supplier */}
          {suppliers.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-2 dark:text-zinc-400">
                {t['product.filters.supplier.label']}
              </label>
              <div className="relative">
                <select
                  value={selectedSupplier}
                  onChange={e => setSelectedSupplier(e.target.value)}
                  className="w-full rounded-full border border-zinc-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm appearance-none outline-hidden focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950/80 dark:focus:border-zinc-600"
                >
                  <option value="all">{t['product.filters.supplier.all']}</option>
                  {suppliers.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
                <SlidersHorizontal className="absolute left-3 top-3 h-4.5 w-4.5 text-zinc-400" />
              </div>
            </div>
          )}

          {/* Dynamic Attributes selectors */}
          {dynamicAttributes.map(attr => (
            <div key={attr.name}>
              <label className="block text-xs font-semibold text-zinc-500 mb-2 dark:text-zinc-400">
                {attr.name}
              </label>
              <div className="relative">
                <select
                  value={selectedAttributes[attr.name] || 'all'}
                  onChange={e => setSelectedAttributes(prev => ({ ...prev, [attr.name]: e.target.value }))}
                  className="w-full rounded-full border border-zinc-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm appearance-none outline-hidden focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950/80 dark:focus:border-zinc-600"
                >
                    <option value="all">{t['product.filters.dynamic.all'].replace('{name}', attr.name)}</option>
                  {attr.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <SlidersHorizontal className="absolute left-3 top-3 h-4.5 w-4.5 text-zinc-400" />
              </div>
            </div>
          ))}

          {/* City */}
          {!sellerResolved && (
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-2 dark:text-zinc-400">
                {t['product.filters.city.label']}
              </label>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  className="w-full rounded-full border border-zinc-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm appearance-none outline-hidden focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950/80 dark:focus:border-zinc-600"
                >
                  <option value="all">{t['product.filters.city.all']}</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{getCityLabel(city, lang)}</option>
                  ))}
                </select>
                <MapPin className="absolute left-3 top-3 h-4.5 w-4.5 text-zinc-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
            <SlidersHorizontal className="w-8 h-8 text-zinc-400" />
          </div>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            {t['product.filters.empty']}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map((p) => {
            const detailUrl = `/${lang}/catalog/${p.id}`;
            return (
              <div 
                key={p.id}
                className="group relative rounded-3xl border border-zinc-200/50 bg-white/45 p-4 shadow-xs backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/45 overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-850 mb-4">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                      <span>SKU: {p.sku || 'N/A'}</span>
                      {p.city && !sellerResolved && (
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5" />
                          {getCityLabel(p.city, lang)}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 min-h-[40px]">
                      <a href={detailUrl} className="hover:text-primary transition-colors">
                        {p.name}
                      </a>
                    </h3>

                    {/* Brand and Supplier Logo Thumbnails on Card */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {p.brandImage && (
                        <img 
                          src={p.brandImage} 
                          alt={p.brand} 
                          className="h-5 w-5 object-contain rounded-md border border-zinc-200/60 dark:border-zinc-800/60 bg-white p-0.5" 
                          title={p.brand} 
                        />
                      )}
                      {p.supplierImage && (
                        <img 
                          src={p.supplierImage} 
                          alt={p.supplier} 
                          className="h-5 w-5 object-contain rounded-md border border-zinc-200/60 dark:border-zinc-800/60 bg-white p-0.5" 
                          title={p.supplier} 
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between">
                  <span className="text-base font-extrabold text-primary">
                    {formatPrice(p.price)}
                  </span>
                  <a 
                    href={detailUrl} 
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-white"
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
