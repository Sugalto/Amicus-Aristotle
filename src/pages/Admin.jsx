import React, { useState, useEffect, useMemo } from 'react';
import { api } from '@/api/apiClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Search, MessageSquare, User, Calendar, Loader2, Lock, LogOut } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useT } from '@/lib/i18n';
import { useAuth } from '@/lib/AuthContext';
import AdminPasswordGate from '@/components/admin/AdminPasswordGate';
import ExportCSVButton from '@/components/admin/ExportCSVButton';
import BulkExportZipButton from '@/components/admin/BulkExportZipButton';
import ExportSessionHtmlButton from '@/components/admin/ExportSessionHtmlButton';
import PrintTranscriptButton from '@/components/admin/PrintTranscriptButton';
import ServiceStatusControls from '@/components/admin/ServiceStatusControls';
import MisconceptionProgressChart from '@/components/admin/MisconceptionProgressChart';

const PW_KEY = 'amicus_admin_pw';

export default function Admin() {
  const { lang } = useLanguage();
  const t = useT(lang);
  const { user, isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();

  const [password, setPassword] = useState(() => sessionStorage.getItem(PW_KEY) || '');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');

  // Load conversations whenever we have a password
  useEffect(() => {
    if (!password) return;
    (async () => {
      setLoading(true);
      setLoadError('');
      try {
        const res = await api.functions.invoke('listConversations', { password });
        setConversations(res?.data?.conversations || []);
      } catch (e) {
        // Password rejected by backend — clear and force re-entry
        const msg = e?.response?.data?.error || e?.message || 'Failed to load';
        setLoadError(msg);
        if (e?.response?.status === 401) {
          sessionStorage.removeItem(PW_KEY);
          setPassword('');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [password]);

  const handleUnlock = (pw) => {
    sessionStorage.setItem(PW_KEY, pw);
    setPassword(pw);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(PW_KEY);
    setPassword('');
    setConversations([]);
    setSelectedId(null);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter(c =>
      (c.session_id || '').toLowerCase().includes(q) ||
      (c.student_name || '').toLowerCase().includes(q) ||
      (c.messages || []).some(m => (m.content || '').toLowerCase().includes(q))
    );
  }, [conversations, search]);

  const selected = conversations.find(c => c.id === selectedId);

  const stats = useMemo(() => {
    const totalMsg = conversations.reduce((s, c) => s + (c.message_count || c.messages?.length || 0), 0);
    return {
      total: conversations.length,
      messages: totalMsg,
      avg: conversations.length ? (totalMsg / conversations.length).toFixed(1) : 0,
    };
  }, [conversations]);

  // Gate 1: must be a signed-in admin user
  if (isLoadingAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <h1 className="font-serif text-2xl text-foreground mb-2">Admin sign-in required</h1>
        <p className="text-sm text-muted-foreground mb-6">
          You must be signed in as an administrator to view this page.
        </p>
        <Button onClick={navigateToLogin}>Sign in</Button>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Lock className="w-5 h-5 text-destructive" />
        </div>
        <h1 className="font-serif text-2xl text-foreground mb-2">Access restricted</h1>
        <p className="text-sm text-muted-foreground">
          This page is only available to administrators.
        </p>
      </div>
    );
  }

  // Gate 2: dashboard password (existing)
  if (!password) {
    return <AdminPasswordGate onUnlock={handleUnlock} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-foreground mb-2">{t('adminTitle')}</h1>
          <p className="text-muted-foreground text-sm">{t('adminSubtitle')}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ExportCSVButton conversations={conversations} />
          <BulkExportZipButton conversations={conversations} />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5">
            <LogOut className="w-3.5 h-3.5" />
            Lock
          </Button>
        </div>
      </div>

      <ServiceStatusControls password={password} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        <StatCard label={t('totalConversations')} value={stats.total} />
        <StatCard label={t('totalMessages')} value={stats.messages} />
        <StatCard label={t('avgLength')} value={stats.avg} />
      </div>

      {/* Misconception progression chart */}
      <MisconceptionProgressChart conversations={conversations} />

      {loadError && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">{loadError}</div>
      )}

      <div className="grid lg:grid-cols-12 gap-6">
        {/* List */}
        <div className="lg:col-span-5">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="border border-border rounded-xl overflow-hidden bg-card divide-y divide-border max-h-[70vh] overflow-y-auto">
            {loading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">{t('noConversations')}</div>
            ) : (
              filtered.map(c => (
                <div
                  key={c.id}
                  className={`relative w-full hover:bg-secondary/50 transition ${
                    selectedId === c.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                  }`}
                >
                  <button
                    onClick={() => setSelectedId(c.id)}
                    className="w-full text-left px-4 py-3 pr-10"
                  >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground truncate">
                        {c.student_name || t('anonymous')}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex-shrink-0">
                      {c.language === 'zh-TW' ? '繁中' : c.language === 'bilingual' ? 'EN/中' : 'EN'}
                    </span>
                  </div>
                  {c.class_name && (
                    <div className="text-[11px] text-muted-foreground mb-0.5">
                      {t('classLabel')}: <span className="text-foreground/80">{c.class_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {c.message_count || c.messages?.length || 0} {t('messages')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {c.created_date ? format(new Date(c.created_date), 'MMM d, HH:mm') : '—'}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground/70 mt-1 truncate">
                    {c.session_id}
                  </div>
                  </button>
                  <div className="absolute top-2 right-2">
                    <ExportSessionHtmlButton conversation={c} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Transcript */}
        <div className="lg:col-span-7">
          <div className="border border-border rounded-xl bg-card min-h-[70vh]">
            {!selected ? (
              <div className="h-full min-h-[70vh] flex items-center justify-center text-sm text-muted-foreground p-8 text-center">
                {t('selectConversation')}
              </div>
            ) : (
              <div className="p-6">
                <div className="border-b border-border pb-4 mb-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-serif text-xl text-foreground">
                      {selected.student_name || t('anonymous')}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-mono truncate">
                      {selected.session_id}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t('started')}: {selected.created_date ? format(new Date(selected.created_date), 'PPp') : '—'}
                      {' · '}
                      {selected.language === 'zh-TW' ? '繁體中文' : selected.language === 'bilingual' ? 'EN / 繁中' : 'English'}
                    </div>
                    {selected.class_name && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {t('classLabel')}: <span className="text-foreground/80">{selected.class_name}</span>
                      </div>
                    )}
                  </div>
                  <PrintTranscriptButton conversation={selected} />
                </div>

                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2">
                  {(selected.messages || []).map((m, i) => (
                    <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                        m.role === 'user'
                          ? 'bg-secondary text-foreground'
                          : 'bg-primary text-primary-foreground font-serif'
                      }`}>
                        {m.role === 'user' ? 'S' : 'A'}
                      </div>
                      <div className={`max-w-[85%] px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-secondary text-foreground rounded-tr-sm'
                          : 'bg-primary/5 text-foreground rounded-tl-sm border border-primary/10'
                      }`}>
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-card border border-border rounded-xl px-5 py-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1">{label}</div>
      <div className="font-serif text-3xl text-foreground">{value}</div>
    </div>
  );
}