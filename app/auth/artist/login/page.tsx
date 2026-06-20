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
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      await api.post("/auth/artist/login", formData);
      setIsRedirecting(true);
      router.replace("/artist/home");
    } catch (err) {
      let msg = "Invalid credentials. Please try again.";
      if (err && typeof err === "object" && "response" in err) {
        // @ts-ignore
        msg = err.response?.data || msg;
      }
      toast.error(msg, { position: "top-right", autoClose: 3000 });
      setIsLoading(false);
    }
  };

  if (isRedirecting) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-28 h-28 flex items-center justify-center text-neutral-900"
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <motion.circle
                cx="50"
                cy="25"
                r="7"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                animate={{ rotate: [-10, 10, -10] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "50px 25px" }}
              />
              <line
                x1="50"
                y1="32"
                x2="50"
                y2="65"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <motion.g
                style={{ transformOrigin: "50px 40px" }}
                animate={{ rotate: [-60, 30, -60] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <line
                  x1="50"
                  y1="40"
                  x2="28"
                  y2="28"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </motion.g>
              <motion.g
                style={{ transformOrigin: "50px 40px" }}
                animate={{ rotate: [30, -60, 30] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <line
                  x1="50"
                  y1="40"
                  x2="72"
                  y2="28"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </motion.g>
              <motion.g
                style={{ transformOrigin: "50px 65px" }}
                animate={{ rotate: [-25, 20, -25] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <line
                  x1="50"
                  y1="65"
                  x2="35"
                  y2="90"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </motion.g>
              <motion.g
                style={{ transformOrigin: "50px 65px" }}
                animate={{ rotate: [20, -25, 20] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <line
                  x1="50"
                  y1="65"
                  x2="65"
                  y2="90"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </motion.g>
            </svg>
          </motion.div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-md font-medium tracking-tight">
              Artist<span className="font-serif italic font-normal text-neutral-600">Bridge</span>
            </span>
          </div>
          <p className="text-xs text-neutral-450 font-sans tracking-wide animate-pulse">
            Tuning the stage for your arrival...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex bg-white text-neutral-900">
      <ToastContainer />

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-neutral-50 border-r border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
            <Mic2 size={16} className="text-neutral-900" />
          </div>
          <span className="text-lg font-medium tracking-tight">
            Artist<span className="font-serif italic font-normal text-neutral-600">Bridge</span>
          </span>
        </div>

        <div>
          <h2 className="text-5xl font-heading font-medium leading-tight mb-6 text-neutral-900">
            Your stage <br /><span className="font-serif italic text-neutral-700">awaits you.</span>
          </h2>
          <p className="text-neutral-500 text-base leading-relaxed max-w-sm">
            Sign in to manage your bookings, connect with organizers, and grow your career.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {[
              "Manage all your bookings in one place",
              "Respond to organizer requests instantly",
              "Build your profile and attract gigs",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border border-neutral-300 flex items-center justify-center flex-shrink-0 bg-white">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                </div>
                <span className="text-sm text-neutral-500">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-neutral-400 text-xs">© 2026 ArtistBridge. All rights reserved.</p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
              <Mic2 size={16} className="text-neutral-900" />
            </div>
            <span className="text-lg font-medium tracking-tight">
              Artist<span className="font-serif italic font-normal text-neutral-600">Bridge</span>
            </span>
          </div>

          <h1 className="text-3xl font-heading font-medium text-neutral-950 mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-neutral-500 mb-8">Sign in to your artist account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-450" />
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
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-450" />
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold py-3.5 rounded-md flex items-center justify-center gap-2 mt-2 font-medium"
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>
            <Link href="/auth/organizer/login">
              <button className="w-full py-3.5 rounded-md border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
                Login as Organizer instead
              </button>
            </Link>
          </div>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/artist/signup" className="font-semibold text-neutral-850 hover:underline">
              Create one →
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default Login;