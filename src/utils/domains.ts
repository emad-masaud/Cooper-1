import { supabaseAdminClient } from './supabase';

export interface ResolvedSeller {
  id?: string;
  email?: string;
  phone?: string;
  name?: string;
  avatar?: string;
  banner?: string;
  username?: string;
  website?: string;
}

function profileToSeller(profile: any): ResolvedSeller {
  return {
    id: profile.id,
    email: profile.email || '',
    phone: profile.phone || '',
    name: profile.name || profile.username || '',
    avatar: profile.avatar || '',
    banner: profile.banner || '',
    username: profile.username || '',
    website: profile.website || '',
  };
}

export async function resolveSellerFromHost(host: string): Promise<ResolvedSeller | null> {
  if (!host) return null;
  const cleanHost = host.toLowerCase().trim().split(':')[0]; // remove port if any

  // Exclude main domains
  const mainDomains = ['meamart.com', 'localhost', '127.0.0.1'];
  if (mainDomains.some(d => cleanHost === d)) {
    return null;
  }

  // Case 1: Subdomain under meamart.com (e.g. seller1.meamart.com)
  if (cleanHost.endsWith('.meamart.com')) {
    const subdomain = cleanHost.replace('.meamart.com', '');
    try {
      const { data: profile } = await supabaseAdminClient
        .from('profiles')
        .select('*')
        .eq('username', subdomain)
        .maybeSingle();

      if (profile) {
        return profileToSeller(profile);
      }
    } catch (err) {
      console.error('Error resolving subdomain seller from Supabase:', err);
    }
    return null;
  }

  // Case 2: Custom domain (e.g. shop.seller.com) matched against profile website
  try {
    const { data: profiles } = await supabaseAdminClient
      .from('profiles')
      .select('*')
      .not('website', 'is', null);

    if (profiles) {
      const matchedProfile = profiles.find(p => {
        if (!p.website) return false;
        const websiteHost = p.website.toLowerCase().replace(/https?:\/\//, '').split('/')[0].split(':')[0];
        return websiteHost === cleanHost;
      });

      if (matchedProfile) {
        return profileToSeller(matchedProfile);
      }
    }
  } catch (err) {
    console.error('Error resolving seller by custom domain from Supabase:', err);
  }

  return null;
}
