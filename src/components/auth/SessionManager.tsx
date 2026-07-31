import { useEffect, useState } from 'react';

export default function SessionManager() {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Check if session cookie exists
    const checkSession = () => {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('meamart_session='))
        ?.split('=')[1];

      if (cookieValue) {
        try {
          let decoded = decodeURIComponent(cookieValue);
          if (decoded.includes('%')) {
            try {
              decoded = decodeURIComponent(decoded);
            } catch (e) {}
          }
          const session = JSON.parse(decoded);
          localStorage.setItem('meamart_session_backup', JSON.stringify(session));
          console.log('Session detected and backed up:', session);
        } catch (e) {
          console.error('Failed to parse session cookie:', e);
        }
      } else {
        const backup = localStorage.getItem('meamart_session_backup');
        if (backup) {
          try {
            document.cookie = `meamart_session=${encodeURIComponent(backup)}; path=/; max-age=2592000; SameSite=Lax`;
            console.log('Restored session cookie from localStorage backup');
          } catch (e) {
            console.error('Failed restoring session cookie:', e);
          }
        }
      }
      setIsChecked(true);
    };

    // Run immediately and after page load events
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkSession);
    } else {
      checkSession();
    }

    // Also check on page visibility (when user returns to tab)
    window.addEventListener('visibilitychange', checkSession);

    return () => {
      document.removeEventListener('DOMContentLoaded', checkSession);
      window.removeEventListener('visibilitychange', checkSession);
    };
  }, []);

  return null;
}
