"use client";

import api from '@/lib/axios';
import { useState, useEffect, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";
import { ToastContainer, toast, Bounce } from 'react-toastify';

type Booking = {
  [x: string]: ReactNode;
  id: string | number;
  eventName: string;
  date: string;
  status: string;
  city: string;
  orgName: string;
  time: string;
  organizerName: string
};

type BookingsState = {
  pending: Booking[];
  confirmed: Booking[];
  cancelled: Booking[];
};

const Bookings = () => {
  const [bookings, setBookings] = useState<BookingsState>({
    pending: [],
    confirmed: [],
    cancelled: [],
  });

  const handleAccept = async (bookingId: string | number) => {
    try {
      const response = await api.put("/booking/bookingAccept", {
        requestId: bookingId,
        updatedStatus: "CONFIRMED",
      });
      console.log(response.data.message);
      fetchBookings(); // Refresh bookings after acceptance
      toast.success("Booking accepted successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      // Optionally, update the state
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
      fetchBookings(); // Refresh bookings after rejection
      toast.success(" ❌ Booking Rejected successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      // Optionally, update the state
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get("/artist/getAllBookings");
      console.log(response.data);
      setBookings(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
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
    <main className="p-6 min-h-screen bg-black text-white space-y-16">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnHover
        draggable
        theme="dark"
        transition={Bounce}
      />
      {/* Confirmed Bookings */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-bold mb-6 text-green-400">Confirmed Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.confirmed.map((booking) => (
            <motion.div
              key={booking.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              className="bg-white/10 backdrop-blur-lg border border-green-400/40 rounded-2xl shadow-sm p-6 text-green-200 hover:shadow-green-600/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold">{booking.organizerName}</h3>
              <h4 className="text-xl font-bold">Event Name : {booking.eventName}</h4>
              <p className="text-sm">City : {booking.city}</p>
              <p className="text-sm mt-1">{booking.date}</p>
              <p className="text-sm mt-1">Time: {booking.time}</p>
              <p className="mt-2 font-medium">Status: {booking.status}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Pending Bookings */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-300">Pending Requests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.pending.map((booking) => (
            <motion.div
              key={booking.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              className="bg-white/10 backdrop-blur-lg border border-gray-400/30 rounded-2xl shadow-sm p-6 text-gray-200 hover:shadow-gray-500/50 transition-all duration-300"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">{booking.organizerName}</h3>
              <h4 className="text-xl font-bold">Event Name : {booking.eventName}</h4>
              <p className="text-sm">City : {booking.city}</p>
              <p className="text-sm mt-1">{booking.date}</p>
              <p className="text-sm mt-1">Time: {booking.time}</p>
              <p className="mt-2 font-medium">Status: {booking.status}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
                  onClick={() => handleAccept(booking.id)}
                >
                  Accept
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
                  onClick={() => handleReject(booking.id)}
                >
                  Reject
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Cancelled Bookings */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-bold mb-6 text-red-400">Rejected Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.cancelled.map((booking) => (
            <motion.div
              key={booking.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              className="bg-white/10 backdrop-blur-lg border border-red-400/40 rounded-2xl shadow-sm p-6 text-red-200 hover:shadow-red-500/50 transition-all duration-300"
            >
             <h3 className="text-lg font-semibold">{booking.organizerName}</h3>
              <h4 className="text-xl font-bold">Event Name : {booking.eventName}</h4>
              <p className="text-sm">City : {booking.city}</p>
              <p className="text-sm mt-1">{booking.date}</p>
              <p className="text-sm mt-1">Time: {booking.time}</p>
              <p className="mt-2 font-medium">Status: {booking.status}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
};

export default Bookings;
