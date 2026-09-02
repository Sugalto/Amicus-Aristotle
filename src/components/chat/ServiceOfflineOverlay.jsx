import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, WifiOff } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useT } from '@/lib/i18n';

export default function ServiceOfflineOverlay({ status }) {
  const { lang } = useLanguage();
  const t = useT(lang);
  const tcCls = lang === 'zh-TW' ? 'font-tc' : '';

  const isIssues = status === 'offline_issues';
  const Icon = isIssues ? AlertTriangle : WifiOff;
  const message = isIssues ? t('chatOfflineIssues') : t('chatOfflineRetry');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm px-6">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lg p-8 text-center"
      >
        <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${
          isIssues ? 'bg-destructive/10 text-destructive' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <h2 className={`font-serif text-2xl text-foreground mb-2 ${tcCls}`}>
          {message}
        </h2>
        <p className={`text-sm text-muted-foreground ${tcCls}`}>
          {lang === 'zh-TW'
            ? '此服務目前由管理員暫停。'
            : lang === 'bilingual'
              ? 'This service is currently paused by the administrator.\n\n此服務目前由管理員暫停。'
              : 'This service is currently paused by the administrator.'}
        </p>
      </motion.div>
    </div>
  );
}