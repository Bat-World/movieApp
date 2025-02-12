"use client";

import React from "react";
import axios from "axios";
import Image from "next/image";
import { Play } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import StarSmall from "@/app/icons/StarSmall";
import { Button } from "@/components/ui/button";
import RightArrow from "@/app/icons/RightArrow";
import { movieDetail } from "@/app/types/movieDetail";
import { Skeleton } from "@/components/ui/skeleton";

// Type Definitions
interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface Credit {
  cast: { name: string }[];
  crew: { name: string; job: string }[];
}

interface MovieDetail {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  adult: boolean;
}

interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const Page = () => {
  const [movieData, setMovieData] = useState<MovieDetail | null>(null);
  const [videoData, setVideoData] = useState<Video[] | null>(null);
  const [creditData, setCreditData] = useState<Credit | null>(null);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState("");
  

  const params = useParams();
  const router = useRouter();

  // Fetch Data from API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [movieRes, videoRes, creditRes, similarRes] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/movie/${params.id}?language=en-US`, {
          headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        }),
        axios.get(
          `${TMDB_BASE_URL}/movie/${params.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`,
          {
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }
        ),
        axios.get(
          `${TMDB_BASE_URL}/movie/${params.id}/credits?api_key=${TMDB_API_KEY}&language=en-US`,
          {
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }
        ),
        axios.get(
          `${TMDB_BASE_URL}/movie/${params.id}/similar?language=en-US&page=1`,
          {
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }
        ),
      ]);

      setMovieData(movieRes.data);
      setVideoData(videoRes.data.results);
      setCreditData(creditRes.data);
      setSimilarMovies(similarRes.data.results.slice(0, 10));
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setErrorMessage("Failed to load movie details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const trailer = videoData?.find((video) => video.type === "Trailer");

  const director = creditData?.crew.find((member) => member.job === "Director");
  const writers = creditData?.crew
    .filter((member) => member.job === "Writer")
    .slice(0, 3);
  const topCast = creditData?.cast.slice(0, 3);

  const openTrailerModal = (key: string) => {
    setTrailerKey(key);
    setIsTrailerModalOpen(true);
  };
  const closeTrailerModal = () => {
    setIsTrailerModalOpen(false);
    setTrailerKey(""); // Reset trailerKey when closing
  };
    

  return (
    <div className="max-w-2xl mx-auto px-4 mt-[80px] md:max-w-4xl lg:max-w-6xl">
      {/* Movie Title & Details */}
      <div className="mt-6">
        {isLoading ? (
          <Skeleton className="h-8 w-3/4 mb-2" />
        ) : (
          <h1 className="text-[24px] lg:text-[36px] font-bold">
            {movieData.title}.
          </h1>
        )}
        <div className="flex items-center space-x-4 text-gray-500 text-sm mt-1">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-24" />
            </>
          ) : (
            <>
              <span>{movieData.release_date}</span>
              <span>• {movieData.adult ? "R" : "PG"}</span>
              <span>• {movieData.runtime}m</span>
              <div className="flex items-center text-yellow-500 font-semibold">
                ⭐{" "}
                <span className="ml-1">
                  {movieData.vote_average.toFixed(1)}/10
                </span>
                <span className="text-gray-400 ml-2 text-xs">
                  {movieData.vote_count}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Movie Thumbnail & Trailer */}
      <div className="relative mt-4 flex flex-row justify-between">
        {isLoading ? (
          <Skeleton className="w-full h-64 rounded-lg" />
        ) : (
          <>
            {/* Poster Image (Hidden on Small Screens) */}
            <Image
              src={`https://image.tmdb.org/t/p/w1280${movieData.poster_path}`}
              alt={movieData?.title || "Movie Poster"}
              width={800}
              height={450}
              objectFit="cover"
              className="hidden sm:hidden lg:block w-[222px] h-[428px] rounded-lg"
            />
            <div className="relative">
              <Image
                src={`https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}`}
                alt={movieData.title}
                width={800}
                height={450}
                className="lg:w-[760px] lg:h-[428px] rounded-lg w-[375px] h-auto"
              />
              <div className="absolute bottom-4 left-4 flex gap-2">
                {trailer && (
                 <button
                 onClick={() => openTrailerModal(trailer.key)}
                 className="flex items-center bg-black/70 text-white px-4 py-2 rounded-lg text-sm"
               >
                 ▶ Play trailer
               </button>
               
                )}
                <Button
                  onClick={() => router.push(`/watch/movie/${params.id}`)}
                  variant="outline"
                  className="text-base font-bold text-[#1A1D29] flex items-center bg-white/80 px-4 py-2 rounded-lg"
                >
                  <Play className="fill-[#1A1D29]" />
                  PLAY
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Trailer Modal */}
      {isTrailerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="relative w-full max-w-4xl bg-transparent p-0 rounded-lg">
            <button
              onClick={closeTrailerModal}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              ×
            </button>
            <div className="w-full h-auto">
              <iframe
                width="100%"
                height="400px"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Trailer"
                style={{ border: "none", display: "block" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Movie Description */}
      {isLoading ? (
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
        </div>
      ) : (
        <p className="text-gray-700 mt-4 text-sm leading-relaxed">
          {movieData.overview}
        </p>
      )}

      {/* Acting crew */}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5">
        {director && (
          <div>
            <h3 className="font-semibold">Director</h3>
            <p className="text-gray-600 text-sm">{director.name}</p>
          </div>
        )}
        {writers && writers.length > 0 && (
          <div>
            <h3 className="font-semibold">Writers</h3>
            <p className="text-gray-600 text-sm">
              {writers.map((writer: any) => writer.name).join(" · ")}
            </p>
          </div>
        )}
        {topCast && topCast.length > 0 && (
          <div>
            <h3 className="font-semibold">Stars</h3>
            <p className="text-gray-600 text-sm">
              {topCast.map((cast: any) => cast.name).join(" · ")}
            </p>
          </div>
        )}
      </div>
      {/*similar movies data */}
      <div className="flex flex-row justify-between mt-[50px]">
        <div className="flex flex-row gap-[10px] items-center">
          {" "}
          <div className="w-[10px] h-[30px] rounded-[20px] bg-[#4338CA] mt-[30px]"></div>
          <p className="mt-[30px] text-[24px] font-semibold">You may like</p>{" "}
        </div>

        <button
          className="w-auto h-auto text-[14px] bg-transparent font-bold flex flex-row items-center gap-[8px] hover:underline mt-[30px]"
          onClick={() => push(`/similarmovie/${params.id}`)}
        >
          See more
          <RightArrow />
        </button>
      </div>
      <div className="flex flex-wrap gap-5 lg:gap-8 justify-start mt-[30px]">
        {isLoading ? (
          <Skeleton className="flex flex-wrap gap-5 lg:gap-8 justify-start mt-[30px]" />
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : similarMovies && similarMovies.length > 0 ? (
          similarMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-transparent w-[157px] h-[334px] bg-[#E4E4E7] rounded-[8px] flex flex-col  lg:w-[230px] lg:h-[440px] cursor-pointer"
              onClick={() => router.push(`/detail/${movie.id}`)}
            >
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                  width={230}
                  height={340}
                  className="rounded-t-[8px] lg:w-[230px] lg:h-[340px] hover:opacity-60"
                />
              ) : (
                <div className="w-[230px] h-[340px] flex items-center justify-center bg-gray-300">
                  <p className="text-center text-gray-600">No Image</p>
                </div>
              )}
              <div className=" flex flex-col w-auto h-auto items-start mt-2 px-2 overflow-hidden">
                <div className="flex flex-row w-auto h-auto items-center gap-[8px]">
                  <StarSmall />
                  <p className="text-[16px] font-semibold">
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p>/10</p>
                </div>
                <p className="text-[18px] font-semibold">{movie.title}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No movies found for this genre.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
