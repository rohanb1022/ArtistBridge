/* eslint-disable @typescript-eslint/no-unused-vars */
// /app/artist/profile/page.tsx

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import Image from "next/image";

type ArtistProfile = {
  name: string;
  email: string;
  city?: string;
  category: string[];
  bio?: string;
  price?: number;
};

const ArtistProfilePage = () => {
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/artist/getProfile");
        setProfile(res.data.data);
      } catch (err: unknown) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-pink-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 font-semibold text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Right-aligned Content */}
      <div className="flex justify-start items-center min-h-screen pr-10 pl-10 sm:pl-32">
        <div className="w-full max-w-2xl">
          <Card className="bg-black bg-opacity-60 shadow-2xl border border-pink-500 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-pink-400">Artist Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-xl font-semibold">Name:</p>
                <p className="text-pink-500">{profile?.name}</p>
              </div>
              <div>
                <p className="text-xl font-semibold">Email:</p>
                <p className="text-pink-500">{profile?.email}</p>
              </div>
              <div>
                <p className="text-xl font-semibold">City:</p>
                <p className="text-pink-500">{profile?.city || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xl font-semibold">Categories:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile?.category.map((cat, index) => (
                    <Badge key={index} className="bg-pink-500 text-white">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xl font-semibold">Bio:</p>
                <p className="text-pink-100 italic max-w-xl leading-relaxed">
                  {profile?.bio}
                </p>
              </div>
              <div>
                <p className="text-xl font-semibold">Price (₹):</p>
                <p className="text-pink-500">{profile?.price}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfilePage;
