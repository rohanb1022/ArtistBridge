"use client";

import api from "@/lib/axios";
import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { CheckCircle2, Clock, XCircle, MapPin, Calendar, Clock3, User, Loader2, MessageCircle, IndianRupee } from "lucide-react";

type Booking = {
  [x: string]: ReactNode;
  id: string | number;
  eventName: string;
  date: string;
  status: string;
  city: string;
  time: string;
  organizerName: string;
  price: number;
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
    <div className="min-h-screen relative" style={{ backgroundColor: "#FFFFFF" }}>
      <ToastContainer />

      <div className="ambient-blob w-[600px] h-[600px] top-[-100px] right-[-150px]"
        style={{ background: "none" }} />
      <div className="ambient-blob w-[500px] h-[500px] bottom-0 left-[-100px]"
        style={{ background: "none", animationDelay: "5s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 uppercase tracking-widest"
            style={{ background: "#F8F8F8", border: "1px solid #E5E5E5", color: "#666666" }}>
            <Calendar size={12} />
            My Bookings
          </div>
          <h1 className="text-4xl font-medium text-neutral-900" style={{ fontFamily: "var(--font-heading)" }}>Booking Dashboard</h1>
          <p className="text-neutral-550 mt-2">Manage all your incoming performance requests and confirmed bookings.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 rounded-xl w-fit"
          style={{ background: "#F8F8F8", border: "1px solid #E5E5E5" }}>
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={
                activeTab === tab.key
                  ? { background: "#FFFFFF", color: "#111111", border: "1px solid #E5E5E5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }
                  : { color: "#666666", background: "transparent", border: "1px solid transparent" }
              }>
              {tab.icon}
              {tab.label}
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs"
                style={{ background: activeTab === tab.key ? "#111111" : "#E5E5E5", color: activeTab === tab.key ? "#FFFFFF" : "#666666" }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3">
            <Loader2 size={28} className="animate-spin text-neutral-800" />
            <span className="text-neutral-550">Loading...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && activeBookings.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "#F8F8F8", border: "1px solid #E5E5E5" }}>
              {tabs.find((t) => t.key === activeTab)?.icon}
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2" style={{ fontFamily: "var(--font-heading)" }}>No {activeTab} bookings</h3>
            <p className="text-neutral-500 text-sm">Bookings will appear here once organizers send requests.</p>
          </motion.div>
        )}

        {/* Grid */}
        {!loading && activeBookings.length > 0 && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeBookings.map((booking) => (
              <motion.div key={String(booking.id)} variants={itemVariants}>
                <div className="glass-card p-6 h-full bg-white border border-neutral-200 rounded-xl"
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#111111";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#E5E5E5";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                  style={{ transition: "all 0.2s ease" }}>

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-neutral-900" style={{ fontFamily: "var(--font-heading)" }}>{booking.eventName}</h3>
                      <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                        <User size={11} />
                        {booking.organizerName}
                      </div>
                    </div>
                    <span className={`badge-${booking.status.toLowerCase() === "cancelled" ? "cancelled" : booking.status.toLowerCase() === "confirmed" ? "confirmed" : "pending"}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-neutral-550">
                    <div className="flex items-center gap-2"><Calendar size={13} className="text-neutral-500" />{booking.date}</div>
                    <div className="flex items-center gap-2"><Clock3 size={13} className="text-neutral-500" />{booking.time}</div>
                    <div className="flex items-center gap-2"><MapPin size={13} className="text-neutral-500" />{booking.city}</div>
                    <div className="flex items-center gap-2 text-neutral-900 font-semibold pt-2 border-t border-neutral-100 mt-2">
                      <IndianRupee size={13} className="text-neutral-600" />
                      <span>₹{booking.price?.toLocaleString() || "N/A"}</span>
                    </div>
                  </div>

                  {activeTab === "pending" && (
                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() => handleAccept(booking.id)}
                        className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                        style={{ background: "#111111", color: "#FFFFFF", border: "1px solid #111111" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#222222")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#111111")}
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                        style={{ background: "transparent", color: "#666666", border: "1px solid #E5E5E5" }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "#F8F8F8";
                          e.currentTarget.style.color = "#111111";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#666666";
                        }}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  )}

                  {activeTab === "confirmed" && (
                    <button
                      onClick={() => router.push(`/artist/chat/${booking.id}`)}
                      className="mt-5 w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                      style={{ background: "#111111", color: "#FFFFFF", border: "1px solid #111111" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#222222")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#111111")}
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
