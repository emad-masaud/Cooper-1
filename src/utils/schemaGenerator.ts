/**
 * MeaMart High-Efficiency Dynamic JSON-LD (Schema.org) Generator
 * Programmatic SEO (PSEO) Builder for all primary & subcategory structures.
 * Includes National Address & GeoCoordinates support for Google Indexing ("خل قوقل يعرف مكاني").
 */

export interface SchemaGeneratorOptions {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
  price?: number | string;
  currency?: string;
  condition?: string;
  contactName?: string;
  contactPhone?: string;
  whatsappUrl?: string;
  whatsappMsgText?: string;
  whatsappBotNumber?: string;
  city?: string;
  country?: string;
  district?: string;
  lat?: number | string;
  lng?: number | string;
  postalCode?: string;
  streetAddress?: string;
  lang?: string;
  communicateActionName?: string;
  buyActionName?: string;
}

export function buildAdJsonLd(ad: any, options: SchemaGeneratorOptions): Record<string, any> {
  const adData = ad?.data || ad || {};
  const customFields = adData.custom_fields || {};
  const categoryKey: string = String(adData.categoryKey || adData.category || '').toLowerCase();
  
  const title = options.title || adData.title || 'MeaMart Listing';
  const description = options.description || adData.description || '';
  const imageUrl = options.imageUrl || (Array.isArray(adData.images) && adData.images[0] ? adData.images[0] : '/logo.svg');
  const price = Number(options.price !== undefined ? options.price : adData.listing_price) || 0;
  const currency = (options.currency || adData.listing_currency || 'SAR').toUpperCase();
  const condition = (options.condition || adData.listing_condition || '').toLowerCase();
  const adId = ad?.id || adData.id || 'unknown';

  const itemCondition = condition === 'new' 
    ? "https://schema.org/NewCondition" 
    : condition === 'used' 
      ? "https://schema.org/UsedCondition" 
      : "https://schema.org/UsedCondition";

  const sellerName = options.contactName || adData.contact_name || 'MeaMart Seller';
  const sellerPhone = options.contactPhone || adData.contact_phone || '';
  const whatsappUrl = options.whatsappUrl || `https://wa.me/${options.whatsappBotNumber || ''}`;

  // GeoCoordinates and Place structure for Google Indexing ("خل قوقل يعرف مكاني")
  const lat = Number(options.lat !== undefined ? options.lat : (customFields.lat || customFields.latitude)) || undefined;
  const lng = Number(options.lng !== undefined ? options.lng : (customFields.lng || customFields.longitude)) || undefined;
  const postalCode = options.postalCode || customFields.postal_code || customFields.postcode || undefined;
  const streetAddress = options.streetAddress || customFields.address || customFields.street_address || undefined;

  const geoObject = (lat && lng) ? {
    "@type": "GeoCoordinates",
    "latitude": lat,
    "longitude": lng
  } : undefined;

  const placeObject = {
    "@type": "Place",
    "name": options.city || adData.listing_city || options.district || 'Saudi Arabia',
    "address": {
      "@type": "PostalAddress",
      "addressLocality": options.city || adData.listing_city || '',
      "addressRegion": options.district || adData.listing_district || options.country || adData.listing_country || 'Saudi Arabia',
      "addressCountry": "SA",
      ...(postalCode ? { "postalCode": postalCode } : {}),
      ...(streetAddress ? { "streetAddress": streetAddress } : {})
    },
    ...(geoObject ? { "geo": geoObject } : {})
  };

  const baseOffer = {
    "@type": "Offer",
    "priceCurrency": currency,
    "price": price,
    "itemCondition": itemCondition,
    "availability": "https://schema.org/InStock",
    "url": options.url,
    "seller": {
      "@type": "Person",
      "name": sellerName,
      "telephone": sellerPhone,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "sales",
        "telephone": options.whatsappBotNumber || sellerPhone,
        "url": whatsappUrl
      }
    },
    "availableAtOrFrom": placeObject
  };

  const potentialActions = [
    {
      "@type": "CommunicateAction",
      "name": options.communicateActionName || "تواصل عبر واتساب | Contact via WhatsApp",
      "instrument": {
        "@type": "SoftwareApplication",
        "name": "WhatsApp"
      },
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": whatsappUrl,
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
          "http://schema.org/AndroidPlatform",
          "http://schema.org/IOSPlatform"
        ]
      },
      "about": {
        "@type": "Thing",
        "name": title,
        "identifier": `MM-${adId}`
      },
      "description": options.whatsappMsgText || title
    },
    {
      "@type": "BuyAction",
      "name": options.buyActionName || "شراء أو حجز | Buy or Book",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": customFields.affiliate_link || customFields.purchase_link || customFields.link || adData.video_url || whatsappUrl
      }
    }
  ];

  const additionalProperties = Object.entries(customFields)
    .filter(([_, val]) => val !== undefined && val !== null && val !== '')
    .map(([key, val]) => ({
      "@type": "PropertyValue",
      "name": key,
      "value": String(val)
    }));

  // ─── 1. CARS & VEHICLES ──────────────────────────────────────────────────
  if (categoryKey.startsWith('cars') || ['classic-cars', 'luxury-cars', 'scrap-cars', 'special-plates', 'tires-batteries'].includes(categoryKey) || categoryKey.startsWith('car-')) {
    const brandName = customFields.vehicle_make || customFields.make || customFields.brand || 'Vehicle';
    const modelName = customFields.vehicle_model || customFields.model || title;
    const year = Number(customFields.vehicle_year || customFields.year) || undefined;
    const mileage = Number(customFields.vehicle_mileage || customFields.mileage) || undefined;
    const fuel = customFields.fuel_type || undefined;
    const transmission = customFields.transmission_type || customFields.transmission || undefined;
    const drivetrain = customFields.drivetrain || undefined;
    const bodyType = customFields.body_type || undefined;
    const seats = Number(customFields.seats_count) || undefined;
    const doors = Number(customFields.doors_count) || undefined;

    return {
      "@context": "https://schema.org/",
      "@type": "Vehicle",
      "name": title,
      "description": description,
      "image": imageUrl,
      "sku": `MM-VEH-${adId}`,
      "vehicleIdentificationNumber": customFields.vin || `MM-${adId}`,
      "brand": {
        "@type": "Brand",
        "name": brandName
      },
      "model": modelName,
      ...(year ? { "vehicleModelDate": String(year) } : {}),
      ...(mileage !== undefined ? {
        "mileageFromOdometer": {
          "@type": "QuantitativeValue",
          "value": mileage,
          "unitCode": "KMT"
        }
      } : {}),
      ...(fuel ? { "fuelType": fuel } : {}),
      ...(transmission ? { "vehicleTransmission": transmission } : {}),
      ...(drivetrain ? { "driveWheelConfiguration": drivetrain } : {}),
      ...(bodyType ? { "bodyType": bodyType } : {}),
      ...(seats ? { "vehicleSeatingCapacity": seats } : {}),
      ...(doors ? { "numberOfDoors": doors } : {}),
      "offers": baseOffer,
      "availableAtOrFrom": placeObject,
      "additionalProperty": additionalProperties,
      "potentialAction": potentialActions
    };
  }

  // ─── 2. REAL ESTATE & PROPERTIES ─────────────────────────────────────────
  if (categoryKey.includes('apartment') || categoryKey.includes('villa') || ['real-estate', 'lands', 'buildings', 'offices-shops', 'warehouses', 'chalets-resthouses', 'shared-housing', 'farms-rental', 'resthouses-rental', 'chalets-resorts'].includes(categoryKey)) {
    const rooms = Number(customFields.rooms || customFields.bedrooms) || undefined;
    const area = Number(customFields.area_m2 || customFields.area) || undefined;
    const bathrooms = Number(customFields.bathrooms) || undefined;
    const floor = customFields.floor || undefined;

    const subResidenceType = categoryKey.includes('apartment') 
      ? "Apartment" 
      : categoryKey.includes('villa') || categoryKey.includes('chalet')
        ? "SingleFamilyResidence" 
        : "Accommodation";

    return {
      "@context": "https://schema.org/",
      "@type": "RealEstateListing",
      "name": title,
      "description": description,
      "image": imageUrl,
      "datePosted": adData.created_at ? new Date(adData.created_at).toISOString().split('T')[0] : undefined,
      "offers": baseOffer,
      "about": {
        "@type": subResidenceType,
        "name": title,
        "description": description,
        "address": placeObject.address,
        ...(geoObject ? { "geo": geoObject } : {}),
        ...(rooms ? { "numberOfRooms": rooms, "numberOfBedrooms": rooms } : {}),
        ...(bathrooms ? { "numberOfBathroomsTotal": bathrooms } : {}),
        ...(area ? {
          "floorSize": {
            "@type": "QuantitativeValue",
            "value": area,
            "unitCode": "MTK"
          }
        } : {}),
        ...(floor ? { "additionalProperty": [...additionalProperties, { "@type": "PropertyValue", "name": "floor", "value": String(floor) }] } : { "additionalProperty": additionalProperties })
      },
      "potentialAction": potentialActions
    };
  }

  // ─── 3. JOBS & RECRUITMENT ───────────────────────────────────────────────
  if (categoryKey.includes('job') || ['jobs', 'full-time-jobs', 'part-time-jobs', 'remote-jobs', 'seasonal-jobs', 'internships', 'drivers-delivery-jobs', 'admin-jobs', 'tech-jobs', 'sales-marketing-jobs', 'skilled-labor-jobs'].includes(categoryKey)) {
    const employer = customFields.employer || customFields.company_name || sellerName || 'MeaMart Employer';
    const salaryMin = Number(customFields.salary_min || price) || 0;
    const salaryMax = Number(customFields.salary_max || salaryMin) || salaryMin;
    const employmentTypeMap: Record<string, string> = {
      'full-time-jobs': 'FULL_TIME',
      'part-time-jobs': 'PART_TIME',
      'remote-jobs': 'OTHER',
      'seasonal-jobs': 'TEMPORARY',
      'internships': 'INTERN'
    };
    const empType = employmentTypeMap[categoryKey] || (customFields.employment_type === 'دوام جزئي' ? 'PART_TIME' : 'FULL_TIME');
    const expYears = customFields.required_experience_years || customFields.experience_years;
    const education = customFields.education_level;

    return {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": customFields.job_title || title,
      "description": description,
      "datePosted": adData.created_at ? new Date(adData.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      "validThrough": new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +60 days default
      "employmentType": empType,
      "hiringOrganization": {
        "@type": "Organization",
        "name": employer,
        "logo": imageUrl
      },
      "jobLocation": placeObject,
      ...(salaryMin > 0 ? {
        "baseSalary": {
          "@type": "MonetaryAmount",
          "currency": currency,
          "value": {
            "@type": "QuantitativeValue",
            "minValue": salaryMin,
            "maxValue": salaryMax > salaryMin ? salaryMax : salaryMin,
            "unitText": customFields.salary_period === 'يومي' ? 'DAY' : customFields.salary_period === 'بالساعة' ? 'HOUR' : 'MONTH'
          }
        }
      } : {}),
      ...(expYears !== undefined ? { "experienceRequirements": `${expYears} years` } : {}),
      ...(education ? { "qualifications": education } : {}),
      "directApply": true,
      "potentialAction": potentialActions
    };
  }

  // ─── 4. SERVICES ─────────────────────────────────────────────────────────
  if (categoryKey.includes('service') || ['services', 'moving-shipping', 'delivery-shipping', 'maintenance-services', 'cleaning-services', 'tech-services', 'design-printing', 'marketing-services', 'legal-services', 'accounting-services', 'education-training-services', 'events-services'].includes(categoryKey)) {
    const serviceType = customFields.service_type || title;

    return {
      "@context": "https://schema.org/",
      "@type": "Service",
      "name": title,
      "serviceType": serviceType,
      "description": description,
      "image": imageUrl,
      "provider": {
        "@type": "Person",
        "name": sellerName,
        "telephone": sellerPhone
      },
      "areaServed": placeObject,
      "offers": baseOffer,
      "additionalProperty": additionalProperties,
      "potentialAction": potentialActions
    };
  }

  // ─── 5. ELECTRONICS, HOME & ALL OTHER PRODUCTS ───────────────────────────
  const brandName = customFields.brand_name || customFields.brand || "MeaMart";
  const modelName = customFields.model_name || customFields.model || title;
  const sku = customFields.serial_number || `MM-${adId}`;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": title,
    "sku": sku,
    "mpn": String(adId),
    "image": imageUrl,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": brandName
    },
    ...(modelName ? { "model": modelName } : {}),
    "offers": baseOffer,
    "availableAtOrFrom": placeObject,
    "additionalProperty": additionalProperties,
    "potentialAction": potentialActions
  };
}
