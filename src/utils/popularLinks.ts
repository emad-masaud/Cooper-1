import { getCollection } from "astro:content";
import { categoriesMap } from "./categories";
import { resolveCity } from "./cities";
import { supabaseAdminClient } from "./supabase";

export interface PopularLinkItem {
  label: string;
  href: string;
  iconName: string;
  count: number;
}

export async function getPopularLinks(lang: string): Promise<PopularLinkItem[]> {
  const isAr = lang === "ar";
  const pickLangValue = (arValue: string, enValue: string) => {
    if (isAr) return arValue;
    return enValue;
  };

  const pickCategoryLabel = (catKey: string) => {
    const catObj = categoriesMap[catKey];
    if (!catObj) return catKey;
    return pickLangValue(catObj.ar || catKey, catObj.en || catKey);
  };

  const pickCityLabel = (cityKey: string) => {
    const cityObj = resolveCity(cityKey);
    return pickLangValue(cityObj.ar, cityObj.en);
  };

  const ads = await getCollection("ads");

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const activeAds = ads.filter((ad) => {
    if (ad.data.listing_status !== "active") return false;

    if (ad.data.expires_at) {
      const exp = new Date(ad.data.expires_at);
      if (exp < now) return false;
    }

    const pubDate = new Date(ad.data.pubDate);
    if (ad.data.featured_flag) {
      return pubDate >= oneMonthAgo;
    }
    return pubDate >= oneWeekAgo;
  });

  const categoryCounts: Record<string, number> = {};
  const cityCounts: Record<string, number> = {};

  activeAds.forEach((ad) => {
    if (ad.data.categoryKey) {
      const cat = ad.data.categoryKey.trim();
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }
    if (ad.data.listing_city) {
      const city = ad.data.listing_city.trim();
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    }
  });

  const items: PopularLinkItem[] = [];

  // Map categories to popular links
  const categoryIconMap: Record<string, string> = {
    "cars": "Car",
    "real-estate": "Home",
    "jobs": "Briefcase",
    "services": "Wrench",
    "electronics": "Smartphone",
    "home-furniture": "Sofa",
    "fashion-beauty": "ShoppingBag",
    "mother-baby": "Baby",
    "pets-animals": "PawPrint",
    "sports-hobbies": "Dumbbell",
    "business-industry": "Building2",
    "food-home-kitchens": "UtensilsCrossed",
    "travel-tourism": "Plane",
    "buy-sell-misc": "Package",
    "places-venues": "MapPin"
  };

  Object.entries(categoryCounts).forEach(([catKey, count]) => {
    const label = pickCategoryLabel(catKey);
    const iconName = categoryIconMap[catKey] || "Tag";
    items.push({
      label,
      href: `/${lang}/ads?category=${catKey}`,
      iconName,
      count
    });
  });

  // Map cities to popular links
  Object.entries(cityCounts).forEach(([cityKey, count]) => {
    const label = pickCityLabel(cityKey);
    items.push({
      label,
      href: `/${lang}/ads?city=${encodeURIComponent(cityKey)}`,
      iconName: "MapPin",
      count
    });
  });

  // Include top scanned QR links into trending items
  try {
    const { data: topQrLinks } = await supabaseAdminClient
      .from("qr_links")
      .select("title, short_code, clicks_count")
      .eq("is_active", true)
      .gt("clicks_count", 0)
      .order("clicks_count", { ascending: false })
      .limit(3);

    if (topQrLinks) {
      topQrLinks.forEach((link: any) => {
        items.push({
          label: `🔥 ${link.title}`,
          href: `/q/${link.short_code}`,
          iconName: "QrCode",
          count: link.clicks_count * 2 // Boost QR scan trends slightly
        });
      });
    }
  } catch (err) {
    console.warn("[PopularLinks] Failed to fetch QR trend stats:", err);
  }

  // Sort by count descending
  items.sort((a, b) => b.count - a.count);

  // Return top 5 items
  return items.slice(0, 5);
}
