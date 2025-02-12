"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import NetflixIcon from "@/app/icons/Netflix";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const Netflix = () => {
  const [netflixData, setNetflixData] = useState([]);
  const swiperRef = useRef(null);

  const fetchNetflixMovies = async () => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/discover/tv`, {
        params: {
          api_key: TMDB_API_KEY,
          watch_region: "US",
          with_watch_providers: 8,
          sort_by: "popularity.desc",
        },
      });
      setNetflixData(response.data.results);
    } catch (error) {
      console.error("Error fetching Netflix movies:", error);
    }
  };

  useEffect(() => {
    fetchNetflixMovies();
  }, []);

  const { push } = useRouter();

  return (
    <div
      className="relative w-full min-h-screen flex flex-col justify-between items-center bg-cover bg-center mt-[70px] md:mt-[100px] lg:mt-[150px]"
      style={{
        backgroundImage: "url('/grayscale_breaking_bad.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgb(13,13,13)] via-transparent to-[rgb(13,13,13)]"></div>

 
      <div className="relative w-full max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col flex-grow min-h-[80vh]">
        <div className="w-[250px] md:w-[300px] mt-10 md:mt-20">
          <p className="text-white text-[20px] md:text-[24px] font-bold leading-[28px] md:leading-[32px]">
            <span className="text-[#4338CA]">YOU</span> ARE <br />
            ABOUT TO <span className="text-[#4338CA]">DISCOVER</span> <br />
            <span className="text-[#4338CA]">TRENDING</span> SERIES ON
          </p>
          <div className="mt-[30px] md:mt-[40px]">
            <NetflixIcon />
          </div>
        </div>

        <div className="relative w-full mt-auto pb-10">
          {" "}
          <Swiper
            spaceBetween={15}
            breakpoints={{
              320: { slidesPerView: 2 },
              480: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Navigation]}
            className="w-full"
          >
            {netflixData.map((movie) => (
              <SwiperSlide
                key={movie.id}
                className="flex flex-col items-center"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.name || "Movie poster"}
                  width={300}
                  height={450}
                  className="rounded-lg shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110"
                  onClick={() => push(`/seriesdetail/${movie.id}`)}
                  priority
                />
              </SwiperSlide>
            ))}
          </Swiper>
       
          <button
            className="absolute bottom-[140px] left-[-40px] z-10 
          flex items-center justify-center w-12 h-12 rounded-full 
          bg-black bg-opacity-50 hover:bg-opacity-70 transition duration-300"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <FaChevronLeft className="text-white text-4xl" />
          </button>
          <button
            className="absolute bottom-[140px] right-[-40px] z-10 
          flex items-center justify-center w-12 h-12 rounded-full 
          bg-black bg-opacity-50 hover:bg-opacity-70 transition duration-300"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <FaChevronRight className="text-white text-4xl" />
          </button>
        </div>
      </div>
    </div>
  );
};
