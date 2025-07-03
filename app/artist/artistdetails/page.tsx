/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { artistCategories } from "@/constants/artist";
import {useRouter} from "next/navigation"
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { be } from "date-fns/locale";


const ArtistDetailsForm = () => {
  useProtectedRoute();
  const [formData , setFormData] = useState({ 
      category  : [] as string[] ,
      price : 0,
      bio : "",
      bestEvent : ""
  })
  const [error , setError] = useState("")
  const router = useRouter();
  const handleInputChange = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name , value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name] : name === "price" ? Number(value) : value
    }))
  }

   const handleCategory = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.includes(value)
        ? prev.category
        : [...prev.category, value],
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
      e.preventDefault()
      setError("")
    try {
      const response = await api.put("/artist/completeProfile" , formData)
      const data = response.data;
      console.log(data)
      router.push("/artist/home")

    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log(error);
      }
      setError("Failed to update profile. Please try again.");
    }
  }

  return (
    <section className="min-h-[80%] bg-white px-4 py-6 flex flex-col items-center justify-start">
      <div className='flex justify-center items-center mx-2 ' >
            <h2 className='text-4xl text-pink-400 font-light mt-4 mb-4' >ArtistBridge</h2>
        </div>
        <hr className='mb-2' />
      <h1 className="text-4xl font-bold text-pink-500 mb-6">Complete Your Artist Profile</h1>

      <div className="bg-pink-50 shadow-xl rounded-2xl p-4 w-full max-w-3xl space-y-4">
        {/* Category Selection */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Select Your Category</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select onValueChange={(e) => handleCategory(e)} >
              <SelectTrigger className="w-full sm:w-1/2 bg-white border-pink-300">
                <SelectValue placeholder="Preferred Category" />
              </SelectTrigger>
              <SelectContent>
                {artistCategories.map((item) => (
                  <SelectItem value={item} key={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-1/2 bg-white border-pink-300">
                <SelectValue placeholder="Optional Category" />
              </SelectTrigger>
              <SelectContent>
                {artistCategories.map((item) => (
                  <SelectItem value={item} key={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Enter Your Cost($)</h3>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Input 
            type="number" 
            name="price" 
            onChange={handleInputChange}  
            placeholder="$ amount" 
            value={formData.price}
            className="w-full sm:w-1/2 border-pink-300" />
          </div>
        </div>

        {/* Bio */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Bio</h3>
          <Textarea 
          placeholder="Tell us about yourself..." 
          onChange={handleInputChange} 
          name="bio"
          value={formData.bio}
          className="w-full border-pink-300 min-h-[120px]" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your best Event </h3>
          <Textarea 
          placeholder="Tell us about best event you have performed in..." 
          onChange={handleInputChange} 
          name="bestEvent"
          value={formData.bestEvent}
          className="w-full border-pink-300 min-h-[120px]" />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button onClick={handleSubmit} className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-2 rounded-full shadow-md">
            Submit Details
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ArtistDetailsForm;
