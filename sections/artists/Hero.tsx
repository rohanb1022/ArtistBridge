"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

const Hero = () => {
  const router = useRouter();

  return (
    <main className="relative w-full min-h-screen text-neutral-900 flex flex-col">
      
      {/* ================= TOP BAR ================= */}
      <header className="absolute top-0 left-0 w-full z-20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          
          {/* Redesigned Logo */}
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-extrabold tracking-tight text-neutral-900">
              Artist
              <span className="text-pink-500">Bridge</span>
            </span>
            <span className="text-[11px] tracking-widest text-neutral-550 uppercase">
              Where artists meet stages
            </span>
          </div>

          {/* Hamburger Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-neutral-200 bg-white/5 hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-white/90 backdrop-blur-xl border border-neutral-200 text-neutral-900 rounded-xl"
            >
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/terms-and-conditions">
                  Terms & Conditions
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/privacy-policy">
                  Privacy Policy
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ================= HERO CONTENT ================= */}
      <section className="flex-1 flex items-center justify-center text-center px-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium leading-tight">
            Welcome Back,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">
              Artist
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-neutral-700">
            Manage bookings, respond to organizers, and perform on stages that
            actually matter.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="px-8 py-6 text-lg bg-pink-600 hover:bg-pink-700"
              onClick={() => router.push("/artist/profile")}
            >
              Go to Dashboard
            </Button>

            <Button
              variant="outline"
              className="px-8 py-6 text-lg border-white/30"
              onClick={() => router.push("/artist/requests")}
            >
              View Requests
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
