"use client";

import ImageShiftPart from "@/components/CarouselPart";
import UpcomingMovies from "@/components/Upcoming";
import TopRatedMovies from "@/components/TopRated";
import PopularMovies from "@/components/Popular";
import { Netflix } from "@/components/Netflix";
import Trending from "@/components/Trending";


export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <ImageShiftPart />
      <div className="w-screen h-auto flex flex-col items-center">
        <div className="w-full h-auto lg:w-90% lg:px-[40px] xl:max-w-[1280px]">
          <Trending />
          <UpcomingMovies />
        </div>
        <div className="w-full h-auto px-[10px] mt-[50px] mb-[50px] lg:mb-[100px]">
          <Netflix />
        </div>
        <div className="w-full h-auto lg:w-90% lg:px-[40px] xl:max-w-[1280px]">
          <PopularMovies />
          <TopRatedMovies />
        </div>
      </div>
    </div>
  );
}
