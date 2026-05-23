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
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: "#020817" }}>
      {/* Ambient blobs */}
      <div className="ambient-blob w-[600px] h-[600px] top-[-150px] left-[-150px]"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)" }} />
      <div className="ambient-blob w-[500px] h-[500px] bottom-0 right-[-100px]"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)", animationDelay: "4s" }} />

      {/* ── TOP NAV ── */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(2,8,23,0.8)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center gap-4">
          <Link href="/artist/home">
            <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={16} />
              Back
            </button>
          </Link>
          <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.08)" }} />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #10B981, #34D399)" }}>
              <Sparkles size={14} className="text-black" />
            </div>
            <span className="font-semibold text-white">AI Career Manager</span>
          </div>
        </div>
      </nav>

      {/* ── MAIN CHAT AREA ── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-8 scrollbar-hide">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence>
            {isFirstMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4"
              >
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-left px-4 py-3 rounded-xl text-sm transition-all duration-200"
                    style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", color: "#94A3B8" }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(16,185,129,0.1)";
                      e.currentTarget.style.color = "#F8FAFC";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(16,185,129,0.05)";
                      e.currentTarget.style.color = "#94A3B8";
                    }}
                  >
                    <Zap size={12} className="inline mr-2" style={{ color: "#10B981" }} />
                    {prompt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((msg, index) => (
            <React.Fragment key={index}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.15))", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <Bot size={16} style={{ color: "#10B981" }} />
                  </div>
                )}

                <div
                  className="max-w-[78%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed"
                  style={{
                    ...(msg.role === "user"
                      ? { background: "linear-gradient(135deg, #10B981, #34D399)", color: "#020817", fontWeight: 500, borderRadius: "1rem 1rem 0.25rem 1rem" }
                      : { background: "rgba(20,27,46,0.9)", color: "#CBD5E1", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1rem 1rem 1rem 0.25rem" }),
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>
              </motion.div>
              
              {msg.role === "assistant" && msg.bookings && msg.bookings.length > 0 && (
                <div className="pl-11 pr-4 mt-2">
                  {msg.bookings.map(booking => (
                    <div key={booking.id} className="p-4 rounded-xl border border-slate-700 bg-slate-800/50 mb-2">
                      <p className="text-white font-semibold">{booking.eventName} <span className="text-sm font-normal text-slate-400">by {booking.organizerName}</span></p>
                      <p className="text-xs text-slate-400 mt-1">Date: {booking.date} | Price: ₹{booking.price}</p>
                    </div>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(20,27,46,0.9)" }}>
                <Loader2 size={16} className="animate-spin text-emerald-500" />
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── INPUT BAR ── */}
      <div className="relative z-50 border-t px-4 py-4" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(2,8,23,0.9)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your manager..."
              disabled={loading}
              className="w-full resize-none p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none"
              style={{ minHeight: "52px", maxHeight: "140px" }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-emerald-500 text-slate-900"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
