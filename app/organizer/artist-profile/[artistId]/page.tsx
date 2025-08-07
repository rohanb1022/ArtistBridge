/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";

const ArtistProfile = () => {
  const { artistId } = useParams();
  const [artistData, setArtistData] = useState<any>(null);
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await api.get(`/organizer/artist-profile/${artistId}`);
        console.log(response.data);
        setArtistData(response.data);
        toast.success("🤩 Artist Booked!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      } catch (error: any) {
        console.error("Error fetching artist:", error);
        toast.error(error.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    };
    fetchArtist();
  }, [artistId]);

  const handleBooking = async () => {
    try {
      if (!artistData || !city || !date || !time || !eventName) {
        console.error("All fields are required for booking.");
        return;
      }
      const response = await api.post("/booking/bookingRequest", {
        artistId: artistId,
        city,
        price: artistData.price,
        date,
        time,
        eventName,
      });

      // Optionally, you can redirect or show a success message
    } catch (error) {
      console.error("Error booking artist:", error);
    }
  };

  return (
    <main className="relative min-h-screen text-white px-6 py-12">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/artistProfilebg.png" //
          alt="Background Image"
          fill
          priority
          className="object-cover brightness-[0.4]" //
        />
      </div>
      <div className="max-w-4xl mx-auto bg-white/10 p-8 rounded-2xl border-2 border-white/25 shadow-xl">
        {artistData ? (
          <>
            <h1 className="text-4xl font-bold text-pink-500 mb-2">
              {artistData.name}
            </h1>
            <p className="text-gray-300 mb-4">{artistData.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-400">city</p>
                <p className="text-lg">{artistData.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">category</p>
                <p className="text-lg">{artistData.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Price</p>
                <p className="text-lg">₹{artistData.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Best Event</p>
                <p className="text-lg">{artistData.bestEvent}</p>
              </div>
            </div>
            <div className="mt-10 text-center text-xl text-gray-200">
              <p className="italic">{artistData.bio}</p>
            </div>

            <div className="mt-8 flex justify-center items-center">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-6 py-2">
                    Book This Artist
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-black w-[60vw] mx-auto border-t border-white/20 p-6 rounded-t-2xl">
                  <DialogTitle className="text-xl font-semibold text-white">
                    Book This Artist
                  </DialogTitle>
                  <h3 className="text-2xl font-bold mb-4 text-pink-500">
                    Booking Details
                  </h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm text-white">
                        name of the event
                      </label>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="text-white" size={20} />
                        <Input
                          placeholder="Enter event name"
                          className="bg-white/10 text-white"
                          value={eventName}
                          onChange={(e) => setEventName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-white">
                        Date (DD/MM/YYYY)
                      </label>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="text-white" size={20} />
                        <Input
                          placeholder="25/12/2025"
                          className="bg-white/10 text-white"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-white">
                        Time (e.g. 7:00 PM)
                      </label>
                      <Input
                        placeholder="7:00 PM"
                        className="bg-white/10 text-white"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm text-white">City</label>
                      <Input
                        placeholder="Mumbai"
                        className="bg-white/10 text-white"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>

                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 rounded-full mt-4"
                      onClick={handleBooking}
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400">Loading...</p>
        )}
      </div>
    </main>
  );
};

export default ArtistProfile;
