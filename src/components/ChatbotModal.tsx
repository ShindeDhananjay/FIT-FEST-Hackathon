'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Bot,
  PlusCircle,
  Sparkles,
  Minus,
  CheckCircle2,
  Trash2,
  Calendar,
  Gift,
  MapPin,
} from 'lucide-react';
import { getApiUrl } from '@/lib/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
  onOpenScanner: () => void;
  scannedContext?: any;
}

const QUICK_PROMPTS = [
  'How do I book a pickup?',
  'What rewards can I redeem?',
  'How do I dispose of e-waste?',
  'How do EcoPoints work?',
];

export const ChatbotModal: React.FC<ChatbotModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
  onOpenScanner,
  scannedContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! 👋 I am **EcoBot**, your EcoLoop assistant.\n\nAsk me about scheduling pickups, sorting your waste, or redeeming your **EcoPoints** for 100% recycled rewards.',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // If scannedContext is provided, automatically trigger a brief AI query
  useEffect(() => {
    if (scannedContext && isOpen) {
      const prompt = `I scanned "${scannedContext.itemName}" (${scannedContext.category}). How should I prepare it for doorstep pickup?`;
      handleSendMessage(prompt, scannedContext);
    }
  }, [scannedContext, isOpen]);

  const handleSendMessage = async (textToSend?: string, context?: any) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          scannedContext: context || scannedContext,
        }),
      });

      const data = await res.json();
      const reply = data.reply || "EcoLoop offers 100% free doorstep pickup across Pune. You can schedule a collection directly in the Request Pickup tab!";

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: 'You can book a free doorstep pickup anytime in Pune via the "Request Pickup" tab and earn EcoPoints! 🌱',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`w-[calc(100vw-2rem)] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-14' : 'h-[520px] max-h-[82vh]'
          }`}
        >
          {/* Header - Clean & Decent */}
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-emerald-700" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm leading-none">EcoBot</h3>
                  <span className="text-[10px] font-semibold bg-white/20 px-1.5 py-0.5 rounded text-white leading-none">
                    EcoLoop AI
                  </span>
                </div>
                <p className="text-[10px] text-emerald-100/90 mt-0.5 leading-none">Pune Smart Waste Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded-md text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message Stream */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/60 text-xs">
                {messages.map((m) => {
                  const isBot = m.role === 'assistant';
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-2 ${isBot ? 'items-start' : 'items-end justify-end'}`}
                    >
                      {isBot && (
                        <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="h-3.5 w-3.5" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                          isBot
                            ? 'bg-white border border-slate-200/80 text-slate-800 shadow-2xs'
                            : 'bg-emerald-600 text-white font-medium rounded-br-xs shadow-xs'
                        }`}
                      >
                        {m.content}
                        <span
                          className={`block text-[9px] mt-1 ${
                            isBot ? 'text-slate-400' : 'text-emerald-200 text-right'
                          }`}
                        >
                          {m.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="px-3 py-2 bg-white border border-slate-200 rounded-2xl rounded-bl-xs shadow-2xs flex items-center gap-2 text-slate-500">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-[11px] font-medium text-slate-600">EcoBot is typing…</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Suggestions */}
              <div className="px-3 py-2 bg-white border-t border-slate-100">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                  {QUICK_PROMPTS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleSendMessage(q)}
                      disabled={loading}
                      className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200/80 transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clean Action Shortcuts */}
              <div className="px-3 py-1.5 bg-emerald-50/50 border-t border-emerald-100/60 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBooking();
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:underline cursor-pointer"
                >
                  <PlusCircle className="h-3 w-3 text-emerald-600" />
                  <span>Book Pickup</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenScanner();
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:underline cursor-pointer"
                >
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  <span>AI Waste Scanner</span>
                </button>
              </div>

              {/* Input Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about pickups, points, rewards..."
                  disabled={loading}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-emerald-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  title="Send"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
