/**
 * Saudi Post (SPL / العنوان الوطني / سبل) API Client Utility
 * Handles National Address lookups, geocoding, short-code resolution, and coordinate mapping.
 */
import { getEnv } from './env';

export function getSplConfig(context?: any) {
  return {
    primaryKey: getEnv(context?.locals, 'SPL_PRIMARY_KEY', '22c70651c8d64b4db0abf7b03260eeff'),
    secondaryKey: getEnv(context?.locals, 'SPL_SECONDARY_KEY', '447821eff59c41f78709b2dfdd129e46'),
    baseUrl: 'https://apina.address.gov.sa/NationalAddress/v3.1/address'
  };
}

export interface NationalAddressResult {
  shortAddress: string;
  buildingNumber: string;
  streetName: string;
  district: string;
  city: string;
  region: string;
  postalCode: string;
  additionalNumber: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

/**
 * Helper to execute request against SPL National Address API
 */
async function callSplApi(endpoint: string, params: Record<string, string>, context?: any): Promise<any> {
  const config = getSplConfig(context);
  const url = new URL(`${config.baseUrl}/${endpoint}`);
  Object.entries(params).forEach(([key, val]) => {
    if (val) url.searchParams.append(key, val);
  });
  url.searchParams.append('api_key', config.primaryKey);
  url.searchParams.append('language', 'A'); // Arabic output

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'api_key': config.primaryKey,
        'Accept': 'application/json'
      }
    });
    if (!res.ok) {
      console.warn(`SPL API request returned status ${res.status} for ${endpoint}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`SPL API request error (${endpoint}):`, err);
    return null;
  }
}

/**
 * Normalizes an SPL API raw address record to our NationalAddressResult interface
 */
function normalizeSplRecord(record: any): NationalAddressResult | null {
  if (!record) return null;
  
  const lat = Number(record.Latitude || record.latitude || record.lat) || 0;
  const lng = Number(record.Longitude || record.longitude || record.long || record.lng) || 0;
  
  const buildingNumber = String(record.BuildingNumber || record.buildingnumber || '');
  const streetName = String(record.StreetName || record.streetname || '');
  const district = String(record.District || record.district || record.sublocality || '');
  const city = String(record.City || record.city || record.locality || '');
  const region = String(record.RegionName || record.regionname || record.Region || '');
  const postalCode = String(record.PostCode || record.postcode || record.PostalCode || '');
  const additionalNumber = String(record.AdditionalNumber || record.additionalnumber || '');
  const shortAddress = String(record.ShortAddress || record.shortaddress || record.Title || '');

  const parts = [
    buildingNumber ? `مبنى ${buildingNumber}` : '',
    streetName,
    district ? `حي ${district}` : '',
    city,
    postalCode ? `الرمز البريدي ${postalCode}` : ''
  ].filter(Boolean);

  return {
    shortAddress,
    buildingNumber,
    streetName,
    district,
    city,
    region,
    postalCode,
    additionalNumber,
    latitude: lat,
    longitude: lng,
    formattedAddress: parts.join(' - ') || shortAddress || 'العنوان الوطني السعودية'
  };
}

/**
 * Search National Address by Free Text or Short Code (e.g. RRRD2929 or "حي الملقا الرياض")
 */
export async function lookupNationalAddress(query: string, context?: any): Promise<NationalAddressResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  // 1. Check if it looks like a Short Address (4 English letters + 4 digits e.g. RRRD2929)
  const isShortCode = /^[A-Za-z]{4}\d{4}$/.test(cleanQuery);
  if (isShortCode) {
    const data = await callSplApi('short-address', { shortaddress: cleanQuery.toUpperCase() }, context);
    const records = data?.Addresses || data?.addresses || (Array.isArray(data) ? data : [data]);
    const normalized = records.map(normalizeSplRecord).filter(Boolean) as NationalAddressResult[];
    if (normalized.length > 0) return normalized;
  }

  // 2. Try Free Text / Geocode endpoint
  const data = await callSplApi('geocode', { addressstring: cleanQuery }, context);
  const records = data?.Addresses || data?.addresses || (Array.isArray(data) ? data : [data]);
  const results = (records || []).map(normalizeSplRecord).filter((r: NationalAddressResult | null): r is NationalAddressResult => {
    return r !== null && (r.latitude !== 0 || r.city !== '' || r.district !== '');
  });

  return results;
}

/**
 * Reverse Lookup by Latitude / Longitude
 */
export async function reverseLookupSPL(lat: number, lng: number, context?: any): Promise<NationalAddressResult | null> {
  if (!lat || !lng) return null;
  const data = await callSplApi('reverse-geocode', { lat: String(lat), long: String(lng) }, context);
  const records = data?.Addresses || data?.addresses || (Array.isArray(data) ? data : [data]);
  return normalizeSplRecord(records?.[0]) || null;
}
