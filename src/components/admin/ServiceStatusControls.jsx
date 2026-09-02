import React, { useEffect, useState } from 'react';
import { api } from '@/api/apiClient';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, WifiOff, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useT } from '@/lib/i18n';

const STATUS_META = {
  online: { tone: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle2, labelKey: 'serviceStatusOnline' },
  offline_retry: { tone: 'text-amber-600 dark:text-amber-400', icon: WifiOff, labelKey: 'serviceStatusOfflineRetry' },
  offline_issues: { tone: 'text-destructive', icon: AlertTriangle, labelKey: 'serviceStatusOfflineIssues' },
};

export default function ServiceStatusControls({ password }) {
  const { lang } = useLanguage();
  const t = useT(lang);

  const [status, setStatus] = useState('online');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.functions.invoke('getServiceStatus', {});
        setStatus(res?.data?.status || 'online');
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateStatus = async (next) => {
    setUpdating(next);
    setError('');
    try {
      const res = await api.functions.invoke('setServiceStatus', { password, status: next });
      setStatus(res?.data?.status || next);
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to update');
    } finally {
      setUpdating('');
    }
  };

  const meta = STATUS_META[status] || STATUS_META.online;
  const Icon = meta.icon;

  return (
    <div className="border border-border rounded-xl bg-card p-5 mb-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {t('serviceStatusLabel')}
          </div>
          <div className={`flex items-center gap-1.5 text-sm font-medium ${meta.tone}`}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Icon className="w-4 h-4" />
            )}
            <span>{loading ? '…' : t(meta.labelKey)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={status === 'online' ? 'default' : 'outline'}
            size="sm"
            disabled={!!updating || loading}
            onClick={() => updateStatus('online')}
            className="gap-1.5"
          >
            {updating === 'online' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            {t('setOnline')}
          </Button>
          <Button
            variant={status === 'offline_retry' ? 'default' : 'outline'}
            size="sm"
            disabled={!!updating || loading}
            onClick={() => updateStatus('offline_retry')}
            className="gap-1.5"
          >
            {updating === 'offline_retry' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <WifiOff className="w-3.5 h-3.5" />}
            {t('setOfflineRetry')}
          </Button>
          <Button
            variant={status === 'offline_issues' ? 'destructive' : 'outline'}
            size="sm"
            disabled={!!updating || loading}
            onClick={() => updateStatus('offline_issues')}
            className="gap-1.5"
          >
            {updating === 'offline_issues' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            {t('setOfflineIssues')}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-3 text-xs text-destructive">{error}</div>
      )}
    </div>
  );
}