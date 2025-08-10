/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
import { ImSpinner3 } from "react-icons/im";
import { Bounce, ToastContainer , toast } from "react-toastify";


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      console.time("loginRequest");
      const res = await api.post("/auth/organizer/login", formData);
      console.log("login successs", res.data);
      toast.success("Booking request sent!", {
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
      //router.refresh();
      router.push("/organizer/home");
      console.timeEnd("loginRequest");
    } catch (error: any) {
      const errorMessage = error.response?.data || "Something went wrong";
      setError(errorMessage);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 px-4 py-10 flex items-center justify-center">
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
              Organizer Login
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
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
            {isLoading ? (
              <Button disabled className="w-full bg-pink-600">
                <ImSpinner3 className="animate-spin mr-2" />
                Logging in...
              </Button>
            ) : (
              <Button type="submit" className="w-full bg-pink-600">
                Login
              </Button>
            )}
            <Link href="/auth/artist/login" className="w-full">
              <Button variant="outline" className="w-full border-pink-600 text-pink-500">
                Login as Artist
              </Button>
            </Link>
            <Link href="/auth/organizer/signup" className="text-sm text-pink-400 text-center">
              Don’t have an account? Signup
            </Link>
          </CardFooter>
        </Card>
      </motion.form>
    </main>
  );
};

export default Login;
