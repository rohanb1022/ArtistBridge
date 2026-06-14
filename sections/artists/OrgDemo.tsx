import React from "react";
import { Button } from "@/components/ui/button";
import { demoOrganizerList } from "@/constants/organizationlist";
import Link from "next/link";

const OrgDemo = () => {
  return (
    <section className="relative py-24 px-4 min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 overflow-hidden">
      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto mb-14 text-center">
          <h2 className="text-4xl md:text-5xl font-medium text-neutral-900">
            Explore Top Organizers
          </h2>
          <p className="mt-4 text-neutral-550 text-sm md:text-base">
            Trusted organizers hosting large-scale concerts and premium events
          </p>
        </div>

        {/* Organizer cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {demoOrganizerList.map((org) => (
            <div
              key={org.id}
              className="group relative rounded-2xl p-[1px]
              bg-gradient-to-br from-pink-500/40 via-purple-500/30 to-cyan-400/40
              hover:from-pink-500 hover:via-purple-500 hover:to-cyan-400
              transition-all duration-300"
            >
              <div className="h-full rounded-2xl bg-gray-900/90 backdrop-blur p-6
                transform transition-all duration-300
                group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-pink-500/20"
              >
                <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-pink-400 transition-colors">
                  {org.name}
                </h3>

                <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                  {org.description ||
                    "Leading organizer for large-scale concerts and premium music events."}
                </p>

                <div className="mt-5 space-y-2 text-sm text-neutral-550">
                  <p>
                    <span className="text-gray-500">City:</span> {org.city}
                  </p>
                  <p>
                    <span className="text-gray-500">Events:</span>{" "}
                    {org.events.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-16">
          <Link href="/artist/requests">
            <Button
              className="relative overflow-hidden bg-transparent border border-pink-500
              text-neutral-900 px-8 py-6 rounded-xl text-sm font-medium
              hover:bg-pink-500/10 hover:scale-105 transition-all"
            >
              View Requests You Received
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrgDemo;
