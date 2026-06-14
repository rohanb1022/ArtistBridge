/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { IoLogOutOutline } from "react-icons/io5";

export const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await api.post("/auth/logout");
      if (response.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="w-full bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-medium tracking-tight text-neutral-900">
            Artist<span className="font-serif italic font-normal text-neutral-600">Bridge</span>
          </span>
        </div>

        {/* Links & Auth */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 px-4 py-2"
            >
              Bookings
            </Button>
          </Link>
          
          <Link href="/">
            <Button
              variant="ghost"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 px-4 py-2"
            >
              Profile
            </Button>
          </Link>

          <Dropdown />

          <Link href="/">
            <Button className="bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 rounded-md px-4 py-2">
              Profile Page
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="text-neutral-500 hover:text-red-600 hover:bg-red-50 p-2"
            onClick={handleLogout}
            title="Logout"
          >
            <IoLogOutOutline className="size-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

const Dropdown = () => {
  const router = useRouter();

  const handleChange = (value: string) => {
    if (value === "search") router.push("/artist");
    if (value === "testimonials") router.push("/artist");
    if (value === "categories") router.push("/");
  };

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger
        className="w-[140px] text-sm font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-md transition-all px-3 py-2"
      >
        <SelectValue placeholder="Artist Menu" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="search">Search Artist</SelectItem>
        <SelectItem value="testimonials">Testimonials</SelectItem>
        <SelectItem value="categories">Categories</SelectItem>
      </SelectContent>
    </Select>
  );
};
