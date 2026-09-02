import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { useLanguage } from '@/lib/LanguageContext';

// Keyword heuristics per cluster. If any student turn OR the assistant's reply contains
// engagement with a cluster's core idea, we consider that cluster "reached".
// A student "moved past" cluster N when their transcript shows engagement with cluster N+1
// (or, for M4, when they've engaged with M4 itself — the final cluster).
const CLUSTER_KEYWORDS = {
  M1: ['soil', 'humus', 'dirt', 'manure', 'fertilizer', 'roots', 'ground', '土壤', '泥土', '肥料', '腐殖'],
  M2: ['water', 'sap', 'moist', 'drink', 'rain', 'willow', 'van helmont', '水', '樹汁', '汁液'],
  M3: ['air', 'gas', 'breath', 'atmosphere', 'carbon dioxide', 'co2', 'oxygen', 'invisible', '空氣', '氣體', '二氧化碳'],
  M4: ['light', 'sun', 'sunlight', 'energy', 'photosynthesis', 'ray', 'chlorophyll', '光', '陽光', '能量', '光合'],
};

function furthestClusterReached(messages) {
  const text = (messages || [])
    .map(m => (m?.content || '').toLowerCase())
    .join(' \n ');
  if (!text.trim()) return 0;

  let furthest = 0;
  ['M1', 'M2', 'M3', 'M4'].forEach((key, idx) => {
    if (CLUSTER_KEYWORDS[key].some(k => text.includes(k))) {
      furthest = Math.max(furthest, idx + 1);
    }
  });
  return furthest; // 0 = no cluster engaged, 1..4 = furthest cluster reached
}

export default function MisconceptionProgressChart({ conversations }) {
  const { lang } = useLanguage();
  const isZh = lang === 'zh-TW';

  const { data, totals } = useMemo(() => {
    // Group conversations by date (yyyy-MM-dd) and count how many moved past each cluster.
    // "Moved past M1" = furthest >= 2, "past M2" = >= 3, "past M3" = >= 4, "past M4" = also >= 4 (final).
    const byDate = new Map();
    const runningTotals = { pastM1: 0, pastM2: 0, pastM3: 0, reachedM4: 0 };

    const sorted = [...(conversations || [])].sort((a, b) => {
      const da = a.created_date ? new Date(a.created_date).getTime() : 0;
      const db = b.created_date ? new Date(b.created_date).getTime() : 0;
      return da - db;
    });

    sorted.forEach(c => {
      if (!c.created_date) return;
      const furthest = furthestClusterReached(c.messages);
      const dateKey = format(parseISO(c.created_date), 'yyyy-MM-dd');
      if (furthest >= 2) runningTotals.pastM1 += 1;
      if (furthest >= 3) runningTotals.pastM2 += 1;
      if (furthest >= 4) runningTotals.pastM3 += 1;
      if (furthest >= 4) runningTotals.reachedM4 += 1;

      byDate.set(dateKey, { ...runningTotals });
    });

    const series = Array.from(byDate.entries()).map(([date, counts]) => ({
      date,
      label: format(parseISO(date), 'MMM d'),
      ...counts,
    }));

    return { data: series, totals: runningTotals };
  }, [conversations]);

  const labels = isZh
    ? { pastM1: '越過 M1 (土壤)', pastM2: '越過 M2 (水)', pastM3: '越過 M3 (空氣)', reachedM4: '達到 M4 (光/能量)' }
    : { pastM1: 'Past M1 (Soil)', pastM2: 'Past M2 (Water)', pastM3: 'Past M3 (Air)', reachedM4: 'Reached M4 (Light)' };

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-8">
      <div className="mb-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-xl text-foreground">
            {isZh ? '誤解進展圖' : 'Misconception Progression'}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isZh
              ? '按日期累計:有多少學生已越過每個誤解叢集 (根據對話關鍵字推斷)'
              : 'Cumulative students who moved past each cluster over time (inferred from transcript keywords)'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <Pill label={labels.pastM1} value={totals.pastM1} />
          <Pill label={labels.pastM2} value={totals.pastM2} />
          <Pill label={labels.pastM3} value={totals.pastM3} />
          <Pill label={labels.reachedM4} value={totals.reachedM4} />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
          {isZh ? '尚無足夠資料顯示圖表' : 'Not enough data yet to plot progression'}
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="pastM1" name={labels.pastM1} stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pastM2" name={labels.pastM2} stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pastM3" name={labels.pastM3} stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="reachedM4" name={labels.reachedM4} stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function Pill({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </span>
  );
}