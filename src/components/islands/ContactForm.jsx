import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2, Send } from 'lucide-react';

export default function ContactForm({ labels = {} }) {
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = labels.nameRequired;
    if (!formData.email.trim()) {
      newErrors.email = labels.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = labels.emailInvalid;
    }
    if (!formData.message.trim()) newErrors.message = labels.messageRequired;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('success');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: undefined }));
  };

  const inputBase = 'w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-zinc-900 dark:text-zinc-50 text-sm';
  const inputOk   = 'border-zinc-200 dark:border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary';
  const inputErr  = 'border-red-400 dark:border-red-600 focus:border-red-500 focus:ring-1 focus:ring-red-500';

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-emerald-500/15 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{labels.successTitle}</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{labels.successDesc}</p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-6 text-sm font-semibold text-primary hover:underline"
          >
            {labels.sendAnother}
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-bold mb-2 text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
              {labels.name} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
              placeholder={labels.namePlaceholder}
            />
            {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold mb-2 text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
              {labels.email} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
              placeholder={labels.emailPlaceholder}
            />
            {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-xs font-bold mb-2 text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
              {labels.message} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={`${inputBase} ${errors.message ? inputErr : inputOk} resize-none`}
              placeholder={labels.messagePlaceholder}
            />
            {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-3.5 bg-primary text-white font-bold rounded-full hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-primary/20 text-sm"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {labels.submitting}
              </>
            ) : (
              <>
                {labels.submit}
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
