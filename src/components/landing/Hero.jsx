import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ScrollText } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useT } from '@/lib/i18n';

const HERO_IMG = "/assets/hero-placeholder.svg";

export default function Hero() {
  const { lang } = useLanguage();
  const t = useT(lang);
  const tcCls = lang === 'zh-TW' ? 'font-tc' : '';

  return (
    <section className="relative overflow-hidden grain">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 lg:pt-24 pb-20 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-[0.18em] font-medium mb-8 ${tcCls}`}>
              <ScrollText className="w-3.5 h-3.5" />
              {t('heroEyebrow')}
            </div>

            <h1 className={`font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-foreground text-balance mb-6 ${tcCls}`}>
              {t('heroTitle')}
            </h1>

            <p className={`text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-10 text-pretty ${tcCls}`}>
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/chat">
                <Button
                  size="lg"
                  className={`bg-primary hover:bg-primary/90 text-primary-foreground h-13 px-8 rounded-full text-base group ${tcCls}`}
                >
                  {t('heroCtaPrimary')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#how">
                <Button
                  size="lg"
                  variant="ghost"
                  className={`h-13 px-8 rounded-full text-base text-foreground hover:bg-secondary ${tcCls}`}
                >
                  {t('heroCtaSecondary')}
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[3/4] max-w-md mx-auto">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl" />
              <div className="relative h-full w-full rounded-3xl overflow-hidden border-2 border-primary/15 shadow-2xl bg-card">
                <img
                  src={HERO_IMG}
                  alt="Aristotle"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-0.5">Persona</div>
                <div className="font-serif text-foreground">Aristotle of Stagira</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}