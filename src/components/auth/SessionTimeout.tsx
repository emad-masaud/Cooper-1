import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from '~/i18n/utils';

interface SessionTimeoutProps {
  timeoutMinutes?: number;
  lang?: string;
}

export default function SessionTimeout({ timeoutMinutes = 30, lang = 'ar' }: SessionTimeoutProps) {
  const t = useTranslations(lang);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60 seconds warning
  
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warningTimeMs = 60 * 1000; // Show warning 60 seconds before timeout
  
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    // If the warning is already showing, don't reset just by mouse move, require explicit click on "Stay Logged In"
    if (showWarning) return;

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    
    idleTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(60);
    }, timeoutMs - warningTimeMs);
  };

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    resetTimer();
  };

  useEffect(() => {
    // Start tracking activity
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initial setup
    resetTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [showWarning, timeoutMs]);

  useEffect(() => {
    if (showWarning) {
      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Timeout reached, logout
            window.location.href = '/api/auth/logout';
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    }

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [showWarning]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl shadow-xl max-w-md w-full mx-4 border border-zinc-200 dark:border-zinc-800 text-center animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
          انتهت مهلة الجلسة
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
          نظراً لعدم وجود تفاعل لفترة من الوقت، سيتم تسجيل خروجك تلقائياً بعد <strong className="text-amber-600 dark:text-amber-500 text-lg mx-1">{countdown}</strong> ثانية لحماية حسابك.
        </p>
        <button 
          onClick={handleStayLoggedIn}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all focus:ring-4 focus:ring-indigo-600/20"
        >
          البقاء متصلاً
        </button>
      </div>
    </div>
  );
}
