"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, IndianRupee, Clock, Tag, CheckCircle, Loader2, Inbox } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

type Request = {
  id: number | string;
  name: string;
  email: string;
  city: string;
  category: string;
  maxBudget: number;
  date: string;
  timing: string;
  status: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const OrganizerRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [accepting, setAccepting] = useState<string | number | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/artist/getRequest");
      const data = res.data?.data;
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch requests", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: number | string) => {
    setAccepting(requestId);
    try {
      await api.put("/artist/acceptRequest", { requestId, updatedStatus: "MATCHED" });
      toast.success("Request accepted! Booking created.", { theme: "dark", position: "top-center" });
      fetchRequests();
    } catch {
      toast.error("Failed to accept request", { theme: "dark" });
    } finally {
      setAccepting(null);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#FFFFFF" }}>
      <ToastContainer />

      <div className="ambient-blob w-[600px] h-[600px] top-[-100px] right-[-150px]"
        style={{ background: "none" }} />
      <div className="ambient-blob w-[500px] h-[500px] bottom-0 left-[-100px]"
        style={{ background: "none", animationDelay: "4s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 uppercase tracking-widest"
            style={{ background: "#F8F8F8", border: "1px solid #E5E5E5", color: "#666666" }}>
            <Inbox size={12} />
            Open Requests
          </div>
          <h1 className="text-4xl font-medium text-neutral-900" style={{ fontFamily: "var(--font-heading)" }}>Organizer Requests</h1>
          <p className="text-neutral-550 mt-2">Browse and accept open event requests from organizers that match your profile.</p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3">
            <Loader2 size={28} className="animate-spin text-neutral-800" />
            <span className="text-neutral-550">Fetching requests...</span>
          </div>
        )}

        {/* Empty */}
        {!loading && requests.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "#F8F8F8", border: "1px solid #E5E5E5" }}>
              <Inbox size={24} className="text-neutral-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2" style={{ fontFamily: "var(--font-heading)" }}>No Open Requests</h3>
            <p className="text-neutral-500 text-sm">When organizers post requests matching your category, they will appear here.</p>
          </motion.div>
        )}

        {/* Request Grid */}
        {!loading && requests.length > 0 && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {requests.map((req) => {
              const isMatched = req.status === "MATCHED";
              const accentColor = isMatched ? "#16A34A" : "#666666";
              const accentBorder = isMatched ? "#DCFCE7" : "#E5E5E5";

              return (
                <motion.div key={String(req.id)} variants={itemVariants}>
                  <div className="glass-card p-6 h-full flex flex-col bg-white border border-neutral-200 rounded-xl"
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = isMatched ? "#16A34A" : "#111111";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#E5E5E5";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                    style={{ transition: "all 0.2s ease" }}>

                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: "var(--font-heading)" }}>{req.name}</h3>
                        <p className="text-xs text-neutral-500 mt-0.5">{req.email}</p>
                      </div>
                      <span className={isMatched ? "badge-confirmed" : "badge-matched"} style={isMatched ? { color: "#16A34A" } : {}}>
                        {req.status}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-sm text-neutral-550 flex-1">
                      <div className="flex items-center gap-2.5">
                        <Tag size={14} style={{ color: accentColor }} />
                        <span>{req.category}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <MapPin size={14} style={{ color: accentColor }} />
                        <span>{req.city}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Calendar size={14} style={{ color: accentColor }} />
                        <span>{req.date}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock size={14} style={{ color: accentColor }} />
                        <span>{req.timing}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <IndianRupee size={14} style={{ color: "#D97706" }} />
                        <span className="font-semibold" style={{ color: "#D97706" }}>
                          {req.maxBudget.toLocaleString()} max budget
                        </span>
                      </div>
                    </div>

                    {!isMatched && (
                      <button
                        onClick={() => handleAccept(req.id)}
                        disabled={accepting === req.id}
                        className="mt-5 w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                        style={{ background: "#111111", color: "#FFFFFF", border: "1px solid #111111" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#222222")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#111111")}
                      >
                        {accepting === req.id ? (
                          <><Loader2 size={16} className="animate-spin" /> Accepting...</>
                        ) : (
                          <><CheckCircle size={16} /> Accept Request</>
                        )}
                      </button>
                    )}

                    {isMatched && (
                      <div className="mt-5 w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                        style={{ background: "#F0FDF4", color: "#16A34A", border: "1px solid #DCFCE7" }}>
                        <CheckCircle size={16} />
                        Request Accepted
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrganizerRequests;
