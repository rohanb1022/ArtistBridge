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
      toast.success("Welcome to ArtistBridge! Complete your profile.", { transition: Bounce, position: "top-center" });
      router.push("/artist/artistdetails");
    } catch (err) {
      let msg = "Something went wrong. Please try again.";
      if (err && typeof err === "object" && "response" in err) {
        // @ts-expect-error: err.response.data may not be typed
        msg = err.response?.data || msg;
      }
      toast.error(msg, { position: "top-right", autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "Rohan Bhangale", icon: <User size={15} /> },
    { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com", icon: <Mail size={15} /> },
    { name: "password", label: "Password", type: "password", placeholder: "Create a strong password", icon: <Lock size={15} /> },
    { name: "city", label: "City", type: "text", placeholder: "Mumbai", icon: <MapPin size={15} /> },
  ];

  return (
    <main className="min-h-screen flex bg-white text-neutral-900">
      <ToastContainer />

      {/* Left Branding Panel */}
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-200 bg-white text-xs font-medium text-neutral-600 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
            Join 2,000+ Artists
          </div>
          <h2 className="text-5xl font-heading font-medium leading-tight mb-6 text-neutral-900">
            Start your <br /><span className="font-serif italic text-neutral-700">journey today.</span>
          </h2>
          <p className="text-neutral-500 text-base max-w-sm leading-relaxed">
            Create your profile, get discovered by top organizers, and take your career to the next level.
          </p>

          <div className="mt-10 p-6 rounded-md bg-white border border-neutral-200 max-w-sm">
            <p className="text-xs text-neutral-400 mb-1 uppercase tracking-wider font-semibold">Quick Start</p>
            <ol className="space-y-3 mt-3">
              {["Sign up & create your account", "Complete your artist profile", "Get discovered by organizers"].map((step, i) => (
                <li key={step} className="flex items-center gap-3 text-sm text-neutral-600">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 bg-neutral-100 text-neutral-800 border border-neutral-200">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <p className="text-neutral-400 text-xs">© 2026 ArtistBridge. All rights reserved.</p>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
              <Mic2 size={16} className="text-neutral-900" />
            </div>
            <span className="text-lg font-medium tracking-tight">
              Artist<span className="font-serif italic font-normal text-neutral-600">Bridge</span>
            </span>
          </div>

          <h1 className="text-3xl font-heading font-medium text-neutral-950 mb-2">
            Create your account
          </h1>
          <p className="text-sm text-neutral-500 mb-8">Join ArtistBridge and start getting booked</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">{field.label}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-450">{field.icon}</span>
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold py-3.5 rounded-md flex items-center justify-center gap-2 mt-2 font-medium"
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Creating Account...</>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>
            <Link href="/auth/organizer/signup">
              <button className="w-full py-3.5 rounded-md border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
                Sign up as Organizer instead
              </button>
            </Link>
          </div>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/artist/login" className="font-semibold text-neutral-850 hover:underline">
              Sign In →
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default Signup;