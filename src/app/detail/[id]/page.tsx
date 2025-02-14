"use client";

import React from "react";
import axios from "axios";
import { MoveLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import MovieMedia from "@/components/MovieMedia";
import CastAndCrew from "@/components/CastandCrew";
import { Skeleton } from "@/components/ui/skeleton";
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

  const params = useParams();
  const router = useRouter();
  const { push } = useRouter();

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
    .slice(0, 12);
  const topCast = creditData?.cast.slice(0, 12);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back(); 
    } else {
      router.push("/");
    }
  };

  return (
    <div className="w-full h-auto flex-col items-center justify-center relative">
      <MoveLeft
        className="absolute top-4 left-10 cursor-pointer z-[10000] transition-transform duration-300 hover:scale-125"
        onClick={handleBack}
      />
      <MovieMedia
        movieData={movieData}
        trailerKey={trailer?.key || ""}
        isLoading={isLoading}
      />
      <div className="max-w-2xl mx-auto px-4 mt-[80px] md:max-w-4xl lg:max-w-6xl">
        {/* Movie Description */}
        {isLoading ? (
          <div className="space-y-2 mt-[30px] md:mt-[50px]">
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          <div className="mt-30px lg:mt-[50px]">
            {/* Trailer Video Directly Below Overview */}
            {trailer && (
              <div className="w-full h-auto flex flex-col mt-[30px] md:mt-[50px]">
                <div className="flex flex-row items-center gap-2">
                  {" "}
                  <div className="w-[10px] h-[30px] rounded-[20px] bg-[#4338CA] flex items-center"></div>
                  <p className=" text-[24px] md:text-[30px] font-semibold ">
                    Trailer
                  </p>{" "}
                </div>

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
        <CastAndCrew
          director={director}
          writers={writers}
          topCast={topCast}
          isLoading={isLoading}
        />
        {/*similar movies data */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5 auto-rows-fr mt-[30px] lg:mt-[30px]">
          <div className="flex flex-row gap-[10px] items-center">
            {" "}
            <div className="w-[10px] h-[30px] rounded-[20px] bg-[#4338CA]"></div>
            <p className=" text-[24px] md:text-[30px] font-semibold p-0">
              You may like
            </p>{" "}
          </div>
          <button
            className="w-auto h-auto text-[15px] bg-transparent font-bold flex flex-row items-center gap-[8px] 
             hover:underline hover:decoration-[#4338CA] decoration-3 underline-offset-20"
            onClick={() => push(`/similarmovie/${params.id}`)}
          >
            See more
          </button>
        </div>
        <SimilarMovies similarMovies={similarMovies} router={router} />
      </div>
    </div>
  );
};

export default Page;
