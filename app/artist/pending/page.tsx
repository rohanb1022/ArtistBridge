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
    <main className="p-6 min-h-screen bg-white text-neutral-900 space-y-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-heading font-medium text-neutral-950">Pending Bookings</h1>
        {loading && <Loader2 className="animate-spin mx-auto mt-4 text-neutral-500 h-5 w-5" />}
      </div>
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {pendingBookings.length === 0 ? (
          <p className="text-neutral-450 italic text-sm text-center">No pending requests.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
            {pendingBookings.map((booking) => (
              <motion.div
                key={booking.id}
                variants={cardVariants}
                whileHover={{ y: -2 }}
                className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-neutral-900 leading-tight">{booking.orgName}</h3>
                    <span className="badge-pending">
                      {booking.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">{booking.eventName}</h4>
                  <p className="text-xs text-neutral-500 mb-1">Date: {booking.date}</p>
                  <p className="text-xs text-neutral-500">City: {booking.city}</p>
                </div>
                
                <div className="flex gap-2 mt-6">
                  <Button
                    className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium py-2 rounded-md shadow-xs transition"
                    onClick={() => handleAccept(booking.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border border-neutral-200 hover:bg-neutral-50 hover:text-red-650 text-neutral-700 text-xs font-medium py-2 rounded-md transition"
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
