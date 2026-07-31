// Bilingual cities map: key → { ar, en }
// Used to normalize city display regardless of what was stored in the database.

export interface CityEntry {
  ar: string;
  en: string;
}

// Map: lowercase English city name → translations
export const citiesMap: Record<string, CityEntry> = {
  // Saudi Arabia - Major Cities
  'riyadh': { ar: 'الرياض', en: 'Riyadh' },
  'الرياض': { ar: 'الرياض', en: 'Riyadh' },
  'jeddah': { ar: 'جدة', en: 'Jeddah' },
  'جدة': { ar: 'جدة', en: 'Jeddah' },
  'mecca': { ar: 'مكة المكرمة', en: 'Mecca' },
  'مكة': { ar: 'مكة المكرمة', en: 'Mecca' },
  'مكة المكرمة': { ar: 'مكة المكرمة', en: 'Mecca' },
  'medina': { ar: 'المدينة المنورة', en: 'Medina' },
  'المدينة': { ar: 'المدينة المنورة', en: 'Medina' },
  'المدينة المنورة': { ar: 'المدينة المنورة', en: 'Medina' },
  'dammam': { ar: 'الدمام', en: 'Dammam' },
  'الدمام': { ar: 'الدمام', en: 'Dammam' },
  'khobar': { ar: 'الخبر', en: 'Khobar' },
  'al khobar': { ar: 'الخبر', en: 'Khobar' },
  'الخبر': { ar: 'الخبر', en: 'Khobar' },
  'dhahran': { ar: 'الظهران', en: 'Dhahran' },
  'الظهران': { ar: 'الظهران', en: 'Dhahran' },
  'jubail': { ar: 'الجبيل', en: 'Jubail' },
  'الجبيل': { ar: 'الجبيل', en: 'Jubail' },
  'tabuk': { ar: 'تبوك', en: 'Tabuk' },
  'تبوك': { ar: 'تبوك', en: 'Tabuk' },
  'abha': { ar: 'أبها', en: 'Abha' },
  'أبها': { ar: 'أبها', en: 'Abha' },
  'taif': { ar: 'الطائف', en: 'Taif' },
  'الطائف': { ar: 'الطائف', en: 'Taif' },
  'buraydah': { ar: 'بريدة', en: 'Buraydah' },
  'بريدة': { ar: 'بريدة', en: 'Buraydah' },
  'qatif': { ar: 'القطيف', en: 'Qatif' },
  'القطيف': { ar: 'القطيف', en: 'Qatif' },
  'yanbu': { ar: 'ينبع', en: 'Yanbu' },
  'ينبع': { ar: 'ينبع', en: 'Yanbu' },
  'najran': { ar: 'نجران', en: 'Najran' },
  'نجران': { ar: 'نجران', en: 'Najran' },
  'jizan': { ar: 'جازان', en: 'Jizan' },
  'جازان': { ar: 'جازان', en: 'Jizan' },
  'hail': { ar: 'حائل', en: 'Hail' },
  'حائل': { ar: 'حائل', en: 'Hail' },
  'sakaka': { ar: 'سكاكا', en: 'Sakaka' },
  'سكاكا': { ar: 'سكاكا', en: 'Sakaka' },
  'arar': { ar: 'عرعر', en: 'Arar' },
  'عرعر': { ar: 'عرعر', en: 'Arar' },
  'khamis mushait': { ar: 'خميس مشيط', en: 'Khamis Mushait' },
  'khamis': { ar: 'خميس مشيط', en: 'Khamis Mushait' },
  'خميس مشيط': { ar: 'خميس مشيط', en: 'Khamis Mushait' },
  'qassim': { ar: 'القصيم', en: 'Qassim' },
  'القصيم': { ar: 'القصيم', en: 'Qassim' },
  'ahsa': { ar: 'الأحساء', en: 'Ahsa' },
  'al ahsa': { ar: 'الأحساء', en: 'Ahsa' },
  'الأحساء': { ar: 'الأحساء', en: 'Ahsa' },
  'dawadmi': { ar: 'الدوادمي', en: 'Dawadmi' },
  'الدوادمي': { ar: 'الدوادمي', en: 'Dawadmi' },
  'wajh': { ar: 'الوجه', en: 'Wajh' },
  'الوجه': { ar: 'الوجه', en: 'Wajh' },
  'neom': { ar: 'نيوم', en: 'NEOM' },
  'نيوم': { ar: 'نيوم', en: 'NEOM' },
  'alula': { ar: 'العُلا', en: 'AlUla' },
  'العلا': { ar: 'العُلا', en: 'AlUla' },

  // UAE
  'dubai': { ar: 'دبي', en: 'Dubai' },
  'دبي': { ar: 'دبي', en: 'Dubai' },
  'abu dhabi': { ar: 'أبوظبي', en: 'Abu Dhabi' },
  'أبوظبي': { ar: 'أبوظبي', en: 'Abu Dhabi' },
  'sharjah': { ar: 'الشارقة', en: 'Sharjah' },
  'الشارقة': { ar: 'الشارقة', en: 'Sharjah' },
  'ajman': { ar: 'عجمان', en: 'Ajman' },
  'عجمان': { ar: 'عجمان', en: 'Ajman' },
  'ras al khaimah': { ar: 'رأس الخيمة', en: 'Ras Al Khaimah' },
  'رأس الخيمة': { ar: 'رأس الخيمة', en: 'Ras Al Khaimah' },
  'fujairah': { ar: 'الفجيرة', en: 'Fujairah' },
  'الفجيرة': { ar: 'الفجيرة', en: 'Fujairah' },
  'umm al quwain': { ar: 'أم القيوين', en: 'Umm Al Quwain' },
  'أم القيوين': { ar: 'أم القيوين', en: 'Umm Al Quwain' },

  // Kuwait
  'kuwait city': { ar: 'مدينة الكويت', en: 'Kuwait City' },
  'الكويت': { ar: 'مدينة الكويت', en: 'Kuwait City' },
  'kuwait': { ar: 'مدينة الكويت', en: 'Kuwait City' },
  'salmiya': { ar: 'السالمية', en: 'Salmiya' },
  'السالمية': { ar: 'السالمية', en: 'Salmiya' },
  'hawalli': { ar: 'حولي', en: 'Hawalli' },
  'حولي': { ar: 'حولي', en: 'Hawalli' },

  // Bahrain
  'manama': { ar: 'المنامة', en: 'Manama' },
  'المنامة': { ar: 'المنامة', en: 'Manama' },
  'riffa': { ar: 'الرفاع', en: 'Riffa' },
  'الرفاع': { ar: 'الرفاع', en: 'Riffa' },
  'muharraq': { ar: 'المحرق', en: 'Muharraq' },
  'المحرق': { ar: 'المحرق', en: 'Muharraq' },

  // Qatar
  'doha': { ar: 'الدوحة', en: 'Doha' },
  'الدوحة': { ar: 'الدوحة', en: 'Doha' },
  'al rayyan': { ar: 'الريان', en: 'Al Rayyan' },
  'الريان': { ar: 'الريان', en: 'Al Rayyan' },

  // Oman
  'muscat': { ar: 'مسقط', en: 'Muscat' },
  'مسقط': { ar: 'مسقط', en: 'Muscat' },
  'salalah': { ar: 'صلالة', en: 'Salalah' },
  'صلالة': { ar: 'صلالة', en: 'Salalah' },
  'sohar': { ar: 'صحار', en: 'Sohar' },
  'صحار': { ar: 'صحار', en: 'Sohar' },
};

/**
 * Resolve a stored city value (Arabic or English) to both languages.
 * Falls back to the original string if not found in map.
 */
export function resolveCity(cityValue: string): CityEntry {
  if (!cityValue) return { ar: '', en: '' };
  const normalized = cityValue.trim().toLowerCase();
  if (citiesMap[normalized]) return citiesMap[normalized];
  // Try Arabic exact match
  if (citiesMap[cityValue.trim()]) return citiesMap[cityValue.trim()];
  // Fallback: return as-is for both languages
  return { ar: cityValue.trim(), en: cityValue.trim() };
}

/**
 * Get the display city name in the given language.
 */
export function getCityLabel(cityValue: string, lang: string): string {
  const resolved = resolveCity(cityValue);
  return lang === 'ar' ? resolved.ar : resolved.en;
}
