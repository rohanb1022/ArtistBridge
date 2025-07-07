/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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

  const renderRequestCard = (req: Request, color: string) => (
    <motion.div
      key={req.id}
      className={`bg-gradient-to-br from-${color}-100/30 to-${color}-200/40 border border-${color}-400/50 p-5 rounded-xl shadow-lg backdrop-blur-md`}
      whileHover={{ scale: 1.03 }}
    >
      <h3 className="text-lg font-bold text-white mb-1">{req.name}</h3>
      <p className="text-sm text-gray-300">Email: {req.email}</p>
      <p className="text-sm text-gray-300">City: {req.city}</p>
      <p className="text-sm text-gray-300">Category: {req.category}</p>
      <p className="text-sm text-gray-300">Date: {req.date}</p>
      <p className="text-sm text-gray-300">Timing: {req.timing}</p>
      <p className="text-sm text-gray-300">Budget: ₹{req.maxBudget}</p>
      <p className={`text-sm font-semibold mt-2 text-${color}-500`}>Status: {req.status}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white px-6 py-10">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-center text-pink-500 mb-10">
          Your Sent Requests
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          </div>
        ) : (
          <>
            {/* Pending Requests */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-pink-400 mb-4 border-b border-pink-500 pb-2">
                Pending Requests
              </h2>
              {pendingRequests.length === 0 ? (
                <p className="text-gray-400">No pending requests.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingRequests.map((req) => renderRequestCard(req, "pink"))}
                </div>
              )}
            </section>

            {/* Matched Requests */}
            <section>
              <h2 className="text-2xl font-semibold text-green-400 mb-4 border-b border-green-500 pb-2">
                Matched Requests
              </h2>
              {matchedRequests.length === 0 ? (
                <p className="text-gray-400">No matched requests yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedRequests.map((req) => renderRequestCard(req, "green"))}
                </div>
              )}
            </section>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default OrganizerSentRequests;
