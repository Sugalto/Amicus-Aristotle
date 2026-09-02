import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollText, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useT } from '@/lib/i18n';

export default function StartSessionGate({ onStart }) {
  const { lang } = useLanguage();
  const t = useT(lang);
  const tcCls = lang === 'zh-TW' ? 'font-tc' : '';

  const [name, setName] = useState('');
  const [className, setClassName] = useState('');

  const canStart = name.trim().length > 0 && className.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canStart) return;
    onStart({ name: name.trim(), class_name: className.trim() });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12 bg-background">
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-card border border-border rounded-2xl shadow-sm p-8"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ScrollText className="w-5 h-5 text-primary" />
          </div>
          <h1 className={`font-serif text-2xl text-foreground mb-1 ${tcCls}`}>
            {t('sessionGateTitle')}
          </h1>
          <p className={`text-sm text-muted-foreground ${tcCls}`}>
            {t('sessionGateSubtitle')}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1.5 ${tcCls}`}>
              {t('sessionGateNameLabel')}
            </label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('sessionGateNamePlaceholder')}
              className={tcCls}
            />
            <p className={`text-[11px] text-muted-foreground mt-1.5 ${tcCls}`}>
              {t('sessionGateNameHint')}
            </p>
          </div>

          <div>
            <label className={`block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1.5 ${tcCls}`}>
              {t('sessionGateClassLabel')}
            </label>
            <Input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder={t('sessionGateClassPlaceholder')}
              className={tcCls}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={!canStart}
          className={`mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-xl group ${tcCls}`}
        >
          {t('sessionGateStart')}
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.form>
    </div>
  );
}