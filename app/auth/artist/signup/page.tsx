"use client";

import { Card, CardContent, CardHeader, CardTitle , CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { ImSpinner3 } from "react-icons/im";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await api.post("/auth/artist/signup", formData);
      console.log("Signup success", res.data);
      router.push("/artist/artistdetails");
    } catch (err) {
      let errorMessage = "Something went wrong";
      if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response) {
        // @ts-expect-error: err.response.data may not be typed
        errorMessage = err.response.data;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:min-w-sm sm:min-w-sm md:min-w-md max-w-md mx-auto"
      >
        <Card className="bg-white/10 backdrop-blur-md shadow-2xl border border-pink-400">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-fuchsia-600 text-transparent bg-clip-text">
              Artist Signup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-200">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="text-white"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-200">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
                className="text-white"
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-gray-200">City</Label>
              <Input
                id="city"
                type="text"
                name="city"
                placeholder="Mumbai"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            {
              isLoading ? (
                <Button disabled className="w-full bg-pink-600">
                  <ImSpinner3 className="animate-spin mr-2" />
                  Signing up...
                </Button>
              ) : (
                <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
                  Sign Up
                </Button>
              )
            }
            <Link href="/auth/organizer/signup" className="w-full">
              <Button variant="outline" className="w-full border-pink-600 text-pink-600">
                Sign Up as Organizer
              </Button>
            </Link>
            <Link href="/auth/artist/login" className="text-sm text-pink-400 hover:underline">
              Already have an account? login
            </Link>
          </CardFooter>
        </Card>
      </motion.form>
    </main>
  );
};

export default Signup;