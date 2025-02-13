"use client";

import React from "react";
import axios from "axios";
import Image from "next/image";
import { Play } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CastAndCrew from "@/components/CastandCrew";
import SimilarMovies from "@/components/SimilarMovie";

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
      console.log("apply image from heree", creditRes.data);

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
    .slice(0, 12);
  const topCast = creditData?.cast.slice(0, 12);

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

      {/* Movie Description */}
      {isLoading ? (
        <div className="space-y-2 mt-[30px] md:mt-[50px]">
          <Skeleton className="h-4 w-full" />
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            {movieData.overview}
          </p>

          {/* Trailer Video Directly Below Overview */}
          {trailer && (
            <div className="w-full h-auto mt-[30px] md:mt-[50px]">
              <iframe
                width="100%"
                height="400px"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                style={{ border: "none", display: "block" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      )}
      {/* cast and crew */}
      <CastAndCrew director={director} writers={writers} topCast={topCast} isLoading={isLoading} />
      {/*similar movies data */}
      <div className="flex flex-row justify-between mt-[50px]">
        <div className="flex flex-row gap-[10px] items-center">
          {" "}
          <div className="w-[10px] h-[30px] rounded-[20px] bg-[#4338CA] mt-[30px]"></div>
          <p className="mt-[30px] text-[24px] font-semibold">You may like</p>{" "}
        </div>
      </div>
      <SimilarMovies similarMovies={similarMovies} router={router} />
    </div>
  );
};

export default Page;
