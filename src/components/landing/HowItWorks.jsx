import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { useT } from '@/lib/i18n';

export default function HowItWorks() {
  const { lang } = useLanguage();
  const t = useT(lang);
  const tcCls = lang === 'zh-TW' ? 'font-tc' : '';

  const steps = [
    { n: '01', titleKey: 'step1Title', bodyKey: 'step1Body' },
    { n: '02', titleKey: 'step2Title', bodyKey: 'step2Body' },
    { n: '03', titleKey: 'step3Title', bodyKey: 'step3Body' },
    { n: '04', titleKey: 'step4Title', bodyKey: 'step4Body' },
  ];

  return (
    <section id="how" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-16">
          <div className={`text-xs uppercase tracking-[0.22em] text-primary font-medium mb-6 ${tcCls}`}>
            — {t('howEyebrow')}
          </div>
          <h2 className={`font-serif text-4xl lg:text-5xl leading-tight text-foreground text-balance ${tcCls}`}>
            {t('howTitle')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="relative pl-12 md:pl-16"
            >
              <span className="absolute left-0 top-0 font-serif text-3xl text-primary/40">
                {step.n}
              </span>
              <h3 className={`font-serif text-2xl text-foreground mb-3 ${tcCls}`}>
                {t(step.titleKey)}
              </h3>
              <p className={`text-muted-foreground leading-relaxed ${tcCls}`}>
                {t(step.bodyKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}