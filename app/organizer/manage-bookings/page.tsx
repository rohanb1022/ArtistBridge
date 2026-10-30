"use client";

import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Clock, XCircle, Trash2, LayoutDashboard, MessageCircle, Hourglass, Search } from "lucide-react";
import { toast, ToastContainer, Bounce } from "react-toastify";

type Booking = {
  id: string;
  artistName: string;
  eventName: string;
  date: string;
  time: string;
  city: string;
  status: string;
  expiryDate?: string | null;
  price?: number;
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
    { key: "cancelled" as const, label: "Declined / Expired", icon: <XCircle size={13} />, color: "#B91C1C", count: bookings.cancelled.length },
  ];

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-600 mb-4">
            <LayoutDashboard size={12} />
            Organizer Workspace
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-medium tracking-tight text-neutral-950 mb-2">
            Manage <span className="font-serif italic font-normal text-neutral-600">Bookings</span>
          </h1>
          <p className="text-neutral-500 text-sm font-sans max-w-xl">
            Track your requests, confirmed events, and see which offers have expired so you can find other talent.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-neutral-200 pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.key
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-300"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3">
            <Loader2 size={24} className="animate-spin text-neutral-400" />
            <span className="text-neutral-400 text-sm">Loading bookings...</span>
          </div>
        )}

        {/* Empty */}
        {!loading && activeBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 border border-dashed border-neutral-200 rounded-xl"
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
                <div className="bg-white border border-neutral-200 rounded-lg p-6 h-full hover:border-neutral-900 hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-neutral-900 text-sm leading-tight">{booking.eventName}</h3>
                        <p className="text-xs text-neutral-500 mt-1 font-sans">Artist: {booking.artistName}</p>
                      </div>
                      <span className={
                        booking.status === "CONFIRMED" ? "badge-confirmed" :
                        booking.status === "PENDING" ? "badge-pending" :
                        booking.status === "EXPIRED" ? "bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-xs font-semibold" :
                        "badge-cancelled"
                      }>
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-neutral-500 font-sans mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">📅</span> Event Date: {booking.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">⏰</span> Event Time: {booking.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">📍</span> City: {booking.city}
                      </div>

                      {/* Expiry Deadline info */}
                      {booking.expiryDate && (
                        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-2 py-1 rounded text-[11px] font-medium border border-amber-200 mt-2">
                          <Hourglass size={12} className="text-amber-600 shrink-0" />
                          <span>
                            {booking.status === "EXPIRED"
                              ? `Expired on: ${booking.expiryDate}`
                              : `Acceptance limit: ${booking.expiryDate}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
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

                    {activeTab === "cancelled" && (
                      <div className="mt-5 pt-3 border-t border-neutral-100">
                        <Link
                          href="/organizer/explore"
                          className="w-full py-2 rounded-md text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Search size={13} />
                          Find Other Artists
                        </Link>
                      </div>
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

export default ManageBookings;
