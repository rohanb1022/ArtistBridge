/* eslint-disable @typescript-eslint/no-unused-vars */
// /app/artist/profile/page.tsx

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useRouter } from "next/navigation";

type ArtistProfile = {
  name: string;
  email: string;
  city?: string;
  category: string[];
  bio?: string;
  price?: number;
};

const ArtistProfilePage = () => {

  const router = useRouter();

  useProtectedRoute();
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

  const handleLogout = async () => {
    try {
      const response = await api.post("/auth/logout");
      console.log(response.data);
      router.push("/auth/artist/login");
    } catch (error) {
      setError("Failed to logout.");
    }
  }

  return (
    <main>
      <button onClick={handleLogout} >Logout</button>
    </main>
  );
};

export default ArtistProfilePage;
