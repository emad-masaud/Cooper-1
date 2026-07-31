/**
 * src/utils/email.ts
 * Unified Decoupled Notifications & Transactional Email Service (Resend + Supabase user_notifications)
 * Reads config from KV storage (email_config) with environment variable fallback.
 * Embeds JSON-LD structured data in emails for Gmail AI / Apple Mail action support.
 */
import { supabaseAdminClient } from './supabase';

const ENV_RESEND_API_KEY = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY || '';

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  jsonLd?: string;
}

interface EmailConfig {
  senderEmail: string;
  resendApiKey: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  notifyOnRegister: boolean;
  notifyOnAdCreate: boolean;
  notifyOnQrScan: boolean;
  templates: Array<{
    id: string;
    name: string;
    subject: string;
    htmlContent: string;
    jsonLd: string;
  }>;
}

// In-memory cache for email config (refreshed every 5 min)
let cachedConfig: EmailConfig | null = null;
let cachedConfigAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Load email config from KV storage (with in-memory cache).
 * Falls back to environment variables if KV is empty.
 */
export async function getEmailConfig(context?: any): Promise<EmailConfig | null> {
  const now = Date.now();
  if (cachedConfig && (now - cachedConfigAt) < CACHE_TTL_MS) {
    return cachedConfig;
  }

  if (!context) return null;

  try {
    // Dynamically import kvGet to avoid circular imports
    const { kvGet } = await import('./kv');
    const raw = await kvGet(context, 'email_config');
    if (raw) {
      cachedConfig = JSON.parse(raw);
      cachedConfigAt = now;
      return cachedConfig;
    }
  } catch (e) {
    console.warn('[Email Config] Failed to load from KV:', e);
  }
  return null;
}

/**
 * Resolve the Resend API key: KV config first, then environment variable fallback
 */
async function resolveApiKey(context?: any): Promise<string> {
  const config = await getEmailConfig(context);
  if (config?.resendApiKey) {
    try {
      const { decryptText } = await import('./crypto');
      const { getEnv } = await import('./env');
      const jwtSecret = context
        ? getEnv(context.locals || {}, 'JWT_SECRET', 'fallback-admin-secret-key-123456')
        : 'fallback-admin-secret-key-123456';
      const decrypted = await decryptText(config.resendApiKey, jwtSecret);
      if (decrypted) return decrypted;
    } catch {}
  }
  return ENV_RESEND_API_KEY;
}

/**
 * Resolve sender address from config or fallback
 */
async function resolveSender(context?: any): Promise<string> {
  const config = await getEmailConfig(context);
  return config?.senderEmail || 'MeaMart <noreply@meamart.com>';
}

/**
 * Inject JSON-LD structured data into email HTML
 */
function injectJsonLd(html: string, jsonLd?: string): string {
  if (!jsonLd || !jsonLd.trim()) return html;
  try {
    // Validate JSON
    JSON.parse(jsonLd);
    const ldScript = `<script type="application/ld+json">${jsonLd}</script>`;
    // Insert at the beginning of the HTML body
    return ldScript + '\n' + html;
  } catch {
    // Invalid JSON-LD, skip injection
    return html;
  }
}

/**
 * Find a template by ID from the saved config
 */
async function findTemplate(templateId: string, context?: any) {
  const config = await getEmailConfig(context);
  if (!config?.templates || !Array.isArray(config.templates)) return null;
  return config.templates.find(t => t.id === templateId) || null;
}

/**
 * Send an email via Resend API with JSON-LD support
 */
export async function sendEmail({ to, subject, html, from, jsonLd }: EmailPayload, context?: any) {
  const apiKey = await resolveApiKey(context);
  const sender = from || await resolveSender(context);
  const finalHtml = injectJsonLd(html, jsonLd);

  if (!apiKey) {
    console.warn('[Notification Service] RESEND_API_KEY is not configured. Email will be logged.');
    console.log(`[Email Log] To: ${to} | Subject: ${subject}`);
    return { success: true, mock: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: sender,
        to: Array.isArray(to) ? to : [to],
        subject,
        html: finalHtml
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API Error:', errorText);
      return { success: false, error: errorText };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err: any) {
    console.error('Email sending failed:', err);
    return { success: false, error: err.message };
  }
}

export interface NotifyUserPayload {
  userId?: string;
  email?: string;
  title: string;
  body: string;
  link?: string;
  type?: 'ad_created' | 'security' | 'system' | 'lead' | 'qr_scan' | 'welcome';
  templateId?: string;
  templateVars?: Record<string, string>;
  context?: any;
}

/**
 * Check if a notification type is enabled in admin settings
 */
async function isNotificationEnabled(type: string, context?: any): Promise<boolean> {
  const config = await getEmailConfig(context);
  if (!config) return true; // Default: enabled if no config saved

  switch (type) {
    case 'welcome':
      return config.notifyOnRegister !== false;
    case 'ad_created':
      return config.notifyOnAdCreate !== false;
    case 'qr_scan':
      return config.notifyOnQrScan !== false;
    default:
      return true; // System/security notifications always sent
  }
}

/**
 * Sends both in-app notification (Supabase user_notifications table) and email via Resend.
 * Respects admin notification rules and uses saved templates with JSON-LD.
 */
export async function notifyUser({ userId, email, title, body, link, type = 'system', templateId, templateVars, context }: NotifyUserPayload) {
  // Check if this notification type is enabled
  const enabled = await isNotificationEnabled(type, context);
  if (!enabled) {
    console.log(`[Notification Service] Notification type '${type}' is disabled by admin.`);
    return { success: true, skipped: true };
  }

  // 1. Save in-app notification to Supabase if userId provided
  if (userId) {
    try {
      await supabaseAdminClient.from('user_notifications').insert({
        user_id: userId,
        title,
        body,
        type,
        link: link || null,
        is_read: false
      });
    } catch (err) {
      console.warn('[Notification Service] Could not insert in-app notification:', err);
    }
  }

  // 2. Send email notification if email provided
  if (email) {
    let emailHtml = '';
    let emailSubject = `ميمارت | ${title}`;
    let jsonLd = '';

    // Try to use saved template if templateId is provided
    if (templateId) {
      const template = await findTemplate(templateId, context);
      if (template) {
        emailHtml = template.htmlContent;
        emailSubject = template.subject;
        jsonLd = template.jsonLd || '';

        // Replace template variables
        if (templateVars) {
          for (const [key, val] of Object.entries(templateVars)) {
            const placeholder = `{{${key}}}`;
            emailHtml = emailHtml.replaceAll(placeholder, val);
            emailSubject = emailSubject.replaceAll(placeholder, val);
            jsonLd = jsonLd.replaceAll(placeholder, val);
          }
        }
      }
    }

    // Fallback to generic template if no custom template found
    if (!emailHtml) {
      emailHtml = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb;">
        <div style="text-align: center; border-bottom: 1px solid #f3f4f6; padding-bottom: 16px; margin-bottom: 20px;">
          <h1 style="color: #111827; font-size: 20px; margin: 0;">MeaMart ميمارت</h1>
        </div>
        <h2 style="color: #1f2937; font-size: 18px;">${title}</h2>
        <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">${body}</p>
        ${link ? `
          <div style="margin-top: 24px; text-align: center;">
            <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #fca311; color: #111827; font-weight: bold; text-decoration: none; border-radius: 8px;">عرض التفاصيل</a>
          </div>
        ` : ''}
        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #f3f4f6; text-align: center; color: #9ca3af; font-size: 12px;">
          هذه رسالة تلقائية من منصة ميمارت.
        </div>
      </div>
    `;
    }

    await sendEmail({ to: email, subject: emailSubject, html: emailHtml, jsonLd }, context);
  }

  return { success: true };
}

/**
 * Send Ad Created Notification (uses saved template if available)
 */
export async function notifyAdCreated(userId: string, email: string | undefined, adTitle: string, adLink: string, context?: any) {
  return notifyUser({
    userId,
    email,
    title: 'تم نشر إعلانك بنجاح',
    body: `تم نشر إعلانك الجديد "${adTitle}" وهو متاح الآن للجميع في منصة ميمارت.`,
    link: adLink,
    type: 'ad_created',
    templateId: 'new_ad',
    templateVars: { adTitle, adUrl: adLink, adId: adLink.split('/').pop() || '' },
    context
  });
}

/**
 * Send Welcome Notification (uses saved template if available)
 */
export async function notifyWelcome(userId: string, email: string, userName: string, confirmationUrl: string, context?: any) {
  return notifyUser({
    userId,
    email,
    title: 'مرحباً بك في ميمارت',
    body: `يسعدنا انضمامك يا ${userName} إلى منصة ميمارت. حسابك أصبح جاهزاً.`,
    link: confirmationUrl,
    type: 'welcome',
    templateId: 'welcome',
    templateVars: { userName, confirmationUrl },
    context
  });
}

/**
 * Send QR Scan / Lead Notification (uses saved template if available)
 */
export async function notifyQrScan(userId: string, email: string | undefined, adTitle: string, reportUrl: string, context?: any) {
  return notifyUser({
    userId,
    email,
    title: 'نشاط جديد على الباركود',
    body: `قام زائر بمسح الباركود الخاص بإعلانك "${adTitle}" والتفاعل معه.`,
    link: reportUrl,
    type: 'qr_scan',
    templateId: 'qr_scan',
    templateVars: { adTitle, reportUrl },
    context
  });
}
