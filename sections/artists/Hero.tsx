/* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import React from "react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { ArrowRight } from "lucide-react";
// import Image from "next/image";

// const Hero = () => {
//   return (
//     <main className="relative w-full min-h-screen overflow-hidden text-white">
//       {/* Background Image */}
//       <div className="absolute inset-0 -z-10 w-full h-full">
//         <Image
//           src="/images/artistHome.jpg"
//           alt="Artist Home Background"
//           fill
//           priority
//           className="object-cover w-full h-full brightness-[0.4]"
//         />
//       </div>

//       {/* Content */}
//       <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
//         <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-pink-500">
//           Welcome Back, Artist
//         </h1>
//         <p className="text-lg sm:text-xl md:text-2xl max-w-xl mb-6">
//           Manage your bookings, profile and connect with top organizers across India.
//         </p>
//         <Link href="/artist/profile">
//           <Button className="bg-pink-600 hover:bg-pink-700 rounded-full text-white px-6 py-2 text-base sm:text-lg">
//             View Your Profile <ArrowRight className="ml-2 h-5 w-5" />
//           </Button>
//         </Link>
//       </section>
//     </main>
//   );
// };

// export default Hero;


"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Menu } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import api from "@/lib/axios"; // adjust to your API instance path

const Hero = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      const response = await api.post("/auth/logout");
      console.log(response.data);
      toast.success("Logout successful");
      router.push("/auth/artist/login");
    } catch (error) {
      setError("Failed to logout." );
      toast.error("Failed to logout");
    }
  };

  return (
    <main className="relative w-full min-h-screen overflow-hidden text-white">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10 w-full h-full">
        <Image
          src="/images/artistHome.jpg"
          alt="Artist Home Background"
          fill
          priority
          className="object-cover w-full h-full brightness-[0.4]"
        />
      </div>

      {/* Hamburger Menu */}
      <div className="absolute top-6 right-6 h-12 w-12 ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-white/10 rounded-full h-10 w-10"
            >
              <Menu className="h-10 w-10" strokeWidth={3} />

            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white text-black rounded-md shadow-lg">
            <DropdownMenuItem asChild>
              <Link href="/artist/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-pink-500">
          Welcome Back, Artist
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl max-w-xl mb-6">
          Manage your bookings, profile and connect with top organizers across India.
        </p>
      </section>
    </main>
  );
};

export default Hero;
