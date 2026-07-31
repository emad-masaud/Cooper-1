import type { APIContext } from 'astro';
import { kvGet, kvPut } from './kv';
import { categoriesStructure } from './categories';
import { citiesMap } from './cities';
import { getEnv } from './env';
import { createSupabaseAdminServerClient } from './supabase';

export interface SanadLog {
  id: string;
  timestamp: string;
  action: string;
  prompt: string;
  status: string;
  response: string;
}

/**
 * Log Sanad actions to KV store
 */
export async function logSanadAction(
  context: any, 
  action: string, 
  prompt: string, 
  status: string, 
  response: string
): Promise<void> {
  try {
    const logsStr = await kvGet(context, 'sanad_logs') || '[]';
    const logs: SanadLog[] = JSON.parse(logsStr);
    
    logs.unshift({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      prompt,
      status,
      response: response.length > 500 ? response.slice(0, 500) + '...' : response
    });

    // Limit to last 50 logs
    const trimmedLogs = logs.slice(0, 50);
    await kvPut(context, 'sanad_logs', JSON.stringify(trimmedLogs));
  } catch (err) {
    console.error('Failed to log Sanad action:', err);
  }
}

/**
 * Get all Sanad logs from KV store
 */
export async function getSanadLogs(context: any): Promise<SanadLog[]> {
  try {
    const logsStr = await kvGet(context, 'sanad_logs') || '[]';
    return JSON.parse(logsStr);
  } catch (err) {
    console.error('Failed to retrieve Sanad logs:', err);
    return [];
  }
}

function detectLanguage(text: string): 'ar' | 'en' {
  return /[\u0600-\u06FF]/.test(text) ? 'ar' : 'en';
}

async function getMeachatSubscriber(
  phone: string,
  token: string
): Promise<any | null> {
  try {
    const res = await fetch(
      `https://app.meachat.com/api/v1/subscriber?phone=${encodeURIComponent(phone)}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.subscriber ?? null;
  } catch {
    return null;
  }
}

/**
 * Core search and conversational agent brain for Sanad (Non-AI Version)
 */
export async function handleSanadChat(
  context: any,
  message: string,
  phoneNumber?: string,
  sellerId?: string,
  firstName?: string,
  customFields?: any,
  botId?: string
): Promise<string> {
  const normMsg = message.toLowerCase().trim();
  let resultData = '';
  let actionName = 'general_chat';

  const formatAdInfo = (p: any): string => {
    const adUrl = `https://meamart.com/ar/ads/${p.slug}`;
    const customFieldsAd = p.adData?.custom_fields || {};
    const affiliateLink = customFieldsAd.affiliate_link || customFieldsAd.purchase_link || customFieldsAd.link || p.adData?.video_url || '';
    const price = p.adData?.listing_price || 0;
    
    if (affiliateLink && !p.adData?.contact_whatsapp && !p.adData?.contact_phone) {
      return `- ${p.title} بقيمة ${price} ﷼ - رابط الشراء المباشر: ${affiliateLink}`;
    }
    return `- ${p.title} بقيمة ${price} ﷼ (رابط الإعلان: ${adUrl})`;
  };

  const formatProductInfo = (p: any): string => {
    const productUrl = `https://meamart.com/ar/market/${p.id}`;
    const price = p.price || p.regular_price || 0;
    const sku = p.sku ? ` (رمز المنتج: ${p.sku})` : '';
    return `- منتج للشراء المباشر: ${p.name}${sku} بقيمة ${price} ﷼ (رابط الشراء: ${productUrl})`;
  };

  // ─── Chatbot Senders / Contacts Tracking ───
  let country = 'Other';
  let isNewUser = false;
  let userMessageCount = 1;

  if (phoneNumber) {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('966')) country = 'السعودية';
    else if (cleanPhone.startsWith('971')) country = 'الإمارات';
    else if (cleanPhone.startsWith('965')) country = 'الكويت';
    else if (cleanPhone.startsWith('973')) country = 'البحرين';
    else if (cleanPhone.startsWith('968')) country = 'عمان';
    else if (cleanPhone.startsWith('974')) country = 'قطر';

    // جلب بيانات المشترك من MeaChat
    const meachatToken = getEnv(context, 'MEACHAT_WEBHOOK_TOKEN', '');
    const subscriber = phoneNumber
      ? await getMeachatSubscriber(phoneNumber, meachatToken)
      : null;

    const cf = subscriber?.custom_fields ?? {};
    const subscriberContext = {
      name:          subscriber?.first_name ?? firstName ?? 'العميل',
      country:       cf.country             ?? country,
      language:      cf.language            ?? detectLanguage(message),
      gender:        cf.gender              ?? null,
      intent_type:   cf.intent_type         ?? null,
      message_count: parseInt(cf.message_count ?? '0'),
      is_new:        !cf.message_count || parseInt(cf.message_count) <= 1,
    };

    // Update variables
    country = subscriberContext.country;
    isNewUser = subscriberContext.is_new;
    userMessageCount = subscriberContext.message_count + 1;
    firstName = subscriberContext.name;
    customFields = { ...customFields, subscriber_metadata: subscriberContext };

    try {
      const supabase = createSupabaseAdminServerClient(context);
      
      const { data: existingMessages } = await supabase
        .from('chatbot_messages')
        .select('id')
        .eq('phone', cleanPhone)
        .limit(1);

      if (!existingMessages || existingMessages.length === 0) {
        isNewUser = true;
      }
    } catch (dbErr) {
      console.error('Failed to check existing messages:', dbErr);
    }
  }
  // ─── Dynamic Prefix Logic (Welcome, Holiday) ───
  let prefix = '';
  if (isNewUser) {
    prefix += 'أهلاً بك في منصة ميمارت!\n';
  }

  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  if (month === 9 && date === 23) {
    prefix += '🇸🇦 كل عام والوطن الغالي بألف خير بمناسبة اليوم الوطني السعودي!\n';
  } else if (month === 2 && date === 22) {
    prefix += '🇸🇦 يوم تأسيس سعيد للمملكة العربية السعودية!\n';
  }

  // ─── Query Saved Responses Library First ───
  try {
    const supabase = createSupabaseAdminServerClient(context);
    let query = supabase
      .from('chatbot_responses')
      .select('*')
      .eq('trigger_pattern', normMsg);

    if (sellerId) {
      query = query.eq('seller_id', sellerId);
    } else {
      query = query.is('seller_id', null);
    }

    const { data: matchedResponse } = await query.maybeSingle();

    if (matchedResponse) {
      // Update use count
      await supabase
        .from('chatbot_responses')
        .update({ use_count: (matchedResponse.use_count || 0) + 1 })
        .eq('id', matchedResponse.id);

      const responseText = matchedResponse.custom_reply || matchedResponse.default_reply;
      const finalReply = prefix ? `${prefix}\n${responseText}` : responseText;
      
      try {
        const cleanPhone = phoneNumber ? phoneNumber.replace(/[^0-9]/g, '') : '';
        const insertData: any = {
          phone: cleanPhone,
          first_name: firstName || 'مستخدم',
          user_message: message,
          ai_proposed_reply: finalReply,
          status: 'approved',
          custom_fields: customFields || {},
          whatsapp_bot_id: botId && !isNaN(parseInt(botId)) ? parseInt(botId) : null
        };
        if (sellerId) insertData.seller_id = sellerId;
        await supabase.from('chatbot_messages').insert(insertData);
      } catch (logErr) {
        console.error('Failed to log matched response:', logErr);
      }

      await logSanadAction(context, 'cached_reply', message, 'success', finalReply);
      return finalReply;
    }
  } catch (dbErr) {
    console.error('Failed to query chatbot response:', dbErr);
  }

  try {
    // 1. Check intent: My Ads (إعلاناتي)
    if (normMsg.includes('إعلاناتي') || normMsg.includes('اعلاناتي') || normMsg.includes('my ads')) {
      actionName = 'my_ads';
      if (!phoneNumber) {
        resultData = 'أهلاً بك! لعرض إعلاناتك يرجى مراسلتي من رقم الجوال المسجل به إعلانك في المنصة.';
      } else {
        const posts: any[] = [];
        const myPosts = posts.filter(p => {
          const adPhone = p.adData?.contact_phone || '';
          const adWa = p.adData?.contact_whatsapp || '';
          const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
          return (adPhone.includes(cleanPhone) || adWa.includes(cleanPhone)) && p.isAd;
        });

        if (myPosts.length === 0) {
          resultData = 'لم أجد أي إعلانات نشطة مسجلة برقم جوالك الحالي في ميمارت.';
        } else {
          resultData = 'إليك قائمة إعلاناتك النشطة في ميمارت:\n' + myPosts.map(formatAdInfo).join('\n');
        }
      }
    }
    // 2. Check intent: New Ads (الجديدة / أحدث الإعلانات)
    else if (normMsg.includes('الجديد') || normMsg.includes('الجديدة') || normMsg.includes('new ads')) {
      actionName = 'new_ads';
      const posts: any[] = [];
      const ads = posts.filter(p => p.isAd).slice(0, 5);
      if (ads.length === 0) {
        resultData = 'لا توجد إعلانات منشورة حالياً.';
      } else {
        resultData = 'أحدث الإعلانات المنشورة في ميمارت:\n' + ads.map(formatAdInfo).join('\n');
      }
    }
    // 3. Check intent: Trending/Featured (الترند / المميز)
    else if (normMsg.includes('ترند') || normMsg.includes('الترند') || normMsg.includes('المميز') || normMsg.includes('trending')) {
      actionName = 'trending';
      const posts: any[] = [];
      const ads = posts.filter(p => p.isAd && p.adData?.featured_flag).slice(0, 5);
      const fallbackAds = ads.length > 0 ? ads : posts.filter(p => p.isAd).slice(0, 5);
      resultData = 'أكثر الإعلانات تميزاً وطلباً حالياً في ميمارت:\n' + fallbackAds.map(formatAdInfo).join('\n');
    }
    // 4. Check intent: Ad Creation (بيع / نشر إعلان)
    else if (
      normMsg.includes('بيع') || normMsg.includes('ابيع') || normMsg.includes('أبيع') || 
      normMsg.includes('عرض') || normMsg.includes('انشر') || normMsg.includes('نشر') || 
      normMsg.includes('اضافة') || normMsg.includes('إضافة') || 
      (normMsg.includes('اعلان') && !normMsg.includes('اعلاناتي')) || 
      (normMsg.includes('إعلان') && !normMsg.includes('إعلاناتي'))
    ) {
      actionName = 'create_ad_draft';
      // Local regex extractor to get title, price
      const priceMatch = message.match(/(\d+)\s*(الف|ألف)?\s*(ريال)?/);
      let extractedPrice = 0;
      if (priceMatch) {
        extractedPrice = Number(priceMatch[1]);
        if (priceMatch[2]) {
          extractedPrice *= 1000;
        }
      }
      
      const cleanTitle = message.replace(/(أبي أبيع|ابيع|أبيع|عرض|انشر|نشر|بـ|سعر|ريال|الف|ألف|ممتازة|بحالة|جديدة|جديد|للبيع)/g, '').trim().substring(0, 35);
      const extractedTitle = cleanTitle || 'إعلان معروض للبيع';

      const sessionId = crypto.randomUUID();
      const sessionKey = `import_session_${sessionId}`;
      const sessionData = {
        brandName: 'ميمارت',
        contact_whatsapp: phoneNumber || '',
        contact_phone: phoneNumber || '',
        categoryKey: 'used-items',
        lang: 'ar',
        items: [{
          title: extractedTitle,
          price: extractedPrice,
          description: message
        }]
      };

      await kvPut(context, sessionKey, JSON.stringify(sessionData));
      const redirectUrl = `https://meamart.com/ar/ads/import-session?sessionId=${sessionId}`;
      
      resultData = `لقد قمت بتجهيز مسودة إعلانك بنجاح على ميمارت!
العنوان: ${extractedTitle}
السعر: ${extractedPrice > 0 ? extractedPrice + ' ﷼' : 'غير محدد'}

اضغط على الرابط التالي لمراجعة الإعلان وتأكيد نشره فوراً:
${redirectUrl}`;
    }
    // 5. Check intent: Categories Lookup (التصنيفات / الأقسام)
    else if (
      normMsg.includes('تصنيف') || normMsg.includes('قسم') || normMsg.includes('اقسام') || 
      normMsg.includes('تصنيفات') || normMsg.includes('category') || normMsg.includes('categories')
    ) {
      actionName = 'categories_info';
      const catList = categoriesStructure.map(c => `- ${c.labelAr}`).join('\n');
      resultData = `التصنيفات الرئيسية المتاحة في ميمارت هي:\n${catList}\n\nيمكنك البحث عن أي سلعة في هذه التصنيفات مباشرة.`;
    }
    // 6. Check intent: Cities Lookup (المدن / المحافظات)
    else if (normMsg.includes('مدن') || normMsg.includes('مدينة') || normMsg.includes('المدن') || normMsg.includes('cities')) {
      actionName = 'cities_info';
      const citiesList = Object.values(citiesMap)
        .map(c => c.ar)
        .filter((value, index, self) => self.indexOf(value) === index)
        .slice(0, 15)
        .join(' - ');
      resultData = `المدن المدعومة والمتاحة في ميمارت تشمل: ${citiesList} وغيرها الكثير من مدن ومحافظات المملكة.`;
    }
    // 7. Check intent: Search (ابحث عن / بحث)
    else if (
      normMsg.includes('ابحث') || normMsg.includes('بحث') || normMsg.includes('search') || 
      normMsg.includes('أريد') || normMsg.includes('اريد') || normMsg.includes('شراء') || 
      normMsg.includes('اشتري') || normMsg.includes('أشتري')
    ) {
      actionName = 'search_ads';
      const searchQuery = message.replace(/(ابحث عن|ابحث لي عن|بحث عن|اريد|أريد|search|شراء|اشتري|أشتري)/g, '').trim();
      
      // Fetch classified ads
      const supabase = createSupabaseAdminServerClient(context);
      const { data: adsData } = await supabase
        .from('ads')
        .select('*')
        .or(`listing_title.ilike.%${searchQuery}%,listing_description.ilike.%${searchQuery}%`)
        .limit(5);

      const matchedAds = adsData || [];

      if (matchedAds.length === 0) {
        resultData = `لم أجد أي إعلانات مطابقة لبحثك عن "${searchQuery}" في منصة ميمارت حالياً.`;
      } else {
        resultData = `إليك النتائج المطابقة لبحثك عن "${searchQuery}" في ميمارت:\n`;
        resultData += `\n*الإعلانات المبوبة:*\n` + matchedAds.map(formatAdInfo).join('\n') + `\n`;
      }
    }
    // 8. Default General Chat (دردشة عامة — Gemini فقط)
    else {
      actionName = 'general_chat';
      
      const fallbackText = 'مرحباً بك في ميمارت! أنا مساعدك سند. يمكنك أن تطلب مني البحث عن إعلانات، أو معرفة أحدث الإعلانات والترند، أو كتابة تفاصيل سلعة لإنشاء إعلان جديد لها فوراً.';
      
      // Fetch Ad Info if request ID is in customFields
      let adContext = null;
      if (customFields && customFields.request) {
        try {
          const requestId = customFields.request.trim();
          const supabase = createSupabaseAdminServerClient(context);
          const { data: adData } = await supabase
            .from('ads')
            .select('*')
            .eq('id', requestId.replace('MM-', ''))
            .maybeSingle();
            
          if (adData) {
             adContext = {
               عنوان_الإعلان: adData.listing_title,
               السعر: adData.listing_price,
               القسم: adData.category_slug,
               معلومات_إضافية: adData.custom_fields || {},
             };
             
             customFields.ad_details = adContext;
          }
        } catch(e) {
          console.error('Failed to fetch ad details for AI context:', e);
        }
      }

      const llmResponse = await callGemini(context, message, customFields, botId);
      
      if (llmResponse) {
        resultData = llmResponse;
        actionName = 'gemini_chat_reply';
      } else {
        resultData = fallbackText;
      }
    }

    // --- Log the full interaction in chatbot_messages (Live Table) ---
    try {
      const supabase = createSupabaseAdminServerClient(context);
      const cleanPhone = phoneNumber ? phoneNumber.replace(/[^0-9]/g, '') : '';
      const insertData: any = {
        phone: cleanPhone,
        first_name: firstName || 'مستخدم',
        user_message: message,
        ai_proposed_reply: resultData,
        status: actionName === 'cached_reply' ? 'approved' : 'pending',
        custom_fields: customFields || {},
        whatsapp_bot_id: botId && !isNaN(parseInt(botId)) ? parseInt(botId) : null
      };
      if (sellerId) insertData.seller_id = sellerId;
      
      await supabase.from('chatbot_messages').insert(insertData);
    } catch (dbErr) {
      console.error('Failed to log message in database:', dbErr);
    }

    await logSanadAction(context, actionName, message, 'success', resultData);
    return resultData;

  } catch (err: any) {
    console.error('Sanad chat error:', err);
    await logSanadAction(context, actionName, message, 'error', err.message || 'System error');
    return 'عذراً، حدث خطأ أثناء معالجة طلبك عبر سند. يرجى المحاولة لاحقاً.';
  }
}

/**
 * Call Gemini 2.5 Flash to generate assistant response for General Chat Fallback
 */
async function callGemini(context: APIContext, promptText: string, customFields?: any, botId?: string): Promise<string> {
  const apiKey = getEnv(context.locals, 'GEMINI_API_KEY') || process.env.GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    console.warn('Gemini API key is not configured, skipping AI generation.');
    return '';
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  let systemPrompt = `أنت مساعد ذكي لمنصة ميمارت (MeaMart) لبيع وشراء الإعلانات المبوبة. اسمك سند.
ترد على العميل باللغة العربية الفصحى بنبرة خليجية واضحة ومباشرة بلا حشو ولا تزيين.
تجنب الصور البلاغية والقصص الدرامية. لا تستخدم علامات تنسيق مثل النجوم أو الشرطات أو الهاشتاقات في النص.
اكتب إجابتك كشات بوت واتساب في أسطر منفصلة واضحة ومختصرة للغاية.

*ملاحظة هامة جداً*: إذا كنت تريد سؤال العميل ليختار بين خيارات محددة (مثل نوع الإعلان أو القسم)، فيجب عليك الرد بصيغة JSON التالية حصراً لكي تظهر له كأزرار تفاعلية:
{
  "message": "نص الرسالة هنا",
  "buttons": ["خيار 1", "خيار 2", "خيار 3"]
}
الحد الأقصى للأزرار هو 3 أزرار، وكل زر 20 حرف كحد أقصى. أما إذا كان ردك نصياً فقط ولا يتطلب أزرار، فرد بالنص العادي دون JSON.`;

  if (customFields && customFields.subscriber_metadata) {
    const sub = customFields.subscriber_metadata;
    systemPrompt += `
## معلومات العميل الحالي
- الاسم: ${sub.name}
- البلد: ${sub.country}
- اللغة المفضلة: ${sub.language}
- الجنس: ${sub.gender ?? 'غير محدد'}
- آخر نية: ${sub.intent_type ?? 'غير محدد'}
- عدد رسائله السابقة: ${sub.message_count}
- عميل جديد: ${sub.is_new ? 'نعم' : 'لا'}

## تعليمات الرد
- إذا كان جديداً: رحّب به بدفء واسأله عن احتياجه
- إذا كان متكرراً: اعترف بوجوده السابق وأسرّع الوصول لهدفه
- خاطبه بصيغة جنسه إذا كانت معروفة (أخوي/أختي)
- إذا عنده نية سابقة مثل INTENT_ITEM اقترح استكمالها
- الرد بلغته المفضلة دائماً
`;
    const { subscriber_metadata, ...otherFields } = customFields;
    if (Object.keys(otherFields).length > 0) {
      systemPrompt += `\nمعلومات إضافية عن طلب العميل (سياق): ${JSON.stringify(otherFields)}`;
    }
  } else if (customFields && Object.keys(customFields).length > 0) {
    systemPrompt += `\nمعلومات إضافية عن طلب العميل (سياق): ${JSON.stringify(customFields)}`;
  }
  if (botId) {
    systemPrompt += `\nمعرف البوت الحالي: ${botId}`;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${systemPrompt}\n\nسؤال العميل: ${promptText}` }]
          }
        ]
      })
    });

    if (!res.ok) return '';
    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ? text.trim() : '';
  } catch (err) {
    console.error('Gemini API call failed:', err);
    return '';
  }
}
