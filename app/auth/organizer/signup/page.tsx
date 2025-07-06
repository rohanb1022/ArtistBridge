/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/organizer/signup", formData);
      console.log("Signup Success:", response.data);
      router.refresh();
      router.push("/organizer/home");
    } catch (err: any) {
      const errorMessage = err.response?.data || "Something went wrong";
      setError(errorMessage);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 px-4 py-10 flex items-center justify-center">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full lg:min-w-sm sm:min-w-sm md:min-w-md max-w-md mx-auto"
      >
        <Card className="w-full bg-black bg-opacity-40 backdrop-blur-md text-white border-pink-500">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-600 to-purple-500">
              Organizer Signup
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                required
                onChange={handleChange}
                className="text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
                onChange={handleChange}
                className="text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="********"
                required
                onChange={handleChange}
                className="text-white"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center pt-2">{error}</p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 px-6 pb-6">
            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
              Sign Up
            </Button>
            <Link href="/auth/artist/signup" className="w-full">
              <Button variant="outline" className="w-full border-pink-600 text-pink-500">
                Signup as Artist
              </Button>
            </Link>
            <Link href="/auth/organizer/login" className="text-sm text-pink-400 text-center">
              Already have an account? Login
            </Link>
          </CardFooter>
        </Card>
      </motion.form>
    </main>
  );
};

export default Signup;
