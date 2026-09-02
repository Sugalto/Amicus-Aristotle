import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useT } from '@/lib/i18n';

export default function CTA() {
  const { lang } = useLanguage();
  const t = useT(lang);
  const tcCls = lang === 'zh-TW' ? 'font-tc' : '';

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <h2 className={`font-serif text-4xl lg:text-6xl leading-[1.05] text-foreground mb-8 text-balance ${tcCls}`}>
          {lang === 'zh-TW' ? '花園裡,他正等候。' : 'He waits for you in the garden.'}
        </h2>
        <Link to="/chat">
          <Button
            size="lg"
            className={`bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-10 rounded-full text-base group ${tcCls}`}
          >
            {t('heroCtaPrimary')}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  );
}