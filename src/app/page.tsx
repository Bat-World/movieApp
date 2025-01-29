"use client";

import React from "react";
import { useState } from "react";
// import { Button } from "@/components/ui/button";
import RightArrow from "./icons/RightArrow";
// import { ThemeProvider } from "@/components/theme-provider";
import { ImageShiftPart } from "../components/CarouselPart";
import axios from "axios";
import { useEffect } from "react";
import { headers } from "next/headers";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export default function Home() {

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [popularMovieData, setPopularMovieData] = useState([]);

const getMovieData = async () => {
  try {
console.log("this is running");
const response = await axios.get(
  `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
  { 
    headers: {
      Authorization: `Bearer ${TMDB_API_TOKEN}`,
    },
  }
);
console.log(response.data.results); 
  } catch (err) {
    console.log(err);
  }
};

  
  useEffect(() => { 
    getMovieData();
  }, []);

    <>
      <ImageShiftPart />
      <div className="w-screen h-auto  flex justify-center ">
        <div className="w-100% h-auto  lg:w-90% lg:px-[40px] xl:max-w-[1280px]">
          <div className="MovieList w-100% h-auto px-[20px] flex flex-col mt-[32px] ">
            <div className="w-100% h-[36px] flex flex-row justify-between">
              <div className="w-[114px] h-100% flex justify-center items-center">
                <p className="text-[24px] font-semibold text-[#09090B]">
                  Upcoming
                </p>
              </div>
              <div className="w-[120px] h-100% flex flex-row justify-center items-center gap-[8px]">
                <p className="text-[14px] font-medium text-[#09090B]">
                  See more
                </p>
                <RightArrow />
              </div>
            </div>
            <div className="MovieImgs w-100%"></div>
          </div>
          <div className="MovieList w-100% h-auto px-[20px] flex flex-col mt-[32px]">
            <div className="w-100% h-[36px] flex flex-row justify-between">
              <div className="w-auto h-100% flex justify-center items-center">
                <p className="text-[24px] font-semibold ">
                  Top Rated
                </p>
              </div>
              <div className="w-[120px] h-100% flex flex-row justify-center items-center gap-[8px]">
                <p className="text-[14px] font-medium">
                  See more
                </p>
                <RightArrow />
              </div>
            </div>
            <div className="MovieImgs w-100%"></div>
          </div>
          <div className="MovieList w-100% h-auto px-[20px] flex flex-col mt-[32px]">
            <div className="w-100% h-[36px] flex flex-row justify-between">
              <div className="w-auto h-100% flex justify-center items-center">
                <p className="text-[24px] font-semibold ">
                  Popular
                </p>
              </div>
              <div className="w-[120px] h-100% flex flex-row justify-center items-center gap-[8px]">
                <p className="text-[14px] font-medium">
                  See more
                </p>
                <RightArrow />
              </div>
            </div>
            <div className="MovieImgs w-100%"></div>
          </div>
        </div>
      </div>
    </>
  
}
