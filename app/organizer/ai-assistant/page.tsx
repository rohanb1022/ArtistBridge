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
      const newMessages = [...messages, { role: "user", content: userMessage }];
      const response = await fetch("/api/ai/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
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
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 relative">
      
      {/* ── TOP NAV ── */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/organizer/home">
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
            <span className="font-heading font-medium text-neutral-950">
              AI Event Assistant
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
          Llama 3 · Pinecone RAG
        </div>
      </nav>

      {/* ── MAIN CHAT AREA ── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-8 scrollbar-hide bg-neutral-50/30">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Suggested Prompts (shown only on first load) */}
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

          {/* Messages */}
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
                    <Bot size={15} className="text-neutral-650" />
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
                    <User size={15} className="text-neutral-650" />
                  </div>
                )}
              </motion.div>

              {/* Artist Cards */}
              {msg.role === "assistant" && msg.artists && msg.artists.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-12 pr-4 mt-2 mb-6"
                >
                  {msg.artists.map((artist) => (
                    <div key={artist.id} className="bg-white border border-neutral-200 rounded-lg p-5 flex flex-col justify-between hover:border-neutral-900 hover:shadow-sm transition-all duration-200">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-neutral-900 text-sm leading-tight">{artist.name}</h3>
                          <div className="text-[10px] text-neutral-450 uppercase tracking-wider font-semibold">
                            {artist.city}
                          </div>
                        </div>
                        <div className="flex gap-1.5 text-[10px] mb-4 text-neutral-550 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600">{artist.category}</span>
                          <span className="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 font-semibold">₹{artist.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <Link href={`/organizer/artist-profile/${artist.id}`}>
                        <button className="w-full text-xs font-semibold py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white transition-colors">
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
                className="flex gap-3.5"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-neutral-200 bg-white">
                  <Bot size={15} className="text-neutral-600" />
                </div>
                <div className="px-5 py-3 rounded-lg flex items-center gap-3 bg-white border border-neutral-200">
                  <Loader2 size={14} className="animate-spin text-neutral-900" />
                  <span className="text-sm text-neutral-500 font-sans">Searching artist database...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
              placeholder="Describe your event, city, budget... (Press Enter to send)"
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
        <p className="text-center text-[10px] text-neutral-400 font-medium tracking-wider uppercase mt-2">
          Powered by Pinecone RAG · Llama 3
        </p>
      </div>
    </div>
  );
}
