import { createSupabaseServerClient, createSupabaseAdminServerClient } from './supabase';
import { getEnv } from './env';

export type MeamartSession = {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  avatar?: string;
  banner?: string;
  gender?: string;
  instagram?: string;
  facebook?: string;
  telegram?: string;
  website?: string;
  gmaps?: string;
  username?: string;
  is_admin?: boolean;
  metadata?: any;
};

function checkIsAdmin(email: string | undefined, locals: any): boolean {
  if (!email) return false;
  const adminEmails = getEnv(locals, 'ADMIN_EMAILS', 'emad@meamart.com')
    .split(',')
    .map((e: string) => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}

export async function getMeamartSession(context: any): Promise<MeamartSession | null> {
  try {
    const supabase = createSupabaseServerClient(context);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!error && user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const is_admin = checkIsAdmin(user.email, context?.locals);

      if (!profile) {
        return {
          id: user.id,
          email: user.email,
          is_admin,
        };
      }

      const metadata = profile.metadata || {};
      return {
        id: user.id,
        email: user.email,
        name: profile.name || profile.first_name || '',
        phone: profile.phone || '',
        avatar: profile.avatar || metadata.seller_avatar || '',
        banner: profile.banner || metadata.seller_banner || '',
        gender: profile.gender || '',
        username: profile.username || '',
        instagram: profile.instagram || metadata.seller_instagram || '',
        facebook: profile.facebook || metadata.seller_facebook || '',
        telegram: profile.telegram || metadata.seller_telegram || '',
        website: profile.website || metadata.seller_website || '',
        gmaps: profile.gmaps || metadata.seller_gmaps || '',
        is_admin,
      };
    }

    // Fallback: Check meamart_session cookie
    const sessionCookie = context?.cookies?.get?.('meamart_session')?.value;
    if (sessionCookie) {
      const decoded = sessionCookie.startsWith('%') ? decodeURIComponent(sessionCookie) : sessionCookie;
      const parsed = JSON.parse(decoded);
      if (parsed && (parsed.email || parsed.id)) {
        let profileData: any = null;
        if (parsed.id) {
          const adminClient = createSupabaseAdminServerClient(context);
          const { data } = await adminClient
            .from('profiles')
            .select('*')
            .eq('id', parsed.id)
            .maybeSingle();
          profileData = data;
        }
        const metadata = profileData?.metadata || {};
        const email = profileData?.email || parsed.email || '';
        return {
          id: parsed.id || '',
          email,
          name: profileData?.name || parsed.name || '',
          phone: profileData?.phone || parsed.phone || '',
          avatar: profileData?.avatar || metadata.seller_avatar || parsed.avatar || '',
          banner: profileData?.banner || metadata.seller_banner || '',
          gender: profileData?.gender || '',
          username: profileData?.username || parsed.username || '',
          instagram: profileData?.instagram || metadata.seller_instagram || '',
          facebook: profileData?.facebook || metadata.seller_facebook || '',
          telegram: profileData?.telegram || metadata.seller_telegram || '',
          website: profileData?.website || metadata.seller_website || '',
          gmaps: profileData?.gmaps || metadata.seller_gmaps || '',
          is_admin: Boolean(parsed.is_admin) || checkIsAdmin(email, context?.locals),
        };
      }
    }

    return null;
  } catch (err) {
    console.error('getMeamartSession Error:', err);
    return null;
  }
}

export async function parseAdminSession(cookies: any, locals?: any): Promise<MeamartSession | null> {
  const cookieValue = cookies?.get?.('meamart_admin_session')?.value;
  if (!cookieValue) return null;

  try {
    const { verifyJWT } = await import('./jwt');
    const secret = getEnv(locals, 'JWT_SECRET', 'fallback-admin-secret-key-123456');
    const payload = await verifyJWT(cookieValue, secret);
    if (payload && payload.is_admin) {
      return payload as MeamartSession;
    }
  } catch (e) {
    console.error('[Session] Admin token verification error:', e);
  }

  return null;
}

export function normalizePhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[^0-9]/g, '');
  return cleaned.length >= 9 ? cleaned.slice(-9) : cleaned;
}
