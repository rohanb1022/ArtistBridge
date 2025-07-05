"use client";

import api from '@/lib/axios';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type Booking = {
  id: string | number;
  eventName: string;
  date: string;
  status: string;
  city: string;
  orgName: string;
};

const Bookings = () => {
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAccept = async (bookingId: string | number) => {
    try {
      const response = await api.put("/booking/bookingAccept", {
        requestId: bookingId,
        updatedStatus: "CONFIRMED",
      });
      console.log(response.data.message);
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  const handleReject = async (bookingId: string | number) => {
    try {
      const response = await api.put("/booking/bookingRejection", {
        requestId: bookingId,
        updatedStatus: "CANCELLED",
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await api.get("/artist/getAllBookings");
        setPendingBookings(response.data.data.pending);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  return (
    <main className="p-6 min-h-screen bg-black text-white space-y-12">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-pink-500">Pending Bookings</h1>
        {loading && <Loader2 className="animate-spin mx-auto mt-4 text-pink-400 h-6 w-6" />}
      </div>
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {pendingBookings.length === 0 ? (
          <p className="text-gray-400 italic text-sm mb-6 text-center">No pending requests.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingBookings.map((booking) => (
              <motion.div
                key={booking.id}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-gray-800/20 text-white border border-gray-500/30 rounded-2xl shadow-xl p-5 backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold">{booking.orgName}</h3>
                <h4 className="text-lg font-bold">{booking.eventName}</h4>
                <p className="text-sm">{booking.date}</p>
                <p className="text-sm">City: {booking.city}</p>
                <p className="text-sm mt-1">Status: {booking.status}</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow transition"
                    onClick={() => handleAccept(booking.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow transition"
                    onClick={() => handleReject(booking.id)}
                  >
                    Reject
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </main>
  );
};

export default Bookings;
