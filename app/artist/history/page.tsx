"use client";

import api from "@/lib/axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { 
  CheckCircle2, XCircle, MapPin, Calendar, Clock3, 
  User, Loader2, IndianRupee, ArrowLeft, Hourglass, 
  Search, TrendingUp, History, Sparkles
} from "lucide-react";

type HistoryItem = {
  id: string;
  eventName: string;
  organizerName: string;
  date: string;
  time: string;
  city: string;
  price: number;
  category: string;
  status: string;
  expiryDate?: string | null;
  historyType: "PERFORMED" | "MISSED";
  historyBadge: string;
  historyDescription: string;
};

type HistoryStats = {
  totalPerformed: number;
  totalMissed: number;
  totalEarnings: number;
  acceptanceRate: number;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function ArtistHistoryPage() {
  const [performed, setPerformed] = useState<HistoryItem[]>([]);
  const [missed, setMissed] = useState<HistoryItem[]>([]);
  const [all, setAll] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState<HistoryStats>({
    totalPerformed: 0,
    totalMissed: 0,
    totalEarnings: 0,
    acceptanceRate: 100,
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "performed" | "missed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/artist/getEventHistory");
      if (res.data?.data) {
        setPerformed(res.data.data.performed || []);
        setMissed(res.data.data.missed || []);
        setAll(res.data.data.all || []);
        if (res.data.data.stats) {
          setStats(res.data.data.stats);
        }
      }
    } catch (error) {
      console.error("Failed to load event history:", error);
      toast.error("Failed to load event history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getFilteredItems = () => {
    let list: HistoryItem[] = [];
    if (activeTab === "performed") list = performed;
    else if (activeTab === "missed") list = missed;
    else list = all;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(
      (item) =>
        item.eventName?.toLowerCase().includes(q) ||
        item.organizerName?.toLowerCase().includes(q) ||
        item.city?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
    );
  };

  const filteredItems = getFilteredItems();

  const tabs = [
    {
      key: "all" as const,
      label: "All Past Events",
      icon: <History size={14} />,
      count: all.length,
    },
    {
      key: "performed" as const,
      label: "Shows Performed",
      icon: <CheckCircle2 size={14} className="text-emerald-600" />,
      count: performed.length,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      key: "missed" as const,
      label: "Missed & Expired",
      icon: <Hourglass size={14} className="text-amber-600" />,
      count: missed.length,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      <ToastContainer />

      {/* Top Banner Navigation */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/artist/bookings"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Active Bookings
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/artist/home"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        {/* Title Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 bg-neutral-200/60 text-neutral-700 border border-neutral-300">
            <Sparkles size={12} className="text-neutral-600" />
            Performance & Request Archive
          </div>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-neutral-950">
            Event <span className="font-serif italic font-normal text-neutral-650">History</span>
          </h1>
          <p className="text-neutral-600 text-sm mt-1 max-w-2xl">
            Keep track of all events you have performed, alongside offers that were missed or passed their acceptance deadline.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Stat 1: Performed */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Shows Performed</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div className="text-3xl font-semibold text-neutral-950">{stats.totalPerformed}</div>
            <p className="text-xs text-neutral-500 mt-1">Successfully completed gigs</p>
          </div>

          {/* Stat 2: Missed */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Missed / Expired</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Hourglass size={16} />
              </div>
            </div>
            <div className="text-3xl font-semibold text-neutral-950">{stats.totalMissed}</div>
            <p className="text-xs text-neutral-500 mt-1">Unaccepted or past deadline</p>
          </div>

          {/* Stat 3: Total Historical Earnings */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Earned from Shows</span>
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
                <IndianRupee size={16} />
              </div>
            </div>
            <div className="text-3xl font-semibold text-neutral-950">
              ₹{stats.totalEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-neutral-500 mt-1">Total revenue from past gigs</p>
          </div>

          {/* Stat 4: Acceptance Rate */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Performance Rate</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
            </div>
            <div className="text-3xl font-semibold text-neutral-950">{stats.acceptanceRate}%</div>
            <p className="text-xs text-neutral-500 mt-1">Ratio of performed vs missed</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 p-1 bg-white border border-neutral-200 rounded-xl shadow-xs">
            {tabs.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-neutral-900 text-white shadow-xs"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                      active
                        ? "bg-neutral-800 text-white"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Filter by event, city, organizer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 shadow-xs"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-neutral-200 rounded-2xl">
            <Loader2 size={32} className="animate-spin text-neutral-700" />
            <span className="text-neutral-500 text-sm">Loading event history...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 px-6 bg-white border border-neutral-200 rounded-2xl shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-500 flex items-center justify-center mx-auto mb-4">
              <History size={24} />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              No historical events found
            </h3>
            <p className="text-neutral-500 text-sm max-w-md mx-auto">
              {searchQuery
                ? `No event records match "${searchQuery}". Try clearing your search.`
                : activeTab === "performed"
                ? "You haven't completed any events yet. Once confirmed events pass their date, they will automatically appear here."
                : activeTab === "missed"
                ? "No missed or expired requests on record. All your requests were handled on time!"
                : "Your past event history is empty. Once bookings pass their event date or deadline, they are archived here."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-800 transition-colors"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}

        {/* History Cards Grid */}
        {!loading && filteredItems.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredItems.map((item) => {
              const isPerformed = item.historyType === "PERFORMED";

              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="bg-white border border-neutral-200 hover:border-neutral-400 rounded-xl p-6 shadow-xs transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Card Top: Event Name & Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-semibold text-neutral-900 text-base leading-snug">
                          {item.eventName}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                          <User size={12} className="text-neutral-400" />
                          <span>Organizer: {item.organizerName}</span>
                        </div>
                      </div>

                      {/* History Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 border ${
                          isPerformed
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : item.status === "CANCELLED" || item.status === "REJECTED"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {isPerformed ? (
                          <CheckCircle2 size={12} />
                        ) : item.status === "CANCELLED" || item.status === "REJECTED" ? (
                          <XCircle size={12} />
                        ) : (
                          <Hourglass size={12} />
                        )}
                        {item.historyBadge}
                      </span>
                    </div>

                    {/* Category Tag */}
                    {item.category && (
                      <div className="mb-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                          {item.category}
                        </span>
                      </div>
                    )}

                    {/* Details List */}
                    <div className="space-y-2 text-xs text-neutral-600 mb-4 border-t border-neutral-100 pt-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-neutral-400" />
                        <span>Event Date: <strong>{item.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 size={13} className="text-neutral-400" />
                        <span>Event Time: {item.time || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-neutral-400" />
                        <span>Location: {item.city}</span>
                      </div>

                      {/* Expiry Date Info if present */}
                      {item.expiryDate && (
                        <div className="flex items-center gap-2 text-neutral-500">
                          <Hourglass size={13} className="text-neutral-400" />
                          <span>Acceptance Deadline: {item.expiryDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom: Price & Explanation Box */}
                  <div>
                    <div className="flex items-center justify-between text-sm pt-3 border-t border-neutral-100 mb-3">
                      <span className="text-neutral-500 text-xs">
                        {isPerformed ? "Fee Earned" : "Offer Price"}
                      </span>
                      <span className="font-semibold text-neutral-900 text-base flex items-center">
                        <IndianRupee size={14} className="text-neutral-600" />
                        {item.price?.toLocaleString() || "0"}
                      </span>
                    </div>

                    {/* Explanatory Banner */}
                    <div
                      className={`p-2.5 rounded-lg text-xs leading-relaxed border ${
                        isPerformed
                          ? "bg-emerald-50/60 border-emerald-100 text-emerald-800"
                          : "bg-amber-50/60 border-amber-100 text-amber-800"
                      }`}
                    >
                      {item.historyDescription}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>
    </div>
  );
}
