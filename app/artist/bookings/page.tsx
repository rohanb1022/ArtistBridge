/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import api from "@/lib/axios";
import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { 
  CheckCircle2, Clock, XCircle, MapPin, Calendar, Clock3, 
  User, Loader2, MessageCircle, IndianRupee, Hourglass, History, ArrowRight
} from "lucide-react";

type Booking = {
  [x: string]: ReactNode;
  id: string;
  eventName: string;
  date: string;
  status: string;
  city: string;
  time: string;
  organizerName: string;
  price: number;
  expiryDate?: string | null;
};

type BookingsState = {
  pending: Booking[];
  confirmed: Booking[];
  cancelled: Booking[];
  historyCount?: {
    performed: number;
    missed: number;
    total: number;
  };
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

const Bookings = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingsState>({ 
    pending: [], 
    confirmed: [], 
    cancelled: [] 
  });
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
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to accept booking.";
      toast.error(msg, { theme: "dark" });
      fetchBookings(); // Automatically re-fetches to move expired items
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

  useEffect(() => { 
    fetchBookings(); 
  }, []);

  const tabs = [
    { key: "pending" as const, label: "Pending", icon: <Clock size={14} />, color: "#F59E0B", count: bookings.pending.length },
    { key: "confirmed" as const, label: "Confirmed", icon: <CheckCircle2 size={14} />, color: "#10B981", count: bookings.confirmed.length },
    { key: "cancelled" as const, label: "Rejected", icon: <XCircle size={14} />, color: "#F87171", count: bookings.cancelled.length },
  ];

  const activeBookings = bookings[activeTab];

  return (
    <div className="min-h-screen relative bg-white">
      <ToastContainer />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 uppercase tracking-widest bg-neutral-100 border border-neutral-200 text-neutral-600">
                <Calendar size={12} />
                My Bookings
              </div>
              <h1 className="text-4xl font-medium text-neutral-900" style={{ fontFamily: "var(--font-heading)" }}>
                Booking Dashboard
              </h1>
              <p className="text-neutral-500 mt-2 text-sm max-w-2xl">
                Manage incoming performance requests and upcoming shows. Events whose dates have passed automatically move to your history.
              </p>
            </div>

            {/* Quick Link to Event History */}
            <Link
              href="/artist/history"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-all shadow-xs self-start md:self-center"
            >
              <History size={16} />
              <span>View Past History</span>
              {bookings.historyCount && bookings.historyCount.total > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-neutral-800 text-neutral-200">
                  {bookings.historyCount.performed} performed
                </span>
              )}
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Informative History Banner */}
        {bookings.historyCount && bookings.historyCount.total > 0 && (
          <div className="mb-8 p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <History size={15} className="text-neutral-500 shrink-0" />
              <span>
                You have <strong>{bookings.historyCount.performed} performed events</strong> and <strong>{bookings.historyCount.missed} missed or expired requests</strong> in your archive.
              </span>
            </div>
            <Link href="/artist/history" className="text-neutral-900 font-semibold hover:underline flex items-center gap-1 shrink-0">
              Open Event History →
            </Link>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 rounded-xl w-fit bg-neutral-50 border border-neutral-200">
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
            <span className="text-neutral-500 text-sm">Loading bookings...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && activeBookings.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 border border-dashed border-neutral-200 rounded-2xl">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-neutral-100 border border-neutral-200 text-neutral-500">
              {tabs.find((t) => t.key === activeTab)?.icon}
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              No active {activeTab} bookings
            </h3>
            <p className="text-neutral-500 text-sm max-w-sm mx-auto">
              {activeTab === "pending"
                ? "You have no incoming pending requests. Expired requests have moved to your Event History."
                : activeTab === "confirmed"
                ? "No upcoming confirmed gigs scheduled. Completed gigs have moved to your Event History."
                : "No rejected bookings."}
            </p>
            <Link
              href="/artist/history"
              className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-neutral-800 hover:underline"
            >
              Check Past Event History →
            </Link>
          </motion.div>
        )}

        {/* Grid */}
        {!loading && activeBookings.length > 0 && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeBookings.map((booking) => (
              <motion.div key={String(booking.id)} variants={itemVariants}>
                <div className="glass-card p-6 h-full bg-white border border-neutral-200 hover:border-neutral-900 rounded-xl transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-neutral-900 text-base" style={{ fontFamily: "var(--font-heading)" }}>
                          {booking.eventName}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                          <User size={11} />
                          {booking.organizerName}
                        </div>
                      </div>
                      <span className={`badge-${booking.status.toLowerCase() === "cancelled" ? "cancelled" : booking.status.toLowerCase() === "confirmed" ? "confirmed" : "pending"}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-neutral-600">
                      <div className="flex items-center gap-2"><Calendar size={13} className="text-neutral-400" />{booking.date}</div>
                      <div className="flex items-center gap-2"><Clock3 size={13} className="text-neutral-400" />{booking.time}</div>
                      <div className="flex items-center gap-2"><MapPin size={13} className="text-neutral-400" />{booking.city}</div>
                      
                      {/* Expiry Deadline info */}
                      {booking.expiryDate && activeTab === "pending" && (
                        <div className="flex items-center gap-2 text-xs font-medium text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-md border border-amber-200 mt-2">
                          <Hourglass size={12} className="text-amber-600 shrink-0" />
                          <span>Accept before: <strong>{String(booking.expiryDate)}</strong></span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-neutral-900 font-semibold pt-2 border-t border-neutral-100 mt-2">
                        <IndianRupee size={13} className="text-neutral-600" />
                        <span>₹{booking.price?.toLocaleString() || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {activeTab === "pending" && (
                      <div className="flex gap-2 mt-5">
                        <button
                          onClick={() => handleAccept(booking.id)}
                          className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all bg-neutral-900 hover:bg-neutral-800 text-white"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => handleReject(booking.id)}
                          className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all bg-transparent text-neutral-600 border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}

                    {activeTab === "confirmed" && (
                      <button
                        onClick={() => router.push(`/artist/chat/${booking.id}`)}
                        className="mt-5 w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all bg-neutral-900 hover:bg-neutral-800 text-white"
                      >
                        <MessageCircle size={15} />
                        Open Chat
                      </button>
                    )}
                  </div>
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
