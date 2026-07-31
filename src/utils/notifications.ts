/**
 * src/utils/notifications.ts
 * Unified Omnichannel Notification Engine (WhatsApp via MeaChat + In-App Database + Email)
 * نظام تنبيهات متكامل لإشعارات الواتساب والتطبيق والبريد الإلكتروني
 */

import { meachat } from './meachat';
import { notifyUser } from './email';

export interface OmnichannelNotificationPayload {
  userId?: string;
  phone?: string;
  email?: string;
  title: string;
  body: string;
  link?: string;
  type?: 'ad_created' | 'ad_updated' | 'security' | 'system' | 'lead';
  whatsappMessage?: string;
  recipientName?: string;
}

/**
 * Send unified notification across all enabled channels:
 * 1. WhatsApp Notification via MeaChat API
 * 2. In-App Notification (Supabase user_notifications)
 * 3. Transactional Email via Resend
 */
export async function sendOmnichannelNotification({
  userId,
  phone,
  email,
  title,
  body,
  link,
  type = 'system',
  whatsappMessage,
  recipientName = 'عميل ميمارت'
}: OmnichannelNotificationPayload) {
  const results: {
    whatsapp?: { success: boolean; error?: string; formattedPhone?: string };
    inAppAndEmail?: { success: boolean; error?: string };
  } = {};

  // 1. Send WhatsApp Notification
  if (phone) {
    const waText = whatsappMessage || `${title}\n\n${body}${link ? `\n\nالرابط:\nhttps://meamart.com${link}` : ''}`;
    try {
      results.whatsapp = await meachat.sendSmartNotification(phone, waText, recipientName);
    } catch (err: any) {
      console.error('[Notification Engine] WhatsApp delivery failed:', err);
      results.whatsapp = { success: false, error: err?.message || String(err) };
    }
  }

  // 2. Send In-App & Email Notification
  if (userId || email) {
    try {
      results.inAppAndEmail = await notifyUser({
        userId,
        email,
        title,
        body,
        link,
        type: type as any
      });
    } catch (err: any) {
      console.warn('[Notification Engine] In-App/Email delivery failed:', err);
      results.inAppAndEmail = { success: false, error: err?.message || String(err) };
    }
  }

  return results;
}

/**
 * Trigger notification when a new listing/ad is successfully published
 */
export async function notifyAdPublished({
  userId,
  phone,
  email,
  adId,
  title,
  price,
  currency = 'SAR',
  city = '',
  isAr = true,
  recipientName = 'عميل ميمارت'
}: {
  userId?: string;
  phone?: string;
  email?: string;
  adId: string;
  title: string;
  price?: number | string;
  currency?: string;
  city?: string;
  isAr?: boolean;
  recipientName?: string;
}) {
  const adUrl = `/ar/ads/${adId}`;
  const fullUrl = `https://meamart.com${adUrl}`;
  
  const waMessage = isAr
    ? `مرحباً بك في ميمارت! 🎉\n\nتم نشر إعلانك بنجاح وهو متاح الآن للجميع:\n\n*العنوان:* ${title}\n*السعر:* ${price ? `${price} ${currency}` : 'غير محدد'}${city ? `\n*المدينة:* ${city}` : ''}\n*حالة الإعلان:* منشور نشط ✅\n\n*رابط الإعلان:* \n${fullUrl}\n\nشكراً لثقتك بمنصة ميمارت!`
    : `Welcome to MeaMart! 🎉\n\nYour ad has been successfully published and is now live:\n\n*Title:* ${title}\n*Price:* ${price ? `${price} ${currency}` : 'N/A'}${city ? `\n*City:* ${city}` : ''}\n*Status:* Published Active ✅\n\n*Ad Link:* \n${fullUrl}\n\nThank you for choosing MeaMart!`;

  return sendOmnichannelNotification({
    userId,
    phone,
    email,
    title: isAr ? 'تم نشر إعلانك بنجاح 🎉' : 'Ad Published Successfully 🎉',
    body: isAr
      ? `تم نشر إعلانك "${title}" بنجاح في ميمارت وهو متاح الآن للزوار والمشترين.`
      : `Your ad "${title}" has been successfully published on MeaMart and is now live.`,
    link: adUrl,
    type: 'ad_created',
    whatsappMessage: waMessage,
    recipientName
  });
}

/**
 * Trigger notification when an existing listing/ad is successfully updated
 */
export async function notifyAdUpdated({
  userId,
  phone,
  email,
  adId,
  title,
  price,
  currency = 'SAR',
  isAr = true,
  recipientName = 'عميل ميمارت'
}: {
  userId?: string;
  phone?: string;
  email?: string;
  adId: string;
  title: string;
  price?: number | string;
  currency?: string;
  isAr?: boolean;
  recipientName?: string;
}) {
  const adUrl = `/ar/ads/${adId}`;
  const fullUrl = `https://meamart.com${adUrl}`;
  
  const waMessage = isAr
    ? `يا هلا بك! 🔄\n\nتم تحديث إعلانك بنجاح في منصة ميمارت:\n\n*العنوان:* ${title}\n*السعر:* ${price ? `${price} ${currency}` : 'غير محدد'}\n*حالة الإعلان:* محدّث ونشط ✅\n\n*رابط الإعلان:* \n${fullUrl}\n\nشكراً لاستخدامك ميمارت!`
    : `Hello! 🔄\n\nYour ad has been successfully updated on MeaMart:\n\n*Title:* ${title}\n*Price:* ${price ? `${price} ${currency}` : 'N/A'}\n*Status:* Updated Active ✅\n\n*Ad Link:* \n${fullUrl}\n\nThank you for using MeaMart!`;

  return sendOmnichannelNotification({
    userId,
    phone,
    email,
    title: isAr ? 'تم تحديث إعلانك بنجاح 🔄' : 'Ad Updated Successfully 🔄',
    body: isAr
      ? `تم حفظ التعديلات على إعلانك "${title}" بنجاح.`
      : `Changes to your ad "${title}" have been saved successfully.`,
    link: adUrl,
    type: 'ad_updated',
    whatsappMessage: waMessage,
    recipientName
  });
}
