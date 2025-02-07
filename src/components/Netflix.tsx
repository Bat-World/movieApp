import React, { useState, useEffect } from "react";
import axios from "axios";
import NetflixIcon from "@/app/icons/Netflix";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const Netflix = () => {
  const [firstMovie, setFirstMovie] = useState(null);
  const [netflixData, setNetflixData] = useState([]);

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
      setFirstMovie(response.data.results[0]);
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
      className="relative w-full min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center items-center bg-cover bg-center mt-[70px] mb-[120px] md:mb-[150px]"
      style={{
        backgroundImage: firstMovie
          ? `url(https://image.tmdb.org/t/p/original${firstMovie.backdrop_path})`
          : "none",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgb(13,13,13)] via-transparent to-[rgb(13,13,13)]"></div>

      {/* Netflix Intro */}
      <div className="absolute top-16 md:top-20 left-5 md:left-8 w-[250px] md:w-[300px]">
        <p className="text-white text-[20px] md:text-[24px] font-semibold leading-[28px] md:leading-[32px]">
          <span className="text-[#4338CA]">YOU</span> ARE <br />
          ABOUT TO <span className="text-[#4338CA]">DISCOVER</span> <br />
          <span className="text-[#4338CA]">TRENDING</span> SERIES ON
        </p>
        <div className="mt-[30px] md:mt-[40px]">
          <NetflixIcon />
        </div>
      </div>

     {/* Swipe */}
      <div className="absolute bottom-[-100px] md:bottom-[-130px] left-0 w-full h-[150px] flex justify-center items-end pb-4">
        <Swiper
          spaceBetween={15}
          breakpoints={{
            320: { slidesPerView: 2 }, // Mobile
            480: { slidesPerView: 3 },
            768: { slidesPerView: 4 }, // Tablets
            1024: { slidesPerView: 5 }, // Small laptops
            1280: { slidesPerView: 6 }, // Desktops
          }}
          className="w-full px-4 md:px-8"
        >
          {netflixData.map((movie) => (
            <SwiperSlide key={movie.id} className="flex flex-col items-center">
              <Image
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.name || "Movie poster"}
                width={300}
                height={450}
                className="rounded-lg shadow-lg cursor-pointer"
                onClick={() => push(`/seriesdetail/${movie.id}`)}
                priority
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
