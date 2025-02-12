"use client";

import axios from "axios";
import Image from "next/image";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselContent,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "./ui/skeleton";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_SERVICE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

export default function ImageShiftPart() {
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [popularMoviesData, setPopularMoviesData] = useState<Movie[]>([]);
 

  interface Movie {
    id: number;
    backdrop_path: string;
    title: string;
    vote_average: number;
    overview: string;
    logo_path: string | null;
  }

  const getMovieData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/upcoming?language=en-US&page=1`,
        {
          headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        }
      );

      // Fetch logos for each movie
      const moviesWithLogos = await Promise.all(
        response.data.results.slice(0, 8).map(async (movie: any) => {
          const logoResponse = await axios.get(
            `${TMDB_BASE_URL}/movie/${movie.id}/images`,
            {
              headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
            }
          );
          const logo = logoResponse.data.logos.find(
            (logo: any) => logo.iso_639_1 === "en"
          );

          return {
            ...movie,
            logo_path: logo ? logo.file_path : null,
          };
        })
      );

      setPopularMoviesData(moviesWithLogos);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data.status_message || "Error fetching movies"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovieData();
  }, []);

  useEffect(() => {
    if (popularMoviesData.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % popularMoviesData.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [popularMoviesData]);

  return (
    <div className="flex flex-col items-center h-[80vh] z-[-1]">
      {loading && <Skeleton className="w-full h-[80vh]" />}
      {error && <p className="text-center mt-10 text-red-500">{error}</p>}

      {!loading && !error && popularMoviesData.length > 0 && (
        <div className="relative w-full max-w-[vw] h-[80vh]">
          <div className="absolute w-full h-[30px] bg-black z-1000"></div>

          {/* Carousel Container */}
          <div className="relative w-full">
            <Carousel className="w-full relative overflow-hidden">
              <CarouselContent
                style={{
                  transform: `translateX(-${activeIndex * 100}%)`,
                  transition: "transform 0.8s ease-in-out",
                }}
              >
                {popularMoviesData.map((movie, index) => (
                  <CarouselItem key={index} className="relative w-full">
                    <div className="relative w-full h-[80vh]">
                      <Image
                        src={`${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`}
                        alt={movie.title}
                        layout="fill"
                        className="object-cover"
                      />
                    </div>
                    {/* Content goes here */}
                    <div className="w-full flex justify-center z-1000">
                      <div className="w-full max-w-[1200px] px-[40px] lg:px-0 text-foreground absolute top-1/3 left-0 right-0 mx-auto z-[1000]">
                        <div className="p-4 relative text-black lg:text-white">
                          <div className="flex flex-col">
                            <div>
                              {movie.logo_path ? (
                                <div className="relative w-[400px] h-[200px]">
                                  <Image
                                    src={`${TMDB_IMAGE_BASE_URL}/original${movie.logo_path}`}
                                    alt={movie.title}
                                    className="object-contain"
                                    width={600}
                                    height={1000}
                                  />
                                </div>
                              ) : (
                                <h3 className="text-[20px] font-bold truncate text-white lg:text-[30px]">
                                  {movie.title}
                                </h3>
                              )}
                            </div>
                            <div className="flex items-center gap-x-2 mt-2">
                              <Star
                                className="w-5 h-5 text-[#FDE047]"
                                fill="currentColor"
                              />
                              <span className="text-md font-semibold dark:text-white">
                                {movie.vote_average.toFixed(1)}
                              </span>
                              <span className="text-sm dark:text-white">
                                /10
                              </span>
                            </div>
                          </div>
                          <p className="w-[302px] text-[16px] leading-[24px] line-clamp-5 mt-4 text-white normal">
                            {movie.overview}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="hidden md:block">
                <CarouselPrevious
                  onClick={() =>
                    setActiveIndex((prevIndex) =>
                      prevIndex === 0
                        ? popularMoviesData.length - 1
                        : prevIndex - 1
                    )
                  }
                  className="absolute left-5 top-[50%] transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10"
                />
                <CarouselNext
                  onClick={() =>
                    setActiveIndex(
                      (prevIndex) => (prevIndex + 1) % popularMoviesData.length
                    )
                  }
                  className="absolute right-5 top-[50%] transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10"
                />
              </div>
            </Carousel>
            {/* Gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgb(13, 13, 13), rgba(13, 13, 13, 0.3), transparent)",
                zIndex: 100,
              }}
            ></div>

            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"></div>
          </div>
        </div>
      )}
    </div>
  );
}
