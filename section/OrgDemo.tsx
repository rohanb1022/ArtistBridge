import React from "react";
import { demoOrganizers } from "@/constants/organizationlist";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const OrgDemo = () => {
  return (
    <section className="w-full px-4 py-4 bg-pink-50">
      {/* Heading */}
      <div className="text-center mb-10 space-y-3">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
          Trusted Organizers Across India
        </h2>
        <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
          Discover popular event companies that regularly hire top talent through ArtistBridge.
        </p>
        <Button><Link href={"/"} >Register the Artist inside you</Link></Button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-2">
        {demoOrganizers.map((org) => (
          <div
            key={org.id}
            className="bg-white border-2 border-pink-300 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-pink-600">{org.name}</h3>
              <p className="text-sm text-gray-800 mt-1">{org.city}</p>
              <p className="text-sm text-gray-500 mt-2 break-all">{org.email}</p>
            </div>

            {/* Review Panel */}
            <div className="mt-4 bg-pink-100 rounded-lg p-3">
              <p className="text-gray-700 text-sm italic">
                “{org.review}”
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrgDemo;
