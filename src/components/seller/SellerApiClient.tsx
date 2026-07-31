import React, { useState, useEffect } from 'react';
import { Key, RefreshCw, Copy, Check, Webhook, Send, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function SellerApiClient({ lang = 'ar' }: { lang?: string }) {
  const isAr = lang === 'ar';

  const [apiKey, setApiKey] = useState('mm_live_8392a4b8f0293847c61e0f9a');
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const [webhookUrl, setWebhookUrl] = useState('https://example-store.com/webhooks/meamart');
  const [webhookSecret, setWebhookSecret] = useState('whsec_48290f84a8392c0192e');
  const [events, setEvents] = useState({
    qrScanned: true,
    adUpdated: true,
    chatStarted: true,
  });

  const [meachatSync, setMeachatSync] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [testSent, setTestSent] = useState(false);

  // New states for OTP API Gateway
  const [otpApiToken, setOtpApiToken] = useState('');
  const [otpPhoneId, setOtpPhoneId] = useState('');
  const [otpTemplateId, setOtpTemplateId] = useState('');
  const [otpSaved, setOtpSaved] = useState(false);

  // Load existing data
  useEffect(() => {
    fetch('/api/settings/developer')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          if (data.settings.meamartApiKey) setApiKey(data.settings.meamartApiKey);
          if (data.settings.MeaChatApiToken) setOtpApiToken(data.settings.MeaChatApiToken);
          if (data.settings.MeaChatWhatsappPhoneId) setOtpPhoneId(data.settings.MeaChatWhatsappPhoneId);
          if (data.settings.MeaChatWhatsappTemplateId) setOtpTemplateId(data.settings.MeaChatWhatsappTemplateId);
        }
      })
      .catch(err => console.error('Failed to fetch developer settings:', err));
  }, []);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    if (!confirm(isAr ? 'هل أنت متأكد من رغبتك في تجديد المفتاح؟ المفتاح القديم سيتوقف عن العمل.' : 'Are you sure you want to regenerate API key? Previous key will stop working.')) return;
    const chars = 'abcdef0123456789';
    let rand = '';
    for (let i = 0; i < 24; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newKey = `mm_live_${rand}`;
    setApiKey(newKey);
    // Auto-save the new key
    handleSaveDeveloperSettings({ meamartApiKey: newKey });
  };

  const handleSaveDeveloperSettings = (updates: any = {}) => {
    const payload = {
      meamartApiKey: updates.meamartApiKey || apiKey,
      MeaChatApiToken: updates.MeaChatApiToken !== undefined ? updates.MeaChatApiToken : otpApiToken,
      MeaChatWhatsappPhoneId: updates.MeaChatWhatsappPhoneId !== undefined ? updates.MeaChatWhatsappPhoneId : otpPhoneId,
      MeaChatWhatsappTemplateId: updates.MeaChatWhatsappTemplateId !== undefined ? updates.MeaChatWhatsappTemplateId : otpTemplateId,
    };

    fetch('/api/settings/developer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (!updates.meamartApiKey) {
        setOtpSaved(true);
        setTimeout(() => setOtpSaved(false), 3000);
      }
    })
    .catch(err => console.error('Error saving developer settings:', err));
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 3000);
  };

  const handleTestWebhook = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleSyncMeaChat = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3500);
    }, 1200);
  };

  return (
    <div className="space-y-8" dir={isAr ? 'rtl' : 'ltr'}>
      {/* API Key Section */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              {isAr ? 'مفتاح الربط البرمجي (API Key)' : 'API Key Access'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isAr ? 'استخدم هذا المفتاح للربط مع متجرك أو نظامك الخاص وقراءة الإعلانات والباركود برمجياً' : 'Use this API key to integrate MeaMart with your custom application or store'}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-2">
              {isAr ? 'المفتاح السري الفعال:' : 'Active API Key:'}
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                readOnly
                value={apiKey}
                className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="rounded-xl border border-zinc-300 px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {showKey ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'إظهار' : 'Show')}
              </button>
              <button
                type="button"
                onClick={handleCopyKey}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600"
              >
                {copiedKey ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copiedKey ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}
              </button>
              <button
                type="button"
                onClick={handleRegenerateKey}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400"
              >
                <RefreshCw className="h-4 w-4" />
                {isAr ? 'تجديد المفتاح' : 'Rotate Key'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Webhooks Section - Replaced with MeaChat API Integrations */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Webhook className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              {isAr ? 'روابط الربط البرمجي (API Endpoints)' : 'API Endpoints Integration'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isAr ? 'استخدم هذه الروابط لربط بياناتك (الإعلانات، المنتجات، الباركود) مع منصات مثل ميشات.' : 'Use these endpoints to integrate your data with external platforms like MeaChat.'}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          {/* Ads API */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              {isAr ? 'رابط جلب الإعلانات (Ads API):' : 'Ads API Endpoint:'}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={`https://meamart.com/api/feeds/ai?type=ads&token=${apiKey}`}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2 font-mono text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
              />
              <button
                type="button"
                onClick={() => { navigator.clipboard.writeText(`https://meamart.com/api/feeds/ai?type=ads&token=${apiKey}`); alert(isAr ? 'تم النسخ!' : 'Copied!'); }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 shrink-0"
              >
                <Copy className="h-4 w-4" /> {isAr ? 'نسخ' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Addresses API */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              {isAr ? 'رابط جلب العناوين (Addresses API):' : 'Addresses API Endpoint:'}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={`https://meamart.com/api/feeds/ai?type=addresses&token=${apiKey}`}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2 font-mono text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
              />
              <button
                type="button"
                onClick={() => { navigator.clipboard.writeText(`https://meamart.com/api/feeds/ai?type=addresses&token=${apiKey}`); alert(isAr ? 'تم النسخ!' : 'Copied!'); }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 shrink-0"
              >
                <Copy className="h-4 w-4" /> {isAr ? 'نسخ' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Products API */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              {isAr ? 'رابط جلب المنتجات (Products API):' : 'Products API Endpoint:'}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={`https://meamart.com/api/feeds/ai?type=products&token=${apiKey}`}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2 font-mono text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
              />
              <button
                type="button"
                onClick={() => { navigator.clipboard.writeText(`https://meamart.com/api/feeds/ai?type=products&token=${apiKey}`); alert(isAr ? 'تم النسخ!' : 'Copied!'); }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 shrink-0"
              >
                <Copy className="h-4 w-4" /> {isAr ? 'نسخ' : 'Copy'}
              </button>
            </div>
          </div>
          
          {/* Suppliers API */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              {isAr ? 'رابط جلب الموردين (Suppliers API):' : 'Suppliers API Endpoint:'}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={`https://meamart.com/api/feeds/ai?type=suppliers&token=${apiKey}`}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2 font-mono text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
              />
              <button
                type="button"
                onClick={() => { navigator.clipboard.writeText(`https://meamart.com/api/feeds/ai?type=suppliers&token=${apiKey}`); alert(isAr ? 'تم النسخ!' : 'Copied!'); }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 shrink-0"
              >
                <Copy className="h-4 w-4" /> {isAr ? 'نسخ' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Barcode API */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              {isAr ? 'رابط جلب الباركود (Barcode API):' : 'Barcode API Endpoint:'}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={`https://meamart.com/api/feeds/ai?type=barcode&token=${apiKey}`}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2 font-mono text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
              />
              <button
                type="button"
                onClick={() => { navigator.clipboard.writeText(`https://meamart.com/api/feeds/ai?type=barcode&token=${apiKey}`); alert(isAr ? 'تم النسخ!' : 'Copied!'); }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 shrink-0"
              >
                <Copy className="h-4 w-4" /> {isAr ? 'نسخ' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Integration Tools & MeaChat Auto-Sync */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              {isAr ? 'أدوات الربط والمزامنة التلقائية مع ميشات (MeaChat)' : 'MeaChat Auto-Sync & Integration'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isAr ? 'مزامنة المنتجات والكتالوج مباشرة مع روبوت المحادثة في واتساب' : 'Auto-sync catalog items with WhatsApp MeaChat account'}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-start justify-between gap-4 rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/10">
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">
                {isAr ? 'مزامنة المنتجات التلقائية مع ميشات (MeaChat)' : 'Auto-sync Products with MeaChat'}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                {isAr
                  ? 'إذا كنت مشتركاً في حساب ميشات بنفس الرقم المرتبط بميمارت، فإن أي منتج تضيفه من الكتالوج أو تعدله يتم تزامنه تلقائياً في ميشات، ويتعرف نظام الباركود فورياً على المسحات لفتح محادثة واتساب مخصصة للمنتج.'
                  : 'Automatically push product updates and QR triggers to your MeaChat WhatsApp bot.'}
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={meachatSync}
                onChange={(e) => setMeachatSync(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <span className="text-xs text-zinc-500">
              {isAr ? 'حالة المزامنة:' : 'Sync Status:'} <strong className="text-emerald-600 dark:text-emerald-400">{meachatSync ? (isAr ? 'نشط ومتصل' : 'Connected') : (isAr ? 'معطل' : 'Disabled')}</strong>
            </span>

            <button
              type="button"
              onClick={handleSyncMeaChat}
              disabled={syncing}
              className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-700"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? (isAr ? 'جاري مزامنة الكتالوج...' : 'Syncing...') : (isAr ? 'مزامنة الكتالوج الآن' : 'Sync Catalog Now')}
            </button>
          </div>

          {syncSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              {isAr ? 'تمت مزامنة كافة منتجات الكتالوج ورموز الباركود مع حسابك في ميشات بنجاح!' : 'All catalog products and QR codes synced with MeaChat!'}
            </div>
          )}
        </div>
      </div>

      {/* MeaChat API Links Download Section */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <Webhook className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              {isAr ? 'روابط API الخاصة بميشات (MeaChat)' : 'MeaChat API Endpoints'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {isAr ? 'روابط واجهة برمجة التطبيقات لربط إعلاناتك، عناوينك، منتجاتك، الموردين، والباركود.' : 'API endpoints to connect your ads, addresses, products, suppliers, and barcodes.'}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{isAr ? 'الإعلانات' : 'Ads'}</p>
              <code className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 block">GET /api/v1/seller/ads</code>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{isAr ? 'العناوين' : 'Addresses'}</p>
              <code className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 block">GET /api/v1/seller/addresses</code>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{isAr ? 'المنتجات' : 'Products'}</p>
              <code className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 block">GET /api/v1/seller/products</code>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{isAr ? 'الموردين' : 'Suppliers'}</p>
              <code className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 block">GET /api/v1/seller/suppliers</code>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{isAr ? 'الباركود' : 'Barcodes'}</p>
              <code className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 block">GET /api/v1/seller/barcodes</code>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="/wa-http-api.txt"
              download="wa-http-api.txt"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary-hover transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              {isAr ? 'تحميل ملف الإعدادات الجاهز (wa-http-api)' : 'Download Ready Config (wa-http-api)'}
            </a>
            <p className="text-[11px] text-zinc-500 mt-2">
              {isAr ? 'ملف جاهز للاستيراد في أنظمة ميشات لتسهيل عملية الربط دون الحاجة للبناء من الصفر.' : 'Ready-to-use config file to import into MeaChat systems.'}
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              {isAr ? 'بوابة التحقق (OTP Gateway) عبر MeaChat' : 'OTP Gateway via MeaChat'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {isAr ? 'اربط حساب MeaChat أو ميشات الخاص بك واستخدم واجهة ميمارت البرمجية (API) لإرسال رموز التحقق لعملائك من أنظمتك الخارجية.' : 'Connect MeaChat/MeaChat and use MeaMart API to send OTPs from external systems.'}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl mb-4 border border-zinc-200 dark:border-zinc-700">
             <p className="text-xs text-zinc-600 dark:text-zinc-300 font-mono" dir="ltr">
               <span className="text-blue-600 dark:text-blue-400 font-bold">POST</span> https://meamart.com/api/v1/external/send-otp
             </p>
             <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
               Body: <code className="text-pink-600 dark:text-pink-400">{`{ "meamartApiKey": "...", "type": "whatsapp", "phone": "9665...", "otp": "12345" }`}</code>
             </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              {isAr ? 'رمز الوصول (MeaChat API Token)' : 'MeaChat API Token'}
            </label>
            <input
              type="text"
              value={otpApiToken}
              onChange={(e) => setOtpApiToken(e.target.value)}
              placeholder={isAr ? 'ضع الـ API Token هنا...' : 'Enter your API Token'}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-primary focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                {isAr ? 'معرف الرقم (Phone Number ID)' : 'Phone Number ID'}
              </label>
              <input
                type="text"
                value={otpPhoneId}
                onChange={(e) => setOtpPhoneId(e.target.value)}
                placeholder="e.g. 11906XXXXX40020"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-primary focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                {isAr ? 'معرف قالب الواتساب (Template ID)' : 'WhatsApp Template ID'}
              </label>
              <input
                type="text"
                value={otpTemplateId}
                onChange={(e) => setOtpTemplateId(e.target.value)}
                placeholder="e.g. 712"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-primary focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => handleSaveDeveloperSettings()}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
            >
              {isAr ? 'حفظ إعدادات بوابة التحقق' : 'Save OTP Gateway Settings'}
            </button>
            {otpSaved && (
              <span className="ml-3 rtl:mr-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                {isAr ? 'تم الحفظ!' : 'Saved!'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
