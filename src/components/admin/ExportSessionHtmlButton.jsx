import React from 'react';
import { FileDown } from 'lucide-react';
import { format } from 'date-fns';

function safeName(str) {
  return (str || '')
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '') || 'anon';
}

function escapeHTML(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Must match the format used in BulkExportZipButton.jsx
export function conversationToHTML(conv) {
  const started = conv.created_date ? format(new Date(conv.created_date), 'PPp') : '—';
  const lang = conv.language === 'zh-TW' ? '繁體中文' : conv.language === 'bilingual' ? 'EN / 繁中' : 'English';
  const student = conv.student_name || 'Anonymous';

  const messages = (conv.messages || []).map((m) => {
    const isUser = m.role === 'user';
    const who = isUser ? student : 'Aristotle';
    const ts = m.timestamp ? format(new Date(m.timestamp), 'PPp') : '';
    return `
      <div class="msg ${isUser ? 'user' : 'aristotle'}">
        <div class="who">${escapeHTML(who)}<span class="ts">${escapeHTML(ts)}</span></div>
        <div class="content">${escapeHTML(m.content)}</div>
      </div>`;
  }).join('');

  return `<!doctype html>
<html lang="${conv.language === 'zh-TW' ? 'zh-TW' : 'en'}">
<head>
  <meta charset="utf-8" />
  <title>Dialogue · ${escapeHTML(student)} · ${escapeHTML(conv.session_id || '')}</title>
  <style>
    @page { margin: 24mm; }
    body { font-family: Georgia, 'Cormorant Garamond', 'Noto Serif TC', 'Songti TC', 'PingFang TC', serif; color: #111; line-height: 1.6; max-width: 780px; margin: 40px auto; padding: 0 24px; }
    h1 { font-size: 22pt; margin: 0 0 4pt; }
    .meta { font-size: 10pt; color: #555; margin-bottom: 18pt; font-family: -apple-system, system-ui, sans-serif; }
    .meta div { margin: 2pt 0; }
    .session { font-family: ui-monospace, Menlo, monospace; font-size: 9pt; color: #777; }
    .msg { padding: 10pt 12pt; border-radius: 8pt; margin: 8pt 0; page-break-inside: avoid; }
    .msg.user { background: #f3f3ee; }
    .msg.aristotle { background: #f0f6f2; border: 1px solid #d8e6dd; }
    .who { font-weight: 600; font-size: 10pt; margin-bottom: 4pt; font-family: -apple-system, system-ui, sans-serif; }
    .ts { font-weight: 400; color: #888; margin-left: 8pt; font-size: 9pt; }
    .content { white-space: pre-wrap; font-size: 12pt; }
    .noprint { position: fixed; top: 12px; right: 12px; }
    .noprint button { font: 14px system-ui; padding: 8px 14px; cursor: pointer; }
    @media print { .noprint { display: none; } body { margin: 0; } }
  </style>
</head>
<body>
  <div class="noprint"><button onclick="window.print()">Print / Save as PDF</button></div>
  <h1>Dialogue with Aristotle</h1>
  <div class="meta">
    <div><strong>Student:</strong> ${escapeHTML(student)}</div>
    ${conv.class_name ? `<div><strong>Class:</strong> ${escapeHTML(conv.class_name)}</div>` : ''}
    <div><strong>Started:</strong> ${escapeHTML(started)}</div>
    <div><strong>Language:</strong> ${escapeHTML(lang)}</div>
    <div><strong>Messages:</strong> ${(conv.messages || []).length}</div>
    <div class="session">${escapeHTML(conv.session_id || '')}</div>
  </div>
  ${messages}
</body>
</html>`;
}

export default function ExportSessionHtmlButton({ conversation }) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (!conversation) return;
    const html = conversationToHTML(conversation);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const datePart = conversation.created_date
      ? format(new Date(conversation.created_date), 'yyyy-MM-dd_HHmm')
      : 'nodate';
    const namePart = safeName(conversation.student_name || 'anon');
    const idPart = (conversation.session_id || conversation.id || '').toString().slice(-6);
    const filename = `${datePart}__${namePart}__${idPart}.html`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Export HTML"
      className="flex-shrink-0 p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition"
    >
      <FileDown className="w-3.5 h-3.5" />
    </button>
  );
}