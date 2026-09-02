import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { useT } from '@/lib/i18n';

export default function About() {
  const { lang } = useLanguage();
  const t = useT(lang);
  const tcCls = lang === 'zh-TW' ? 'font-tc' : '';

  return (
    <section className="py-24 lg:py-32 bg-card border-y border-border">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className={`text-xs uppercase tracking-[0.22em] text-primary font-medium mb-6 ${tcCls}`}>
            — {t('aboutEyebrow')}
          </div>
          <h2 className={`font-serif text-4xl lg:text-5xl leading-tight text-foreground mb-8 text-balance ${tcCls}`}>
            {t('aboutTitle')}
          </h2>
          <p className={`text-lg lg:text-xl text-muted-foreground leading-relaxed text-pretty ${tcCls}`}>
            {t('aboutBody')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}