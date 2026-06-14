"use client";

import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Clock, XCircle, Trash2, LayoutDashboard, MessageCircle } from "lucide-react";
import { toast, ToastContainer, Bounce } from "react-toastify";

type Booking = {
  id: string;
  artistName: string;
  eventName: string;
  date: string;
  time: string;
  city: string;
  status: string;
};

type BookingsState = {
  pending: Booking[];
  confirmed: Booking[];
  cancelled: Booking[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ManageBookings = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingsState>({
    pending: [],
    confirmed: [],
    cancelled: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed" | "cancelled">("pending");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await api.get("/organizer/getAllBookings");
        setBookings(response.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await api.put("/booking/bookingRejection", { requestId: bookingId, updatedStatus: "CANCELLED" });
      toast.success("Booking cancelled.", { transition: Bounce });
      setBookings((prev) => ({
        ...prev,
        confirmed: prev.confirmed.filter((b) => b.id !== bookingId),
        cancelled: [...prev.cancelled, { ...prev.confirmed.find((b) => b.id === bookingId)!, status: "CANCELLED" }],
      }));
    } catch {
      toast.error("Failed to cancel booking.");
    }
  };

  const tabs = [
    { key: "pending" as const, label: "Pending", icon: <Clock size={13} />, color: "#B45309", count: bookings.pending.length },
    { key: "confirmed" as const, label: "Confirmed", icon: <CheckCircle2 size={13} />, color: "#15803D", count: bookings.confirmed.length },
    { key: "cancelled" as const, label: "Cancelled", icon: <XCircle size={13} />, color: "#B91C1C", count: bookings.cancelled.length },
  ];

  const activeColor = tabs.find((t) => t.key === activeTab)?.color || "#111111";
  const activeBookings = bookings[activeTab];

  return (
    <div className="min-h-screen bg-white text-neutral-900 relative">
      <ToastContainer />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-600 mb-4"
          >
            <LayoutDashboard size={12} />
            Booking Manager
          </div>
          <h1 className="text-4xl font-heading font-medium text-neutral-950" style={{ fontFamily: "var(--font-heading)" }}>Manage Bookings</h1>
          <p className="text-sm text-neutral-500 mt-2 font-sans">Track and manage all your artist bookings in one place.</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8 p-1 bg-neutral-50 border border-neutral-200 rounded-md w-fit"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200"
              style={
                activeTab === tab.key
                  ? { background: "#FFFFFF", color: "#111111", border: "1px solid #E5E5E5", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)" }
                  : { color: "#666666", background: "transparent", border: "1px solid transparent" }
              }
            >
              {tab.icon}
              {tab.label}
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] bg-neutral-100 border border-neutral-200 text-neutral-500">
                {tab.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3">
            <Loader2 size={24} className="animate-spin text-neutral-900" />
            <span className="text-sm text-neutral-450 font-sans">Loading bookings...</span>
          </div>
        )}

        {/* Empty */}
        {!loading && activeBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="w-12 h-12 rounded-full border border-neutral-200 bg-white flex items-center justify-center mx-auto mb-4 text-neutral-500">
              {tabs.find((t) => t.key === activeTab)?.icon}
            </div>
            <h3 className="text-lg font-heading font-medium text-neutral-900 mb-2">
              No {activeTab} bookings
            </h3>
            <p className="text-neutral-500 text-sm font-sans">Your {activeTab} bookings will appear here.</p>
          </motion.div>
        )}

        {/* Bookings Grid */}
        {!loading && activeBookings.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activeBookings.map((booking) => (
              <motion.div key={booking.id} variants={itemVariants}>
                <div className="bg-white border border-neutral-200 rounded-lg p-6 h-full hover:border-neutral-900 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-neutral-900 text-sm leading-tight">{booking.eventName}</h3>
                        <p className="text-xs text-neutral-500 mt-1 font-sans">Artist: {booking.artistName}</p>
                      </div>
                      <span className={
                        booking.status === "CONFIRMED" ? "badge-confirmed" :
                        booking.status === "PENDING" ? "badge-pending" : "badge-cancelled"
                      }>
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-neutral-500 font-sans mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">📅</span> {booking.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">⏰</span> {booking.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">📍</span> {booking.city}
                      </div>
                    </div>
                  </div>

                  {activeTab === "confirmed" && (
                    <div className="flex gap-2 mt-6 pt-4 border-t border-neutral-100">
                      <button
                        onClick={() => router.push(`/organizer/chat/${booking.id}`)}
                        className="flex-1 py-2 rounded-md text-xs font-semibold border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-neutral-900 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <MessageCircle size={13} />
                        Chat
                      </button>
                      <button
                        className="flex-1 py-2 rounded-md text-xs font-semibold border border-red-100 hover:bg-red-50 text-red-650 hover:text-red-755 flex items-center justify-center gap-1.5 transition-all"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        <Trash2 size={13} />
                        Cancel
                      </button>
                    </div>
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

export default ManageBookings;
