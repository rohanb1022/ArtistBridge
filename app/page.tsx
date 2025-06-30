// app/page.tsx (This is the root landing page)

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/landing.jpg"
          alt="Landing Background"
          layout="fill"
          objectFit="cover"
          className="brightness-[0.5]"
          priority
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight drop-shadow-xl">
          Make Every Event <br className="hidden sm:block" /> Truly Unforgettable
        </h1>
        <p className="text-lg sm:text-xl mt-6 max-w-xl drop-shadow-md">
          Find and book talented artists for your event with just a few clicks.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/auth/artist/login">
            <Button className="px-8 py-4 text-lg bg-pink-500 hover:bg-pink-600 rounded-full shadow-lg">
              Login as Artist
            </Button>
          </Link>
          <Link href="/auth/organizer/login">
            <Button className="px-8 py-4 text-lg bg-white text-pink-600 hover:bg-pink-100 rounded-full shadow-lg">
              Login as Organizer
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

