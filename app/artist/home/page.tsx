"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mic2, Calendar, Clock, Briefcase, Star, ArrowRight, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

const ctaCards = [
  {
    icon: <Calendar size={20} />,
    title: "My Bookings",
    desc: "View all confirmed shows and upcoming performances.",
    href: "/artist/bookings",
    color: "#10B981",
    colorBg: "rgba(16,185,129,0.1)",
    colorBorder: "rgba(16,185,129,0.2)",
  },
  {
    icon: <Clock size={20} />,
    title: "Pending Requests",
    desc: "Organizers are waiting — respond to new requests.",
    href: "/artist/bookings",
    color: "#F59E0B",
    colorBg: "rgba(245,158,11,0.1)",
    colorBorder: "rgba(245,158,11,0.2)",
  },
  {
    icon: <Briefcase size={20} />,
    title: "Open Requests",
    desc: "Browse public event requests matching your profile.",
    href: "/artist/requests",
    color: "#7C3AED",
    colorBg: "rgba(124,58,237,0.1)",
    colorBorder: "rgba(124,58,237,0.2)",
  },
  {
    icon: <Star size={20} />,
    title: "My Profile",
    desc: "Update your bio, pricing, and categories to attract more gigs.",
    href: "/artist/profile",
    color: "#0EA5E9",
    colorBg: "rgba(14,165,233,0.1)",
    colorBorder: "rgba(14,165,233,0.2)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
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
    <main className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#020817" }}>

      {/* Ambient Blobs */}
      <div className="ambient-blob w-[600px] h-[600px] top-[-150px] left-[-150px]"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)" }} />
      <div className="ambient-blob w-[500px] h-[500px] top-[30%] right-[-100px]"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", animationDelay: "4s" }} />

      {/* Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto border-b"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)" }}>
            <Mic2 size={16} className="text-black" />
          </div>
          <span className="text-lg font-bold" style={{ fontFamily: "var(--font-sora)" }}>
            Artist<span style={{ color: "#F59E0B" }}>Bridge</span>
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
          <Link href="/artist/artistdetails">
            <button className="text-sm text-slate-400 hover:text-white transition-colors">Update Profile</button>
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ border: "1px solid rgba(239,68,68,0.2)", color: "#F87171", background: "rgba(239,68,68,0.05)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.05)")}>
            <LogOut size={15} />
            Logout
          </button>
        </motion.div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-20 pb-12 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 uppercase tracking-widest"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Artist Dashboard
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-sora)" }}>
            Welcome Back,{" "}
            <span className="text-gold">Artist</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Manage your bookings, respond to organizer requests, and grow your presence across India.
          </p>
        </motion.div>
      </section>

      {/* CTA Cards */}
      <section className="relative z-10 px-6 pb-20 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {ctaCards.map((card) => (
            <motion.div key={card.title} variants={itemVariants}>
              <Link href={card.href}>
                <div className="glass-card p-6 group cursor-pointer h-full"
                  style={{ borderColor: card.colorBorder }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = card.colorBg;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${card.color}20`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(20, 27, 46, 0.7)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors"
                    style={{ background: card.colorBg, color: card.color, border: `1px solid ${card.colorBorder}` }}>
                    {card.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-2" style={{ fontFamily: "var(--font-sora)" }}>{card.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">{card.desc}</p>
                  <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: card.color }}>
                    Open <ArrowRight size={14} />
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.06), rgba(124,58,237,0.06))", border: "1px solid rgba(245,158,11,0.12)" }}
        >
          <div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-sora)" }}>
              💡 Not getting enough bookings?
            </h3>
            <p className="text-slate-400">A complete profile with your bio, pricing, and category gets 5x more requests.</p>
          </div>
          <Link href="/artist/artistdetails">
            <button className="btn-gold px-6 py-3 rounded-xl text-sm whitespace-nowrap flex items-center gap-2">
              Complete Profile <ArrowRight size={16} />
            </button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
