"use client";
import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import StarSmall from "@/app/icons/StarSmall";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import RightArrow from "@/app/icons/RightArrow";
import { log } from "console";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const Page = () => {
  interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
  }

  const [videoData, setVideoData] = useState<Video[] | null>(null);
  interface Movie {
    title: string;
    release_date: string;
    adult: boolean;
    runtime: number;
    vote_average: number;
    vote_count: number;
    poster_path: string;
    backdrop_path: string;
    overview: string;
  }

  const [movieData, setMovieData] = useState([]);

  const [creditData, setCreditData] = useState<Credit | null>(null);
  interface SimilarMovie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
  }

  const [similarMovieData, setSimilarMovieData] = useState<
    SimilarMovie[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState("");
  const params = useParams();
  const router = useRouter();
  const { push } = useRouter();

  // Fetch movie details
  const fetchMovie = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${params.id}?&language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );
      setMovieData(response.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      setErrorMessage("Failed to load movie details.");
    }
  };

  // Fetch videos (trailers)
  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${params.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );

      console.log("trailerrr", response.data.results);

      setVideoData(response.data.results);
    } catch (err) {
      console.log("Failed to load videos:", err);
    }
  };

  // Fetch credits (cast and crew)
  const fetchCredits = async () => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${params.id}/credits?api_key=${TMDB_API_KEY}&language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );
      console.log("crewwwwwwww", response.data);

      setCreditData(response.data);
    } catch (err) {
      console.log("Failed to load credits:", err);
    }
  };

  // Fetch similar movies
  const fetchSimilarMoviesData = async () => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${params.id}/similar?language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );
      setSimilarMovieData(response.data.results.slice(0, 10));
    } catch (err) {
      console.log("Failed to load similar movies:", err);
    }
  };
  useEffect(() => {
    fetchMovie();
    fetchCredits();
    fetchVideos();
    fetchSimilarMoviesData();
  }, [params.id]);

  const openTrailerModal = (trailerKey: string) => {
    setTrailerKey(trailerKey);
    setIsTrailerModalOpen(true);
  };

  const closeTrailerModal = () => {
    setIsTrailerModalOpen(false);
    setTrailerKey("");
  };

  if (errorMessage) {
    return <div className="text-center mt-10 text-red-500">{errorMessage}</div>;
  }

  if (!movieData && !isLoading) {
    return <div className="text-center mt-10">No movie data found.</div>;
  }

  const trailer = videoData?.find((video: Video) => video.type === "Trailer");

  const director = creditData?.crew.find(
    (member: { name: string; job: string }) => member.job === "Director"
  );
  const writers = creditData?.crew
    .filter((member: { name: string; job: string }) => member.job === "Writer")
    .slice(0, 3);
  const topCast = creditData?.cast.slice(0, 3);

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
              alt={movieData.title}
              width={800}
              height={450}
              objectFit="cover"
              className="hidden sm:hidden lg:block w-[222px] h-[428px] rounded-lg"
            />

            {/* Backdrop Image */}
            <div className="relative">
              <Image
                src={`https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}`}
                alt={movieData.title}
                width={800}
                height={450}
                className="lg:w-[760px] lg:h-[428px] rounded-lg w-[375px] h-auto"
              />

              {/* Buttons Positioned Bottom-Left */}
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
          <div className="relative w-full max-w-4xl bg-white p-4 rounded-lg">
            <button
              onClick={closeTrailerModal}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              ×
            </button>
            <div
              className="aspect-w-16 aspect-h-9"
              style={{ height: "400px", margin: 0, padding: 0 }}
            >
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Trailer"
                style={{ border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-none"
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
        ) : similarMovieData && similarMovieData.length > 0 ? (
          similarMovieData.map((movie) => (
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
