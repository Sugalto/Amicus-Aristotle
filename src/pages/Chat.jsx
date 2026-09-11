import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/api/apiClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, RotateCcw, ArrowLeft, Volume2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useT } from '@/lib/i18n';
import MessageBubble from '@/components/chat/MessageBubble';
import ThinkingIndicator from '@/components/chat/ThinkingIndicator';
import StartSessionGate from '@/components/chat/StartSessionGate';
import ServiceOfflineOverlay from '@/components/chat/ServiceOfflineOverlay';

const SESSION_KEY = 'amicus_session_id';
const SESSION_NAME_KEY = 'amicus_session_name';
const SESSION_CLASS_KEY = 'amicus_session_class';

function generateSessionId() {
  return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
}

export default function Chat() {
  const { lang } = useLanguage();
  const t = useT(lang);
  const tcCls = lang === 'zh-TW' ? 'font-tc' : '';

  const [sessionId, setSessionId] = useState('');
  const [studentName, setStudentName] = useState(() => sessionStorage.getItem(SESSION_NAME_KEY) || '');
  const [className, setClassName] = useState(() => sessionStorage.getItem(SESSION_CLASS_KEY) || '');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [conversationDocId, setConversationDocId] = useState(null);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  const [serviceStatus, setServiceStatus] = useState('online');
  const isOffline = serviceStatus === 'offline_retry' || serviceStatus === 'offline_issues';

  // Poll service status (every 20s)
  useEffect(() => {
    let cancelled = false;
    const fetchStatus = async () => {
      try {
        const res = await api.functions.invoke('getServiceStatus', {});
        if (!cancelled) setServiceStatus(res?.data?.status || 'online');
      } catch (e) {
        // Fail open — don't block the chat on a transient network error
      }
    };
    fetchStatus();
    const id = setInterval(fetchStatus, 20000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const hasIdentity = studentName.trim().length > 0 && className.trim().length > 0;

  // Initialize session + greeting (only after identity is provided)
  useEffect(() => {
    if (!hasIdentity) return;
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = generateSessionId();
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    setSessionId(sid);
    setMessages([{
      role: 'assistant',
      content: lang === 'bilingual' ? t('bilingualGreeting') : t('aristotleGreeting'),
      timestamp: new Date().toISOString(),
    }]);
  }, [hasIdentity]); // eslint-disable-line

  const handleStartSession = ({ name, class_name }) => {
    sessionStorage.setItem(SESSION_NAME_KEY, name);
    sessionStorage.setItem(SESSION_CLASS_KEY, class_name);
    setStudentName(name);
    setClassName(class_name);
  };

  // Update greeting when language changes (only if conversation hasn't started)
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{ ...prev[0], content: lang === 'bilingual' ? t('bilingualGreeting') : t('aristotleGreeting') }];
      }
      return prev;
    });
  }, [lang]); // eslint-disable-line

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  // Persist conversation via backend (uses service role so anonymous students can save)
  const saveConversation = useCallback(async (msgs) => {
    if (!sessionId) return;
    try {
      const res = await api.functions.invoke('saveConversation', {
        conversationId: conversationDocId,
        session_id: sessionId,
        language: lang,
        messages: msgs,
        student_name: studentName,
        class_name: className,
      });
      const newId = res?.data?.id;
      if (newId && !conversationDocId) setConversationDocId(newId);
    } catch (e) {
      console.error('save conversation failed', e);
    }
  }, [sessionId, lang, conversationDocId]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isThinking || isOffline) return;

    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsThinking(true);

    try {
      const response = await api.functions.invoke('aristotleChat', {
        messages: newMessages.map(({ role, content }) => ({ role, content })),
        language: lang,
      });

      const reply = response?.data?.reply || (lang === 'zh-TW' ? '...請容我再想一想。' : lang === 'bilingual' ? '...Let me think on that further.\n\n---\n\n...請容我再想一想。' : '...Let me think on that further.');
      const assistantMsg = { role: 'assistant', content: reply, timestamp: new Date().toISOString() };
      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);
      saveConversation(finalMessages);
    } catch (e) {
      console.error(e);
      const errorMsg = {
        role: 'assistant',
        content: lang === 'zh-TW'
          ? '抱歉,我一時失神。請再說一次。'
          : lang === 'bilingual'
            ? 'Forgive me — my thoughts wandered. Please try again.\n\n---\n\n抱歉,我一時失神。請再說一次。'
            : 'Forgive me — my thoughts wandered. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages([...newMessages, errorMsg]);
    } finally {
      setIsThinking(false);
      textareaRef.current?.focus();
    }
  };

  const speakText = (text) => {
      if (!('speechSynthesis' in window)) {
        alert('Your browser does not support text-to-speech.');
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      if (lang === 'zh-TW' || lang === 'bilingual') {
        utterance.lang = 'zh-TW';

        const chineseVoice =
          voices.find(v => v.name === 'Microsoft HanHan Online - Chinese (Taiwan)') ||
          voices.find(v => v.lang === 'zh-TW') ||
          voices.find(v => v.lang === 'zh-HK') ||
          voices.find(v => v.lang === 'zh-CN');

        if (chineseVoice) {
          utterance.voice = chineseVoice;
        }
      } else {
        utterance.lang = 'en-US';

        const englishVoice =
          voices.find(v => v.name.includes('Aria')) ||
          voices.find(v => v.lang === 'en-US');

        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }

      utterance.rate = 1;
      utterance.pitch = 1;

      window.speechSynthesis.speak(utterance);
    };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewConversation = () => {
    const newSid = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, newSid);
    sessionStorage.removeItem(SESSION_NAME_KEY);
    sessionStorage.removeItem(SESSION_CLASS_KEY);
    setSessionId(newSid);
    setConversationDocId(null);
    setStudentName('');
    setClassName('');
    setMessages([]);
  };

  if (!hasIdentity) {
    return (
      <>
        <StartSessionGate onStart={handleStartSession} />
        {isOffline && <ServiceOfflineOverlay status={serviceStatus} />}
      </>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Chat header */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-border bg-card">
              <img
                src="/assets/aristotle-avatar.svg"
                alt="Aristotle"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className={`font-serif text-lg text-foreground leading-tight ${tcCls}`}>
                {t('chatHeader')}
              </div>
              <div className={`text-xs text-muted-foreground ${tcCls}`}>{t('chatSubtitle')}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className={`gap-1.5 ${tcCls}`}>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('backHome')}</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewConversation}
              className={`gap-1.5 ${tcCls}`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('newConversation')}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
          {messages.map((m, i) => (
              <div key={i}>
                <MessageBubble message={m} index={i} />

                {m.role === 'assistant' && (
                  <div className="mt-1 ml-12">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => speakText(m.content)}
                      className="h-7 px-2 text-muted-foreground"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5 mr-1" />
                      {lang === 'zh-TW' ? '朗讀' : 'Read aloud'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          {isThinking && <ThinkingIndicator />}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card/50 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-end gap-2 bg-background border border-border rounded-2xl p-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15 transition">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chatPlaceholder')}
              rows={1}
              disabled={isThinking || isOffline}
              className={`flex-1 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[40px] max-h-40 px-3 py-2 ${tcCls}`}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isThinking || isOffline}
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-10 w-10 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className={`text-[11px] text-muted-foreground mt-2 px-1 ${tcCls}`}>
            {lang === 'zh-TW' ? '按 Enter 送出 · Shift+Enter 換行' : 'Press Enter to send · Shift+Enter for new line'}
          </p>
        </div>
      </div>

      {isOffline && <ServiceOfflineOverlay status={serviceStatus} />}
    </div>
  );
}