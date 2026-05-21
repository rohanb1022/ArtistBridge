"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string; artists?: any[] };

const suggestedPrompts = [
  "I need a singer in Mumbai for ₹20,000",
  "Find me a DJ for a corporate event in Pune",
  "I want a dancer for a wedding in Delhi under ₹30k",
  "Show me magicians available in Bangalore",
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI Booking Assistant powered by Pinecone RAG and Llama 3.\n\nTell me about your event — the type of artist you need, your city, budget, and event date — and I'll instantly find the best matches from our database.",
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
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Sorry, I encountered an error. Please try again.", artists: data.artists || [] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops! Something went wrong connecting to the AI. Please check your API keys and try again." },
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
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)" }} />
      <div className="ambient-blob w-[500px] h-[500px] bottom-0 right-[-100px]"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)", animationDelay: "4s" }} />

      {/* Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      {/* ── TOP NAV ── */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(2,8,23,0.8)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center gap-4">
          <Link href="/organizer/home">
            <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={16} />
              Back
            </button>
          </Link>
          <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.08)" }} />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)" }}>
              <Sparkles size={14} className="text-black" />
            </div>
            <span className="font-semibold text-white" style={{ fontFamily: "var(--font-sora)" }}>
              AI Event Assistant
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
          style={{ background: "rgba(16,185,129,0.1)", color: "#34D399", border: "1px solid rgba(16,185,129,0.2)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Llama 3 · Pinecone RAG
        </div>
      </nav>

      {/* ── MAIN CHAT AREA ── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-8 scrollbar-hide">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Suggested Prompts (shown only on first load) */}
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
                    style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", color: "#94A3B8" }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(245,158,11,0.1)";
                      e.currentTarget.style.color = "#F8FAFC";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(245,158,11,0.05)";
                      e.currentTarget.style.color = "#94A3B8";
                    }}
                  >
                    <Zap size={12} className="inline mr-2" style={{ color: "#F59E0B" }} />
                    {prompt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
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
                  style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(124,58,237,0.15))", border: "1px solid rgba(245,158,11,0.2)" }}>
                  <Bot size={16} style={{ color: "#F59E0B" }} />
                </div>
              )}

              <div
                className="max-w-[78%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed"
                style={{
                  ...(msg.role === "user"
                    ? { background: "linear-gradient(135deg, #D97706, #F59E0B)", color: "#020817", fontWeight: 500, borderRadius: "1rem 1rem 0.25rem 1rem" }
                    : { background: "rgba(20,27,46,0.9)", color: "#CBD5E1", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1rem 1rem 1rem 0.25rem" }),
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)" }}>
                  <User size={16} style={{ color: "#A78BFA" }} />
                </div>
              )}
            </motion.div>

            {/* Artist Cards */}
            {msg.role === "assistant" && msg.artists && msg.artists.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-11 pr-4 mt-2 mb-6"
              >
                {msg.artists.map((artist) => (
                  <div key={artist.id} className="glass-card p-4 hover:scale-[1.02] transition-transform duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white" style={{ fontFamily: "var(--font-sora)" }}>{artist.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                         {artist.city}
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs mb-4 text-slate-400 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">{artist.category}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">₹{artist.price}</span>
                    </div>
                    <Link href={`/organizer/artist-profile/${artist.id}`}>
                      <button className="w-full text-xs font-medium py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors">
                        View Profile
                      </button>
                    </Link>
                  </div>
                ))}
              </motion.div>
            )}
          </React.Fragment>
          ))}

          {/* Loading indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(124,58,237,0.15))", border: "1px solid rgba(245,158,11,0.2)" }}>
                  <Bot size={16} style={{ color: "#F59E0B" }} />
                </div>
                <div className="px-5 py-3.5 rounded-2xl flex items-center gap-3"
                  style={{ background: "rgba(20,27,46,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1rem 1rem 1rem 0.25rem" }}>
                  <Loader2 size={16} className="animate-spin" style={{ color: "#F59E0B" }} />
                  <span className="text-sm text-slate-400">Searching artist database...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── INPUT BAR ── */}
      <div className="relative z-50 border-t px-4 py-4"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(2,8,23,0.9)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your event, city, budget... (Press Enter to send)"
              disabled={loading}
              className="w-full resize-none studio-input pr-14 py-3.5 scrollbar-hide"
              style={{ minHeight: "52px", maxHeight: "140px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 140) + "px";
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: input.trim() ? "linear-gradient(135deg, #D97706, #F59E0B)" : "rgba(255,255,255,0.05)",
              color: input.trim() ? "#020817" : "#475569",
              cursor: !input.trim() ? "not-allowed" : "pointer",
            }}
          >
            <Send size={18} />
          </motion.button>
        </div>
        <p className="text-center text-xs text-slate-600 mt-2">
          Powered by Pinecone RAG · Groq Llama 3 · HuggingFace Embeddings
        </p>
      </div>
    </div>
  );
}
