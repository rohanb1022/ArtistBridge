/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { Mic2, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Bounce, toast, ToastContainer } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      await api.post("/auth/artist/login", formData);
      toast.success("Welcome back! Redirecting...", { theme: "dark", transition: Bounce, position: "top-center" });
      router.replace("/artist/home");
    } catch (err) {
      let msg = "Invalid credentials. Please try again.";
      if (err && typeof err === "object" && "response" in err) {
        // @ts-ignore
        msg = err.response?.data || msg;
      }
      toast.error(msg, { theme: "dark", position: "top-right", autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex" style={{ backgroundColor: "#020817" }}>
      <ToastContainer />

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0F172A 0%, #141B2E 100%)" }}>
        <div className="ambient-blob w-[500px] h-[500px] top-[-100px] left-[-100px]"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)" }} />
        <div className="ambient-blob w-[400px] h-[400px] bottom-0 right-[-100px]"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", animationDelay: "3s" }} />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)" }}>
            <Mic2 size={18} className="text-black" />
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: "var(--font-sora)" }}>
            Artist<span style={{ color: "#F59E0B" }}>Bridge</span>
          </span>
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-bold leading-tight mb-6 text-white" style={{ fontFamily: "var(--font-sora)" }}>
            Your stage<br />awaits you.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
            Sign in to manage your bookings, connect with organizers, and grow your career.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {["Manage all your bookings in one place", "Respond to organizer requests instantly", "Build your profile and attract gigs"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
                <span className="text-sm text-slate-400">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-slate-600 text-sm">© 2026 ArtistBridge. All rights reserved.</p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)" }}>
              <Mic2 size={16} className="text-black" />
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: "var(--font-sora)", color: "#F59E0B" }}>ArtistBridge</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-sora)" }}>
            Welcome back
          </h1>
          <p className="text-slate-400 mb-8">Sign in to your artist account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  onChange={handleChange}
                  className="studio-input pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  onChange={handleChange}
                  className="studio-input pl-11"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold py-3.5 rounded-xl flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              <span className="text-xs text-slate-600">or</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>
            <Link href="/auth/organizer/login">
              <button className="w-full py-3.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8", background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}>
                Login as Organizer instead
              </button>
            </Link>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/artist/signup" className="font-semibold transition-colors"
              style={{ color: "#F59E0B" }}>
              Create one →
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default Login;