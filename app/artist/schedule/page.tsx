"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  User,
  ArrowLeft,
  Loader2,
  Ticket
} from "lucide-react";
import Link from "next/link";

type Booking = {
  id: string | number;
  eventName: string;
  date: string;
  status: string;
  city: string;
  time: string;
  organizerName: string;
  price: number;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ArtistSchedulePage() {
  const router = useRouter();
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed

  // State to track date clicked in calendar (defaults to today's date string YYYY-MM-DD)
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/artist/getAllBookings");
      // We only care about confirmed bookings for the schedule
      setConfirmedBookings(response.data.data.confirmed || []);
    } catch (err) {
      console.error("Failed to load bookings for schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDateStr(todayStr);
  };

  // Helper to format date parts to YYYY-MM-DD
  const makeDateString = (day: number) => {
    const y = currentYear;
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Filter bookings
  const todayBookings = confirmedBookings.filter((b) => b.date === todayStr);
  const selectedDateBookings = confirmedBookings.filter((b) => b.date === selectedDateStr);

  // Render the empty padding cells and day cells
  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-10 md:h-12" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDateStr = makeDateString(day);
    const hasBooking = confirmedBookings.some((b) => b.date === cellDateStr);
    const isSelected = selectedDateStr === cellDateStr;
    const isToday = todayStr === cellDateStr;

    calendarCells.push(
      <button
        key={`day-${day}`}
        onClick={() => setSelectedDateStr(cellDateStr)}
        className={`h-10 md:h-12 rounded-lg flex flex-col items-center justify-center relative transition-all text-xs font-medium border ${
          isSelected
            ? "bg-neutral-900 border-neutral-900 text-white shadow-xs"
            : isToday
            ? "border-neutral-900 text-neutral-900 bg-neutral-50"
            : "border-transparent hover:bg-neutral-50 text-neutral-800"
        }`}
      >
        <span>{day}</span>
        {hasBooking && (
          <span
            className={`w-1.5 h-1.5 rounded-full absolute bottom-1.5 ${
              isSelected ? "bg-white" : "bg-neutral-900"
            }`}
          />
        )}
      </button>
    );
  }

  return (
    <main className="min-h-screen bg-white text-neutral-900 relative font-sans">
      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-neutral-200">
        <Link
          href="/artist/home"
          className="flex items-center gap-1.5 text-neutral-550 hover:text-neutral-900 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-lg font-medium tracking-tight">
            Artist<span className="font-serif italic font-normal text-neutral-600">Bridge</span>
          </span>
        </div>
      </nav>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 border border-neutral-200 bg-neutral-50 text-neutral-600">
            <CalendarIcon size={12} />
            Performance Schedule
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-medium text-neutral-950 mb-3">
            Schedule & <span className="font-serif italic text-neutral-700">Calendar</span>
          </h1>
          <p className="text-neutral-500 text-sm md:text-base max-w-xl">
            Keep track of your confirmed events, travel timings, and upcoming monthly bookings.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 size={32} className="animate-spin text-neutral-800" />
            <span className="text-sm text-neutral-500 font-medium">Synchronizing calendar...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: TODAY'S SCHEDULE & SELECTED DATE DETAILS */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 space-y-8"
            >
              {/* SECTION 1: TODAY'S TIMELINE */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-5 border-b border-neutral-250 pb-3">
                  <h3 className="text-md font-semibold text-neutral-900 uppercase tracking-wide">
                    Today&apos;s Schedule
                  </h3>
                  <span className="text-xs text-neutral-500 font-medium">
                    {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>

                {todayBookings.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-neutral-450 italic">
                      No performances scheduled for today. Have a peaceful day!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white border border-neutral-200 rounded-lg p-4 shadow-2xs flex gap-4 items-start"
                      >
                        <div className="w-10 h-10 rounded-md bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 text-xs font-semibold uppercase">
                          Show
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-sm text-neutral-900">{booking.eventName}</h4>
                          <div className="flex items-center gap-1 text-xs text-neutral-500">
                            <Clock3 size={12} />
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-neutral-500">
                            <MapPin size={12} />
                            <span>{booking.city}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-neutral-500">
                            <User size={12} />
                            <span>{booking.organizerName}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 2: EVENTS FOR SELECTED DATE */}
              <div className="border border-neutral-200 rounded-xl p-6 bg-white">
                <div className="flex items-center justify-between mb-5 border-b border-neutral-200 pb-3">
                  <h3 className="text-md font-semibold text-neutral-900 uppercase tracking-wide">
                    Details for:
                  </h3>
                  <span className="text-xs font-semibold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-md">
                    {new Date(selectedDateStr).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {selectedDateBookings.length === 0 ? (
                    <motion.div
                      key="empty-select"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-8 text-center"
                    >
                      <p className="text-sm text-neutral-450 italic">
                        No bookings confirmed for this date.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="list-select"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {selectedDateBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 hover:border-neutral-900 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-heading font-medium text-lg text-neutral-950">
                              {booking.eventName}
                            </h4>
                            <span className="badge-confirmed">CONFIRMED</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs text-neutral-550 mb-4">
                            <div className="flex items-center gap-2">
                              <Clock3 size={13} className="text-neutral-500" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={13} className="text-neutral-500" />
                              <span>{booking.city}</span>
                            </div>
                            <div className="flex items-center gap-2 col-span-2">
                              <User size={13} className="text-neutral-500" />
                              <span>Organizer: <strong>{booking.organizerName}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 col-span-2">
                              <Ticket size={13} className="text-neutral-500" />
                              <span>Deal: <strong>₹{booking.price?.toLocaleString()}</strong></span>
                            </div>
                          </div>

                          <button
                            onClick={() => router.push(`/artist/chat/${booking.id}`)}
                            className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold transition-colors"
                          >
                            Open Event Chat
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>

            {/* RIGHT COLUMN: MONTH GRID CALENDAR */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl p-6"
            >
              {/* Calendar Controller Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-heading font-medium text-neutral-950">
                    {MONTHS[currentMonth]} <span className="font-serif italic text-neutral-600">{currentYear}</span>
                  </h3>
                  <p className="text-xs text-neutral-450 mt-0.5">Select a date to check scheduling details</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToday}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-md border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-all"
                  >
                    Today
                  </button>
                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-md border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-md border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Day of Week Label Grid */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-neutral-450 uppercase tracking-widest">
                {DAYS_OF_WEEK.map((d) => (
                  <div key={d} className="py-2">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarCells}
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center gap-6 text-xs text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full border border-neutral-900 bg-neutral-50" />
                  <span>Current Date</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
                  <span>Selected Date</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neutral-400" />
                  <span>Performance Scheduled</span>
                </div>
              </div>

            </motion.div>

          </div>
        )}
      </div>
    </main>
  );
}
