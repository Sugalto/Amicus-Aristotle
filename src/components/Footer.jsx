import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useT } from '@/lib/i18n';

export default function Footer() {
  const { lang } = useLanguage();
  const t = useT(lang);

  return (
    <footer className="border-t border-border bg-card/50 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="font-serif text-primary-foreground text-lg leading-none">A</span>
              </div>
              <span className="font-serif text-xl text-foreground">{t('appName')}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              {t('footerTagline')}
            </p>
          </div>

          <div className={`text-sm md:text-right ${lang === 'zh-TW' ? 'font-tc' : ''}`}>
            <p className="font-medium text-foreground">{t('footerLab')}</p>
            <p className="text-muted-foreground mt-1">{t('footerUni')}</p>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} CSTEM Lab · HKU</span>
          <span className="font-mono tracking-wider">EDUCATIONAL RESEARCH</span>
        </div>
      </div>
    </footer>
  );
}