import { ArtistCategory } from "@/types";

export const artistType : ArtistCategory[] = [
    {
      id : 1,
    type: "Singers",
    priceRange: "₹20,000 – ₹2,00,000",
    events: ["Weddings", "Concerts", "Corporate Shows"],
    genres: ["Pop", "Classical", "Bollywood"],
    icon: "/svg/singerArtist.svg",
    available: 120,
  },
  {
    id : 2,
    type: "DJs",
    priceRange: "₹25,000 – ₹1,50,000",
    events: ["Clubs", "Parties", "College Fests"],
    genres: ["EDM", "Techno", "Bollywood Remix"],
    icon: "/svg/djArtist.svg",
    available: 45,
  },
  {
    id : 3,
    type: "Dancers",
    priceRange: "₹15,000 – ₹1,00,000",
    events: ["Stage Shows", "Weddings", "Award Nights"],
    genres: ["Hip Hop", "Classical", "Contemporary"],
    icon: "/svg/danceArtist.svg",
    available: 60,
  },
  {
    id : 4,
    type: "Speakers",
    priceRange: "₹30,000 – ₹3,00,000",
    events: ["Corporate Events", "TEDx", "Workshops"],
    genres: ["Motivational", "Technical", "Spiritual"],
    icon: "/svg/speakerArtist.svg",
    available: 25,
  },

]