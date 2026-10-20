'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  SendHorizontal,
  RotateCcw,
  Bot,
  User,
  ExternalLink,
} from 'lucide-react';
import {
  RoutePrompt,
  getRandomRoutePrompts,
  resolveLocalQuery,
} from '@/lib/ai/route-prompts';

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp?: string;
  source?: 'local_knowledge' | 'ai_fallback';
}

const INITIAL_GREETING: ChatMessage = {
  id: 'init-1',
  role: 'assistant',
  content: 'Hello there, how can I help you?',
};

export const AIAssistantWidget: React.FC = () => {
  const pathname = usePathname();

  // Route visibility guard: Strictly hide and unmount on /login, /account, and any sub-routes
  if (!pathname || pathname.startsWith('/account') || pathname.startsWith('/login')) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [inputQuery, setInputQuery] = useState('');
  const [promptChips, setPromptChips] = useState<RoutePrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Hydration-safe randomization for route-specific suggestion chips
  useEffect(() => {
    setPromptChips(getRandomRoutePrompts(pathname, 4));
  }, [pathname]);

  // Scroll to bottom when messages update or loading indicator appears
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when expanded
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Outside click & Escape key listener for smooth collapse
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Clean up any in-flight requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text || isLoading) return;

    // Reset input & clear existing errors
    setInputQuery('');
    setError(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Step 1: Local Knowledge Intercept
    const localAnswer = resolveLocalQuery(text);
    if (localAnswer) {
      setIsLoading(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-local-${Date.now()}`,
            role: 'assistant',
            content: localAnswer,
            source: 'local_knowledge',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsLoading(false);
      }, 350);
      return;
    }

    // Step 2: Fallback to AI API Endpoint (/api/ai/chat)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          currentRoute: pathname,
          pageContext: typeof document !== 'undefined' ? document.title : '',
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: data.id || `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.content || 'I am currently unable to process your request.',
          source: data.source || 'ai_fallback',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Request cancelled by user
        return;
      }
      console.error('AI Assistant fetch error:', err);
      setError('Unable to reach AI Assistant. Please check connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  return (
    <div className="font-sans">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* State 1: Collapsed Floating Action Button (FAB) */
          <motion.button
            key="fab"
            layoutId="ai-assistant-container"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.07, y: -2 }}
            whileTap={{ scale: 0.93 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
            style={{ transformOrigin: 'bottom right' }}
            aria-label="Open AI Command Assistant"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer bg-primary text-primary-foreground shadow-lg hover:shadow-xl ring-1 ring-border/20 select-none group"
          >
            <motion.div
              animate={{ rotate: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 transition-transform group-hover:rotate-12 duration-200" />
            </motion.div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gov-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gov-accent" />
            </span>
          </motion.button>
        ) : (
          /* State 2: Morphing Expanded Executive Card */
          <motion.div
            key="card"
            ref={cardRef}
            layoutId="ai-assistant-container"
            initial={{ opacity: 0, scale: 0.92, borderRadius: '9999px' }}
            animate={{ opacity: 1, scale: 1, borderRadius: '24px' }}
            exit={{
              opacity: 0,
              scale: 0.85,
              borderRadius: '9999px',
              transition: { duration: 0.12 },
            }}
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 28,
              mass: 0.8,
            }}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed z-50 w-[calc(100vw-2rem)] right-4 bottom-4 h-[78vh] max-h-[620px] rounded-2xl sm:right-6 sm:bottom-6 sm:w-[400px] sm:h-[580px] sm:max-h-[calc(100vh-3rem)] sm:rounded-3xl bg-background/95 dark:bg-card/95 backdrop-blur-xl border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* 1. Sticky Header (56px) */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.2 }}
              className="h-14 min-h-[56px] px-4 border-b border-border bg-background/80 flex items-center justify-between gap-3 select-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs ring-1 ring-gov-accent/30">
                  <Bot className="w-4 h-4 text-gov-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-foreground tracking-tight">
                      Maha Command AI
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    DGIPR State Intelligence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Assistant"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* 2. Scrollable Message Viewport */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: index === 0 ? 0.12 : 0,
                  }}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3.5 text-xs sm:text-sm leading-relaxed max-w-[85%] whitespace-pre-line shadow-2xs'
                        : 'bg-muted/70 text-foreground border border-border/50 rounded-2xl rounded-tl-sm p-3.5 text-xs sm:text-sm leading-relaxed max-w-[85%] whitespace-pre-line shadow-2xs'
                    }
                  >
                    {msg.content}
                  </div>

                  {msg.timestamp && (
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  )}

                  {/* Route prompt chips right beneath initial greeting */}
                  {index === 0 && messages.length === 1 && promptChips.length > 0 && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.05, delayChildren: 0.15 },
                        },
                      }}
                      className="mt-3.5 w-full space-y-1.5"
                    >
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Suggested for this view
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {promptChips.map((chip, chipIdx) => (
                          <motion.button
                            key={chipIdx}
                            variants={{
                              hidden: { opacity: 0, y: 8, scale: 0.95 },
                              visible: { opacity: 1, y: 0, scale: 1 },
                            }}
                            type="button"
                            onClick={() => handleSendMessage(chip.query)}
                            className="text-left text-xs px-3 py-1.5 rounded-full bg-secondary/60 hover:bg-primary hover:text-primary-foreground text-secondary-foreground border border-border/60 transition-colors cursor-pointer active:scale-95"
                          >
                            {chip.label}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {/* Animated 3-dot wave typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start"
                >
                  <div className="bg-muted/70 text-foreground border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-2xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gov-accent animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gov-accent animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gov-accent animate-bounce" />
                  </div>
                </motion.div>
              )}

              {/* Error State with Inline Retry */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded-xl bg-status-danger-bg text-status-danger border border-status-danger/20 text-xs flex items-center justify-between gap-2"
                >
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1 font-semibold underline hover:text-status-danger-dark"
                  >
                    <RotateCcw className="w-3 h-3" /> Retry
                  </button>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 3. Sticky Input Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-border bg-background/80 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about CPI, SLAs, districts..."
                disabled={isLoading}
                className="flex-1 bg-secondary/50 text-foreground text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-border/70 focus:outline-hidden focus:ring-1 focus:ring-gov-accent transition-all placeholder:text-muted-foreground disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                aria-label="Send Message"
                className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                <SendHorizontal className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default AIAssistantWidget;
