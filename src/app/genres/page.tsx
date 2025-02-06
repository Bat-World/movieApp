"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import StarSmall from "@/app/icons/StarSmall";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

const Page = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  console.log(searchParams.get("genresId"));
  console.log(searchParams.get("page"));

  const selectedGenreIds = searchParams.get("genreIds")!;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [genreData, setGenreData] = useState<
    { id: number; poster_path: string; title: string; vote_average: number }[]
  >([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);

  //  Fetch list of all genres
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

  //  Fetch movies for selected genres
  const fetchGenreData = async () => {
    if (!selectedGenreIds.length) return;

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        params: {
          language: "en-US",
          page: 1,
          sort_by: "popularity.desc",
          with_genres: selectedGenreIds,
        },
      });

      setGenreData(response.data.results);
    } catch {
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
  }, [selectedGenreIds]);

  //  Handle genre selection
  const handleGenreSelection = (genreId: number) => {
    const updatedGenres = selectedGenreIds.includes(genreId)
      ? selectedGenreIds.filter((id) => id !== genreId) // Remove genre
      : [...selectedGenreIds, genreId]; // Add genre

    const queryParams = new URLSearchParams();
    if (updatedGenres.length) {
      queryParams.set("genresId", updatedGenres.join(","));
    }

    push(`/genres?${queryParams.toString()}`);
  };

  return (
    <div className="w-full h-auto flex flex-row mt-[100px]">
      <div className="col-span-1 space-x-1 w-[400px]">
        {genres.map((item) => (
          <Badge
            key={item.id}
            onClick={() => handleGenreSelection(item.id)}
            variant="outline"
            className={`${
              selectedGenreIds.includes(item.id)
                ? "bg-black text-white dark:bg-white dark:text-black"
                : ""
            } rounded-full cursor-pointer`}
          >
            {item.name}
          </Badge>
        ))}
      </div>

      <Separator
        orientation="vertical"
        className="h-full w-[2px] bg-gray-300"
      />

      <div className="col-span-2 w-50%">
        <h1 className="text-2xl font-bold text-center">
          {selectedGenreIds.length ? `Movies in Selected Genres` : "Movies"}
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
