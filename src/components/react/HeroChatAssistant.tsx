import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Loader2, Plus, Mic } from 'lucide-react';
import { ui } from '~/i18n/ui';

interface Props {
  lang: string;
}

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

export default function HeroChatAssistant({ lang }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const t = ui[lang as keyof typeof ui] || ui['en'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add initial greeting
      setMessages([
        {
          id: Date.now().toString(),
          role: 'bot',
          text: lang === 'ar' 
            ? 'أهلاً بك في ميمارت! أنا مساعدك الذكي. كيف أقدر أساعدك اليوم؟ تقدر تسألني عن أي إعلان أو تطلب مني أسوي لك إعلان جديد.'
            : 'Welcome to MeaMart! I am your AI assistant. How can I help you today? You can ask me about listings or ask me to create a new ad for you.'
        }
      ]);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, lang, messages.length]);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userText = inputText.trim();
    setInputText('');
    
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setLoading(true);

    try {
      // Call the API endpoint
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, lang })
      });

      if (!response.ok) {
        throw new Error('API Request Failed');
      }

      const data = await response.json();
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'bot', text: data.reply || '...' };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'bot', 
        text: lang === 'ar' ? 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.' : 'Sorry, there was a connection error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Trigger Button - Gemini Style */}
      <div 
        onClick={() => setIsOpen(true)}
        className="w-full max-w-2xl mx-auto bg-white dark:bg-[#1e1f20] border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors rounded-full px-6 py-4 flex items-center cursor-text shadow-sm dark:shadow-none"
      >
        <Plus className="w-6 h-6 text-zinc-500 dark:text-zinc-400 mr-4" />
        <span className="flex-1 text-left text-zinc-500 dark:text-zinc-400 text-lg font-medium">
          {lang === 'ar' ? 'اسأل المساعد...' : 'Ask Assistant'}
        </span>
        <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 ml-4">
          <Mic className="w-5 h-5 hover:text-zinc-800 dark:hover:text-white transition-colors cursor-pointer" />
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex flex-col bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md sm:p-4 md:p-6 animate-in fade-in duration-300">
          <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col bg-white dark:bg-zinc-900 sm:rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="text-start">
                  <h3 className="font-bold text-zinc-900 dark:text-white leading-tight">
                    {lang === 'ar' ? 'مساعد ميمارت' : 'MeaMart Assistant'}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs text-zinc-500 font-medium">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar */}
                    {msg.role === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    {/* Bubble */}
                    <div className={`px-5 py-3.5 rounded-2xl text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-tl-sm' 
                        : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tr-sm border border-zinc-100 dark:border-zinc-700 shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="px-5 py-4 rounded-2xl bg-white dark:bg-zinc-800 rounded-tr-sm border border-zinc-100 dark:border-zinc-700 shadow-sm flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
              <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                  className="w-full resize-none rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 py-3.5 px-4 pr-12 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all min-h-[52px] max-h-[150px]"
                  rows={1}
                  dir="auto"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim() || loading}
                  className="absolute bottom-1.5 rtl:left-1.5 ltr:right-1.5 w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white disabled:opacity-50 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 transition-colors"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 rtl:-scale-x-100" />}
                </button>
              </div>
              <div className="text-center mt-3">
                <span className="text-[10px] text-zinc-400 font-medium">
                  Powered by MeaChat AI
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
