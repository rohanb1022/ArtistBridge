/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { Loader2, Calendar, Clock, DollarSign, MapPin, Tag } from "lucide-react";

// Request Type
type Request = {
  id: number;
  name: string;
  email: string;
  city: string;
  category: string;
  maxBudget: number;
  date: string;
  timing: string;
  status: string;
};

const OrganizerSentRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);

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

  const pendingRequests = requests.filter((req) => req.status === "PENDING");
  const matchedRequests = requests.filter((req) => req.status === "MATCHED");

  const renderRequestCard = (req: Request) => (
    <motion.div
      key={req.id}
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
      
      <div className="border-t border-neutral-100 pt-3 mt-4 text-[11px] text-neutral-400 font-sans">
        Organizer: {req.email}
      </div>
    </motion.div>
  );

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
