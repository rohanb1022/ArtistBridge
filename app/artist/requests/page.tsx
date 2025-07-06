"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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

const OrganizerRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/artist/getRequest");
      const data = res.data?.data;
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch requests", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: number) => {
    try {
      await api.put(`/organizer/acceptRequest`, {
        requestId,
        updatedStatus: "MATCHED",
      });
      fetchRequests();
    } catch (error) {
      console.error("Failed to update request", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-black text-white">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl text-center font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-10">
          Organizer Requests
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <motion.div
              key={req.id}
              whileHover={{ scale: 1.03 }}
              className={`p-6 rounded-2xl shadow-xl backdrop-blur-md bg-white/10 border transition-all duration-300 ${
                req.status === "MATCHED"
                  ? "border-green-400 hover:shadow-green-500/40"
                  : "border-pink-400 hover:shadow-pink-500/40"
              }`}
            >
              <h3 className="text-2xl font-semibold mb-2 text-white">{req.name}</h3>
              <p className="text-sm text-gray-300 mb-1">Email: {req.email}</p>
              <p className="text-sm text-gray-300 mb-1">City: {req.city}</p>

              <div className="my-2">
                <p className="text-sm font-medium text-white mb-1">Category:</p>
                <span className="inline-block px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400 text-pink-300 text-sm font-semibold">
                  {req.category}
                </span>
              </div>

              <p className="text-sm text-gray-300 mt-3">Date: {req.date}</p>
              <p className="text-sm text-gray-300">Timing: {req.timing}</p>
              <p className="text-sm text-gray-300">Budget: ₹{req.maxBudget}</p>

              <p
                className={`text-sm mt-3 font-semibold ${
                  req.status === "MATCHED" ? "text-green-400" : "text-pink-400"
                }`}
              >
                Status: {req.status}
              </p>

              {req.status === "PENDING" && (
                <Button
                  className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-xl"
                  onClick={() => handleAccept(req.id)}
                >
                  Accept
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {!loading && requests.length === 0 && (
          <p className="text-center text-gray-500 mt-12">No requests found.</p>
        )}
      </motion.div>
    </div>
  );
};

export default OrganizerRequests;
