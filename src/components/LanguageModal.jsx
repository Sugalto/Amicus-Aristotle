import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';

export default function LanguageModal() {
  const { hasChosen, setLang } = useLanguage();
  const [selected, setSelected] = React.useState('en');

  if (hasChosen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 22, stiffness: 240 }}
          className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
        >
          <div className="bg-primary text-primary-foreground px-8 py-6 flex items-center gap-3">
            <Globe className="w-5 h-5" />
            <span className="text-xs uppercase tracking-[0.2em] font-medium">Amicus Aristotle AI</span>
          </div>
          <div className="p-8">
            <h2 className="font-serif text-3xl text-foreground mb-2">
              Choose your language
            </h2>
            <p className="text-sm text-muted-foreground mb-1 font-tc">請選擇語言</p>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Select the language you'd like to use to converse with Aristotle.
            </p>

            <div className="space-y-2 mb-6">
              <LangOption
                code="en"
                label="English"
                sublabel="Default"
                selected={selected === 'en'}
                onClick={() => setSelected('en')}
              />
              <LangOption
                code="zh-TW"
                label="繁體中文"
                sublabel="Traditional Chinese"
                selected={selected === 'zh-TW'}
                onClick={() => setSelected('zh-TW')}
              />
              <LangOption
                code="bilingual"
                label="Bilingual · 雙語"
                sublabel="Reply in English, then 繁體中文 translation"
                selected={selected === 'bilingual'}
                onClick={() => setSelected('bilingual')}
              />
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl text-base"
              onClick={() => setLang(selected)}
            >
              {selected === 'en' ? 'Continue' : '繼續'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function LangOption({ label, sublabel, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all text-left ${
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/40'
      }`}
    >
      <div>
        <div className="font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{sublabel}</div>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
        selected ? 'border-primary bg-primary' : 'border-border'
      }`}>
        {selected && <Check className="w-3 h-3 text-primary-foreground" />}
      </div>
    </button>
  );
}