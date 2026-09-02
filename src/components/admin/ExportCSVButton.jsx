import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

function escapeCSV(value) {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function buildCSV(conversations) {
  const headers = [
    'session_id',
    'student_name',
    'class_name',
    'language',
    'created_date',
    'updated_date',
    'message_count',
    'message_index',
    'role',
    'content',
    'timestamp',
  ];

  const rows = [headers.join(',')];

  conversations.forEach((c) => {
    const messages = c.messages || [];
    if (messages.length === 0) {
      rows.push([
        c.session_id, c.student_name, c.class_name, c.language,
        c.created_date, c.updated_date, c.message_count || 0,
        '', '', '', '',
      ].map(escapeCSV).join(','));
      return;
    }
    messages.forEach((m, i) => {
      rows.push([
        c.session_id, c.student_name, c.class_name, c.language,
        c.created_date, c.updated_date, c.message_count || messages.length,
        i + 1, m.role, m.content, m.timestamp,
      ].map(escapeCSV).join(','));
    });
  });

  return rows.join('\n');
}

export default function ExportCSVButton({ conversations }) {
  const handleExport = () => {
    if (!conversations?.length) return;
    const csv = buildCSV(conversations);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    a.href = url;
    a.download = `amicus-aristotle-dialogues-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={!conversations?.length}
      className="gap-1.5"
    >
      <Download className="w-3.5 h-3.5" />
      Export CSV
    </Button>
  );
}