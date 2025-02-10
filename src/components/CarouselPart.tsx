"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Star, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Header } from "./Header";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_SERVICE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
export default function ImageShifPart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [popularMoviesData, setPopularMoviesData] = useState<Movie[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [moviesSearch, setMoviesSearch] = useState("");
  const [showSearchValue, setShowSearchValue] = useState("");

  interface Movie {
    id: number;
    backdrop_path: string;
    title: string;
    vote_average: number;
    overview: string;
  }

  // Search movie data
  const fetchSearchMovies = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        `${TMDB_BASE_URL}/search/movie?query=${moviesSearch}&api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );

      setSearchMoviesData(response.data.results.slice(0, 10));
    } catch (err) {
      setErrorMessage("Failed to load movies.");
    } finally {
      setIsLoading(false);
    }
  };

  // genre list
  const fetchGenreListData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );

      setGenreList(response.data.genres);
    } catch (err: unknown) {
      console.log(err);
      setErrorMessage("Failed to load genres.");
    } finally {
      setIsLoading(false);
    }
  };

  const getMovieData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/upcoming?language=en-US&page=1`,
        {
          headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        }
      );
      setPopularMoviesData(response.data.results.slice(0, 8));
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
    if (moviesSearch) {
      setShowSearchValue(true);
      fetchSearchMovies();
    } else {
      setShowSearchValue(false);
    }
  }, [moviesSearch]);

  useEffect(() => {
    fetchGenreListData();
  }, []);

  const getMovieTrailer = async (movieId: number) => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${movieId}/videos?language=en-US`,
        {
          headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        }
      );
      const trailers = response.data.results.filter(
        (video: { type: string; site: string; key: string }) =>
          video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailers.length > 0) {
        setTrailerUrl(`https://www.youtube.com/embed/${trailers[0].key}`);
      } else {
        setTrailerUrl(null);
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
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
    <div className="flex flex-col items-center h-[80vh] z-[-1] ">
      {loading && <p className="text-center mt-10">Loading movies...</p>}
      {error && <p className="text-center mt-10 text-red-500">{error}</p>}

      {!loading && !error && popularMoviesData.length > 0 && (
        <div className="relative w-full max-w-[vw]  h-[80vh]">
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
                    <div className="w-full lg:w-[1280px] h-auto">
                      <div className="static text-foreground absolute top-1/4 lg:left-[140px] translate-y-1/2 z-[200]">
                        <div className="p-4 relative text-black lg:text-white">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="text-sm">Now Playing:</h4>
                              <h3 className="text-xl font-bold truncate dark:text-white">
                                {movie.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-x-2 mt-2">
                              <Star
                                className="w-5 h-5 text-[#FDE047]"
                                fill="currentColor"
                              />
                              <span className="text-md font-semibold dark:text-white">
                                {movie.vote_average.toFixed(1)}
                              </span>
                              <span className=" text-sm dark:text-white">
                                /10
                              </span>
                            </div>
                          </div>
                          <p className="w-[302px] text-[16px] leading-[24px] line-clamp-5 mt-4 dark:text-white ">
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

            {/* Fixed Icons on Carousel Container */}
            <div className="absolute top-4 left-0 w-full flex flex-row justify-center gap-[10px]"></div>
            {/* Hero Section */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgb(13, 13, 13), rgba(13, 13, 13, 0.3), transparent)",
                zIndex: 100,
              }}
            ></div>

            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
              <Button
                variant="outline"
                className="w-[144.45px] flex items-center justify-center bg-gray-200 dark:bg-gray-800 dark:text-white"
                onClick={() => getMovieTrailer(movie.id)}
              >
                <Play className="w-4 h-4" />
                <span>Watch Trailer</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {trailerUrl && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative w-[90%] max-w-3xl bg-white p-4 rounded-lg">
            <button
              onClick={() => setTrailerUrl(null)}
              className="absolute top-2 right-2 bg-gray-200 p-2 rounded-full"
            >
              <X className="w-6 h-6 text-black" />
            </button>
            <iframe
              className="w-full h-[300px] lg:h-[500px]"
              src={trailerUrl}
              title="Movie Trailer"
              allow="fullscreen"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
