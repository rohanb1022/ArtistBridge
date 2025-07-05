import React from "react";
import { Button } from "@/components/ui/button";
import { demoOrganizerList } from "@/constants/organizationlist";
import Link from "next/link";

const OrgDemo = () => {
  return (
    <main>
      <section className="py-16 px-4 bg-gray-900 min-h-screen">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-white">
          Explore Top Organizers Who Host Grand Concerts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {demoOrganizerList.map((org) => (
            <div
              key={org.id}
              className="bg-gray-800 p-6 rounded-xl shadow-xl hover:scale-105 transition-transform"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-pink-400">
                {org.name}
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                {org.description || "Leading organizer for large-scale events and concerts."}
              </p>
              <p className="mt-4 text-sm text-gray-500">
                <strong>City:</strong> {org.city}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                <strong>Events:</strong> {org.events.join(", ")}
              </p>
            </div>
          ))}
        </div>
        <div className="w-full flex justify-center mt-10">
          <Link href="/artist/requests">
            <Button className="bg-gray-900 border border-pink-500 rounded-lg px-4 py-2 hover:scale-110">
              See the requests you got
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default OrgDemo;

