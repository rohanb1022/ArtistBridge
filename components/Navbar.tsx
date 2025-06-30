/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect } from "react";
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
      const response = await api.post("/auth/logout")

      if (response.status === 200) {
        console.log("Logout successful")
        router.push("/")  // navigate the user to landing page after logout
      } else {
        console.error("Logout failed");
      }
      // Redirect to home page after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <>
    <nav className="flex flex-row justify-around items-center gap-4 mt-2 mb-4 min-h-[10vh]">
      <div className="font-light text-3xl text-pink-600">ArtistBridge</div>
      <div className="flex flex-row justify-evenly items-center gap-6 ">
        <Button
          variant={"ghost"}
          className="border border-transparent hover:border-2 hover:border-pink-600 hover:scale-[1.04] "
        >
          <Link href={"/"} className="text-[20px]" >Bookings</Link>
        </Button>
        <Button
          variant={"ghost"}
          className="border border-transparent hover:border-2 hover:border-pink-600 hover:scale-[1.04] "
        >
          <Link href={"/"} className="text-[20px]" >Profile</Link>
        </Button>
        <Dropdown />
        <Button className="bg-pink-500 text-white rounded-md hover:bg-pink-700 " >Profile</Button>
        <Button
          variant={"ghost"}
          className="border border-transparent hover:border-2 hover:border-pink-600 hover:scale-[1.04]"
          onClick={handleLogout}
        >
          <Link href={"/"} className="scale-[1.6]" ><IoLogOutOutline /></Link>
        </Button>
      </div>
    </nav>
    <hr />
    </>
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
        className="
          w-[160px]
          text-black
          text-[20px]
          font-semibold
          border
          border-transparent
          hover:border-pink-600
          hover:border-2
          data-[state=open]:border-pink-600
          [&>span]:text-black
          transition-all duration-200"
      >
        <SelectValue placeholder="Artist" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="search">Search Artist</SelectItem>
        <SelectItem value="testimonials">Testimonials</SelectItem>
        <SelectItem value="categories">Categories</SelectItem>
      </SelectContent>
    </Select>
  );
};
