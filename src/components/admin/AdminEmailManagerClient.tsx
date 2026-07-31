import React, { useState, useEffect } from 'react';
import { Mail, Bell, Code, Eye, Send, CheckCircle2, AlertCircle, Sparkles, Sliders, Loader2 } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  htmlContent: string;
  jsonLd: string;
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'رسالة الترحيب وتأكيد الحساب',
    description: 'ترسل تلقائياً عند تسجيل حساب جديد في ميمارت',
    subject: 'مرحباً بك في ميمارت - أكد حسابك وابدأ الآن',
    htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; direction: rtl; text-align: right; border: 1px solid #eee; border-radius: 16px;">
  <h2 style="color: #111;">مرحباً {{userName}} في منصة ميمارت!</h2>
  <p style="color: #555; line-height: 1.6;">يسعدنا انضمامك إلى منصة الإعلانات الذكية والمنتجات الدائمة. حسابك أصبح جاهزاً بالكامل لإنشاء الإعلانات وتوليد الباركود الذكي.</p>
  <div style="margin: 24px 0;">
    <a href="{{confirmationUrl}}" style="background-color: #6366f1; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">تفعيل الحساب وعرض الملف الشخصي</a>
  </div>
  <p style="font-size: 13px; color: #888;">طلباتك أوامر - فريق ميمارت</p>
</div>`,
    jsonLd: `{
  "@context": "http://schema.org",
  "@type": "EmailMessage",
  "description": "تأكيد وتفعيل الحساب في ميمارت",
  "potentialAction": {
    "@type": "ConfirmAction",
    "name": "تفعيل الحساب",
    "handler": {
      "@type": "HttpActionHandler",
      "url": "https://meamart.com/ar/seller/dashboard"
    }
  }
}`
  },
  {
    id: 'new_ad',
    name: 'إشعار نشر إعلان جديد',
    description: 'ترسل للمعلن عند نشر إعلانه بنجاح في السوق',
    subject: 'تم نشر إعلانك "{{adTitle}}" بنجاح على ميمارت',
    htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; direction: rtl; text-align: right; border: 1px solid #eee; border-radius: 16px;">
  <h2 style="color: #111;">تم نشر إعلانك بنجاح! 🎉</h2>
  <p style="color: #555; line-height: 1.6;">تم اعتماد إعلانك <strong>{{adTitle}}</strong> وهو الآن متاح لجميع زوار ميمارت ومفهرس في محركات البحث.</p>
  <div style="margin: 24px 0;">
    <a href="{{adUrl}}" style="background-color: #10b981; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">عرض الإعلان المباشر</a>
  </div>
  <p style="font-size: 13px; color: #888;">منصة ميمارت للإعلانات الذكية</p>
</div>`,
    jsonLd: `{
  "@context": "http://schema.org",
  "@type": "EmailMessage",
  "description": "إشعار نشر إعلان جديد في ميمارت",
  "potentialAction": {
    "@type": "ViewAction",
    "name": "عرض الإعلان المباشر",
    "target": "https://meamart.com/ar/ads/{{adId}}"
  }
}`
  },
  {
    id: 'qr_scan',
    name: 'تنبيه تفاعل ومسح الباركود',
    description: 'ترسل عند قيام عميل بمسح الباركود أو بدء محادثة واتساب',
    subject: 'تنبيه ذكي: نشاط جديد على باركود إعلانك "{{adTitle}}"',
    htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; direction: rtl; text-align: right; border: 1px solid #eee; border-radius: 16px;">
  <h2 style="color: #111;">نشاط جديد على الباركود الخاص بك 📱</h2>
  <p style="color: #555; line-height: 1.6;">قام زائر بمسح الباركود الخاص بإعلانك <strong>{{adTitle}}</strong> والاطلاع على التفاصيل أو التواصل عبر الواتساب.</p>
  <div style="margin: 24px 0;">
    <a href="{{reportUrl}}" style="background-color: #3b82f6; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">عرض تقارير المسحات والمحادثات</a>
  </div>
  <p style="font-size: 13px; color: #888;">نظام ميمارت لتتبع الباركود الذكي</p>
</div>`,
    jsonLd: `{
  "@context": "http://schema.org",
  "@type": "EmailMessage",
  "description": "إشعار تفاعل ومسح باركود إعلان ميمارت",
  "potentialAction": {
    "@type": "ViewAction",
    "name": "عرض تقرير الباركود",
    "target": "https://meamart.com/ar/seller/reports"
  }
}`
  },
  {
    id: 'welcome_en',
    name: '[English] Welcome & Account Confirmation',
    description: 'Sent automatically upon registration in English',
    subject: 'Welcome to MeaMart - Confirm Your Account',
    htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; direction: ltr; text-align: left; border: 1px solid #eee; border-radius: 16px;">
  <h2 style="color: #111;">Welcome {{userName}} to MeaMart!</h2>
  <p style="color: #555; line-height: 1.6;">We are delighted to have you on MeaMart smart classifieds. Your account is ready for ad publishing and dynamic QR generation.</p>
  <div style="margin: 24px 0;">
    <a href="{{confirmationUrl}}" style="background-color: #6366f1; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Activate Account & Dashboard</a>
  </div>
  <p style="font-size: 13px; color: #888;">MeaMart Team</p>
</div>`,
    jsonLd: `{
  "@context": "http://schema.org",
  "@type": "EmailMessage",
  "description": "MeaMart account verification",
  "potentialAction": {
    "@type": "ConfirmAction",
    "name": "Activate Account",
    "handler": {
      "@type": "HttpActionHandler",
      "url": "https://meamart.com/en/seller/dashboard"
    }
  }
}`
  },
  {
    id: 'new_ad_en',
    name: '[English] New Ad Published Notification',
    description: 'Sent to advertiser when ad is successfully live',
    subject: 'Your ad "{{adTitle}}" is now live on MeaMart',
    htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; direction: ltr; text-align: left; border: 1px solid #eee; border-radius: 16px;">
  <h2 style="color: #111;">Ad Published Successfully! 🎉</h2>
  <p style="color: #555; line-height: 1.6;">Your ad <strong>{{adTitle}}</strong> has been approved and is now live and indexed.</p>
  <div style="margin: 24px 0;">
    <a href="{{adUrl}}" style="background-color: #10b981; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Live Ad</a>
  </div>
  <p style="font-size: 13px; color: #888;">MeaMart Smart Ads Platform</p>
</div>`,
    jsonLd: `{
  "@context": "http://schema.org",
  "@type": "EmailMessage",
  "description": "New Ad Published on MeaMart",
  "potentialAction": {
    "@type": "ViewAction",
    "name": "View Live Ad",
    "target": "https://meamart.com/en/ads/{{adId}}"
  }
}`
  }
];

export default function AdminEmailManagerClient() {
  const [activeTab, setActiveTab] = useState<'settings' | 'templates'>('settings');
  const [senderEmail, setSenderEmail] = useState('MeaMart <noreply@meamart.com>');
  const [resendApiKey, setResendApiKey] = useState('');
  const [smtpHost, setSmtpHost] = useState('smtp.resend.com');
  const [smtpPort, setSmtpPort] = useState('465');
  const [smtpUser, setSmtpUser] = useState('resend');
  const [smtpPassword, setSmtpPassword] = useState('');
  
  // Notification rules toggles
  const [notifyOnRegister, setNotifyOnRegister] = useState(true);
  const [notifyOnAdCreate, setNotifyOnAdCreate] = useState(true);
  const [notifyOnQrScan, setNotifyOnQrScan] = useState(true);

  // Template editor state
  const [templates, setTemplates] = useState<EmailTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedId, setSelectedId] = useState<string>('welcome');
  const [previewMode, setPreviewMode] = useState<'html' | 'jsonld'>('html');
  
  // Save/load state
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const currentTemplate = templates.find(t => t.id === selectedId) || templates[0];

  const updateCurrentTemplate = (field: keyof EmailTemplate, value: string) => {
    setTemplates(prev => prev.map(t => t.id === selectedId ? { ...t, [field]: value } : t));
  };

  // Load saved config on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/admin/save-email-settings');
        const data = await res.json();
        if (data.success && data.config) {
          const c = data.config;
          if (c.senderEmail) setSenderEmail(c.senderEmail);
          if (c.resendApiKey) setResendApiKey(c.resendApiKey);
          if (c.smtpHost) setSmtpHost(c.smtpHost);
          if (c.smtpPort) setSmtpPort(c.smtpPort);
          if (c.smtpUser) setSmtpUser(c.smtpUser);
          if (c.smtpPassword) setSmtpPassword(c.smtpPassword);
          if (c.notifyOnRegister !== undefined) setNotifyOnRegister(c.notifyOnRegister);
          if (c.notifyOnAdCreate !== undefined) setNotifyOnAdCreate(c.notifyOnAdCreate);
          if (c.notifyOnQrScan !== undefined) setNotifyOnQrScan(c.notifyOnQrScan);
          if (Array.isArray(c.templates) && c.templates.length > 0) {
            setTemplates(c.templates);
          }
        }
      } catch (err) {
        console.error('Failed to load email config:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, []);

  // Real save to API
  const handleSaveSettings = async () => {
    setSaveStatus('saving');
    setSaveError('');
    try {
      const res = await fetch('/api/admin/save-email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderEmail,
          resendApiKey,
          smtpHost,
          smtpPort,
          smtpUser,
          smtpPassword,
          notifyOnRegister,
          notifyOnAdCreate,
          notifyOnQrScan,
          templates
        })
      });
      const result = await res.json();
      if (result.success) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 4000);
      } else {
        throw new Error(result.error || 'فشل الحفظ');
      }
    } catch (err: any) {
      setSaveStatus('error');
      setSaveError(err.message || 'خطأ في الاتصال بالخادم');
      setTimeout(() => setSaveStatus('idle'), 5000);
    }
  };

  // Send test email
  const handleSendTest = async () => {
    setTestStatus('sending');
    try {
      const res = await fetch('/api/admin/save-email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderEmail,
          resendApiKey,
          smtpHost,
          smtpPort,
          smtpUser,
          smtpPassword,
          notifyOnRegister,
          notifyOnAdCreate,
          notifyOnQrScan,
          templates,
          _testEmail: true
        })
      });
      const result = await res.json();
      if (result.success) {
        setTestStatus('sent');
        setTimeout(() => setTestStatus('idle'), 4000);
      } else {
        setTestStatus('error');
        setTimeout(() => setTestStatus('idle'), 4000);
      }
    } catch {
      setTestStatus('error');
      setTimeout(() => setTestStatus('idle'), 4000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-zinc-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm font-bold">جاري تحميل إعدادات البريد...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub Navigation for Email & Notifications */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 py-3 px-6 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'settings'
              ? 'border-primary text-primary dark:text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>إعدادات البريد والتنبيهات</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 py-3 px-6 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'templates'
              ? 'border-primary text-primary dark:text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>نماذج البريد ودعم JSON-LD للذكاء الاصطناعي</span>
        </button>
      </div>

      {/* Tab 1: Settings & Notification Toggles */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Provider Settings */}
          <div className="rounded-2x1 border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-zinc-900 dark:text-white text-base">إعدادات خادم الإرسال (SMTP / Resend)</h4>
                <p className="text-xs text-zinc-500">إعداد عنوان المرسل ومفتاح الربط لإرسال رسائل البريد</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-zinc-700 dark:text-zinc-300">اسم المرسل وعنوان البريد</label>
                <input
                  type="text"
                  value={senderEmail}
                  onChange={e => setSenderEmail(e.target.value)}
                  placeholder="MeaMart <noreply@meamart.com>"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5 text-zinc-700 dark:text-zinc-300">مفتاح الربط (API Key / Resend)</label>
                <input
                  type="password"
                  value={resendApiKey}
                  onChange={e => setResendApiKey(e.target.value)}
                  placeholder="re_xxxxxxxxxxxxxxxxxxxxx"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-sm font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <label className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">خادم SMTP Host</label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={e => setSmtpHost(e.target.value)}
                    placeholder="smtp.example.com"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">المنفذ SMTP Port</label>
                  <input
                    type="text"
                    value={smtpPort}
                    onChange={e => setSmtpPort(e.target.value)}
                    placeholder="465 / 587"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">مستخدم SMTP User</label>
                  <input
                    type="text"
                    value={smtpUser}
                    onChange={e => setSmtpUser(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">كلمة مرور SMTP Password</label>
                  <input
                    type="password"
                    value={smtpPassword}
                    onChange={e => setSmtpPassword(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Rules */}
          <div className="rounded-2x1 border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-zinc-900 dark:text-white text-base">قواعد وتفعيل التنبيهات التلقائية</h4>
                <p className="text-xs text-zinc-500">اختر الأحداث التي يتم إرسال إشعارات بريدية فورية عندها</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/40 cursor-pointer">
                <div>
                  <span className="block text-sm font-bold text-zinc-800 dark:text-zinc-200">تنبيه الترحيب عند تسجيل حساب جديد</span>
                  <span className="text-xs text-zinc-500">يتضمن مخطط JSON-LD لتأكيد الحساب عبر مساعد البريد</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnRegister}
                  onChange={e => setNotifyOnRegister(e.target.checked)}
                  className="w-5 h-5 rounded text-primary focus:ring-primary accent-primary"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/40 cursor-pointer">
                <div>
                  <span className="block text-sm font-bold text-zinc-800 dark:text-zinc-200">تنبيه عند نشر إعلان جديد بنجاح</span>
                  <span className="text-xs text-zinc-500">إرسال رابط الإعلان المباشر مع مخطط ViewAction للذكاء الاصطناعي</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnAdCreate}
                  onChange={e => setNotifyOnAdCreate(e.target.checked)}
                  className="w-5 h-5 rounded text-primary focus:ring-primary accent-primary"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/40 cursor-pointer">
                <div>
                  <span className="block text-sm font-bold text-zinc-800 dark:text-zinc-200">تنبيه عند مسح الباركود أو فتح محادثة</span>
                  <span className="text-xs text-zinc-500">إشعار فوري للمعلن عند تفاعل زائر مع الباركود أو الواتساب</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnQrScan}
                  onChange={e => setNotifyOnQrScan(e.target.checked)}
                  className="w-5 h-5 rounded text-primary focus:ring-primary accent-primary"
                />
              </label>
            </div>
          </div>

          {/* Save Status & Action */}
          <div className="md:col-span-2 flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              {saveStatus === 'saved' && (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  تم حفظ إعدادات البريد والتنبيهات بنجاح
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {saveError || 'فشل الحفظ'}
                </span>
              )}
              {saveStatus === 'saving' && (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-zinc-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الحفظ...
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSendTest}
                disabled={testStatus === 'sending'}
                className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-bold text-xs hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                {testStatus === 'sending' ? 'جاري الإرسال...' : testStatus === 'sent' ? 'تم الإرسال ✓' : testStatus === 'error' ? 'فشل الإرسال' : 'إرسال بريد تجريبي'}
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={saveStatus === 'saving'}
                className="px-8 py-3 rounded-xl bg-primary text-white font-extrabold text-sm shadow-md hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saveStatus === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
                حفظ إعدادات البريد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: JSON-LD Email Templates Editor */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Templates Selector List */}
          <div className="lg:col-span-1 space-y-3">
            <h4 className="text-sm font-extrabold text-zinc-700 dark:text-zinc-300 mb-2">النماذج المتاحة</h4>
            {templates.map(tpl => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setSelectedId(tpl.id)}
                className={`w-full text-right p-4 rounded-full border transition-all ${
                  selectedId === tpl.id
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-zinc-900 dark:text-white">{tpl.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                    JSON-LD
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">{tpl.description}</p>
              </button>
            ))}
          </div>

          {/* Editor & Preview Area */}
          <div className="lg:col-span-2 rounded-2x1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <h4 className="font-extrabold text-base text-zinc-900 dark:text-white">{currentTemplate.name}</h4>
                <p className="text-xs text-zinc-500">محرر النموذج مع مخطط البيانات المنظمة لتطبيقات الذكاء الاصطناعي</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode('html')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    previewMode === 'html' ? 'bg-primary text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  محرر HTML
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('jsonld')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    previewMode === 'jsonld' ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>مخطط الذكاء الاصطناعي (JSON-LD)</span>
                </button>
              </div>
            </div>

            {/* Subject Input */}
            <div>
              <label className="block text-xs font-bold mb-1.5 text-zinc-700 dark:text-zinc-300">عنوان الرسالة (Subject)</label>
              <input
                type="text"
                value={currentTemplate.subject}
                onChange={e => updateCurrentTemplate('subject', e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3.5 py-2.5 text-sm font-bold"
              />
            </div>

            {/* Editor Textarea */}
            {previewMode === 'html' ? (
              <div>
                <label className="block text-xs font-bold mb-1.5 text-zinc-700 dark:text-zinc-300">محتوى البريد (HTML Content)</label>
                <textarea
                  rows={8}
                  value={currentTemplate.htmlContent}
                  onChange={e => updateCurrentTemplate('htmlContent', e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3.5 font-mono text-xs leading-relaxed text-left"
                  dir="ltr"
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    مخطط Schema.org المنظم (يقرأه مساعدو الذكاء الاصطناعي و Gmail AI و Apple Mail)
                  </label>
                  <span className="text-[11px] font-bold text-emerald-600">تنسيق JSON-LD معتمد</span>
                </div>
                <textarea
                  rows={10}
                  value={currentTemplate.jsonLd}
                  onChange={e => updateCurrentTemplate('jsonLd', e.target.value)}
                  className="w-full rounded-xl border border-emerald-500/40 bg-zinc-950 text-emerald-400 p-3.5 font-mono text-xs leading-relaxed text-left"
                  dir="ltr"
                />
                <p className="mt-2 text-xs text-zinc-500">
                  يتم إدراج هذا المخطط تلقائياً داخل وسم &lt;script type="application/ld+json"&gt; في رأس البريد الإلكتروني لتمكين تنفيذ الإجراءات المباشرة.
                </p>
              </div>
            )}

            {/* Live Render Preview */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <label className="block text-xs font-extrabold mb-2 text-zinc-500">المعاينة الحية للبريد الإلكتروني</label>
              <div
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white text-zinc-900 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: currentTemplate.htmlContent }}
              />
            </div>

            {/* Save Templates Button */}
            <div className="flex items-center justify-between pt-2">
              {saveStatus === 'saved' && (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  تم حفظ القوالب بنجاح
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {saveError || 'فشل الحفظ'}
                </span>
              )}
              {saveStatus !== 'saved' && saveStatus !== 'error' && <span />}
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={saveStatus === 'saving'}
                className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold text-xs hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saveStatus === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
                حفظ تعديلات النموذج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
