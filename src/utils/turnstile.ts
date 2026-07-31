/**
 * Cloudflare Turnstile Server Verification Utility
 * Verifies Turnstile CAPTCHA tokens against Cloudflare API
 */
import { getEnv } from './env';

export async function verifyTurnstileToken(
  token: string | undefined | null,
  locals: any,
  remoteIp?: string
): Promise<boolean> {
  const secretKey = getEnv(locals, 'TURNSTILE_SECRET_KEY');

  if (!secretKey) {
    // Only bypass in local dev — in production this should never happen
    const isProduction = getEnv(locals, 'SITE_URL', '').includes('https://');
    if (isProduction) {
      console.error('[Turnstile] TURNSTILE_SECRET_KEY not set in production — blocking request');
      return false;
    }
    console.warn('[Turnstile] TURNSTILE_SECRET_KEY not set — bypassing in dev mode');
    return true;
  }

  if (!token) {
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('[Turnstile] Verification fetch error:', error);
    // On Cloudflare API outage, fail closed to prevent CAPTCHA bypass
    return false;
  }
}
