"use client";

import api from '@/lib/axios'
import {useState , useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from "framer-motion";

type Booking = {
  id: string | number;
  eventName: string;
  date: string;
  status: string;
  city: string;
  orgName: string;
};

type BookingsState = {
  pending: Booking[];
  confirmed: Booking[];
  cancelled: Booking[];
};

const Bookings = () => {
  const [bookings , setBookings] = useState<BookingsState>({
    pending : [],
    confirmed : [],
    cancelled : []
  })

  const handleAccept = async (bookingId: string | number) => {
    try {
      const response = await api.put("/booking/bookingAccept", { 
        requestId: bookingId,
        updatedStatus: "CONFIRMED"
       });
      console.log(response.data.message);
      // Optionally, update the state to reflect the change
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  const handleReject = async (bookingId: string | number) => {
    try {
      const response = await api.put("/booking/bookingRejection", {
        requestId : bookingId,
        updatedStatus: "CANCELLED"
      });
      console.log(response.data);
      // Optionally, update the state to reflect the change
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/artist/getAllBookings")
        console.log(response.data)
        setBookings(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchBookings()
  } , [] )


// Animation variants
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
    <main className="p-6 space-y-12">
  {/* Confirmed Bookings */}
  <motion.section
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <h2 className="text-2xl font-bold mb-4 text-green-700">Confirmed Bookings</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.confirmed.map((booking) => (
        <motion.div
          key={booking.id}
          variants={cardVariants}
          whileHover={{ scale: 1.03 }}
          className="backdrop-blur-md bg-green-100/30 border border-green-400/40 rounded-2xl shadow-xl p-5 text-green-900 transition-all duration-300"
        >
            <h3 className="text-lg font-semibold">{booking.orgName}</h3>
          <h4 className="text-lg font-bold">{booking.eventName}</h4>
          <p className="text-sm">{booking.date}</p>
          <p className="font-medium mt-2">Status: {booking.status}</p>
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
    <h2 className="text-2xl font-bold mb-4 text-gray-700">Pending Requests</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.pending.map((booking) => (
        <motion.div
          key={booking.id}
          variants={cardVariants}
          whileHover={{ scale: 1.03 }}
          className="backdrop-blur-md bg-gray-100/60 border border-gray-400/40 rounded-2xl shadow-lg p-5 text-gray-800"
        >
          <div className="flex flex-col gap-1">
            
            <h3 className="text-lg font-semibold">{booking.orgName}</h3>
            <h4 className="text-lg font-semibold">{booking.eventName}</h4>
            <p className="text-sm">{booking.date}</p>
            <p className="text-sm">Status: {booking.status}</p>
            <p className="text-sm">City: {booking.city}</p>
          </div>
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
  </motion.section>

  {/* Rejected Bookings */}
  <motion.section
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <h2 className="text-2xl font-bold mb-4 text-red-700">Rejected Bookings</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.cancelled.map((booking) => (
        <motion.div
          key={booking.id}
          variants={cardVariants}
          whileHover={{ scale: 1.03 }}
          className="backdrop-blur-md bg-red-100/30 border border-red-400/40 rounded-2xl shadow-xl p-5 text-red-900 transition-all duration-300"
        >
          <h3 className="text-lg font-semibold">{booking.orgName}</h3>
          <h4 className="text-lg font-bold">{booking.eventName}</h4>
          <p className="text-sm">{booking.date}</p>
          <p className="font-medium mt-2">Status: {booking.status}</p>
        </motion.div>
      ))}
    </div>
  </motion.section>
</main>


  )
}

export default Bookings
