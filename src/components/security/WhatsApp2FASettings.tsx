import React, { useState, useEffect } from 'react';
import WhatsApp2FAStatusBadge from './WhatsApp2FAStatusBadge';
import { startWhatsApp2FA, verifyWhatsApp2FA, disableWhatsApp2FA } from '~/lib/api/security/whatsapp2fa';

interface WhatsApp2FASettingsProps {
  userId: string;
  initialEnabled?: boolean;
  initialPhone?: string;
}

export default function WhatsApp2FASettings({ userId, initialEnabled = false, initialPhone = '' }: WhatsApp2FASettingsProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [phone, setPhone] = useState(initialPhone || '');
  const [step, setStep] = useState<'idle' | 'otp_sent'>('idle');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 8) {
      setError('يرجى إدخال رقم واتساب صحيح مثال: 0500000000 أو 966500000000');
      return;
    }
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await startWhatsApp2FA(phone, userId);
      if (res.success) {
        setStep('otp_sent');
        setCountdown(60);
        setAttempts(0);
        setSuccessMsg(res.message || 'تم إرسال رمز التحقق إلى واتساب بنجاح');
      } else {
        setError(res.error || 'تعذر إرسال الرمز. حاول مجدداً.');
      }
    } catch {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setError('يرجى إدخال الرمز المكون من 6 أرقام');
      return;
    }

    if (attempts >= 5) {
      setError('تجاوزت عدد المحاولات المسموح بها. اطلب رمزاً جديداً.');
      return;
    }

    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await verifyWhatsApp2FA(phone, otpCode.trim(), {
        enable2FA: true,
        userId
      });

      if (res.success) {
        setEnabled(true);
        setStep('idle');
        setOtpCode('');
        setSuccessMsg('تم تفعيل التحقق بخطوتين عبر واتساب بنجاح!');
      } else {
        setAttempts((a) => a + 1);
        setError(res.error || 'الرمز غير صحيح');
      }
    } catch {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('هل أنت متأكد من إيقاف التحقق بخطوتين عبر واتساب؟')) return;
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await disableWhatsApp2FA(userId);
      if (res.success) {
        setEnabled(false);
        setSuccessMsg('تم إيقاف التحقق بخطوتين عبر واتساب');
      } else {
        setError(res.error || 'تعذر إيقاف التحقق بخطوتين');
      }
    } catch {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-zinc-200/60 bg-white/60 p-6 sm:p-8 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/60 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.58 3.38 17.07L2.12 21.68L6.87 20.43C8.33 21.41 10.11 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.05 14.86C16.85 15.42 15.86 15.93 15.41 15.98C15.01 16.03 14.52 16.06 12.87 15.38C10.66 14.47 9.24 12.23 9.13 12.08C9.03 11.93 8.24 10.88 8.24 9.8C8.24 8.72 8.79 8.19 9.01 7.96C9.23 7.73 9.48 7.68 9.64 7.68C9.8 7.68 9.96 7.68 10.1 7.69C10.25 7.7 10.43 7.62 10.63 8.1C10.85 8.63 11.39 9.94 11.45 10.07C11.52 10.2 11.56 10.36 11.47 10.53C11.39 10.71 11.34 10.79 11.2 10.95C11.07 11.1 10.92 11.22 10.8 11.37C10.67 11.51 10.53 11.66 10.69 11.94C10.85 12.21 11.4 13.11 12.21 13.83C13.25 14.76 14.1 15.05 14.4 15.18C14.65 15.28 14.8 15.26 14.95 15.09C15.15 14.86 15.48 14.39 15.68 14.12C15.88 13.84 16.09 13.88 16.33 13.97C16.58 14.06 17.9 14.71 18.17 14.84C18.44 14.98 18.62 15.04 18.68 15.15C18.75 15.26 18.75 15.82 17.05 14.86Z" />
              </svg>
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">التحقق بخطوتين (2FA) عبر واتساب</h3>
          </div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            حماية حسابك بطبقة أمان إضافية عند تسجيل الدخول باستخدام رمز أمان يتم إرساله إلى جوالك عبر واتساب.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <WhatsApp2FAStatusBadge enabled={enabled} phone={phone} />
        </div>
      </div>

      {error && (
        <div className="rounded-full border border-red-200 bg-red-50/80 p-4 text-sm font-bold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="rounded-full border border-emerald-200 bg-emerald-50/80 p-4 text-sm font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
          {successMsg}
        </div>
      )}

      {enabled ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-full bg-zinc-50 dark:bg-zinc-950/50 p-5 border border-zinc-200/50 dark:border-zinc-800/50">
          <div>
            <div className="text-sm font-bold text-zinc-900 dark:text-white">الرقم المرتبط بالأمان:</div>
            <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5" dir="ltr">
              {phone}
            </div>
            <div className="text-xs text-zinc-400 mt-1">النوع الحالي: WhatsApp OTP (MeaChat/MeaChat)</div>
          </div>

          <button
            type="button"
            onClick={handleDisable2FA}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-sm font-bold text-red-600 dark:border-red-900/50 dark:bg-zinc-900 dark:hover:bg-red-950/30 transition shadow-sm disabled:opacity-50"
          >
            {loading ? 'جاري المعالجة...' : 'إيقاف التحقق بخطوتين'}
          </button>
        </div>
      ) : (
        <div>
          {step === 'idle' ? (
            <form onSubmit={handleSendOTP} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  رقم جوال واتساب للأمان (مع رمز الدولة):
                </label>
                <input
                  type="tel"
                  placeholder="مثال: 0500000000 أو 966500000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-bold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !phone}
                className="w-full py-3.5 px-6 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm transition shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {loading ? 'جاري إرسال الرمز...' : 'إرسال رمز إلى واتساب'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4 max-w-md">
              <div className="rounded-full bg-zinc-50 dark:bg-zinc-950/50 p-4 border border-zinc-200/50 dark:border-zinc-800/50">
                <span className="text-xs font-bold text-zinc-500">تم إرسال رمز التحقق إلى:</span>
                <span className="block text-sm font-extrabold text-zinc-900 dark:text-white mt-0.5" dir="ltr">{phone}</span>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  أدخل رمز التحقق (6 أرقام):
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-center text-2xl font-extrabold tracking-widest text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="flex-1 py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {loading ? 'جاري التحقق...' : 'تحقق وتفعيل'}
                </button>

                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={countdown > 0 || loading}
                  className="py-3.5 px-4 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
                >
                  {countdown > 0 ? `إعادة الإرسال (${countdown}ث)` : 'إعادة إرسال الرمز'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => { setStep('idle'); setOtpCode(''); setError(''); }}
                className="block w-full text-center text-xs font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 pt-2"
              >
                تغيير رقم الجوال
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
