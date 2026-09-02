import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { useT } from '@/lib/i18n';

export default function ThinkingIndicator() {
  const { lang } = useLanguage();
  const t = useT(lang);
  const tcCls = lang === 'zh-TW' ? 'font-tc' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start gap-3"
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden border border-border bg-card">
        <img
          src="/assets/aristotle-avatar.svg"
          alt="Aristotle"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2.5">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
        </div>
        <span className={`text-xs text-muted-foreground italic ${tcCls}`}>{t('thinking')}</span>
      </div>
    </motion.div>
  );
}