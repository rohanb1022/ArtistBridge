import CTA from "@/components/CTA";
import Category from "@/sections/Category";
import Hero from "@/sections/Hero";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <div>
        <Hero/>
        <CTA/>
        <Category/> 
      </div>
    </div>
  );
}
