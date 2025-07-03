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
      // Force navigation only after DOM updates
      router.push("/organizer/home")
    } catch (err: any) {
      const errorMessage = err.response?.data || "Something went wrong";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-[80vh] px-4">
      <div className="text-md">Organizer</div>
      <form
        onSubmit={handleSubmit}
        className="sm:w-[90%] min-md:w-[35vw] min-lg:w-[35vw] space-y-6"
      >
        <Card className="w-full shadow-xl">
          <div className="flex flex-row justify-between">
            <CardHeader className="text-center w-1/2">
              <CardTitle className="text-2xl font-semibold">
                Create an account
              </CardTitle>
            </CardHeader>
            <Link href="/auth/organizer/login">
              <Button variant="link" className="text-sm">
                Already have an account?
              </Button>
            </Link>
          </div>

          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="m@example.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center pt-2">{error}</p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
            <Link href={"/auth/artist/signup"}>
              <Button variant="outline" className="w-full">
                Signup as Artist
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Signup;
