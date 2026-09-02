import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { useTheme } from '@/lib/ThemeContext';
import { useT } from '@/lib/i18n';
import { Globe, Sun, Moon } from 'lucide-react';

export default function Header() {
  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const t = useT(lang);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="font-serif text-primary-foreground text-lg leading-none">A</span>
          </div>
          <span className={`font-serif text-lg text-foreground hidden sm:inline ${lang === 'zh-TW' ? 'font-tc' : ''}`}>
            {t('appName')}
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`px-3 py-1.5 text-sm rounded-md transition ${
              isActive('/') ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
            } ${lang === 'zh-TW' ? 'font-tc' : ''}`}
          >
            {t('home')}
          </Link>
          <Link
            to="/info"
            className={`px-3 py-1.5 text-sm rounded-md transition ${
              isActive('/info') ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
            } ${lang === 'zh-TW' ? 'font-tc' : ''}`}
          >
            {t('info')}
          </Link>
          <Link
            to="/chat"
            className={`px-3 py-1.5 text-sm rounded-md transition ${
              isActive('/chat') ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
            } ${lang === 'zh-TW' ? 'font-tc' : ''}`}
          >
            {t('chat')}
          </Link>

          <button
            onClick={toggleTheme}
            className="ml-2 flex items-center justify-center w-8 h-8 rounded-md border border-border hover:border-primary/50 hover:bg-secondary/40 transition text-muted-foreground hover:text-foreground"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              const next = lang === 'en' ? 'zh-TW' : lang === 'zh-TW' ? 'bilingual' : 'en';
              setLang(next);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-border hover:border-primary/50 hover:bg-secondary/40 transition text-muted-foreground hover:text-foreground"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? '中' : lang === 'zh-TW' ? 'EN/中' : 'EN'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}