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

const OrganizerChatPage = () => {
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

  // Scroll to bottom on new messages
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
      senderRole: "organizer",
      senderName: booking?.organizerName || "You",
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#020817" }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-amber-400" />
          <span className="text-slate-400">Loading chat...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#020817" }}
      >
        <div className="text-center glass-card p-10 max-w-md mx-auto">
          <MessageCircle size={40} className="text-amber-400 mx-auto mb-4" />
          <h2
            className="text-xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Chat Unavailable
          </h2>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#020817" }}
    >
      {/* Ambient blobs */}
      <div
        className="ambient-blob w-[500px] h-[500px] top-[-80px] left-[-100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)",
        }}
      />
      <div
        className="ambient-blob w-[400px] h-[400px] bottom-0 right-[-80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)",
          animationDelay: "5s",
        }}
      />

      {/* Header */}
      <div
        className="relative z-10 border-b px-6 py-4 flex items-center gap-4"
        style={{
          backgroundColor: "rgba(14,23,46,0.85)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <button
          onClick={() => router.push("/organizer/manage-bookings")}
          className="p-2 rounded-xl transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "rgba(245,158,11,0.15)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.05)")
          }
        >
          <ArrowLeft size={18} className="text-slate-300" />
        </button>

        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(245,158,11,0.15)",
            border: "1px solid rgba(245,158,11,0.3)",
          }}
        >
          <MessageCircle size={18} style={{ color: "#F59E0B" }} />
        </div>

        <div className="flex-1 min-w-0">
          <h2
            className="text-white font-semibold truncate text-sm"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            {booking?.eventName}
          </h2>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <User size={10} />
              {booking?.artistName}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar size={10} />
              {booking?.date}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin size={10} />
              {booking?.city}
            </span>
          </div>
        </div>

        <span
          className="badge-confirmed text-xs flex-shrink-0"
          style={{ fontSize: "0.65rem" }}
        >
          CONFIRMED
        </span>
      </div>

      {/* Messages Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 space-y-3 scrollbar-hide">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.2)",
              }}
            >
              <MessageCircle size={24} className="text-amber-400" />
            </div>
            <p
              className="text-white font-semibold"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Start the conversation
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Say hello to {booking?.artistName}!
            </p>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.senderRole === "organizer";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[72%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}
                >
                  {!isMe && (
                    <span className="text-xs text-slate-500 ml-1">
                      {msg.senderName}
                    </span>
                  )}
                  <div
                    className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={
                      isMe
                        ? {
                            background:
                              "linear-gradient(135deg, #D97706, #F59E0B)",
                            color: "#020817",
                            borderBottomRightRadius: "4px",
                            boxShadow: "0 4px 20px rgba(245,158,11,0.3)",
                          }
                        : {
                            background: "rgba(20,27,46,0.9)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "#CBD5E1",
                            borderBottomLeftRadius: "4px",
                          }
                    }
                  >
                    {msg.content}
                  </div>
                  <span className="text-xs text-slate-600 mx-1">
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
      <div
        className="relative z-10 border-t px-4 py-4"
        style={{
          backgroundColor: "rgba(14,23,46,0.85)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="studio-input flex-1"
            style={{ borderRadius: "1rem" }}
            autoComplete="off"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
            style={{
              background: input.trim()
                ? "linear-gradient(135deg, #D97706, #F59E0B)"
                : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(245,158,11,0.3)",
              boxShadow: input.trim()
                ? "0 4px 20px rgba(245,158,11,0.35)"
                : "none",
              cursor: input.trim() ? "pointer" : "not-allowed",
            }}
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin text-amber-300" />
            ) : (
              <Send
                size={16}
                style={{ color: input.trim() ? "#020817" : "#475569" }}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizerChatPage;
