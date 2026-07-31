import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, ShieldCheck, Mail, Phone, Lock, Globe, ArrowRight, RefreshCw, Smartphone } from 'lucide-react';

interface SecurityTasksStatus {
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  googleLinked: boolean;
  totpEnabled: boolean;
  whatsapp2faEnabled: boolean;
  completionPercentage: number;
}

interface SecurityOnboardingProps {
  lang?: string;
  initialSession?: any;
}

export default function SecurityOnboardingTasksClient({ lang = 'ar', initialSession }: SecurityOnboardingProps) {
  const isEn = lang === 'en';
  const [status, setStatus] = useState<SecurityTasksStatus>({
    email: initialSession?.email || '',
    emailVerified: false,
    phone: '',
    phoneVerified: false,
    googleLinked: false,
    totpEnabled: false,
    whatsapp2faEnabled: false,
    completionPercentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // TOTP QR generation state
  const [totpQr, setTotpQr] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [totpInput, setTotpInput] = useState('');

  // WhatsApp OTP state
  const [phoneInput, setPhoneInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/security/onboarding-status');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.status) {
          setStatus(data.status);
          setPhoneInput(data.status.phone || '');
        }
      }
    } catch (e) {
      console.error('Failed to load security onboarding status', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSendEmailVerification = async () => {
    setActionLoading('email');
    setMessage(null);
    try {
      const res = await fetch('/api/auth/email/send-verification', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMessage({
          text: isEn ? 'Verification link sent to your email successfully!' : 'تم إرسال رابط التحقق إلى بريدك الإلكتروني بنجاح!',
          type: 'success'
        });
      } else {
        setMessage({
          text: data.error || (isEn ? 'Failed to send email verification' : 'فشل في إرسال رابط التحقق'),
          type: 'error'
        });
      }
    } catch {
      setMessage({
        text: isEn ? 'Connection error' : 'خطأ في الاتصال بالخادم',
        type: 'error'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartWhatsAppVerification = async () => {
    if (!phoneInput.trim()) {
      setMessage({ text: isEn ? 'Please enter a valid phone number' : 'يرجى إدخال رقم هاتف صحيح', type: 'error' });
      return;
    }
    setActionLoading('whatsapp_start');
    setMessage(null);
    try {
      const res = await fetch('/api/security/whatsapp-2fa/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneInput.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setMessage({
          text: isEn ? 'Verification code sent to your WhatsApp!' : 'تم إرسال رمز التحقق إلى حسابك على واتساب!',
          type: 'success'
        });
      } else {
        setMessage({ text: data.error || (isEn ? 'Failed to send WhatsApp code' : 'فشل إرسال كود الواتساب'), type: 'error' });
      }
    } catch {
      setMessage({ text: isEn ? 'Connection error' : 'خطأ في الاتصال بالخادم', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyWhatsAppOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setMessage({ text: isEn ? 'Enter 6-digit code' : 'أدخل الكود المكون من 6 أرقام', type: 'error' });
      return;
    }
    setActionLoading('whatsapp_verify');
    setMessage(null);
    try {
      const res = await fetch('/api/security/whatsapp-2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneInput.trim(), code: otpCode.trim(), enable2FA: true })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(false);
        setOtpCode('');
        setMessage({ text: isEn ? 'WhatsApp verified and linked successfully!' : 'تم التحقق وربط رقم الواتساب بنجاح!', type: 'success' });
        fetchStatus();
      } else {
        setMessage({ text: data.error || (isEn ? 'Invalid code' : 'كود التحقق غير صحيح'), type: 'error' });
      }
    } catch {
      setMessage({ text: isEn ? 'Connection error' : 'خطأ في الاتصال بالخادم', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleLinkGoogle = () => {
    const redirectUrl = encodeURIComponent(`/${lang}/seller/profile`);
    window.location.href = `/api/auth/google?link_account=true&redirect=${redirectUrl}`;
  };

  const handleSetupTotp = async () => {
    setActionLoading('totp_setup');
    setMessage(null);
    try {
      const res = await fetch('/api/security/totp/generate', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setTotpQr(data.qrCodeUrl);
        setTotpSecret(data.secret);
      } else {
        setMessage({ text: data.error || (isEn ? 'Failed to generate QR code' : 'فشل في توليد كود التحقق'), type: 'error' });
      }
    } catch {
      setMessage({ text: isEn ? 'Connection error' : 'خطأ في الاتصال بالخادم', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyTotp = async () => {
    if (!totpInput || totpInput.length !== 6) {
      setMessage({ text: isEn ? 'Enter 6-digit code' : 'أدخل الكود المكون من 6 أرقام', type: 'error' });
      return;
    }
    setActionLoading('totp_verify');
    setMessage(null);
    try {
      const res = await fetch('/api/security/totp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: totpSecret, code: totpInput.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setTotpQr(null);
        setTotpSecret(null);
        setTotpInput('');
        setMessage({ text: isEn ? 'Google Authenticator 2FA activated successfully!' : 'تم تفعيل المصادقة الثنائية عبر Google Authenticator بنجاح!', type: 'success' });
        fetchStatus();
      } else {
        setMessage({ text: data.error || (isEn ? 'Invalid authenticator code' : 'كود المصادقة غير صحيح'), type: 'error' });
      }
    } catch {
      setMessage({ text: isEn ? 'Connection error' : 'خطأ في الاتصال بالخادم', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="rounded-3xl border border-zinc-200/80 bg-white/90 p-6 sm:p-8 shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/90 my-8" dir={isEn ? 'ltr' : 'rtl'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary dark:bg-primary/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">
              {isEn ? 'Security Tasks & Account Protection System' : 'نظام مهمات الأمان وحماية الحساب'}
            </h3>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">
              {isEn
                ? 'Complete your account security checklist to ensure highest protection and unlock full store capabilities.'
                : 'أكمل مهمات الأمان الإلزامية لحماية حسابك وضمان توثيق متجرك بالكامل.'}
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 rounded-full border border-zinc-200/60 dark:border-zinc-800/60">
          <div className="w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                status.completionPercentage === 100 ? 'bg-emerald-500' : status.completionPercentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${status.completionPercentage}%` }}
            />
          </div>
          <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200">
            {status.completionPercentage}% {isEn ? 'Completed' : 'مكتمل'}
          </span>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-full mb-6 text-xs font-bold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50'
              : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex justify-center items-center text-zinc-400">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Task 1: Email Verification */}
          <div className={`p-5 rounded-xl border transition-all ${
            status.emailVerified
              ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/30 dark:bg-emerald-950/20'
              : 'border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/40'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  status.emailVerified ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                }`}>
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <span>{isEn ? '1. Email Verification' : '1. التحقق من البريد الإلكتروني'}</span>
                    {status.emailVerified && <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {status.email || (isEn ? 'Verify your registration email' : 'تأكيد ملكية عنوان بريدك الإلكتروني المسجل')}
                  </p>
                </div>
              </div>
              <div>
                {status.emailVerified ? (
                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                    {isEn ? 'Verified' : 'موثق'}
                  </span>
                ) : (
                  <button
                    onClick={handleSendEmailVerification}
                    disabled={actionLoading === 'email'}
                    className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition shadow-sm disabled:opacity-50"
                  >
                    {actionLoading === 'email' ? (isEn ? 'Sending...' : 'جاري الإرسال...') : (isEn ? 'Verify Email' : 'تأكيد البريد')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Task 2: WhatsApp Number & 2FA */}
          <div className={`p-5 rounded-xl border transition-all ${
            status.whatsapp2faEnabled || status.phoneVerified
              ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/30 dark:bg-emerald-950/20'
              : 'border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/40'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  status.whatsapp2faEnabled || status.phoneVerified ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                }`}>
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <span>{isEn ? '2. WhatsApp Security Link' : '2. التحقق وربط رقم الواتساب'}</span>
                    {(status.whatsapp2faEnabled || status.phoneVerified) && <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {isEn ? 'Link WhatsApp number & enable 2-step OTP' : 'ربط رقم الواتساب لتلقي رموز التحقق وإشعارات المتجر'}
                  </p>
                </div>
              </div>
              <div>
                {status.whatsapp2faEnabled || status.phoneVerified ? (
                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                    {isEn ? 'Linked & Active' : 'مربوط ومفعل'}
                  </span>
                ) : !otpSent ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="966500000000"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-32 px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-center font-mono"
                    />
                    <button
                      onClick={handleStartWhatsAppVerification}
                      disabled={actionLoading === 'whatsapp_start'}
                      className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition shadow-sm disabled:opacity-50"
                    >
                      {actionLoading === 'whatsapp_start' ? '...' : (isEn ? 'Link' : 'تفعيل')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-20 px-2 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-center font-mono font-bold"
                    />
                    <button
                      onClick={handleVerifyWhatsAppOtp}
                      disabled={actionLoading === 'whatsapp_verify'}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow-sm"
                    >
                      {isEn ? 'Verify' : 'تأكيد'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Task 3: Google Account Linking */}
          <div className={`p-5 rounded-xl border transition-all ${
            status.googleLinked
              ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/30 dark:bg-emerald-950/20'
              : 'border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/40'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  status.googleLinked ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                }`}>
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <span>{isEn ? '3. Link Google Account' : '3. ربط حساب Google'}</span>
                    {status.googleLinked && <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {isEn ? 'Allow instant 1-click login using your Google account' : 'ربط الحساب بجوجل للدخول السريع بضغطة زر وتوثيق الهوية'}
                  </p>
                </div>
              </div>
              <div>
                {status.googleLinked ? (
                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                    {isEn ? 'Linked' : 'مربوط'}
                  </span>
                ) : (
                  <button
                    onClick={handleLinkGoogle}
                    className="px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition shadow-xs flex items-center gap-1.5"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span>{isEn ? 'Link Google' : 'ربط بحساب Google'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Task 4: Google Authenticator 2FA */}
          <div className={`p-5 rounded-xl border transition-all ${
            status.totpEnabled
              ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/30 dark:bg-emerald-950/20'
              : 'border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/40'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  status.totpEnabled ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                }`}>
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <span>{isEn ? '4. Google Authenticator (2FA)' : '4. التحقق عبر Google Authenticator'}</span>
                    {status.totpEnabled && <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {isEn ? 'High security TOTP time-based authentication app' : 'المصادقة الثنائية فائقة الأمان باستخدام تطبيق Google Authenticator'}
                  </p>
                </div>
              </div>
              <div>
                {status.totpEnabled ? (
                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                    {isEn ? 'Enabled' : 'مفعل'}
                  </span>
                ) : (
                  <button
                    onClick={handleSetupTotp}
                    disabled={actionLoading === 'totp_setup'}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold hover:opacity-90 transition shadow-sm disabled:opacity-50"
                  >
                    {actionLoading === 'totp_setup' ? '...' : (isEn ? 'Setup 2FA' : 'تفعيل التطبيق')}
                  </button>
                )}
              </div>
            </div>

            {/* TOTP QR Drawer if setting up */}
            {totpQr && !status.totpEnabled && (
              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center space-y-3 bg-white dark:bg-zinc-950 p-4 rounded-full">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  {isEn ? 'Scan this QR code with Google Authenticator app:' : 'امسح رمز الـ QR عبر تطبيق Google Authenticator:'}
                </p>
                <div className="flex justify-center my-2">
                  <img src={totpQr} alt="TOTP QR Code" className="w-36 h-36 rounded-xl border p-2 bg-white" />
                </div>
                <p className="text-[10px] font-mono text-zinc-400 select-all">{totpSecret}</p>
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={totpInput}
                    onChange={(e) => setTotpInput(e.target.value.replace(/\D/g, ''))}
                    className="w-28 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-center font-mono font-bold text-sm"
                  />
                  <button
                    onClick={handleVerifyTotp}
                    disabled={actionLoading === 'totp_verify'}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow-sm"
                  >
                    {isEn ? 'Verify & Save' : 'تأكيد وتفعيل'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
