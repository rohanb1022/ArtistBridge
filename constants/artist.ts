import { ArtistCategory } from "@/types";

export const demoArtists = [
  {
    id: 1,
    name: "Aarav Mehta",
    email: "aarav.mehta@gmail.com",
    category: "Singer",
    priceRange: "₹10,000 - ₹20,000",
    city: "Mumbai",
    bio: "A versatile live performer known for Bollywood and acoustic sets.",
    created_at: "2024-06-01T10:30:00Z",
    img : "/images/singer.jpg"
  },
  {
    id: 2,
    name: "Diya Sharma",
    email: "diya.sharma@gmail.com",
    category: "Dancer",
    priceRange: "₹8,000 - ₹15,000",
    city: "Delhi",
    bio: "Trained classical dancer with experience in corporate and wedding events.",
    created_at: "2024-05-15T12:00:00Z",
    img : "/images/dancer.jpg"
  },
  {
    id: 3,
    name: "Kabir Singh",
    email: "kabir.singh@gmail.com",
    category: "Stand-up Comedian",
    priceRange: "₹12,000 - ₹25,000",
    city: "Bengaluru",
    bio: "Comedy with a punch of relatability and fun. Performed at 100+ venues.",
    created_at: "2024-04-20T09:45:00Z",
    img : "/images/stand-up.jpg"
  },
  {
    id: 4,
    name: "Nehal Verma",
    email: "sneha.verma@gmail.com",
    category: "Magician",
    priceRange: "₹5,000 - ₹12,000",
    city: "Lucknow",
    bio: "Illusionist with over 50 stage shows and children’s party experience.",
    created_at: "2024-03-10T11:20:00Z",
    img : "/images/magic.jpg"

  },
  {
    id: 5,
    name: "Yash Rajput",
    email: "yash.rajput@gmail.com",
    category: "Instrumentalist",
    priceRange: "₹7,000 - ₹18,000",
    city: "Indore",
    bio: "Performs live flute and tabla fusions for private and spiritual events.",
    created_at: "2024-02-28T14:15:00Z",
    img : "/images/drumSet.png"
  },
  {
    id: 6,
    name: "Meera Iyer",
    email: "meera.iyer@gmail.com",
    category: "Anchor/Host",
    priceRange: "₹9,000 - ₹20,000",
    city: "Hyderabad",
    bio: "Energetic stage host for corporate events, weddings, and college fests.",
    created_at: "2024-01-22T16:45:00Z",
    img : "/images/host.jpg"

  }
];


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

export const artistCategories = [
  "SINGER",
  "DANCER",
  "MAGICIAN",
  "COMEDIAN",
  "DJ",
  "INSTRUMENTALIST",
  "MIME",
  "THEATRE",
  "BEATBOXER",
  "SPEAKER",
  "PAINTER",
  "POET",
  "PHOTOGRAPHER",
  "MODEL",
  "CIRCUS",
];
