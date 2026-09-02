import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '@/lib/LanguageContext';

export default function MessageBubble({ message, index }) {
  const { lang } = useLanguage();
  const isUser = message.role === 'user';
  const tcCls = lang === 'zh-TW' ? 'font-tc' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.02, 0.1) }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-3`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden border border-border bg-card mt-1">
          <img
            src="/assets/aristotle-avatar.svg"
            alt="Aristotle"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'order-1' : ''}`}>
        <div
          className={`px-5 py-3.5 rounded-2xl ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-card border border-border text-foreground rounded-tl-sm'
          }`}
        >
          {isUser ? (
            <p className={`text-[15px] leading-relaxed whitespace-pre-wrap ${tcCls}`}>
              {message.content}
            </p>
          ) : (
            <div className={`text-[15px] leading-relaxed prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 ${tcCls}`}
                 style={{ fontFamily: lang === 'zh-TW' ? 'var(--font-tc)' : 'var(--font-serif)', fontSize: '17px' }}
            >
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="my-1.5">{children}</p>,
                  em: ({ children }) => <em className="italic text-foreground/85">{children}</em>,
                  hr: () => <hr className="my-3 border-t border-border/70" />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center mt-1">
          <span className="text-foreground/70 text-sm">You</span>
        </div>
      )}
    </motion.div>
  );
}