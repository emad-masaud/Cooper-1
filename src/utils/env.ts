export function getEnv(locals: any, key: string, defaultValue: string = ''): string {
  // 1. Try Cloudflare runtime environment variables (Astro + Cloudflare)
  if (locals?.runtime?.env && locals.runtime.env[key]) {
    return locals.runtime.env[key];
  }
  
  // 2. Try Node.js process.env safely (avoid ReferenceError in Cloudflare)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  
  // 3. Try Astro's build-time static variables
  if (import.meta.env && import.meta.env[key]) {
    return import.meta.env[key] as string;
  }
  
  return defaultValue;
}
