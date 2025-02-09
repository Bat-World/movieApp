"use client";

import ImageShiftPart from "@/components/CarouselPart";
import UpcomingMovies from "@/components/Upcoming";
import TopRatedMovies from "@/components/TopRated";
import PopularMovies from "@/components/Popular";
import Trending from "@/components/Trending";
import { Netflix } from "@/components/Netflix";

export default function Home() {
  return (
    <>
      <ImageShiftPart />
      <div className="w-screen h-auto flex justify-center">
        <div className="w-full h-auto lg:w-90% lg:px-[40px] xl:max-w-[1280px]">
          <Trending />
          <UpcomingMovies />
          <div />
          <Netflix />
          <div className="w-full h-auto lg:w-90% lg:px-[40px] xl:max-w-[1280px]">
            <PopularMovies />
            <TopRatedMovies />
          </div>
        </div>
      </div>
    </>
  );
}
