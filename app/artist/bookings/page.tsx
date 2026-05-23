"use client";

import api from "@/lib/axios";
import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { CheckCircle2, Clock, XCircle, MapPin, Calendar, Clock3, User, Loader2, MessageCircle } from "lucide-react";

type Booking = {
  [x: string]: ReactNode;
  id: string | number;
  eventName: string;
  date: string;
  status: string;
  city: string;
  time: string;
  organizerName: string;
};

type BookingsState = {
  pending: Booking[];
  confirmed: Booking[];
  cancelled: Booking[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const Bookings = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingsState>({ pending: [], confirmed: [], cancelled: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed" | "cancelled">("pending");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/artist/getAllBookings");
      setBookings(response.data.data);
    } catch {
      toast.error("Failed to load bookings.", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId: string | number) => {
    try {
      await api.put("/booking/bookingAccept", { requestId: bookingId, updatedStatus: "CONFIRMED" });
      toast.success("Booking accepted!", { theme: "dark", transition: Bounce, position: "top-center" });
      fetchBookings();
    } catch {
      toast.error("Failed to accept booking.", { theme: "dark" });
    }
  };

  const handleReject = async (bookingId: string | number) => {
    try {
      await api.put("/booking/bookingRejection", { requestId: bookingId, updatedStatus: "CANCELLED" });
      toast.success("Booking rejected.", { theme: "dark", transition: Bounce, position: "top-center" });
      fetchBookings();
    } catch {
      toast.error("Failed to reject booking.", { theme: "dark" });
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const tabs = [
    { key: "pending" as const, label: "Pending", icon: <Clock size={14} />, color: "#F59E0B", count: bookings.pending.length },
    { key: "confirmed" as const, label: "Confirmed", icon: <CheckCircle2 size={14} />, color: "#10B981", count: bookings.confirmed.length },
    { key: "cancelled" as const, label: "Rejected", icon: <XCircle size={14} />, color: "#F87171", count: bookings.cancelled.length },
  ];

  const activeColor = tabs.find((t) => t.key === activeTab)?.color || "#F59E0B";
  const activeBookings = bookings[activeTab];

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#020817" }}>
      <ToastContainer />

      <div className="ambient-blob w-[600px] h-[600px] top-[-100px] right-[-150px]"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)" }} />
      <div className="ambient-blob w-[500px] h-[500px] bottom-0 left-[-100px]"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", animationDelay: "5s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 uppercase tracking-widest"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }}>
            <Calendar size={12} />
            My Bookings
          </div>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>Booking Dashboard</h1>
          <p className="text-slate-400 mt-2">Manage all your incoming performance requests and confirmed bookings.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 rounded-xl w-fit"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={
                activeTab === tab.key
                  ? { background: `${tab.color}18`, color: tab.color, border: `1px solid ${tab.color}30` }
                  : { color: "#64748B", background: "transparent", border: "1px solid transparent" }
              }>
              {tab.icon}
              {tab.label}
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs"
                style={{ background: activeTab === tab.key ? `${tab.color}20` : "rgba(255,255,255,0.05)", color: activeTab === tab.key ? tab.color : "#64748B" }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3">
            <Loader2 size={28} className="animate-spin" style={{ color: activeColor }} />
            <span className="text-slate-400">Loading...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && activeBookings.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: `${activeColor}10`, border: `1px solid ${activeColor}20` }}>
              {tabs.find((t) => t.key === activeTab)?.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "var(--font-sora)" }}>No {activeTab} bookings</h3>
            <p className="text-slate-500 text-sm">Bookings will appear here once organizers send requests.</p>
          </motion.div>
        )}

        {/* Grid */}
        {!loading && activeBookings.length > 0 && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeBookings.map((booking) => (
              <motion.div key={String(booking.id)} variants={itemVariants}>
                <div className="glass-card p-6 h-full"
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${activeColor}30`;
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}>

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white" style={{ fontFamily: "var(--font-sora)" }}>{booking.eventName}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <User size={11} />
                        {booking.organizerName}
                      </div>
                    </div>
                    <span className={`badge-${booking.status.toLowerCase() === "cancelled" ? "cancelled" : booking.status.toLowerCase() === "confirmed" ? "confirmed" : "pending"}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-400">
                    <div className="flex items-center gap-2"><Calendar size={13} style={{ color: activeColor }} />{booking.date}</div>
                    <div className="flex items-center gap-2"><Clock3 size={13} style={{ color: activeColor }} />{booking.time}</div>
                    <div className="flex items-center gap-2"><MapPin size={13} style={{ color: activeColor }} />{booking.city}</div>
                  </div>

                  {activeTab === "pending" && (
                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() => handleAccept(booking.id)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: "rgba(16,185,129,0.12)", color: "#34D399", border: "1px solid rgba(16,185,129,0.25)" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(16,185,129,0.2)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(16,185,129,0.12)")}
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.18)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  )}

                  {activeTab === "confirmed" && (
                    <button
                      onClick={() => router.push(`/artist/chat/${booking.id}`)}
                      className="mt-5 w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                      style={{ background: "rgba(124,58,237,0.12)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.25)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,58,237,0.22)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "rgba(124,58,237,0.12)")}
                    >
                      <MessageCircle size={15} />
                      Open Chat
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
