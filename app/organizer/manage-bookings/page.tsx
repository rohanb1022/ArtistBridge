"use client";

import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import React, { useEffect, useState } from 'react';

type Booking = {
  id: string;
  artist: { name: string };
  date: string;
  status: string;
  artistName: string;
  eventName: string;
};

type BookingsState = {
  pending: Booking[];
  confirmed: Booking[];
  cancelled: Booking[];
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState<BookingsState>({
    pending: [],
    confirmed: [],
    cancelled: [],
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/organizer/getAllBookings');
        console.log(response.data);
        setBookings(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBookings();
  }, []);

  const handleDeleteBooking = (bookingId: string) => async () => {
    try {
      const response = await api.put('/booking/bookingRejection' , { 
        requestId: bookingId,
        updatedStatus: 'CANCELLED'
       });
      console.log(response.data.message);
      // Optionally, update the state to remove the deleted booking
      setBookings((prev) => ({
        ...prev,
        confirmed: prev.confirmed.filter((booking) => booking.id !== bookingId),
      }));
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  return (
    <main className="p-6 space-y-10">
      {/* Pending Bookings */}
      <section>
        <h2 className="text-2xl font-bold text-gray-400 mb-4">Pending Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.pending.map((booking) => (
            <div
              key={booking.id}
              className="backdrop-blur-sm border border-gray-400/40 rounded-2xl shadow-md p-4 text-gray-400"
            >
              <p className="text-sm">Event Name: <span className="font-medium">{booking.eventName}</span></p>
              <p className="text-sm">Artist: <span className="font-semibold">{booking.artistName}</span></p>
              <p className="text-sm">Date: {booking.date}</p>
              <p className="text-sm font-semibold mt-2">Status: {booking.status}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Confirmed Bookings */}
      <section>
        <h2 className="text-2xl font-bold text-green-700 mb-4">Confirmed Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.confirmed.map((booking) => (
            <div
              key={booking.id}
              className="backdrop-blur-sm border border-green-400/40 rounded-2xl shadow-lg p-4 text-green-700"
            >
              <p className="text-sm">Event Name: <span className="font-medium">{booking.eventName}</span></p>
              <p className="text-sm">Artist: <span className="font-semibold">{booking.artistName}</span></p>
              <p className="text-sm">Date: {booking.date}</p>
              <p className="text-sm font-semibold mt-2">Status: {booking.status}</p>
              <Button 
                className='w-fit my-2 p-2' 
                onClick={handleDeleteBooking(booking.id)}
                >
                Delete Booking
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Cancelled Bookings */}
      <section>
        <h2 className="text-2xl font-bold text-red-700 mb-4">Cancelled Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.cancelled.map((booking) => (
            <div
              key={booking.id}
              className="backdrop-blur-sm border border-red-400/40 rounded-2xl shadow-lg p-4 text-red-900"
            >
              <p className="text-sm">Event Name: <span className="font-medium">{booking.eventName}</span></p>
              <p className="text-sm">Artist: <span className="font-semibold">{booking.artistName}</span></p>
              <p className="text-sm">Date: {booking.date}</p>
              <p className="text-sm font-semibold mt-2">Status: {booking.status}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ManageBookings;
