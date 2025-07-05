/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import api from '@/lib/axios';
import { useState } from 'react';
import { motion } from 'framer-motion';

const RequestForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    category: "",
    maxBudget: "",
    date: "",
    timing: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/organizer/sendRequest", {
        ...form,
        maxBudget: parseInt(form.maxBudget),
      });
      setMessage("Request sent successfully!");
      setForm({
        name: "",
        email: "",
        city: "",
        category: "",
        maxBudget: "",
        date: "",
        timing: "",
      });
    } catch (error) {
      console.error("Failed to send request:", error);
      setMessage("Failed to send request. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white text-black">
      <motion.div
        className="max-w-2xl mx-auto bg-pink-100/20 border border-pink-400 p-6 rounded-xl shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl text-center font-bold text-pink-600 mb-6">
          Send a Request to Artist
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(form).map(([key, value]) => (
            <div key={key}>
              <label className="block mb-1 font-medium capitalize">
                {key === "maxBudget" ? "Max Budget (₹)" : key}
              </label>
              <input
                type={key === "date" ? "date" : key === "maxBudget" ? "number" : "text"}
                value={value}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-md transition"
          >
            {loading ? "Sending..." : "Send Request"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-pink-700 font-medium">
            {message}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default RequestForm;
