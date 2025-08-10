/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ImSpinner3 } from "react-icons/im";
import { Bounce, toast, ToastContainer } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/artist/login", formData);
      console.log("Login success", res.data);
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
      router.replace("/artist/home");
    } catch (err) {
      let errorMessage = "Something went wrong";
      if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response) {
        // @ts-ignore
        errorMessage = err.response.data;
      }
      setError(errorMessage);
       toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[90vh] bg-black flex items-center justify-center px-4">
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:min-w-sm sm:min-w-md md:min-w-md max-w-md mx-auto"
      >
        <Card className="bg-white/10 backdrop-blur-md shadow-2xl border border-pink-400">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-fuchsia-600 text-transparent bg-clip-text">
              Artist Login
            </CardTitle>
            <CardDescription className="text-gray-300">
              Enter your email to login
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-200">Email</Label>
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
            <div>
              <Label htmlFor="password" className="text-gray-200">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                required
                onChange={handleChange}
                className="text-white"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            {
              isLoading ? (
                <Button disabled className="w-full bg-pink-600">
                  <ImSpinner3 className="animate-spin mr-2" />
                  Logging in...
                </Button>
              ) : (
                <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
                  Login
                </Button>
              )
            }
            <Link href="/auth/organizer/login" className="w-full">
              <Button variant="outline" className="w-full border-pink-600 text-pink-600">
                Login as Organizer
              </Button>
            </Link>
            <Link href="/auth/artist/signup" className="text-sm text-pink-400 hover:underline">
              Don&apos;t have an account? Sign Up
            </Link>
          </CardFooter>
        </Card>
      </motion.form>
    </main>
  );
};

export default Login;