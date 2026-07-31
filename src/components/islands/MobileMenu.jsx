import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Github, User, LogOut, LayoutGrid, LogIn, Sun, Moon, ShoppingBag, QrCode } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ACTION_LINKS } from '~/site.config';

export default function MobileMenu({ 
  links, 
  currentPath = '/',
  labels = {
    menu: 'Menu',
    getStarted: 'Get Started'
  },
  userSession = null,
  lang = 'ar',
  availableLangs = null,
  children
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSession, setActiveSession] = useState(userSession);

  useEffect(() => {
    if (!userSession) {
      const sessionStr = localStorage.getItem('meamart_session_active');
      if (sessionStr) {
        try {
          setActiveSession(JSON.parse(sessionStr));
        } catch (e) {
          console.error('[MobileMenu] Failed to parse session:', e);
        }
      }
    } else {
      setActiveSession(userSession);
    }
  }, [userSession]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-foreground hover:bg-foreground/5 rounded-md transition-colors z-50 relative"
        aria-label="Open Mobile Menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu-panel"
      >
        <Menu className="w-6 h-6" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[60]"
              aria-hidden="true"
            />

            {/* Slide-out Panel / Full Screen Overlay */}
            <motion.div
              id="mobile-menu-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-0 md:inset-auto md:top-0 md:right-0 md:h-full md:w-96 bg-background md:border-l md:border-foreground/10 md:shadow-2xl z-[70] p-6 flex flex-col h-[100dvh] md:h-full"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold text-primary md:text-lg">{labels.menu}</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-foreground/70 hover:text-foreground rounded-full hover:bg-foreground/5 transition-colors"
                  aria-label="Close Mobile Menu"
                >
                  <X className="w-8 h-8 md:w-6 md:h-6" aria-hidden="true" />
                </button>
              </div>

              <nav className="flex-1 min-h-0 overflow-y-auto" aria-label="Mobile Menu Links">
                <ul className="flex flex-col gap-4 md:gap-2 m-0 p-0 list-none">
                  {links.map((link) => {
                    const isActive = (href) => {
                         if (href === '/') return currentPath === '/';
                         return currentPath.startsWith(href);
                    };
                    const isLinkActive = isActive(link.href || '') || (link.children && link.children.map(c => isActive(c.href)).some(Boolean));

                    return (
                    <li key={link.label}>
                      {link.children ? (
                          <div className="flex flex-col">
                               <div className={`flex items-center justify-between py-2 text-xl md:text-lg font-bold ${
                                   isLinkActive ? 'text-primary dark:text-blue-300' : 'text-foreground/80 dark:text-white'
                               }`}>
                                  {link.label}
                               </div>
                               <ul className="pl-4 flex flex-col gap-3 md:gap-2 border-l-2 border-foreground/10 ml-2 m-0 list-none">
                                  {link.children.map(child => {
                                      const Icon = child.icon ? Icons[child.icon] : null;
                                      return (
                                      <li key={child.href}>
                                        <a 
                                            href={child.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`py-2 text-lg md:text-base transition-colors flex items-center gap-3 ${
                                                isActive(child.href) 
                                                ? 'text-primary dark:text-blue-300 font-medium' 
                                                : 'text-foreground hover:text-primary dark:text-white dark:hover:text-blue-300'
                                            }`}
                                        >
                                            {Icon && <Icon className="w-5 h-5 md:w-4 md:h-4" aria-hidden="true" />}
                                            {child.label}
                                        </a>
                                      </li>
                                  )})}
                               </ul>
                          </div>
                      ) : (
                          <a
                              href={link.href}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center justify-between py-2 text-xl md:text-lg font-bold transition-colors ${
                                  isActive(link.href) 
                                  ? 'text-primary dark:text-blue-300' 
                                  : 'text-foreground hover:text-primary dark:text-white dark:hover:text-blue-300'
                              }`}
                          >
                              {link.label}
                              <motion.span 
                                initial={{ x: -10, opacity: 0 }}
                                whileHover={{ x: 0, opacity: 1 }}
                                className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-hidden="true"
                              >
                                →
                              </motion.span>
                          </a>
                      )}
                    </li>
                  );})}
                </ul>
              </nav>

              <div className="pt-6 md:pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-4 mt-auto">
                {activeSession ? (
                  <div className="space-y-4">
                    {/* User Info Card */}
                    <div className="flex items-center gap-3 p-3 rounded-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50">
                      <div className="h-10 w-10 rounded-full bg-primary/10 border border-zinc-200 text-primary flex items-center justify-center font-bold text-sm overflow-hidden dark:border-zinc-800 shrink-0">
                        {activeSession.avatar ? (
                          <img src={activeSession.avatar} alt={activeSession.name} className="h-full w-full object-cover" />
                        ) : (
                          activeSession.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{lang === 'ar' ? 'مرحباً بك' : 'Welcome'}</p>
                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">{activeSession.name}</p>
                      </div>
                    </div>

                    {/* User Actions Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <a 
                        href={`/${lang}/seller/dashboard`} 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <LayoutGrid className="w-4 h-4 text-primary" />
                        <span>{lang === 'ar' ? 'إعلاناتي' : 'My Ads'}</span>
                      </a>
                      <a 
                        href={`/${lang}/seller/products`} 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4 text-primary" />
                        <span>{lang === 'ar' ? 'منتجاتي' : 'My Products'}</span>
                      </a>
                      <a 
                        href={`/${lang}/seller/addresses`} 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <Icons.MapPin className="w-4 h-4 text-primary" />
                        <span>{lang === 'ar' ? 'عناويني' : 'My Addresses'}</span>
                      </a>
                      <a 
                        href={`/${lang}/seller/profile`} 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <User className="w-4 h-4 text-primary" />
                        <span>{lang === 'ar' ? 'الملف الشخصي' : 'My Profile'}</span>
                      </a>
                      <a 
                        href={`/${lang}/seller/qr-manager`} 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors col-span-2"
                      >
                        <QrCode className="w-4 h-4 text-primary" />
                        <span>{lang === 'ar' ? 'الباركود والرابط الموحد' : 'QR & Bio Link'}</span>
                      </a>
                    </div>
                    {activeSession.is_admin && (
                      <a 
                        href={`/${lang}/admin/dashboard`} 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors w-full"
                      >
                        <User className="w-4 h-4" />
                        <span>{lang === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}</span>
                      </a>
                    )}

                    <a 
                      href="/api/auth/logout" 
                      onClick={() => {
                        localStorage.removeItem('meamart_session_active');
                        localStorage.removeItem('meamart_session_timestamp');
                      }}
                      className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-950/45 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <a 
                      href={`/${lang}/login`}
                      onClick={() => setIsOpen(false)}
                      className="w-full py-3 px-4 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-center font-bold rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
                    </a>
                  </div>
                )}

                <a 
                  href={`/${lang}/ads/create`}
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 px-4 bg-primary text-white text-center font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2"
                >
                  {labels.getStarted}
                </a>
                
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => window.toggleTheme && window.toggleTheme()}
                    className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center"
                    aria-label="Toggle Theme"
                  >
                    <Sun className="w-5 h-5 dark:hidden block" />
                    <Moon className="w-5 h-5 hidden dark:block" />
                  </button>
                </div>

                {/* Language Switcher */}
                {availableLangs && availableLangs.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {availableLangs.map((langCode) => (
                      <a
                        key={langCode}
                        href={`/${langCode}${window.location.pathname.replace(/^\/[a-z]{2}/, '')}`}
                        onClick={() => setIsOpen(false)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                          lang === langCode
                            ? 'bg-primary text-white border-primary'
                            : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-primary hover:text-primary'
                        }`}
                      >
                        {langCode.toUpperCase()}
                      </a>
                    ))}
                  </div>
                )}

                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
