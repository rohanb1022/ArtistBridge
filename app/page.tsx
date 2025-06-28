import ArtistDemo from "@/section/ArtistDemo";
import Footer from "@/section/Footer";
import Hero from "@/section/Hero";
import OrgDemo from "@/section/OrgDemo";

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
