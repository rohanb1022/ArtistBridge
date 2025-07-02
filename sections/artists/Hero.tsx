import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const Hero = () => {
  return (
    <main>
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/artistHome.jpg"
          alt="Artist Home Background"
          fill
          priority
          className="object-cover brightness-[0.4]"
        />
      </div>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-pink-500">
          Welcome Back, Artist
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mb-6">
          Manage your bookings, profile and connect with top organizers across
          India.
        </p>
        <Link href="/artist/profile">
          <Button className="bg-pink-600 hover:bg-pink-700 rounded-full text-white px-6 py-2 text-lg">
            View Your Profile <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>
    </main>
  );
};

export default Hero;
