import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Droplets, Wind, Sun } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useT } from '@/lib/i18n';

export default function Misconceptions() {
  const { lang } = useLanguage();
  const t = useT(lang);
  const tcCls = lang === 'zh-TW' ? 'font-tc' : '';

  const items = [
    { code: 'M1', titleKey: 'm1Title', bodyKey: 'm1Body', Icon: Sprout, hue: 'bg-amber-50 text-amber-700 border-amber-200' },
    { code: 'M2', titleKey: 'm2Title', bodyKey: 'm2Body', Icon: Droplets, hue: 'bg-sky-50 text-sky-700 border-sky-200' },
    { code: 'M3', titleKey: 'm3Title', bodyKey: 'm3Body', Icon: Wind, hue: 'bg-teal-50 text-teal-700 border-teal-200' },
    { code: 'M4', titleKey: 'm4Title', bodyKey: 'm4Body', Icon: Sun, hue: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-16">
          <div className={`text-xs uppercase tracking-[0.22em] text-primary font-medium mb-6 ${tcCls}`}>
            — {t('misEyebrow')}
          </div>
          <h2 className={`font-serif text-4xl lg:text-5xl leading-tight text-foreground mb-6 text-balance ${tcCls}`}>
            {t('misTitle')}
          </h2>
          <p className={`text-lg text-muted-foreground leading-relaxed ${tcCls}`}>
            {t('misSub')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <motion.div
              key={it.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="bg-background border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border ${it.hue} mb-5`}>
                <it.Icon className="w-5 h-5" />
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                Cluster {it.code}
              </div>
              <h3 className={`font-serif text-xl text-foreground mb-2 leading-tight ${tcCls}`}>
                {t(it.titleKey)}
              </h3>
              <p className={`text-sm text-muted-foreground leading-relaxed ${tcCls}`}>
                {t(it.bodyKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}