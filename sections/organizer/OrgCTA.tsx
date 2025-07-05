"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Search, Settings, Users } from "lucide-react";

const OrganizerCTA = () => {
  return (
    <section
      className="min-h-screen w-full bg-black bg-cover bg-center bg-no-repeat text-white px-6 py-16"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1515169067865-5387e4c0b9c4?auto=format&fit=crop&w=1950&q=80')", // changeable
      }}
    >
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-pink-500 mb-4">
          Power Your Next Event with the Right Talent
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          Discover, evaluate, and book the best artists for your event in just a few clicks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {[
          {
            icon: <Search className="w-8 h-8 text-pink-500" />,
            title: "Browse Talent",
            description:
              "Explore our wide database of artists by category, location, and price range.",
            link: "/organizer/explore",
          },
          {
            icon: <Calendar className="w-8 h-8 text-pink-500" />,
            title: "Manage Bookings",
            description:
              "Keep track of all your bookings, from initial requests to final confirmations.",
            link: "/organizer/manage-bookings",
          },
          {
            icon: <Users className="w-8 h-8 text-pink-500" />,
            title: "View Artist Profiles",
            description:
              "Go through detailed artist profiles, ratings, bios, and past performances.",
            link: "/organizer/get-request",
          },
          {
            icon: <Settings className="w-8 h-8 text-pink-500" />,
            title: "Customize Your Needs",
            description:
              "Set event preferences and we'll match artists based on your specific needs.",
            link: "/organizer/searchfilters",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="group border-2 border-white/20 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:border-pink-500 transition"
          >
            <div className="mb-4 flex justify-center">{card.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              {card.title}
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              {card.description}
            </p>
            <Link href={card.link}>
              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-md">
                Get Started
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrganizerCTA;
