/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-white text-black px-6 py-10">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-10">
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
              <h2 className="text-xl font-semibold text-pink-500 mb-4">Pending Requests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingRequests.length === 0 ? (
                  <p className="text-gray-500">No pending requests.</p>
                ) : (
                  pendingRequests.map((req) => (
                    <motion.div
                      key={req.id}
                      className="bg-pink-100/40 border border-pink-400/50 p-4 rounded-lg shadow-lg backdrop-blur-md"
                      whileHover={{ scale: 1.02 }}
                    >
                      <h3 className="text-lg font-semibold">{req.name}</h3>
                      <p className="text-sm">Email: {req.email}</p>
                      <p className="text-sm">City: {req.city}</p>
                      <p className="text-sm">Category: {req.category}</p>
                      <p className="text-sm">Date: {req.date}</p>
                      <p className="text-sm">Timing: {req.timing}</p>
                      <p className="text-sm">Budget: ₹{req.maxBudget}</p>
                      <p className="text-sm font-medium mt-2 text-pink-600">Status: {req.status}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </section>

            {/* Matched (Confirmed) Requests */}
            <section>
              <h2 className="text-xl font-semibold text-green-500 mb-4">Matched Requests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedRequests.length === 0 ? (
                  <p className="text-gray-500">No matched requests yet.</p>
                ) : (
                  matchedRequests.map((req) => (
                    <motion.div
                      key={req.id}
                      className="bg-green-100/40 border border-green-400/50 p-4 rounded-lg shadow-lg backdrop-blur-md"
                      whileHover={{ scale: 1.02 }}
                    >
                      <h3 className="text-lg font-semibold">{req.name}</h3>
                      <p className="text-sm">Email: {req.email}</p>
                      <p className="text-sm">City: {req.city}</p>
                      <p className="text-sm">Category: {req.category}</p>
                      <p className="text-sm">Date: {req.date}</p>
                      <p className="text-sm">Timing: {req.timing}</p>
                      <p className="text-sm">Budget: ₹{req.maxBudget}</p>
                      <p className="text-sm font-medium mt-2 text-green-600">Status: {req.status}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default OrganizerSentRequests;
