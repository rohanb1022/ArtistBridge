/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { Calendar, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Bounce, toast, ToastContainer } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/auth/organizer/login", formData);
      toast.success("Welcome back! Redirecting...", { transition: Bounce, position: "top-center" });
      router.push("/organizer/home");
    } catch (error: any) {
      const msg = error.response?.data || "Something went wrong";
      toast.error(msg, { position: "top-right", autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-200 bg-white text-xs font-medium text-neutral-600 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
            For Event Organizers
          </div>
          <h2 className="text-5xl font-heading font-medium leading-tight mb-6 text-neutral-900">
            Plan events <br /><span className="font-serif italic text-neutral-700">like a pro.</span>
          </h2>
          <p className="text-neutral-500 text-base max-w-sm leading-relaxed mb-8">
            Access your organizer dashboard to discover artists, manage bookings, and create spectacular events.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-sm">
            {[
              { label: "Artists Available", value: "2,000+" },
              { label: "Cities Covered", value: "50+" },
              { label: "Bookings Made", value: "500+" },
              { label: "Avg. Response", value: "< 24h" },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-md bg-white border border-neutral-200">
                <div className="text-2xl font-heading font-medium text-neutral-900">{s.value}</div>
                <div className="text-xs text-neutral-400 mt-0.5">{s.label}</div>
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
          <p className="text-sm text-neutral-500 mb-8">Access your event management dashboard</p>

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
            New to ArtistBridge?{" "}
            <Link href="/auth/organizer/signup" className="font-semibold text-neutral-850 hover:underline">
              Create organizer account →
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default Login;
