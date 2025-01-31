"use client";
import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const Page = () => {
  const [videoData, setVideoData] = useState<any>(null);
  const [movieData, setMovieData] = useState<any>(null);
  const [creditData, setCreditData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
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

  // Fetch videos (trailers)
  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${param}/videos?language=en-US`,
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

  useEffect(() => {
    fetchMovie();
    fetchCredits();
    fetchVideos();
  }, [params.id]);

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (errorMessage) {
    return <div className="text-center mt-10 text-red-500">{errorMessage}</div>;
  }

  if (!movieData) {
    return <div className="text-center mt-10">No movie data found.</div>;
  }

  // Extract director, writers, and top 3 cast members
  const director = creditData?.crew.find(
    (member: any) => member.job === "Director"
  );
  const writers = creditData?.crew
    .filter((member: any) => member.job === "Writer")
    .slice(0, 3); // Limit to 3 writers
  const topCast = creditData?.cast.slice(0, 3); // Limit to 3 cast members

  // Find the first trailer
  const trailer = videoData?.find((video: any) => video.type === "Trailer");

  return (
    <div className="max-w-2xl mx-auto px-4 mt-[80px] md:max-w-4xl lg:max-w-6xl">
      {/* Movie Title & Details */}
      <div className="mt-6">
        <h1 className="text-2xl font-bold">{movieData.title}</h1>
        <div className="flex items-center space-x-4 text-gray-500 text-sm mt-1">
          <span>{movieData.release_date}</span>
          <span>• {movieData.adult ? "R" : "PG"}</span>
          <span>• {movieData.runtime}m</span>
          <div className="flex items-center text-yellow-500 font-semibold">
            ⭐ <span className="ml-1">{movieData.vote_average.toFixed(1)}/10</span>
            <span className="text-gray-400 ml-2 text-xs">
              {movieData.vote_count}
            </span>
          </div>
        </div>
      </div>

      {/* Movie Thumbnail & Trailer */}
      <div className="relative mt-4">
        <Image
          src={`https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}`}
          alt={movieData.title}
          width={800}
          height={450}
          className="w-full rounded-lg"
        />
        {trailer && (
          <a
            href={`https://www.youtube.com/watch?v=${trailer.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 left-4 flex items-center bg-black/70 text-white px-4 py-2 rounded-lg text-sm"
          >
            ▶ Play trailer <span className="ml-2">2:35</span>
          </a>
        )}
      </div>

      {/* Genres */}
      <div className="mt-4 flex flex-wrap gap-2">
        {movieData.genres.map((genre: any) => (
          <span
            key={genre.id}
            className="bg-gray-200 text-sm px-3 py-1 rounded-full"
          >
            {genre.name}
          </span>
        ))}
      </div>

      {/* Movie Description */}
      <p className="text-gray-700 mt-4 text-sm leading-relaxed">
        {movieData.overview}
      </p>

      {/* Director, Writers, Stars */}
      <div className="mt-6 space-y-4">
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

      {/* More Like This Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">More like this</h2>
          <a href="#" className="text-blue-500 text-sm">
            See more →
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-4">
          <div className="p-3">
            <div className="flex items-center text-yellow-500 text-sm font-semibold">
              ⭐ <span className="ml-1">rating</span>
            </div>
            <p className="text-sm mt-1">title</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;