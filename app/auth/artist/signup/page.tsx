"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { Mic2, Mail, Lock, User, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Bounce, toast, ToastContainer } from "react-toastify";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", city: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/auth/artist/signup", formData);
      toast.success("Welcome to ArtistBridge! Complete your profile.", { theme: "dark", transition: Bounce, position: "top-center" });
      router.push("/artist/artistdetails");
    } catch (err) {
      let msg = "Something went wrong. Please try again.";
      if (err && typeof err === "object" && "response" in err) {
        // @ts-expect-error: err.response.data may not be typed
        msg = err.response?.data || msg;
      }
      toast.error(msg, { theme: "dark", position: "top-right", autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "Rohan Bhangale", icon: <User size={16} /> },
    { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com", icon: <Mail size={16} /> },
    { name: "password", label: "Password", type: "password", placeholder: "Create a strong password", icon: <Lock size={16} /> },
    { name: "city", label: "City", type: "text", placeholder: "Mumbai", icon: <MapPin size={16} /> },
  ];

  return (
    <main className="min-h-screen flex" style={{ backgroundColor: "#020817" }}>
      <ToastContainer />

      {/* Left Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0F172A 0%, #141B2E 100%)" }}>
        <div className="ambient-blob w-[500px] h-[500px] top-[-100px] right-[-100px]"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)" }} />
        <div className="ambient-blob w-[400px] h-[400px] bottom-[-50px] left-[-100px]"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)", animationDelay: "4s" }} />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)" }}>
            <Mic2 size={18} className="text-black" />
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: "var(--font-sora)", color: "#F8FAFC" }}>
            Artist<span style={{ color: "#F59E0B" }}>Bridge</span>
          </span>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 uppercase tracking-widest"
            style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "#A78BFA" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Join 2,000+ Artists
          </div>
          <h2 className="text-5xl font-bold leading-tight mb-6 text-white" style={{ fontFamily: "var(--font-sora)" }}>
            Start your<br />journey today.
          </h2>
          <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
            Create your profile, get discovered by top organizers, and take your career to the next level.
          </p>

          <div className="mt-10 p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-sm text-slate-500 mb-1 uppercase tracking-widest font-medium">Quick Start</p>
            <ol className="space-y-2 mt-3">
              {["Sign up & create your account", "Complete your artist profile", "Get discovered by organizers"].map((step, i) => (
                <li key={step} className="flex items-center gap-3 text-sm text-slate-400">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <p className="relative z-10 text-slate-600 text-sm">© 2026 ArtistBridge. All rights reserved.</p>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)" }}>
              <Mic2 size={16} className="text-black" />
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: "var(--font-sora)", color: "#F59E0B" }}>ArtistBridge</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-sora)" }}>
            Create your account
          </h1>
          <p className="text-slate-400 mb-8">Join ArtistBridge and start getting booked</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-300 mb-2">{field.label}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">{field.icon}</span>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    required
                    onChange={handleChange}
                    className="studio-input pl-11"
                  />
                </div>
              </div>
            ))}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold py-3.5 rounded-xl flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" /> Creating Account...</>
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              <span className="text-xs text-slate-600">or</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>
            <Link href="/auth/organizer/signup">
              <button className="w-full py-3.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8", background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}>
                Sign up as Organizer instead
              </button>
            </Link>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/artist/login" className="font-semibold transition-colors" style={{ color: "#F59E0B" }}>
              Sign In →
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default Signup;