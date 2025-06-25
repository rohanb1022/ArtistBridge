export interface ArtistCategory {
  id: number;
  type: string;
  priceRange: string;
  events: string[];
  genres: string[];
  icon: string;
  available: number;
}

export interface Artist {
  id: number;
  email : string;
  password : string;
  name: string;
  category: string;
  priceRange: string;
  location: string;
}

export enum Role {
  artist,
  organizer
}