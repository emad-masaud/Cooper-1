import { siteConfig } from '~/site.config';
import { kvGet } from '~/utils/kv';

export async function getActiveConfig(astroContext: any) {
  try {
    const overrideStr = await kvGet(astroContext, 'site_config_override');
    if (overrideStr) {
      const override = JSON.parse(overrideStr);
      return {
        ...siteConfig,
        name: override.name || siteConfig.name,
        description: override.description || siteConfig.description,
        ogImage: override.ogImage || siteConfig.ogImage,
        seo: {
          ...siteConfig.seo,
          keywords: override.keywords || siteConfig.seo.keywords,
        },
        marketing: {
          ...(siteConfig.marketing || {}),
          googleSiteVerification: override.googleSiteVerification || siteConfig.marketing?.googleSiteVerification,
          facebookPixel: {
            enabled: Boolean(override.facebookPixelId),
            id: override.facebookPixelId || '',
          }
        },
        analytics: {
          ...(siteConfig.analytics || {}),
          vendors: {
            ...(siteConfig.analytics?.vendors || {}),
            googleAnalytics: {
              id: override.googleAnalyticsId || '',
              enabled: Boolean(override.googleAnalyticsId),
            }
          }
        }
      };
    }
  } catch (e) {
    console.error('Failed to parse site config override:', e);
  }
  return siteConfig;
}
