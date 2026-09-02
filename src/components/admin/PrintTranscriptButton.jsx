import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { format } from 'date-fns';

function escapeHTML(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildHTML(conversation) {
  const started = conversation.created_date
    ? format(new Date(conversation.created_date), 'PPp')
    : '—';
  const lang = conversation.language === 'zh-TW' ? '繁體中文' : 'English';
  const student = conversation.student_name || 'Anonymous';

  const messages = (conversation.messages || []).map((m) => {
    const isUser = m.role === 'user';
    const who = isUser ? student : 'Aristotle';
    const ts = m.timestamp ? format(new Date(m.timestamp), 'PPp') : '';
    return `
      <div class="msg ${isUser ? 'user' : 'aristotle'}">
        <div class="who">${escapeHTML(who)}<span class="ts">${escapeHTML(ts)}</span></div>
        <div class="content">${escapeHTML(m.content)}</div>
      </div>
    `;
  }).join('');

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Dialogue · ${escapeHTML(student)} · ${escapeHTML(conversation.session_id)}</title>
  <style>
    @page { margin: 24mm; }
    body { font-family: Georgia, 'Cormorant Garamond', serif; color: #111; line-height: 1.5; }
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
    @media print { .noprint { display: none; } }
    .noprint { position: fixed; top: 12px; right: 12px; }
    .noprint button { font: 14px system-ui; padding: 8px 14px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="noprint"><button onclick="window.print()">Print / Save as PDF</button></div>
  <h1>Dialogue with Aristotle</h1>
  <div class="meta">
    <div><strong>Student:</strong> ${escapeHTML(student)}</div>
    <div><strong>Started:</strong> ${escapeHTML(started)}</div>
    <div><strong>Language:</strong> ${escapeHTML(lang)}</div>
    <div><strong>Messages:</strong> ${(conversation.messages || []).length}</div>
    <div class="session">${escapeHTML(conversation.session_id)}</div>
  </div>
  ${messages}
  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 350));</script>
</body>
</html>`;
}

export default function PrintTranscriptButton({ conversation }) {
  const handlePrint = () => {
    if (!conversation) return;
    const html = buildHTML(conversation);
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrint}
      className="gap-1.5"
    >
      <Printer className="w-3.5 h-3.5" />
      Print PDF
    </Button>
  );
}