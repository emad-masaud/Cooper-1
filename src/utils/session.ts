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
  // Authentication is disabled for Phase 1.
  return null;
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
