/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { Calendar, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err) {
        toast.error(decodeURIComponent(err), { position: "top-right", autoClose: 5000 });
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/auth/organizer/login", formData);
      setIsRedirecting(true);
      router.push("/organizer/home");
    } catch (error: any) {
      const msg = error.response?.data || "Something went wrong";
      toast.error(msg, { position: "top-right", autoClose: 3000 });
      setIsLoading(false);
    }
  };

  if (isRedirecting) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 border-2 border-neutral-100 rounded-full"
            />
            <motion.div
              className="absolute inset-0 border-2 border-t-neutral-900 border-r-transparent border-b-transparent border-l-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium tracking-tight">
              Artist<span className="font-serif italic font-normal text-neutral-600">Bridge</span>
            </span>
          </div>
          <p className="text-xs text-neutral-450 font-sans tracking-wide animate-pulse">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex bg-white text-neutral-900">
      <ToastContainer />

      {/* Left Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-neutral-50 border-r border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
            <Calendar size={16} className="text-neutral-900" />
          </div>
          <span className="text-lg font-medium tracking-tight">
            Artist<span className="font-serif italic font-normal text-neutral-600">Bridge</span>
          </span>
        </div>

        <div>
          <h2 className="text-5xl font-heading font-medium leading-tight mb-6 text-neutral-900">
            Welcome back, <br /><span className="font-serif italic text-neutral-700">Organizer.</span>
          </h2>
          <p className="text-neutral-500 text-base max-w-sm leading-relaxed mb-8">
            Access your events, track artist requests, and discover premier talent for your upcoming shows.
          </p>
          <div className="p-6 rounded-md bg-white border border-neutral-200 max-w-sm">
            <p className="text-xs text-neutral-450 font-semibold mb-3 uppercase tracking-wider">Dashboard Features</p>
            {["Real-time booking management", "Instant artist messaging", "Curated artist marketplace", "Seamless payments"].map((item) => (
              <div key={item} className="flex items-center gap-3 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span className="text-sm text-neutral-650">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-neutral-400 text-xs">© 2026 ArtistBridge. All rights reserved.</p>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
              <Calendar size={16} className="text-neutral-900" />
            </div>
            <span className="text-lg font-medium tracking-tight">
              Artist<span className="font-serif italic font-normal text-neutral-600">Bridge</span>
            </span>
          </div>

          <h1 className="text-3xl font-heading font-medium text-neutral-950 mb-2">
            Organizer Sign In
          </h1>
          <p className="text-sm text-neutral-500 mb-6">Access your event management dashboard</p>

          {/* Google Sign In */}
          <div className="mb-6">
            <GoogleAuthButton role="organizer" label="Sign in with Google" />
            <div className="relative flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">or sign in with email</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-450" />
                <input type="email" name="email" placeholder="you@company.com" required onChange={handleChange} className="studio-input pl-11" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-450" />
                <input type="password" name="password" placeholder="••••••••" required onChange={handleChange} className="studio-input pl-11" />
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
            <Link href="/auth/artist/login">
              <button className="w-full py-3.5 rounded-md border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
                Login as Artist instead
              </button>
            </Link>
          </div>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/organizer/signup" className="font-semibold text-neutral-850 hover:underline">
              Create an Organizer Account →
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default Login;
