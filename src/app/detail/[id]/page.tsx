"use client";
import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const Page = () => {
  const [videoData, setVideoData] = useState<any>(null);
  const [movieData, setMovieData] = useState<any>(null);
  const [creditData, setCreditData] = useState<any>(null);
  const [similarMovieData, setSimilarMovieData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState("");
  const params = useParams();

  // Fetch movie details
  const fetchMovie = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${params.id}?api_key=${TMDB_API_KEY}&language=en-US`,
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
      setCreditData(response.data);
    } catch (err) {
      console.log("Failed to load credits:", err);
    }
  };

   // Fetch similar movies
   const fetchSimilarMoviesData = async () => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${params.id}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );
      setSimilarMovieData(response.data.results);
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

  // Find the first trailer
  const trailer = videoData?.find((video: any) => video.type === "Trailer");

   // Extract director, writers, and top 3 cast members
   const director = creditData?.crew.find(
    (member: any) => member.job === "Director"
  );
  const writers = creditData?.crew
    .filter((member: any) => member.job === "Writer")
    .slice(0, 3); // Limit to 3 writers
  const topCast = creditData?.cast.slice(0, 3); // Limit to 3 cast members

 

  return (
    <div className="max-w-2xl mx-auto px-4 mt-[80px] md:max-w-4xl lg:max-w-6xl">
      {/* Movie Title & Details */}
      <div className="mt-6">
        {isLoading ? (
          <Skeleton className="h-8 w-3/4 mb-2" />
        ) : (
          <h1 className="text-2xl font-bold">{movieData.title}</h1>
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
                ⭐ <span className="ml-1">{movieData.vote_average.toFixed(1)}/10</span>
                <span className="text-gray-400 ml-2 text-xs">
                  {movieData.vote_count}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Movie Thumbnail & Trailer */}
      <div className="relative mt-4">
        {isLoading ? (
          <Skeleton className="w-full h-64 rounded-lg" />
        ) : (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}`}
              alt={movieData.title}
              width={800}
              height={450}
              className="w-full rounded-lg"
            />
            {trailer && (
              <button
                onClick={() => openTrailerModal(trailer.key)}
                className="absolute bottom-4 left-4 flex items-center bg-black/70 text-white px-4 py-2 rounded-lg text-sm"
              >
                ▶ Play trailer
              </button>
            )}
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
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Trailer"
                frameBorder="0"
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

      {/* Director, Writers, Stars */}
      <div className="mt-6 space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-48" />
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
      {/* ... */}
    </div>
  );
};

export default Page;
