"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { artistCategories } from "@/constants/artist";

const OrgRequestForm = () => {
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    setDate(new Date());
  }, []);

  return (
    <section className="min-h-screen bg-white px-4 py-10 flex flex-col items-center justify-start">
      <h1 className="text-4xl font-bold text-pink-500 mb-10">
        Request an Artist for Your Event
      </h1>

      <div className="bg-pink-50 shadow-xl rounded-2xl p-6 w-full max-w-3xl space-y-8">
        {/* City */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Event City
          </h3>
          <Input
            type="text"
            placeholder="Enter your city"
            className="w-full border-pink-300"
          />
        </div>

        {/* Category */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Select Category
          </h3>
          <Select>
            <SelectTrigger className="w-full bg-white border-pink-300">
              <SelectValue placeholder="Select a category" />
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

        {/* Budget */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Maximum Budget ($)
          </h3>
          <Input
            type="number"
            placeholder="Enter max budget"
            className="w-full border-pink-300"
          />
        </div>

        {/* Event Date */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Event Date
          </h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            required
            className="rounded-md border border-pink-300"
          />
        </div>

        {/* Timing */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Event Timing
          </h3>
          <Input
            type="text"
            placeholder="e.g. 6 PM to 10 PM"
            className="w-full border-pink-300"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-2 rounded-full shadow-md">
            Send Request
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OrgRequestForm;
