/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, Calendar, Clock, DollarSign, MapPin, Tag, 
  Sparkles, User, ArrowRight, ChevronDown, ChevronUp 
} from "lucide-react";
import Link from "next/link";

// Request Type
type Request = {
  id: string;
  name: string;
  email: string;
  city: string;
  category: string;
  maxBudget: number;
  date: string;
  timing: string;
  status: string;
};

type RecommendedArtist = {
  id: string;
  name: string;
  city: string;
  category: string[];
  price: number;
  bio: string;
  bestEvent: string;
  matchPercentage: number;
  tags: string[];
};

const OrganizerSentRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);

  // Recommendations state
  const [openRecsRequestId, setOpenRecsRequestId] = useState<string | null>(null);
  const [recommendedArtists, setRecommendedArtists] = useState<RecommendedArtist[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await api.get("/organizer/getAllRequests");
        setRequests(res.data.data);
      } catch (error) {
        console.error("Failed to fetch organizer requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const toggleRecommendations = async (requestId: string) => {
    if (openRecsRequestId === requestId) {
      setOpenRecsRequestId(null);
      return;
    }
    setOpenRecsRequestId(requestId);
    setRecsLoading(true);
    setRecommendedArtists([]);
    try {
      const res = await api.get(`/organizer/recommendArtists?requestId=${requestId}`);
      setRecommendedArtists(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch recommended artists:", error);
    } finally {
      setRecsLoading(false);
    }
  };

  const pendingRequests = requests.filter((req) => req.status === "PENDING");
  const matchedRequests = requests.filter((req) => req.status === "MATCHED");

  const renderRequestCard = (req: Request) => {
    const isRecsOpen = openRecsRequestId === req.id;
    return (
      <div key={req.id} className="flex flex-col gap-3">
        <motion.div
          className="bg-white border border-neutral-200 p-6 rounded-lg shadow-xs hover:border-neutral-900 transition-all duration-200 flex flex-col justify-between"
          whileHover={{ y: -2 }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-neutral-900 leading-tight">{req.name}</h3>
              <span className={req.status === "PENDING" ? "badge-pending" : "badge-matched"}>
                {req.status}
              </span>
            </div>

            <div className="space-y-2 text-xs text-neutral-500 font-sans">
              <div className="flex items-center gap-1.5">
                <Tag size={13} className="text-neutral-400" />
                <span>Category: {req.category}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-neutral-400" />
                <span>City: {req.city}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-neutral-400" />
                <span>Date: {req.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-neutral-400" />
                <span>Time: {req.timing}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-neutral-800">
                <DollarSign size={13} className="text-neutral-400" />
                <span>Budget: ₹{req.maxBudget.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-neutral-100 pt-3 mt-4 flex items-center justify-between text-[11px] text-neutral-400 font-sans">
            <span>Organizer: {req.email}</span>
            {req.status === "PENDING" && (
              <button
                onClick={() => toggleRecommendations(req.id)}
                className="flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                <Sparkles size={12} className="text-yellow-600 animate-pulse" />
                {isRecsOpen ? "Hide Artists" : "Find Artists"}
                {isRecsOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
        </motion.div>

        {/* Expandable recommendations drawer */}
        <AnimatePresence>
          {isRecsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 -mt-1 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-neutral-900" />
                  Recommended Talents for this Gig
                </h4>
                <span className="text-[10px] text-neutral-400">Powered by Matching Engine</span>
              </div>

              {recsLoading ? (
                <div className="flex items-center justify-center py-6 gap-2 text-xs text-neutral-500">
                  <Loader2 size={14} className="animate-spin text-neutral-900" />
                  Analyzing database profiles...
                </div>
              ) : recommendedArtists.length === 0 ? (
                <p className="text-xs text-neutral-500 py-3">No matching artists found in the platform database for this category yet.</p>
              ) : (
                <div className="space-y-3.5">
                  {recommendedArtists.map((artist) => (
                    <div 
                      key={artist.id} 
                      className="bg-white border border-neutral-200 rounded-md p-3 hover:border-neutral-900 transition-colors duration-200 flex flex-col md:flex-row justify-between gap-3 items-start md:items-center"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-neutral-900">{artist.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-900 text-white">
                            {artist.matchPercentage}% Match
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 line-clamp-1">{artist.bio || "No biography provided."}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {artist.tags.map((tag, i) => (
                            <span 
                              key={i} 
                              className="text-[9px] font-medium px-2 py-0.5 rounded-md border"
                              style={{ 
                                background: tag.includes("💰") ? "#FDF8F2" : tag.includes("📍") ? "#F3F4F6" : "#ECFDF5",
                                borderColor: tag.includes("💰") ? "#FBE6D2" : tag.includes("📍") ? "#E5E7EB" : "#A7F3D0",
                                color: tag.includes("💰") ? "#B45309" : tag.includes("📍") ? "#4B5563" : "#047857"
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-between flex-shrink-0">
                        <div className="text-right">
                          <p className="text-[10px] text-neutral-400">Starting Price</p>
                          <p className="text-xs font-bold text-neutral-950">₹{artist.price.toLocaleString()}</p>
                        </div>
                        <Link href={`/organizer/artist-profile/${artist.id}`}>
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-neutral-950 hover:bg-neutral-850 text-white text-xs font-medium transition-all">
                            View Profile
                            <ArrowRight size={11} />
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 px-6 py-12">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-heading font-medium text-center text-neutral-950 mb-12">
          Your Sent Requests
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-900" />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Pending Requests */}
            <section>
              <h2 className="text-xl font-heading font-medium text-neutral-900 mb-6 pb-2 border-b border-neutral-200">
                Pending Requests
              </h2>
              {pendingRequests.length === 0 ? (
                <p className="text-sm text-neutral-450 font-sans">No pending requests found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingRequests.map(renderRequestCard)}
                </div>
              )}
            </section>

            {/* Matched Requests */}
            <section>
              <h2 className="text-xl font-heading font-medium text-neutral-900 mb-6 pb-2 border-b border-neutral-200">
                Matched Requests
              </h2>
              {matchedRequests.length === 0 ? (
                <p className="text-sm text-neutral-450 font-sans">No matched requests yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedRequests.map(renderRequestCard)}
                </div>
              )}
            </section>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OrganizerSentRequests;
