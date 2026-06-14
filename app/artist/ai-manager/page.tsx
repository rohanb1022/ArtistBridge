"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string; bookings?: any[] };

const suggestedPrompts = [
  "Do I have any pending booking requests?",
  "Can you help me draft a reply to decline a booking?",
  "Help me negotiate a higher budget for a pending request.",
];

export default function ArtistAIManagerPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI Career Manager powered by LangGraph and Llama 3.\n\nI can help you check your pending bookings, draft professional replies to organizers, and provide scheduling advice. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (msg?: string) => {
    const userMessage = msg || input;
    if (!userMessage.trim() || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const newMessages = [...messages, { role: "user", content: userMessage }];
      const response = await fetch("/api/artist/ai-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Sorry, I encountered an error.", bookings: data.bookings || [] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops! Something went wrong connecting to the AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isFirstMessage = messages.length === 1;

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 relative">
      
      {/* ── TOP NAV ── */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/artist/home">
            <button className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              <ArrowLeft size={15} />
              Back
            </button>
          </Link>
          <div className="w-px h-4 bg-neutral-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-neutral-900 flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="font-heading font-medium text-neutral-950">AI Career Manager</span>
          </div>
        </div>
      </nav>

      {/* ── MAIN CHAT AREA ── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-8 scrollbar-hide bg-neutral-50/30">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence>
            {isFirstMessage && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4"
              >
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-left px-4 py-3.5 rounded-md text-xs font-medium bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 hover:shadow-xs transition-all duration-200"
                  >
                    <Zap size={11} className="inline mr-1.5 text-neutral-900" />
                    {prompt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((msg, index) => (
            <React.Fragment key={index}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-neutral-200 bg-white">
                    <Bot size={15} className="text-neutral-655" />
                  </div>
                )}

                <div
                  className="max-w-[80%] px-5 py-3 rounded-lg text-sm leading-relaxed font-sans"
                  style={{
                    ...(msg.role === "user"
                      ? { backgroundColor: "#111111", color: "#FFFFFF" }
                      : { backgroundColor: "#FFFFFF", color: "#111111", border: "1px solid #E5E5E5" }),
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-neutral-200 bg-white">
                    <User size={15} className="text-neutral-655" />
                  </div>
                )}
              </motion.div>
              
              {msg.role === "assistant" && msg.bookings && msg.bookings.length > 0 && (
                <div className="pl-12 pr-4 mt-2 space-y-2">
                  {msg.bookings.map(booking => (
                    <div key={booking.id} className="p-4 rounded-lg border border-neutral-200 bg-white shadow-xs">
                      <p className="text-sm font-semibold text-neutral-900">{booking.eventName} <span className="text-xs font-normal text-neutral-500">by {booking.organizerName}</span></p>
                      <p className="text-xs text-neutral-450 mt-1">Date: {booking.date} | Price: ₹{booking.price?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-200 bg-white">
                <Loader2 size={14} className="animate-spin text-neutral-900" />
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── INPUT BAR ── */}
      <div className="relative z-50 border-t border-neutral-200 px-6 py-4 bg-white/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your manager..."
              disabled={loading}
              className="w-full resize-none studio-input pr-12 py-3.5 scrollbar-hide text-sm rounded-md"
              style={{ minHeight: "48px", maxHeight: "140px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 140) + "px";
              }}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className={`w-11 h-11 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
              input.trim()
                ? "bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer"
                : "bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed"
            }`}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
