"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import {
  ArrowLeft,
  Send,
  Loader2,
  MessageCircle,
  Calendar,
  MapPin,
  User,
} from "lucide-react";

type Message = {
  id: string;
  bookingId: string;
  senderId: string;
  senderRole: string;
  senderName: string;
  content: string;
  createdAt: string;
};

type Booking = {
  id: string;
  eventName: string;
  organizerName: string;
  artistName: string;
  date: string;
  city: string;
  status: string;
};

const ArtistChatPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get(`/chat/getMessages?bookingId=${bookingId}`);
      setMessages(res.data.data);
      setBooking(res.data.booking);
      setError(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || "Failed to load chat");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchMessages();
    pollingRef.current = setInterval(fetchMessages, 3000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setSending(true);
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      bookingId: bookingId as string,
      senderId: "me",
      senderRole: "artist",
      senderName: booking?.artistName || "You",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");

    try {
      await api.post("/chat/sendMessage", { bookingId, content: trimmed });
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setInput(trimmed);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-neutral-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-neutral-600" />
          <span className="text-sm text-neutral-450 font-sans">Loading chat...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-neutral-900">
        <div className="text-center bg-white border border-neutral-200 p-8 rounded-lg max-w-sm mx-auto shadow-xs">
          <MessageCircle size={32} className="text-neutral-450 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-medium text-neutral-900 mb-2">
            Chat Unavailable
          </h2>
          <p className="text-xs text-neutral-550 mb-6 font-sans">{error}</p>
          <button
            onClick={() => router.back()}
            className="w-full btn-gold py-2 rounded-md text-sm font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 relative">
      
      {/* Header */}
      <div className="relative z-10 border-b border-neutral-200 px-6 py-4 flex items-center gap-4 bg-white/85 backdrop-blur-md">
        <button
          onClick={() => router.push("/artist/bookings")}
          className="p-2 rounded-md border border-neutral-200 hover:border-neutral-900 text-neutral-655 hover:text-neutral-950 bg-white transition-all"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="w-8 h-8 rounded-full border border-neutral-200 bg-neutral-50 flex items-center justify-center flex-shrink-0">
          <MessageCircle size={15} className="text-neutral-600" />
        </div>

        <div className="flex-1 min-w-0 text-left">
          <h2 className="text-neutral-900 font-heading font-medium truncate text-base leading-tight">
            {booking?.eventName}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-0.5 text-[11px] text-neutral-450 font-sans">
            <span className="flex items-center gap-1">
              <User size={10} />
              {booking?.organizerName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              {booking?.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={10} />
              {booking?.city}
            </span>
          </div>
        </div>

        <span className="badge-confirmed text-xs flex-shrink-0">
          CONFIRMED
        </span>
      </div>

      {/* Messages Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-neutral-50/20 scrollbar-hide">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-12 h-12 rounded-full border border-neutral-200 bg-white flex items-center justify-center mx-auto mb-4 text-neutral-600">
              <MessageCircle size={20} />
            </div>
            <p className="text-neutral-900 font-medium text-base">
              Start the conversation
            </p>
            <p className="text-neutral-500 text-xs mt-1 font-sans">
              Say hello to {booking?.organizerName}!
            </p>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.senderRole === "artist";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  {!isMe && (
                    <span className="text-[10px] font-semibold text-neutral-450 ml-1 font-sans">
                      {msg.senderName}
                    </span>
                  )}
                  <div
                    className="px-4 py-2.5 rounded-lg text-sm leading-relaxed font-sans"
                    style={
                      isMe
                        ? {
                            backgroundColor: "#111111",
                            color: "#FFFFFF",
                          }
                        : {
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #E5E5E5",
                            color: "#111111",
                          }
                    }
                  >
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-neutral-400 mx-1 font-sans">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 border-t border-neutral-200 px-6 py-4 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="studio-input flex-1 text-sm rounded-md"
            autoComplete="off"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className={`w-11 h-11 rounded-md flex items-center justify-center transition-all flex-shrink-0 border ${
              input.trim()
                ? "bg-neutral-900 border-neutral-900 hover:bg-neutral-800 text-white cursor-pointer"
                : "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed"
            }`}
          >
            {sending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistChatPage;
