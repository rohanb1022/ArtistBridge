import ArtistDemo from "@/sections/ArtistDemo";
import Footer from "@/sections/Footer";
import Hero from "@/sections/Hero";
import OrgDemo from "@/sections/OrgDemo";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero/>
      <ArtistDemo/>
      <OrgDemo/>
      <Footer/>
    </div>
  );
}
