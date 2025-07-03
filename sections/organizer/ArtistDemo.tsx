import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const dummyArtists = [
  {
    id : 1,
    name: "Rohan Bhangale",
    city: "Mumbai",
    category: ["Singer", "Performer"],
    bio: "Energetic and soulful artist performing at weddings, college fests and live events. Known for adaptability and stage charisma.",
    price: 15000,
    email: "rohan@example.com",
    image: "/images/artist1.jpg"
  },
  {
    id : 2,
    name: "Aisha Khan",
    city: "Delhi",
    category: ["Dancer", "Choreographer"],
    bio: "Dynamic Bollywood and contemporary dance performer with 5+ years of experience.",
    price: 12000,
    email: "aisha@example.com",
    image: "/images/artist2.jpg"
  },
  {
    id : 3,
    name: "Yash Mehta",
    city: "Bangalore",
    category: ["DJ"],
    bio: "Professional DJ specializing in corporate events and EDM parties. Played at over 100+ gigs.",
    price: 18000,
    email: "yash@example.com",
    image: "/images/artist3.jpg"
  },{
    id : 4,
  name: "Priya Sharma",
  email: "priyasharma@example.com",
  city: "Bangalore",
  category: ["Singer", "Performer"],
  price: 12000,
  bio: "Priya is a versatile singer known for her soulful voice and strong stage presence. With experience performing at weddings, corporate events, and festivals, she brings energy and elegance to every stage she steps on."
}// Add 3-5 more dummy artists similarly
];

const PopularArtists = () => {
  return (
    <section className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-pink-500">Explore Popular Artists</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {dummyArtists.map((artist) => (
            <Card
              key={artist.id}
              className="bg-white/10 border border-white/20 backdrop-blur-md text-white overflow-hidden rounded-xl shadow-xl hover:border-pink-500 transition-all"
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-1/3 h-64 md:h-auto">
                  <Image
                    height={356}
                    width={256}
                    src={`/images/artist${artist.id}.jpg`}
                    alt={artist.name}
                    className="object-cover mx-1 border-2 rounded-xl"
                  />
                </div>
                <CardContent className="p-6 flex flex-col gap-3 md:w-2/3">
                  <h3 className="text-2xl font-bold text-pink-400">{artist.name}</h3>
                  <p className="text-sm text-gray-300">City: {artist.city}</p>
                  <p className="text-sm text-gray-300">Category: {artist.category.join(", ")}</p>
                  <p className="text-sm text-gray-300">Email: {artist.email}</p>
                  <p className="text-sm text-gray-300">Price: ₹{artist.price}</p>
                  <p className="text-sm text-white mt-2 leading-relaxed">{artist.bio}</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/artist/explore">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 text-lg rounded-full">
              Explore All Artists →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularArtists;
