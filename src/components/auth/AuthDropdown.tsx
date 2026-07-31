import { useEffect, useState } from 'react';
import { User, LogOut, LayoutGrid, QrCode } from 'lucide-react';

interface AuthSession {
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  is_admin?: boolean;
}

export default function AuthDropdown({ lang = 'ar' }: { lang?: string }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check localStorage for session
    const sessionStr = localStorage.getItem('meamart_session_active');
    if (sessionStr) {
      try {
        const parsedSession = JSON.parse(sessionStr);
        setSession(parsedSession);
        console.log('[AuthDropdown] ✅ Session loaded from localStorage:', parsedSession.email);
      } catch (e) {
        console.error('[AuthDropdown] Failed to parse session:', e);
      }
    }

    // Listen for storage changes (from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'meamart_session_active') {
        if (e.newValue) {
          try {
            setSession(JSON.parse(e.newValue));
          } catch (e) {
            console.error('[AuthDropdown] Failed to parse session from storage event:', e);
          }
        } else {
          setSession(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!session) {
    return null;
  }

  const initials = session.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const dashboardUrl = `/${lang}/seller/dashboard`;
  const logoutUrl = '/api/auth/logout';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary/20 dark:bg-primary/20 dark:text-white"
        aria-expanded={isOpen}
        aria-label={`User menu for ${session.name}`}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {initials}
        </div>
        <span className="hidden sm:inline">{session.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{session.name}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{session.email}</p>
          </div>

          <div className="space-y-1 p-2">
            <a
              href={dashboardUrl}
              className="flex items-center gap-2 rounded px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              onClick={() => setIsOpen(false)}
            >
              <LayoutGrid className="h-4 w-4" />
              {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
            </a>

            <a
              href={`/${lang}/seller/qr-manager`}
              className="flex items-center gap-2 rounded px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              onClick={() => setIsOpen(false)}
            >
              <QrCode className="h-4 w-4 text-primary" />
              {lang === 'ar' ? 'الباركود' : 'Barcode & QR'}
            </a>

            {session.is_admin && (
              <a
                href={`/${lang}/admin/dashboard`}
                className="flex items-center gap-2 rounded px-3 py-2 text-sm font-bold text-primary transition hover:bg-primary/10 dark:hover:bg-primary/20"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                Admin Panel
              </a>
            )}

            <a
              href={logoutUrl}
              className="flex items-center gap-2 rounded px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
              onClick={() => {
                localStorage.removeItem('meamart_session_active');
                localStorage.removeItem('meamart_session_timestamp');
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
