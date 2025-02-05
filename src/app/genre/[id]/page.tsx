"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import StarSmall from "@/app/icons/StarSmall";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

const Page = () => {
  const params = useParams();
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const genreId = parseInt(params.id, 10) || 0; // ✅ Prevent NaN issues
  const currentPage = parseInt(params.page, 10) || 1;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [genreData, setGenreData] = useState([]);
  const [genres, setGenres] = useState([]); // ✅ Store genres separately
  const [selectedGenreIds, setSelectedGenreIds] = useState([]); // ✅ Properly store selected genre IDs

  // ✅ Fetch list of all genres
  const fetchGenreList = async () => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
        headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        params: { language: "en-US" },
      });
      setGenres(response.data.genres);
    } catch (err) {
      console.error("Failed to load genres:", err);
    }
  };

  // ✅ Fetch movies for the selected genre
  const fetchGenreData = async () => {
    if (!genreId) return; // ✅ Prevent unnecessary API calls
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
      setErrorMessage("Failed to load movies.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGenreList();
  }, []);

  useEffect(() => {
    fetchGenreData();
  }, [genreId, currentPage]);

  // ✅ Handle genre selection correctly
  const handleGenreSelection = (genreId) => {
    setSelectedGenreIds((prevSelected) => {
      let updatedGenres;
      if (prevSelected.includes(genreId)) {
        updatedGenres = prevSelected.filter((id) => id !== genreId); // Remove genre
      } else {
        updatedGenres = [...prevSelected, genreId]; // Add genre
      }

      // ✅ Update URL with new selected genres
      const queryParams = new URLSearchParams();
      queryParams.set("genresId", updatedGenres.join(","));
      push(`/genres?${queryParams.toString()}`);

      return updatedGenres;
    });
  };

  return (
    <div className="w-full h-auto flex flex-row mt-[100px]">
      <div className="col-span-1 space-x-1 w-[400px]">
        {genres.length > 0 &&
          genres.map((item) => {
            const genreIdStr = item.id.toString();
            const isSelected = selectedGenreIds.includes(item.id);
            return (
              <Badge
                onClick={() => handleGenreSelection(item.id)}
                variant="outline"
                key={item.id}
                className={`${
                  isSelected
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : ""
                } rounded-full cursor-pointer`}
              >
                {item.name}
              </Badge>
            );
          })}
      </div>

      <Separator orientation="vertical" className="h-full w-[2px] bg-gray-300" />

      <div className="col-span-2 w-50%">
        <h1 className="text-2xl font-bold text-center">
          {genreId ? `Movies in Genre ${genreId}` : "Movies"}
        </h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : genreData.length > 0 ? (
          <div className="w-auto h-auto flex flex-wrap gap-4 justify-center mt-4">
            {genreData.map((movie) => (
              <div
                key={movie.id}
                className="bg-[var(--detail-bg)] w-[157px] h-[334px] bg-[#E4E4E7] rounded-[8px] flex flex-col lg:w-[230px] lg:h-[440px] cursor-pointer"
                onClick={() => push(`/detail/${movie.id}`)}
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
                <div className="flex flex-col w-auto h-auto items-start mt-2 px-2">
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
            ))}
          </div>
        ) : (
          <p>No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
