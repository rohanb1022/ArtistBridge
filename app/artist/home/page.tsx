"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mic2, Calendar, Clock, Briefcase, Star, ArrowRight, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

const ctaCards = [
  {
    icon: <Calendar size={18} />,
    title: "My Bookings",
    desc: "View all confirmed shows and upcoming performances.",
    href: "/artist/bookings",
  },
  {
    icon: <Clock size={18} />,
    title: "Pending Requests",
    desc: "Organizers are waiting — respond to new requests.",
    href: "/artist/bookings",
  },
  {
    icon: <Briefcase size={18} />,
    title: "Open Requests",
    desc: "Browse public event requests matching your profile.",
    href: "/artist/requests",
  },
  {
    icon: <Star size={18} />,
    title: "My Profile",
    desc: "Update your bio, pricing, and categories to attract more gigs.",
    href: "/artist/profile",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ArtistHomePage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      router.push("/");
    } catch {
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900 relative">
      
      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-neutral-200">
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
            <Mic2 size={16} className="text-white" />
          </div>
          <span className="text-lg font-medium tracking-tight">
            Artist<span className="font-serif italic font-normal text-neutral-600">Bridge</span>
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
          <Link href="/artist/artistdetails">
            <button className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Update Profile</button>
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold border border-red-200 hover:bg-red-50 text-red-650 hover:text-red-755 transition-all"
          >
            <LogOut size={13} />
            Logout
          </button>
        </motion.div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-10 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 border border-neutral-200 bg-neutral-50 text-neutral-600"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
            Artist Dashboard
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-medium text-neutral-950 mb-3" >
            Welcome Back, <span className="font-serif italic text-neutral-700">Artist</span>
          </h1>
          <p className="text-neutral-500 text-sm md:text-base max-w-xl font-sans leading-relaxed">
            Manage your bookings, respond to organizer requests, and grow your presence across India.
          </p>
        </motion.div>
      </section>

      {/* CTA Cards */}
      <section className="relative z-10 px-6 pb-12 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {ctaCards.map((card) => (
            <motion.div key={card.title} variants={itemVariants}>
              <Link href={card.href}>
                <div className="bg-white border border-neutral-200 rounded-lg p-6 hover:border-neutral-900 hover:shadow-sm transition-all duration-200 flex flex-col justify-between h-full group"
                >
                  <div>
                    <div className="w-9 h-9 rounded-md flex items-center justify-center mb-4 bg-neutral-50 border border-neutral-200 text-neutral-900">
                      {card.icon}
                    </div>
                    <h3 className="font-semibold text-neutral-900 mb-2 font-sans text-base">{card.title}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed mb-5 font-sans">{card.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-neutral-900" >
                    Open <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Complete Profile Banner */}
      <section className="relative z-10 px-6 pb-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-8 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 bg-neutral-50 border border-neutral-200"
        >
          <div className="text-left">
            <h3 className="text-lg font-heading font-medium text-neutral-900 mb-1">
              💡 Not getting enough bookings?
            </h3>
            <p className="text-neutral-500 text-sm font-sans leading-relaxed">A complete profile with your bio, pricing, and category gets 5x more requests.</p>
          </div>
          <Link href="/artist/artistdetails">
            <button className="px-5 py-2.5 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 text-sm font-medium whitespace-nowrap flex items-center gap-1.5">
              Complete Profile <ArrowRight size={15} />
            </button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
