/* eslint-disable @next/next/no-img-element */
import { artistType } from "@/constants/artistType";
import { ArtistCategory } from "@/types/";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const Category = () => {
  return (
    <section>
      <div className="category-section flex justify-center items-center">
        <Carousel className="carousel w-full max-w-lg mx-auto px-3"> 
          <CarouselContent className="overflow-visible" >
            {artistType.map((item: ArtistCategory) => (
              <CarouselItem key={item.id} className="px-4" >
                <div className="p-1">
                  <Card className="bg-gray-950 flex flex-col md:flex-row justify-evenly items-center border border-blue-600 rounded-2xl h-auto w-full md:w-[30rem]">
                    <CardContent className="flex flex-col items-center md:items-start justify-center p-6 text-center md:text-left">
                      <img
                        src={item.icon}
                        alt={item.type}
                        className="w-20 h-20 mb-4"
                      />
                      <h3 className="text-lg font-bold text-white">{item.type}</h3>
                      <p className="text-md text-gray-400">
                        {item.available}+ artists
                      </p>
                    </CardContent>
                    <CardContent className="text-white flex flex-col gap-3 items-center justify-center p-6">
                      <p>{item.priceRange}</p>
                      <p>{item.events.join(", ")}</p>
<p>{item.genres.join(", ")}</p>

                      <Button variant={"ghost"} >Browse Artists</Button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="size-9"/>
          <CarouselNext className="size-9"/>
        </Carousel>
      </div>
    </section>
  );
};

export default Category;
