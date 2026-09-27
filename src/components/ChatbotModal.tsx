'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Recycle,
  Leaf,
  PlusCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Minus,
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
  'What waste items can I recycle?',
  'How do I dispose of old phone batteries?',
  'Is doorstep collection free in Pune?',
  'How do I earn EcoPoints?',
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
        'Namaste! 🙏 I am **EcoBot**, your 24/7 AI recycling assistant powered by Google Gemini.\n\nI can help you segregate kitchen, plastic, or electronic waste, explain Pune Municipal pickup timings, or calculate your EcoPoints. How can I help you today? 🌱',
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

  // If scannedContext is provided, automatically trigger an AI query
  useEffect(() => {
    if (scannedContext && isOpen) {
      const prompt = `I just scanned an item: "${scannedContext.itemName}" (${scannedContext.category}). Can you give me specific tips on how to prepare and segregate it for pickup?`;
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
      const reply = data.reply || "I'm having trouble connecting right now, but feel free to ask about waste pickup or segregation!";

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: 'Doorstep waste collection in Pune is 100% free! You can schedule a pickup right away via the "Book Pickup" tab. 🌱',
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
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`w-[calc(100vw-2rem)] sm:w-[420px] bg-white rounded-3xl shadow-2xl border border-gray-200/90 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white flex items-center justify-between shadow-xs select-none">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-emerald-700" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight">EcoBot AI</h3>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-1.5 py-0.2 rounded text-emerald-100">
                    Gemini
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/80">Pune Citizen Help & Waste Guide</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isMinimized ? 'Expand chat' : 'Minimize chat'}
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#fbfdfc] text-xs">
                {messages.map((m) => {
                  const isBot = m.role === 'assistant';
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-end justify-end'}`}
                    >
                      {isBot && (
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                          isBot
                            ? 'bg-white border border-gray-100 text-gray-800 shadow-2xs'
                            : 'bg-emerald-600 text-white font-medium rounded-br-none shadow-sm'
                        }`}
                      >
                        {m.content}
                        <span
                          className={`block text-[9px] mt-1.5 font-sans ${
                            isBot ? 'text-gray-400' : 'text-emerald-100/70 text-right'
                          }`}
                        >
                          {m.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                      <Bot className="h-4 w-4 animate-spin-slow" />
                    </div>
                    <div className="p-3 bg-white border border-gray-100 rounded-2xl rounded-bl-none shadow-2xs flex items-center gap-1.5 text-gray-500">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                      <span className="text-[11px] font-medium">EcoBot is thinking with Gemini…</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Suggestions */}
              <div className="px-4 py-2 bg-white border-t border-gray-100">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {QUICK_PROMPTS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleSendMessage(q)}
                      disabled={loading}
                      className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-200/80 transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Action Shortcuts Bar */}
              <div className="px-4 py-2 bg-emerald-50/70 border-t border-emerald-100/80 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBooking();
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Schedule Free Pickup</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenScanner();
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Scan Waste with AI</span>
                </button>
              </div>

              {/* Input Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask EcoBot anything about waste & recycling..."
                  disabled={loading}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
