import React from 'react';

interface Props {
  enabled: boolean;
  phone?: string;
}

export default function WhatsApp2FAStatusBadge({ enabled, phone }: Props) {
  if (enabled) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        مفعل عبر واتساب {phone ? `(${phone})` : ''}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-500/10 px-3 py-1 text-xs font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
      <span className="h-2 w-2 rounded-full bg-zinc-400" />
      غير مفعل
    </span>
  );
}
