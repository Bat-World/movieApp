"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

const Page = () => {
  const params = useParams();
  const router = useRouter();

  const genreId = parseInt(params.id, 10);
  const currentPage = parseInt(params.page, 10) || 1;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [genreData, setGenreData] = useState([]);
  const [genreName, setGenreName] = useState("");

  // Fetch all genres and find the matching name
  const fetchGenreName = async () => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
        headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        params: { language: "en-US" },
      });

      const genres = response.data.genres;
      const genre = genres.find((g) => g.id === genreId);
      setGenreName(genre ? genre.name : "Unknown Genre");
    } catch (err) {
      setGenreName("Unknown Genre");
    }
  };

  // Fetch movies for the selected genre
  const fetchGenreData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        params: {
          include_adult: false,
          include_video: false,
          language: "en-US",
          page: currentPage,
          sort_by: "popularity.desc",
          with_genres: genreId,
        },
      });

      setGenreData(response.data.results);
    } catch (err) {
      setErrorMessage("Failed to load genres.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (genreId) {
      fetchGenreName();
      fetchGenreData();
    }
  }, [genreId, currentPage]);

  return (
    <div className="w-full h-full mt-[100px]">
      <h1 className="text-2xl font-bold text-center">{genreName} Movies</h1>

      <div className="w-full h-auto flex flex-wrap gap-4 justify-center mt-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : genreData.length > 0 ? (
          genreData.map((movie) => (
            <div
              key={movie.id}
              className="w-[157px] h-[334px] bg-[#E4E4E7] rounded-[8px] flex flex-col lg:w-[230px] lg:h-[440px] cursor-pointer"
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
              <div className="p-2">
                <p className="font-semibold text-sm">{movie.title}</p>
                <p className="text-xs text-gray-600">{movie.release_date}</p>
                <p className="text-xs text-yellow-500">⭐ {movie.vote_average.toFixed(1)}</p>
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
