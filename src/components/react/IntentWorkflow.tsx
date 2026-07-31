import { useTranslations } from '../../i18n/utils';
import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Home, 
  Smartphone, 
  Briefcase, 
  Wrench, 
  Edit3, 
  CheckCircle, 
  ArrowLeft, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  HelpCircle, 
  FileText,
  MapPin,
  Tag,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Bot,
  AlertCircle
} from 'lucide-react';

interface IntentOption {
  id: string;
  label: string;
  icon: any;
  placeholder: string;
  style?: {
    bg: string;
    text: string;
    border: string;
    hoverBg: string;
    hoverText: string;
  };
  questions?: { key: string; label: string; placeholder: string }[];
}

const getIntents = (t: any): IntentOption[] => [
  { 
    id: 'SELL_CAR', 
    label: t['intent.workflow.text100'], 
    icon: Car, 
    placeholder: t['intent.workflow.text101'],
    style: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100/50 dark:border-blue-900/30',
      hoverBg: 'group-hover:bg-blue-600 dark:group-hover:bg-blue-500',
      hoverText: 'group-hover:text-white',
    },
    questions: [
      { key: 'الماركة والموديل وسنة الصنع', label: t['intent.workflow.text102'], placeholder: t['intent.workflow.text103'] },
      { key: 'الممشى والحالة العامة', label: t['intent.workflow.text104'], placeholder: t['intent.workflow.text105'] },
      { key: 'المدينة وحي المعاينة', label: t['intent.workflow.text106'], placeholder: t['intent.workflow.text107'] },
      { key: 'السعر المطلوب', label: t['intent.workflow.text108'], placeholder: t['intent.workflow.text109'] }
    ]
  },
  { 
    id: 'SELL_PROPERTY', 
    label: t['intent.workflow.text110'], 
    icon: Home, 
    placeholder: t['intent.workflow.text111'],
    style: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100/50 dark:border-emerald-900/30',
      hoverBg: 'group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500',
      hoverText: 'group-hover:text-white',
    },
    questions: [
      { key: 'نوع العقار والمساحة والهدف', label: t['intent.workflow.text112'], placeholder: t['intent.workflow.text113'] },
      { key: 'المدينة والحي والخدمات', label: t['intent.workflow.text114'], placeholder: t['intent.workflow.text115'] },
      { key: 'عدد الغرف والمواصفات', label: t['intent.workflow.text116'], placeholder: t['intent.workflow.text117'] },
      { key: 'السعر أو الإيجار المطلوب', label: t['intent.workflow.text118'], placeholder: t['intent.workflow.text119'] }
    ]
  },
  { 
    id: 'SELL_DEVICE', 
    label: t['intent.workflow.text120'], 
    icon: Smartphone, 
    placeholder: t['intent.workflow.text121'],
    style: {
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-100/50 dark:border-purple-900/30',
      hoverBg: 'group-hover:bg-purple-600 dark:group-hover:bg-purple-500',
      hoverText: 'group-hover:text-white',
    },
    questions: [
      { key: 'اسم الجهاز والماركة والموديل', label: t['intent.workflow.text122'], placeholder: t['intent.workflow.text123'] },
      { key: 'حالة الجهاز والملحقات', label: t['intent.workflow.text124'], placeholder: t['intent.workflow.text125'] },
      { key: 'المدينة ومكان التسليم', label: t['intent.workflow.text126'], placeholder: t['intent.workflow.text127'] },
      { key: 'السعر المطلوب', label: t['intent.workflow.text128'], placeholder: t['intent.workflow.text129'] }
    ]
  },
  { 
    id: 'POST_JOB', 
    label: t['intent.workflow.text130'], 
    icon: Briefcase, 
    placeholder: t['intent.workflow.text131'],
    style: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-100/50 dark:border-indigo-900/30',
      hoverBg: 'group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500',
      hoverText: 'group-hover:text-white',
    },
    questions: [
      { key: 'المسمى الوظيفي والمجال', label: t['intent.workflow.text132'], placeholder: t['intent.workflow.text133'] },
      { key: 'الخبرة والشروط المطلوبة', label: t['intent.workflow.text134'], placeholder: t['intent.workflow.text135'] },
      { key: 'المدينة ومقر العمل', label: t['intent.workflow.text136'], placeholder: t['intent.workflow.text137'] },
      { key: 'الراتب والمزايا المقدرة', label: t['intent.workflow.text138'], placeholder: t['intent.workflow.text139'] }
    ]
  },
  { 
    id: 'POST_SERVICE', 
    label: t['intent.workflow.text140'], 
    icon: Wrench, 
    placeholder: t['intent.workflow.text141'],
    style: {
      bg: 'bg-cyan-50 dark:bg-cyan-950/30',
      text: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-100/50 dark:border-cyan-900/30',
      hoverBg: 'group-hover:bg-cyan-600 dark:group-hover:bg-cyan-500',
      hoverText: 'group-hover:text-white',
    },
    questions: [
      { key: 'نوع الخدمة والمميزات', label: t['intent.workflow.text142'], placeholder: t['intent.workflow.text143'] },
      { key: 'نطاق التغطية والمدن', label: t['intent.workflow.text144'], placeholder: t['intent.workflow.text145'] },
      { key: 'الأسعار والرسوم', label: t['intent.workflow.text146'], placeholder: t['intent.workflow.text147'] }
    ]
  }
];

const getKnowledgeCenterUrl = (intentId?: string): string => {
  switch (intentId) {
    case 'SELL_CAR': return '/docs/selling/sell-cars-fast';
    case 'SELL_PROPERTY': return '/docs/selling/sell-real-estate';
    case 'POST_JOB': return '/docs/selling/jobs-listing-guide';
    case 'POST_SERVICE': return '/docs/selling/services-listing-guide';
    default: return '/docs/selling/create-ad-guide';
  }
};

export default function IntentWorkflow({ lang = 'ar' }: { lang?: string }) {
  const [step, setStep] = useState(1);
  const [selectedIntent, setSelectedIntent] = useState<IntentOption | null>(null);
  const [inputMode, setInputMode] = useState<'template' | 'freetext'>('template');
  const [inputText, setInputText] = useState('');
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [externalAgentOutput, setExternalAgentOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [autofillSuccess, setAutofillSuccess] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  
  const t = useTranslations(lang);
  const intents = useMemo(() => getIntents(t), [t]);

  const handleAttributeChange = (oldKey: string, newKeyVal: string, newVal: string) => {
    setResult((prev: any) => {
      if (!prev) return prev;
      const copy = { ...prev.attributes };
      if (oldKey !== newKeyVal) {
        delete copy[oldKey];
      }
      copy[newKeyVal] = newVal;
      return { ...prev, attributes: copy };
    });
  };

  const handleDeleteAttribute = (keyToDelete: string) => {
    setResult((prev: any) => {
      if (!prev) return prev;
      const copy = { ...prev.attributes };
      delete copy[keyToDelete];
      return { ...prev, attributes: copy };
    });
  };

  const handleAddAttribute = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    setResult((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        attributes: {
          ...prev.attributes,
          [newKey.trim()]: newValue.trim()
        }
      };
    });
    setNewKey('');
    setNewValue('');
  };

  const handleIntentSelect = (intent: IntentOption) => {
    setSelectedIntent(intent);
    setQuestionAnswers({});
    setInputText('');
    setError(null);
    if (intent.questions && intent.questions.length > 0) {
      setInputMode('template');
    } else {
      setInputMode('freetext');
    }
    setStep(2);
  };

  const handleAnswerChange = (key: string, value: string) => {
    setQuestionAnswers(prev => ({ ...prev, [key]: value }));
  };

  const isInputValid = () => {
    if (inputMode === 'freetext') {
      return inputText.trim().length >= 3;
    } else {
      return Object.values(questionAnswers).some(val => val.trim().length >= 2);
    }
  };

  const handleGenerate = async () => {
    if (!isInputValid()) {
      setError(t['intent.workflow.text148']);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/intent-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: selectedIntent?.id || 'FREE_TEXT_FILL',
          inputText: inputMode === 'freetext' ? inputText : '',
          questionAnswers: inputMode === 'template' ? questionAnswers : {},
          lang
        })
      });

      if (!res.ok) {
        throw new Error(t['intent.workflow.text149']);
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.error || (t['intent.workflow.text150']));
      
      setResult(json.data);
      setStep(3);
    } catch (err: any) {
      setError(err.message || (t['intent.workflow.text151']));
    } finally {
      setLoading(false);
    }
  };

  const handleParseExternalOutput = () => {
    try {
      if (!String(externalAgentOutput).trim()) {
        setError(t['intent.workflow.text152']);
        return;
      }
      
      const jsonStr = externalAgentOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      
      if (!parsed.title && !parsed.description) {
        throw new Error(t['intent.workflow.text153']);
      }
      
      setResult({
        title: parsed.title || '',
        description: parsed.description || '',
        price: parsed.price ? String(parsed.price) : '',
        city: parsed.city || '',
        category: parsed.category || selectedIntent?.id || '',
        attributes: {}
      });
      setStep(3);
      setError(null);
    } catch (err) {
      setError(t['intent.workflow.text154']);
    }
  };

  const handleProceedToAd = () => {
    if (result) {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('meamart:prefill', { detail: result });
        window.dispatchEvent(event);

        // Direct DOM form auto-fill if on any create or edit page
        const isTargetPage = window.location.pathname.includes('/ads/create') || window.location.pathname.includes('/seller/products/create') || window.location.pathname.includes('/ads/edit');
        if (isTargetPage) {
          const fillField = (selectors: string[], value: any) => {
            if (value === null || value === undefined || value === '') return;
            for (const sel of selectors) {
              const el = document.querySelector(sel) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
              if (el) {
                el.value = String(value);
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                break;
              }
            }
          };

          fillField(['#ad-title', 'input[name="listing_title"]', 'input[name="title"]', 'input[name="name"]', '#product-name'], result.title);
          fillField(['#ad-description', 'textarea[name="listing_description"]', 'textarea[name="description"]', 'textarea[name="short_description"]', '#product-description', '#listing-description-textarea'], result.description);
          fillField(['#ad-price', 'input[name="listing_price"]', 'input[name="regular_price"]', 'input[name="price"]', '#product-price', '#price-input'], result.price);
          fillField(['#ad-city', 'select[name="listing_city"]', 'input[name="listing_city"]', 'input[name="city"]', '#city-input'], result.city);
          fillField(['#ad-category', 'select[name="categoryKey"]', '#real-category-select', 'select[name="category"]', 'select[name="product_type"]'], result.category);

          // Force trigger a global prefill event again just to be safe
          window.dispatchEvent(new CustomEvent('meamart:prefill_fallback', { detail: result }));

          setAutofillSuccess(true);
          setTimeout(() => {
            setIsCollapsed(true);
          }, 1500);
          return;
        }
      }
      sessionStorage.setItem('meamart_prefill_ad', JSON.stringify(result));
      window.location.href = `/${lang}/ads/create`;
    }
  };

  const handleCopy = () => {
    if (result) {
      const textToCopy = `${result.title}\n\n${result.description}${result.price ? `\n\nالسعر: ${result.price}` : ''}${result.city ? `\nالمدينة: ${result.city}` : ''}`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 transition-all duration-300">
      
      {/* HEADER & STEP PROGRESS */}
      <div className="bg-zinc-50/80 dark:bg-zinc-900/80 border-b border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:px-8 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* TITLE ON START SIDE */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
            <div className="p-2.5 sm:p-3 bg-primary text-white rounded-xl sm:rounded-full shadow-md shadow-primary/20 shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white m-0 tracking-tight">
              {t['intent.workflow.text155']}
            </h2>
          </div>

          {/* STEP COUNTER & COLLAPSE BUTTON ON END SIDE (FAR LEFT IN RTL / FAR RIGHT IN LTR) */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-200/60 dark:border-zinc-800/60">
            {/* STEP INDICATOR */}
            <div className="flex items-center gap-2 bg-zinc-100/80 dark:bg-zinc-800/80 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
              <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all ${step === 1 ? 'bg-primary text-white scale-110 shadow-xs' : step > 1 ? 'bg-green-500 text-white' : 'bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'}`}>1</span>
              <div className="w-3 sm:w-4 h-0.5 bg-zinc-300 dark:bg-zinc-700"></div>
              <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all ${step === 2 ? 'bg-primary text-white scale-110 shadow-xs' : step > 2 ? 'bg-green-500 text-white' : 'bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'}`}>2</span>
              <div className="w-3 sm:w-4 h-0.5 bg-zinc-300 dark:bg-zinc-700"></div>
              <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all ${step === 3 ? 'bg-primary text-white scale-110 shadow-xs' : 'bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'}`}>3</span>
            </div>

            {/* COLLAPSE BUTTON */}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full transition-all border border-zinc-200/80 dark:border-zinc-700/80 active:scale-95 shrink-0 shadow-2xs"
            >
              {isCollapsed ? (
                <>
                  <span>{t['intent.workflow.text156']}</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>{t['intent.workflow.text157']}</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {autofillSuccess && (
        <div className="bg-emerald-500/15 border-b border-emerald-500/30 p-4 text-center text-sm font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2 animate-in fade-in duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          {t['intent.workflow.text158']}
        </div>
      )}

      {!isCollapsed && (
        <div className="p-4 sm:p-8 animate-in fade-in duration-300">
        {/* STEP 1: SELECT INTENT */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-5 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                {t['intent.workflow.text159']}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                {t['intent.workflow.text160']}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {intents.map(intent => (
                <button
                   key={intent.id}
                   type="button"
                   onClick={() => handleIntentSelect(intent)}
                   className="group flex flex-col items-center justify-center rounded-2xl border border-zinc-200/50 bg-white p-4 text-center transition-all duration-300 hover:border-primary/20 hover:shadow-lg dark:border-zinc-800/50 dark:bg-zinc-900/40 hover:scale-105 active:scale-95 select-none"
                >
                  <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full border ${intent.style?.bg || 'bg-primary/10'} ${intent.style?.text || 'text-primary'} ${intent.style?.border || 'border-primary/20'} transition-all duration-300 ${intent.style?.hoverBg || 'group-hover:bg-primary'} ${intent.style?.hoverText || 'group-hover:text-white'} shadow-xs`}>
                    <intent.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors group-hover:text-primary">
                    {intent.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 relative flex items-center py-3 sm:py-4">
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
              <span className="flex-shrink-0 mx-3 sm:mx-4 text-zinc-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider">{t['intent.workflow.text161']}</span>
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>

            <button
              type="button"
              onClick={() => handleIntentSelect({ 
                id: 'FREE_TEXT_FILL', 
                label: t['intent.workflow.text162'], 
                icon: Edit3,
                placeholder: t['intent.workflow.text163'],
                style: {
                  bg: 'bg-primary/10 dark:bg-primary/20',
                  text: 'text-primary',
                  border: 'border-primary/30',
                  hoverBg: 'group-hover:bg-primary',
                  hoverText: 'group-hover:text-white',
                }
              })}
              className="w-full flex items-center justify-center gap-2 sm:gap-3 p-4 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all font-bold text-xs sm:text-sm active:scale-[0.99]"
            >
              <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
              <span>{t['intent.workflow.text164']}</span>
            </button>

            <div className="mt-4 sm:mt-6 relative flex items-center py-3 sm:py-4">
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
              <span className="flex-shrink-0 mx-3 sm:mx-4 text-zinc-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider">{t['intent.workflow.text165']}</span>
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>

            <button
              onClick={() => { setStep(4); setError(null); }}
              className="w-full flex items-center justify-center gap-2 sm:gap-3 p-4 bg-foreground text-background rounded-full px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <span>{t['intent.workflow.text166']}</span>
            </button>
          </div>
        )}

        {/* STEP 2: INPUT DETAILS / GUIDED QUESTIONS */}
        {step === 2 && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => { setStep(1); setError(null); }}
              className="flex items-center gap-1.5 text-xs font-extrabold text-zinc-500 hover:text-primary dark:hover:text-primary mb-4 sm:mb-6 transition-colors bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl w-fit active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" /> {t['intent.workflow.text167']}
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 flex h-11 w-11 items-center justify-center rounded-full border ${selectedIntent?.style ? `${selectedIntent.style.bg} ${selectedIntent.style.text} ${selectedIntent.style.border}` : 'bg-primary/10 text-primary border-primary/20'}`}>
                  {selectedIntent?.icon ? <selectedIntent.icon className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 m-0">{selectedIntent?.label}</h3>
                  <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 m-0 mt-0.5">{t['intent.workflow.text168']}</p>
                </div>
              </div>

              {/* MODE SWITCHER IF QUESTIONS EXIST */}
              {selectedIntent?.questions && selectedIntent.questions.length > 0 && (
                <div className="grid grid-cols-2 sm:flex bg-zinc-200/70 dark:bg-zinc-800 p-1 rounded-xl w-full sm:w-auto border border-zinc-300/50 dark:border-zinc-700/50">
                  <button
                    onClick={() => setInputMode('template')}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all ${inputMode === 'template' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'}`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{t['intent.workflow.text169']}</span>
                  </button>
                  <button
                    onClick={() => setInputMode('freetext')}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all ${inputMode === 'freetext' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'}`}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span>{t['intent.workflow.text170']}</span>
                  </button>
                </div>
              )}
            </div>

            {/* TEMPLATE / GUIDED QUESTIONS MODE */}
            {inputMode === 'template' && selectedIntent?.questions ? (
              <div className="space-y-3 sm:space-y-3.5 mb-6 sm:mb-8">
                {selectedIntent.questions.map((q) => (
                  <input
                    key={q.key}
                    type="text"
                    value={questionAnswers[q.key] || ''}
                    onChange={e => handleAnswerChange(q.key, e.target.value)}
                    placeholder={q.placeholder}
                    className="w-full rounded-2xl border border-zinc-300/90 dark:border-zinc-700/90 bg-zinc-50/60 focus:bg-white dark:bg-zinc-900/60 dark:focus:bg-zinc-900 px-4 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold outline-hidden focus:border-primary focus:ring-4 focus:ring-primary/10 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 transition-all shadow-2xs min-h-[46px]"
                  />
                ))}
              </div>
            ) : (
              /* FREE TEXT MODE */
              <div className="mb-6 sm:mb-8">
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={selectedIntent?.placeholder || (t['intent.workflow.text171'])}
                  rows={6}
                  className="w-full rounded-2xl border border-zinc-300/90 dark:border-zinc-700/90 bg-zinc-50/60 focus:bg-white dark:bg-zinc-900/60 dark:focus:bg-zinc-900 py-4 px-4 text-xs sm:text-sm font-semibold outline-hidden focus:border-primary focus:ring-4 focus:ring-primary/10 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 resize-none transition-all leading-relaxed shadow-2xs"
                ></textarea>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 p-3 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0"></span>
                <span>{error}</span>
              </div>
            )}
            
            <div className="pt-2 sm:pt-4">
              <button
                onClick={handleGenerate}
                disabled={!isInputValid() || loading}
                className="w-full sm:w-auto rounded-2xl bg-primary hover:bg-primary/90 py-3.5 sm:py-4 px-8 sm:px-10 text-xs sm:text-sm font-extrabold text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[46px]"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>{t['intent.workflow.text172']}</span>
              </button>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-500">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
              {t['intent.workflow.text173']}
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium max-w-sm text-center">
              {t['intent.workflow.text174']}
            </p>
          </div>
        )}

        {/* STEP 3: RESULT PREVIEW & HANDOFF */}
        {step === 3 && result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2.5 text-green-600 dark:text-green-400">
                <CheckCircle className="w-6 h-6 shrink-0" />
                <div>
                  <h3 className="text-lg font-black m-0 tracking-tight text-zinc-900 dark:text-white">{t['intent.workflow.text175']}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 m-0 mt-0.5 font-medium">{t['intent.workflow.text176']}</p>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3.5 py-2 rounded-xl transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? (t['intent.workflow.text177']) : (t['intent.workflow.text178'])}
              </button>
            </div>

            {/* CATALOG MATCH BANNER IF FOUND */}
            {result.catalogMatch && (
              <div className="mb-6 bg-amber-500/10 border border-amber-500/30 dark:border-amber-500/40 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500 text-white rounded-xl font-bold text-xs">كتالوج</div>
                  <div>
                    <h5 className="text-sm font-bold text-zinc-900 dark:text-white m-0">
                      {t['intent.workflow.text179']}
                    </h5>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 m-0 mt-0.5">
                      {result.catalogMatch.title} {result.catalogMatch.price ? `(${result.catalogMatch.price} ريال)` : ''}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* AD PREVIEW CARD */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 mb-6 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                  <Tag className="w-3.5 h-3.5" />
                  {selectedIntent?.label || (t['intent.workflow.text180'])}
                </span>
                {result.city && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {result.city} {result.district ? `- ${result.district}` : ''}
                  </span>
                )}
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-3 leading-snug">{result.title}</h4>
              
              {result.price && (
                <div className="text-lg font-black text-primary mb-4 flex items-baseline gap-1">
                  <span>{result.price}</span>
                  <span className="text-xs font-bold uppercase">{t['intent.workflow.text181']}</span>
                </div>
              )}

              <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800/80 my-4"></div>

              {/* INTERACTIVE ATTRIBUTES GRID (ABOVE DESCRIPTION) */}
              {result.attributes && (
                <div className="mb-6 pb-5 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="mb-4">
                    <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      {t['intent.workflow.text182']}
                    </span>
                    <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 m-0">
                      {t['intent.workflow.text183']}
                    </p>
                  </div>

                  <div className="space-y-3 mb-4">
                    {Object.entries(result.attributes).map(([key, val]) => (
                      <div key={key} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="text"
                          value={key}
                          onChange={(e) => handleAttributeChange(key, e.target.value, String(val))}
                          className="flex-1 min-w-0 w-full rounded-full border border-zinc-200 bg-white/80 py-3 px-4 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-700 dark:bg-zinc-950/80 dark:focus:border-zinc-650 dark:text-zinc-50"
                          placeholder={t['intent.workflow.text184']}
                        />
                        <input
                          type="text"
                          value={String(val)}
                          onChange={(e) => handleAttributeChange(key, key, e.target.value)}
                          className="flex-1 min-w-0 w-full rounded-full border border-zinc-200 bg-white/80 py-3 px-4 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-700 dark:bg-zinc-950/80 dark:focus:border-zinc-650 dark:text-zinc-50"
                          placeholder={t['intent.workflow.text185']}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteAttribute(key)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all shrink-0 flex items-center justify-center border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                          title={t['intent.workflow.text186']}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* ADD FIELD ROW */}
                  <div className="bg-zinc-100/50 dark:bg-zinc-900/30 p-3 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
                    <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-2">
                      {t['intent.workflow.text187']}
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        className="flex-1 min-w-0 flex-1 min-w-0 w-full rounded-full border border-zinc-200 bg-white/80 py-3 px-4 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-700 dark:bg-zinc-950/80 dark:focus:border-zinc-650 dark:text-zinc-50"
                        placeholder={t['intent.workflow.text188']}
                      />
                      <input
                        type="text"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="flex-1 min-w-0 flex-1 min-w-0 w-full rounded-full border border-zinc-200 bg-white/80 py-3 px-4 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary dark:border-zinc-700 dark:bg-zinc-950/80 dark:focus:border-zinc-650 dark:text-zinc-50"
                        placeholder={t['intent.workflow.text189']}
                      />
                      <button
                        type="button"
                        onClick={handleAddAttribute}
                        disabled={!newKey.trim() || !newValue.trim()}
                        className="rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-4 py-2 text-xs font-extrabold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t['intent.workflow.text190']}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">{t['intent.workflow.text191']}</div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed m-0">{result.description}</p>
            </div>

            {/* NEXT ACTION GUIDANCE BOX */}
            {result.nextActionGuidance && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <div className="p-1.5 bg-primary text-white rounded-lg shrink-0 mt-0.5">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-primary uppercase tracking-wider m-0 mb-1">{t['intent.workflow.text192']}</h5>
                  <p className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 m-0 leading-relaxed">
                    {result.nextActionGuidance}
                  </p>
                </div>
              </div>
            )}
            
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <button
                onClick={handleProceedToAd}
                className="flex-1 rounded-full bg-primary hover:bg-primary/90 py-3.5 sm:py-4 px-5 sm:px-6 text-xs sm:text-sm font-extrabold text-white shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 min-h-[46px]"
              >
                <span>{t['intent.workflow.text193']}</span>
                <ArrowLeft className="w-4 h-4 shrink-0" />
              </button>
              
              <button
                onClick={handleCopy}
                className="rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-3 sm:py-4 px-5 sm:px-6 text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center justify-center gap-2 shrink-0 active:scale-95 min-h-[44px]"
              >
                <Copy className="w-4 h-4 shrink-0" />
                <span>{t['intent.workflow.text194']}</span>
              </button>
            </div>
            
            <button 
              onClick={() => { setStep(1); setResult(null); }}
              className="mt-6 sm:mt-8 w-full text-center text-xs font-bold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors py-2"
            >
              {t['intent.workflow.text195']}
            </button>
          </div>
        )}

        {/* STEP 4: EXTERNAL AGENT */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => { setStep(1); setError(null); setExternalAgentOutput(''); }}
              className="flex items-center gap-1.5 text-xs font-extrabold text-zinc-500 hover:text-primary dark:hover:text-primary mb-4 sm:mb-6 transition-colors bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl w-fit active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" /> {t['intent.workflow.text196']}
            </button>
            
            <div className="mb-6 bg-zinc-50 dark:bg-zinc-900/40 p-5 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
              <div className="flex flex-col sm:flex-col items-start sm:items-center gap-4 mb-6 text-center">
                <div className="p-3 flex h-14 w-auto px-4">
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 scale-110 sm:scale-125">
                    <div className="relative bg-white dark:bg-zinc-900 rounded-full p-1 border-2 border-zinc-100 dark:border-zinc-800 shadow-sm">
                      <img src="https://thesvg.org/icons/gemini/default.svg" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" alt="Google Gemini" />
                    </div>
                    <div className="relative bg-white dark:bg-zinc-900 rounded-full p-1 border-2 border-zinc-100 dark:border-zinc-800 shadow-sm">
                      <img src="https://thesvg.org/icons/openai-chatgpt/default.svg" className="w-6 h-6 sm:w-7 sm:h-7 object-contain dark:invert" alt="ChatGPT" />
                    </div>
                    <div className="relative bg-white dark:bg-zinc-900 rounded-full p-1 border-2 border-zinc-100 dark:border-zinc-800 shadow-sm">
                      <img src="https://thesvg.org/icons/claude/default.svg" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" alt="Claude" />
                    </div>
                    <div className="relative bg-white dark:bg-zinc-900 rounded-full p-1 border-2 border-zinc-100 dark:border-zinc-800 shadow-sm">
                      <img src="https://thesvg.org/icons/kimi/default.svg" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" alt="Kimi" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 m-0">
                    {t['intent.workflow.text197']}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 m-0 mt-1">
                    {t['intent.workflow.text198']}
                  </p>
                </div>
              </div>

              <div className="relative mb-8 group">
                <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                  {t['intent.workflow.text199']}
                </label>
                {(() => {
                  const docUrl = `https://meamart.com/${lang}${getKnowledgeCenterUrl(selectedIntent?.id)}`;
                  let dynamicPrompt = String(t['intent.workflow.dynamicPrompt'] || '').replace('{docUrl}', docUrl);
                  
                  let myData = '';
                  if (inputMode === 'freetext') {
                    myData = inputText;
                  } else {
                    if (selectedIntent?.questions) {
                      myData = selectedIntent.questions.map(q => `- ${q.label}: ${questionAnswers[q.key] || ''}`).join('\n');
                    }
                  }
                  if (myData) {
                    dynamicPrompt += '\n\n' + (t['intent.workflow.text184'] || 'تفاصيل الإعلان:') + '\n' + myData;
                  }
                  
                  return (
                    <>
                      <textarea 
                        readOnly 
                        value={dynamicPrompt.replace(/\\n/g, '\n')}
                        className="w-full h-44 text-[13px] sm:text-sm font-mono leading-relaxed text-zinc-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-950/80 p-4 sm:p-5 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 resize-none outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          navigator.clipboard.writeText(dynamicPrompt);
                          const btn = e.currentTarget;
                          const originalHTML = btn.innerHTML;
                          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M20 6 9 17l-5-5"/></svg><span class="text-emerald-600 font-bold ml-1">${t['intent.workflow.text200']}</span>`;
                          setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
                        }}
                        className="absolute top-9 right-3 rtl:left-3 rtl:right-auto flex items-center px-3 py-1.5 bg-transparent hover:bg-white dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 opacity-40 hover:opacity-100 hover:shadow-sm font-bold text-xs"
                      >
                        <Copy className="w-4 h-4 ml-1.5" /> {t['intent.workflow.text201']}
                      </button>
                    </>
                  );
                })()}
              </div>

              <div className="border-t-2 border-dashed border-zinc-200 dark:border-zinc-700 pt-6 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-full mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                  {t['intent.workflow.text202'] || '2. Click the link provided by the assistant'}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t['intent.workflow.text203'] || 'The assistant will generate a direct link for you. Clicking it will automatically fill this form.'}
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
}
