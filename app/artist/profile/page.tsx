/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-12 px-4 sm:px-10">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-black bg-opacity-40 shadow-2xl border border-pink-500 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-pink-400">Artist Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-xl font-semibold">Name:</p>
              <p className="text-pink-200">{profile?.name}</p>
            </div>
            <div>
              <p className="text-xl font-semibold">Email:</p>
              <p className="text-pink-200">{profile?.email}</p>
            </div>
            <div>
              <p className="text-xl font-semibold">City:</p>
              <p className="text-pink-200">{profile?.city || "Not provided"}</p>
            </div>
            <div>
              <p className="text-xl font-semibold">Categories:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile?.category.map((cat: string, index: number) => (
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
              <p className="text-pink-200">{profile?.price}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArtistProfilePage;
