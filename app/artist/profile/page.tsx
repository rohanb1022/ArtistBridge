// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useEffect, useState } from "react";
// import api from "@/lib/axios";
// import { Card, CardContent } from "@/components/ui/card";
// import { Loader2, Minus, Plus } from "lucide-react";
// import { useProtectedRoute } from "@/hooks/useProtectedRoute";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"
// import { Bar, BarChart, ResponsiveContainer } from "recharts"
// import React from "react";

// interface ArtistProfile {
//   name: string;
//   email: string;
//   city?: string;
//   category: string[];
//   bio?: string;
//   price?: number;
// }

// const ArtistProfilePage = () => {
//   const router = useRouter();

//   useProtectedRoute();

//   const [profile, setProfile] = useState<ArtistProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await api.get("/artist/getProfile");
//         setProfile(res.data.data);
//       } catch (err: unknown) {
//         setError("Failed to load profile.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader2 className="animate-spin w-10 h-10 text-pink-500" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-red-600 font-semibold text-xl">{error}</p>
//       </div>
//     );
//   }

//   const handleLogout = async () => {
//     try {
//       const response = await api.post("/auth/logout");
//       console.log(response.data);
//       router.push("/auth/artist/login");
//     } catch (error) {
//       setError("Failed to logout.");
//     }
//   };

//   return (
//     <section className="min-h-screen px-6 py-10 bg-black text-white">
//       <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
//         {/* Left Section */}
//         <div className="flex-[2] flex flex-col gap-6">
//           {/* Profile Overview */}
//           <div className="flex gap-6 items-start">
//             <div className="w-24 h-24 rounded-lg bg-pink-400 flex items-center justify-center text-xl font-bold shadow-lg">
//               {profile?.name
//                 ? profile.name
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")
//                     .toUpperCase()
//                 : "AR"}
//             </div>
//             <div className="flex flex-col gap-3">
//               <div className="text-lg font-semibold bg-white text-black px-4 py-2 rounded-md shadow">
//                 name :- {profile?.name || "-"}
//               </div>
//               <div className="text-lg font-medium border border-white px-4 py-2 rounded-md shadow">
//                 Category :- {profile?.category?.join(", ") || "-"}
//               </div>
//             </div>
//           </div>

//           {/* Bio Section */}
//           <div className="mt-2">
//             <p className="text-lg font-semibold mb-2">Bio :-</p>
//             <Card className="bg-zinc-900 text-white border-zinc-700">
//               <CardContent className="p-4 text-sm leading-6 tracking-wide">
//                 {profile?.bio ||
//                   "Passionate artist with a presence in live shows and private gigs. Known for energetic and professional performance across various genres."}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Optional: Logout button */}
//           <Button
//             variant="outline"
//             className="mt-4 w-fit border-pink-600 text-pink-500 hover:bg-pink-800"
//             onClick={handleLogout}
//           >
//             Logout
//           </Button>
//         </div>

//         {/* Right Section */}
//         <div className="flex-[1] flex flex-col gap-4">
//           <h2 className="text-xl font-semibold mb-2">History</h2>
//           <div className="flex flex-col gap-3">
//             {[1, 2, 3, 4].map((item) => (
//               <Card
//                 key={item}
//                 className="bg-zinc-800 border-zinc-700 text-sm p-3 hover:border-pink-500 transition-all"
//               >
//                 <p className="text-white">Event {item} - Mumbai</p>
//               </Card>
//             ))}
//           </div>
//           <Button
//             variant="secondary"
//             className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white"
//             onClick={() => {
//               // Open drawer to add history
//               DrawerDemo();
//             }}
//           >
//             Add History
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ArtistProfilePage;

// function DrawerDemo() {
//   const [goal, setGoal] = React.useState(350)

//   // Example data for the BarChart
//   const data = [
//     { name: "Mon", goal: 300 },
//     { name: "Tue", goal: 320 },
//     { name: "Wed", goal: 350 },
//     { name: "Thu", goal: 370 },
//     { name: "Fri", goal: 340 },
//     { name: "Sat", goal: 360 },
//     { name: "Sun", goal: goal },
//   ];

//   function onClick(adjustment: number) {
//     setGoal(Math.max(200, Math.min(400, goal + adjustment)))
//   }
//   return (
//     <Drawer>
//       <DrawerTrigger asChild>
//         <Button variant="outline">Open Drawer</Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <div className="mx-auto w-full max-w-sm">
//           <DrawerHeader>
//             <DrawerTitle>Move Goal</DrawerTitle>
//             <DrawerDescription>Set your daily activity goal.</DrawerDescription>
//           </DrawerHeader>
//           <div className="p-4 pb-0">
//             <div className="flex items-center justify-center space-x-2">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="h-8 w-8 shrink-0 rounded-full"
//                 onClick={() => onClick(-10)}
//                 disabled={goal <= 200}
//               >
//                 <Minus />
//                 <span className="sr-only">Decrease</span>
//               </Button>
//               <div className="flex-1 text-center">
//                 <div className="text-7xl font-bold tracking-tighter">
//                   {goal}
//                 </div>
//                 <div className="text-muted-foreground text-[0.70rem] uppercase">
//                   Calories/day
//                 </div>
//               </div>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="h-8 w-8 shrink-0 rounded-full"
//                 onClick={() => onClick(10)}
//                 disabled={goal >= 400}
//               >
//                 <Plus />
//                 <span className="sr-only">Increase</span>
//               </Button>
//             </div>
//             <div className="mt-3 h-[120px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={data}>
//                   <Bar
//                     dataKey="goal"
//                     style={
//                       {
//                         fill: "hsl(var(--foreground))",
//                         opacity: 0.9,
//                       } as React.CSSProperties
//                     }
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//           <DrawerFooter>
//             <Button>Submit</Button>
//             <DrawerClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DrawerClose>
//           </DrawerFooter>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   )
// }


/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ArtistProfile {
  name: string;
  email: string;
  city?: string;
  category: string[];
  bio?: string;
  price?: number;
}

interface HistoryItem {
  city: string;
  description: string;
}

const ArtistProfilePage = () => {
  const router = useRouter();
  useProtectedRoute();

  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [newCity, setNewCity] = useState("");
  const [newDescription, setNewDescription] = useState("");

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

  const handleLogout = async () => {
    try {
      const response = await api.post("/auth/logout");
      console.log(response.data);
      router.push("/auth/artist/login");
    } catch (error) {
      setError("Failed to logout.");
    }
  };

  const handleAddHistory = () => {
    if (!newCity || !newDescription) return;
    setHistory([...history, { city: newCity, description: newDescription }]);
    setNewCity("");
    setNewDescription("");
    setDrawerOpen(false);
  };

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
    <section className="min-h-screen px-6 py-10 bg-black text-white">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Section */}
        <div className="flex-[2] flex flex-col gap-6">
          <div className="flex gap-6 items-start">
            <div className="w-24 h-24 rounded-lg bg-pink-400 flex items-center justify-center text-xl font-bold shadow-lg">
              {profile?.name
                ? profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "AR"}
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-lg font-semibold bg-white text-black px-4 py-2 rounded-md shadow">
                name :- {profile?.name || "-"}
              </div>
              <div className="text-lg font-medium border border-white px-4 py-2 rounded-md shadow">
                Category :- {profile?.category?.join(", ") || "-"}
              </div>
            </div>
          </div>

          <div className="mt-2">
            <p className="text-lg font-semibold mb-2">Bio :-</p>
            <Card className="bg-zinc-900 text-white border-zinc-700">
              <CardContent className="p-4 text-sm leading-6 tracking-wide">
                {profile?.bio ||
                  "Passionate artist with a presence in live shows and private gigs. Known for energetic and professional performance across various genres."}
              </CardContent>
            </Card>
          </div>

          <Button
            variant="outline"
            className="mt-4 w-fit border-pink-600 text-pink-500 hover:bg-pink-800"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex-[1] flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-2">History</h2>
          <div className="flex flex-col gap-3">
            {history.map((item, index) => (
              <Card
                key={index}
                className="bg-zinc-800 border-zinc-700 text-sm p-3 hover:border-pink-500 transition-all"
              >
                <p className="text-white font-semibold">{item.city}</p>
                <p className="text-white text-xs mt-1">{item.description}</p>
              </Card>
            ))}
          </div>
          <Button
            variant="secondary"
            className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white"
            onClick={() => setDrawerOpen(true)}
          >
            Add Event
          </Button>
        </div>
      </div>

      {/* Drawer for Add History */}
      <Drawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen}
        >
        <DrawerContent className="bg-zinc-900" >
          <div className="mx-auto w-full max-w-md p-4 text-white rounded-lg shadow-lg">
            <DrawerHeader className="flex justify-between items-center">
              <div>
                <DrawerTitle className="text-xl font-bold text-white" >Add Event</DrawerTitle>
                <DrawerDescription>Enter your performance history.</DrawerDescription>
              </div>
            </DrawerHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="City (e.g., Mumbai)"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
              />
              <Textarea
                placeholder="Enter performance description..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <DrawerFooter>
              <Button onClick={handleAddHistory} variant="ghost" >Add</Button>
              <DrawerClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </section>
  );
};

export default ArtistProfilePage;
