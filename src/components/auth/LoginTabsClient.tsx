import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import TurnstileWidgetReact from '../security/TurnstileWidgetReact';
import { startWhatsApp2FA, verifyWhatsApp2FA } from '~/lib/api/security/whatsapp2fa';

interface LoginTabsProps {
  signinLabel: string;
  registerLabel: string;
  signinDesc: string;
  registerDesc: string;
  googleBtn: string;
  googleRegister: string;
  googleClientId?: string;
  lang?: string;
}

export default function LoginTabsClient(props: LoginTabsProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorPhone, setTwoFactorPhone] = useState('');
  const [twoFactorUserId, setTwoFactorUserId] = useState('');
  const [twoFactorPendingData, setTwoFactorPendingData] = useState<any>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const isEn = props.lang === 'en' || (typeof window !== 'undefined' && window.location.pathname.startsWith('/en'));
  const currentLang = isEn ? 'en' : 'ar';

  useEffect(() => {
    const hasCookieSession = document.cookie.includes('meamart_session=');
    const hasLocalSession = localStorage.getItem('meamart_session_active');
    const backupSession = localStorage.getItem('meamart_session_backup');
    if (hasCookieSession || hasLocalSession || backupSession) {
      if (!hasCookieSession && backupSession) {
        try {
          document.cookie = `meamart_session=${encodeURIComponent(backupSession)}; path=/; max-age=2592000; SameSite=Lax`;
        } catch (e) {
          console.error('Failed restoring cookie:', e);
        }
      }
      const lang = window.location.pathname.split('/')[1] || 'ar';
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect') || `/${lang}/seller/dashboard`;
      window.location.replace(redirectUrl);
      return;
    }

    // Check URL params or hash on mount
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'register' || window.location.hash === '#register') {
      setActiveTab('register');
    }
    const errorParam = urlParams.get('error');
    if (errorParam) {
      setAuthError(decodeURIComponent(errorParam));
    }
  }, []);

  useEffect(() => {
    return;
  }, [props.googleClientId]);

  const redirectParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') : null;
  const googleHref = redirectParam ? `/api/auth/google?redirect=${encodeURIComponent(redirectParam)}` : '/api/auth/google';

  const [showEmailOption, setShowEmailOption] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMsg, setAuthMsg] = useState<any>('');
  const [authError, setAuthError] = useState<any>('');

  const formatAlert = (val: any) => {
    if (!val) return null;
    if (typeof val === 'object') {
      if (Object.keys(val).length === 0) return null;
      return val.message || val.error || null;
    }
    if (typeof val === 'string' && (val.trim() === '' || val.trim() === '{}')) return null;
    return val;
  };

  const cleanError = formatAlert(authError);
  const cleanMsg = formatAlert(authMsg);

  const handleEmailAuth = async (e: React.FormEvent, mode: 'login' | 'register') => {
    e.preventDefault();
    if (mode === 'register' && !name.trim()) {
      setAuthError(isEn ? 'Please enter your full name' : 'يرجى إدخال الاسم الكامل');
      return;
    }
    if (!email || !password) {
      setAuthError(isEn ? 'Please enter email and password' : 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    setAuthMsg('');
    try {
      const res = await fetch('/api/auth/email/password-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, mode })
      });
      const data = await res.json();
      if (data.success) {
        if (data.requires2FA) {
          setTwoFactorPhone(data.phone || '');
          setTwoFactorUserId(data.userId || '');
          setTwoFactorPendingData(data.sessionData || null);
          setRequires2FA(true);
          setAuthMsg(isEn ? 'Verification code sent to your WhatsApp' : 'تم إرسال رمز التحقق إلى واتساب الخاص بك');
        } else {
          setAuthMsg(isEn ? (mode === 'register' ? 'Registered successfully! Redirecting...' : 'Signed in successfully! Redirecting...') : (data.message || 'تم بنجاح!'));
          const lang = window.location.pathname.split('/')[1] || 'ar';
          const urlParams = new URLSearchParams(window.location.search);
          const redirectUrl = urlParams.get('redirect') || `/${lang}/seller/dashboard`;
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 800);
        }
      } else {
        setAuthError(data.error || (isEn ? 'Login/Registration failed' : 'فشل تسجيل الدخول/التسجيل'));
      }
    } catch {
      setAuthError(isEn ? 'Server connection error' : 'حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerify2FAChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode || twoFactorCode.trim().length !== 6) {
      setAuthError(isEn ? 'Please enter the 6-digit verification code' : 'يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await verifyWhatsApp2FA(twoFactorPhone, twoFactorCode.trim(), {
        loginChallenge: true,
        userId: twoFactorUserId,
        pendingSessionData: twoFactorPendingData
      });

      if (res.success) {
        setAuthMsg(isEn ? 'Verified successfully! Redirecting...' : 'تم التحقق بنجاح! جاري الدخول...');
        const lang = window.location.pathname.split('/')[1] || 'ar';
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect') || `/${lang}/seller/dashboard`;
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 600);
      } else {
        setAuthError(typeof res.error === 'string' ? res.error : (isEn ? 'Invalid verification code' : 'رمز التحقق غير صحيح'));
      }
    } catch {
      setAuthError(isEn ? 'Server error occurred' : 'حدث خطأ في الخادم');
    } finally {
      setAuthLoading(false);
    }
  };

  if (requires2FA) {
    return (
      <div className="rounded-3xl border border-zinc-200/50 bg-white/60 p-6 sm:p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60 overflow-hidden text-center space-y-6" dir={isEn ? 'ltr' : 'rtl'}>
        <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.58 3.38 17.07L2.12 21.68L6.87 20.43C8.33 21.41 10.11 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" />
          </svg>
        </div>

        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            {isEn ? 'WhatsApp 2-Step Verification' : 'التحقق بخطوتين عبر واتساب'}
          </h3>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
            {isEn ? `Enter the 6-digit code sent to WhatsApp (${twoFactorPhone})` : `أدخل رمز التحقق المكون من 6 أرقام المرسل إلى واتساب (${twoFactorPhone})`}
          </p>
        </div>

        {cleanError && (
          <div className="rounded-full border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            {cleanError}
          </div>
        )}

        {cleanMsg && (
          <div className="rounded-full border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
            {cleanMsg}
          </div>
        )}

        <form onSubmit={handleVerify2FAChallenge} className="space-y-4 max-w-xs mx-auto">
          <input
            type="text"
            maxLength={6}
            placeholder="• • • • • •"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
            className="w-full px-4 py-3.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-center text-2xl font-extrabold tracking-widest text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
            required
          />

          <button
            type="submit"
            disabled={authLoading || twoFactorCode.length !== 6}
            className="w-full py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
          >
            {authLoading ? (isEn ? 'Verifying...' : 'جاري التحقق...') : (isEn ? 'Confirm Login' : 'تأكيد الدخول')}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-zinc-200/50 bg-white/60 p-5 sm:p-8 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60 overflow-hidden shadow-zinc-200/50 dark:shadow-none" dir={isEn ? 'ltr' : 'rtl'}>
      {(typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) && (
        <div className="mb-6 p-3.5 rounded-full bg-amber-50/80 border border-amber-200/80 dark:bg-amber-950/30 dark:border-amber-900/50 text-center">
          <p className="text-xs font-extrabold text-amber-800 dark:text-amber-300 mb-2.5 flex items-center justify-center gap-1.5">
            <span>⚡ {isEn ? 'Local Dev Quick Test Mode' : 'وضع التجربة السريعة في المحلي'}</span>
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <a
              href="/api/auth/dev-login"
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-[11px] font-bold hover:bg-amber-600 transition shadow-xs"
            >
              {isEn ? '🚀 Login as Test Seller (1-Click)' : '🚀 دخول كبائع تجريبي (بضغطة واحدة)'}
            </a>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@meamart.com');
                setPassword('MeaMart@Admin#2026!');
                setActiveTab('login');
              }}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 text-[11px] font-bold hover:opacity-90 transition shadow-xs"
            >
              {isEn ? '👑 Fill Admin Account' : '👑 تعبئة بيانات حساب الإدمن'}
            </button>
          </div>
        </div>
      )}

      <div className="flex border-b border-zinc-100 dark:border-zinc-800/80 -mx-5 sm:-mx-8 -mt-5 sm:-mt-8 mb-6" role="tablist" aria-label="Login tabs">
        <button
          type="button"
          onClick={() => { setActiveTab('login'); setAuthError(''); setAuthMsg(''); }}
          className={`flex-1 py-4 text-center font-bold text-sm transition-all border-b-2 ${
            activeTab === 'login'
              ? 'border-primary text-primary dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
          role="tab"
          aria-selected={activeTab === 'login'}
        >
          {props.signinLabel}
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('register'); setAuthError(''); setAuthMsg(''); }}
          className={`flex-1 py-4 text-center font-bold text-sm transition-all border-b-2 ${
            activeTab === 'register'
              ? 'border-primary text-primary dark:text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
          role="tab"
          aria-selected={activeTab === 'register'}
        >
          {props.registerLabel}
        </button>
      </div>

      {activeTab === 'login' && (
        <div className="space-y-6 text-center">
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{props.signinDesc}</p>
          <a
            href={googleHref}
            className="flex items-center justify-center gap-3 w-full rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 py-3.5 text-sm font-bold text-zinc-700 shadow-sm transition hover:scale-[1.01] active:scale-[0.99] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>{props.googleBtn}</span>
          </a>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 font-bold text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                {isEn ? 'Or sign in with email' : 'أو الدخول بالبريد الإلكتروني'}
              </span>
            </div>
          </div>

          <form onSubmit={e => handleEmailAuth(e, 'login')} className={`space-y-3 ${isEn ? 'text-left' : 'text-right'}`}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={isEn ? 'Email Address' : 'البريد الإلكتروني'}
              className="w-full rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-950"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={isEn ? 'Password' : 'كلمة المرور'}
                className={`w-full rounded-full border border-zinc-200 bg-white py-3 ${isEn ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm font-medium dark:border-zinc-800 dark:bg-zinc-950`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute ${isEn ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {cleanError && <p className="text-xs font-bold text-red-500 text-center my-2">{cleanError}</p>}
            {cleanMsg && <p className="text-xs font-bold text-emerald-600 text-center my-2">{cleanMsg}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-full bg-zinc-900 py-3 text-xs font-extrabold text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 disabled:opacity-50"
            >
              {authLoading ? (isEn ? 'Verifying...' : 'جاري التحقق...') : (isEn ? 'Sign In' : 'تسجيل الدخول')}
            </button>
          </form>

          <TurnstileWidgetReact action="login" lang={currentLang} />
        </div>
      )}

      {activeTab === 'register' && (
        <div className="space-y-6 text-center">
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{props.registerDesc}</p>
          <a
            href={googleHref}
            className="flex items-center justify-center gap-3 w-full rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 py-3.5 text-sm font-bold text-zinc-700 shadow-sm transition hover:scale-[1.01] active:scale-[0.99] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>{props.googleRegister}</span>
          </a>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 font-bold text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                {isEn ? 'Or register with email' : 'أو التسجيل بالبريد الإلكتروني'}
              </span>
            </div>
          </div>

          <form onSubmit={e => handleEmailAuth(e, 'register')} className={`space-y-3 ${isEn ? 'text-left' : 'text-right'}`}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={isEn ? 'Full Name' : 'الاسم الكامل'}
              required
              className="w-full rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-950"
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={isEn ? 'Email Address' : 'البريد الإلكتروني'}
              className="w-full rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-950"
            />
            <div className="relative">
              <input
                type={showRegisterPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={isEn ? 'Password (at least 6 characters)' : 'كلمة المرور (6 أحرف على الأقل)'}
                className={`w-full rounded-full border border-zinc-200 bg-white py-3 ${isEn ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm font-medium dark:border-zinc-800 dark:bg-zinc-950`}
              />
              <button
                type="button"
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                className={`absolute ${isEn ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors`}
              >
                {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {cleanError && <p className="text-xs font-bold text-red-500 text-center my-2">{cleanError}</p>}
            {cleanMsg && <p className="text-xs font-bold text-emerald-600 text-center my-2">{cleanMsg}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-full bg-primary py-3 text-xs font-extrabold text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {authLoading ? (isEn ? 'Creating Account...' : 'جاري إنشاء الحساب...') : (isEn ? 'Create New Account' : 'إنشاء حساب جديد')}
            </button>
          </form>

          <TurnstileWidgetReact action="register" lang={currentLang} />
        </div>
      )}
    </div>
  );
}
