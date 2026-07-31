import React, { useEffect, useRef } from 'react';

interface TurnstileWidgetProps {
  onVerify?: (token: string) => void;
  action?: string;
  theme?: 'light' | 'dark' | 'auto';
  lang?: string;
}

declare global {
  interface Window {
    turnstile?: any;
    onTurnstileSuccess?: (token: string) => void;
  }
}

export default function TurnstileWidgetReact({ onVerify, action = 'login', theme = 'auto', lang }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const siteKey = (import.meta as any).env?.PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';
  const currentLang = lang || (typeof window !== 'undefined' && window.location.pathname.startsWith('/en') ? 'en' : 'ar');

  useEffect(() => {
    // Load script if not already loaded
    if (!document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
      const script = document.createElement('script');
      script.src = `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const interval = setInterval(() => {
      if (window.turnstile && containerRef.current && containerRef.current.childElementCount === 0) {
        window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: theme,
          action: action,
          language: currentLang,
          callback: (token: string) => {
            if (onVerify) onVerify(token);
          }
        });
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [siteKey, theme, action, onVerify, currentLang]);

  return <div ref={containerRef} className="my-3 flex justify-center min-h-[65px]" />;
}
