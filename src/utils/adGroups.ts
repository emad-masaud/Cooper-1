import { getCityLabel } from '~/utils/cities';
import { categoriesStructure } from '~/utils/categories';

export interface LocationGroup {
  key: string;
  country: string;
  city: string;
  street: string;
  district: string;
  count: number;
}

export interface CustomFieldGroup {
  key: string;
  fieldKey: string;
  fieldLabel: string;
  value: string;
  count: number;
}

export interface TagGroup {
  tag: string;
  count: number;
}

export function getLocationGroups(ads: any[], lang: string, minCount = 10): LocationGroup[] {
  const groups: Record<string, LocationGroup> = {};

  ads.forEach((ad) => {
    const country = ad.data.listing_country || (lang === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia');
    const city = getCityLabel(ad.data.listing_city || '', lang);
    const street = ad.data.listing_street || ad.data.listing_address || '';
    const district = ad.data.listing_district || '';
    const key = [country, city, street, district].join('||');

    if (!groups[key]) {
      groups[key] = { key, country, city, street, district, count: 0 };
    }
    groups[key].count += 1;
  });

  return Object.values(groups)
    .filter((group) => group.count >= minCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export function getCustomFieldGroups(ads: any[], minCount = 10): CustomFieldGroup[] {
  const groups: Record<string, CustomFieldGroup> = {};

  ads.forEach((ad) => {
    const customFields = ad.data.custom_fields || {};
    Object.entries(customFields).forEach(([fieldKey, fieldValue]) => {
      if (fieldValue === undefined || fieldValue === null || fieldValue === '') return;
      const value = String(fieldValue).trim();
      if (!value) return;
      const groupKey = `${fieldKey}||${value}`;
      const label = fieldKey.replace(/[_-]/g, ' ');

      if (!groups[groupKey]) {
        groups[groupKey] = {
          key: groupKey,
          fieldKey,
          fieldLabel: label,
          value,
          count: 0,
        };
      }
      groups[groupKey].count += 1;
    });
  });

  return Object.values(groups)
    .filter((group) => group.count >= minCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export function getTagGroups(ads: any[], minCount = 10): TagGroup[] {
  const counts: Record<string, number> = {};

  ads.forEach((ad) => {
    const tags = ad.data.tags || [];
    tags.forEach((tag: string) => {
      const normalized = String(tag).trim();
      if (!normalized) return;
      counts[normalized] = (counts[normalized] || 0) + 1;
    });
  });

  return Object.entries(counts)
    .filter(([, count]) => count >= minCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export function getSubcategoryGroups(ads: any[], parentCategoryKey: string, lang: string, minCount = 10): { key: string; label: string; count: number; }[] {
  const parentGroup = categoriesStructure.find((group) => group.key === parentCategoryKey);
  if (!parentGroup) return [];

  const counts: Record<string, number> = {};
  const childLabels: Record<string, string> = {};

  parentGroup.children.forEach((child) => {
    counts[child.key] = 0;
    childLabels[child.key] = lang === 'ar' ? child.ar : child.en;
  });

  ads.forEach((ad) => {
    if (counts[ad.data.categoryKey] !== undefined) {
      counts[ad.data.categoryKey] += 1;
    }
  });

  return Object.entries(counts)
    .filter(([, count]) => count >= minCount)
    .map(([key, count]) => ({ key, label: childLabels[key] || key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export function getTagsFromAds(ads: any[]): string[] {
  const tags = new Set<string>();
  ads.forEach((ad) => {
    (ad.data.tags || []).forEach((tag: string) => {
      const normalized = String(tag).trim();
      if (normalized) tags.add(normalized);
    });
  });
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}
