"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import StarSmall from "@/app/icons/StarSmall";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const Page = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const selectedGenreIds = useMemo(
    () => searchParams.get("genresId")?.split(",").filter(Boolean) || [],
    [searchParams]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [moviesSearch, setMoviesSearch] = useState("");
  const [searchMoviesData, setSearchMoviesData] = useState<Movie[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchType, setSearchType] = useState<"genre" | "name">("genre"); 

  // Fetch list of all genres
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

  // Fetch movies for selected genres
  const fetchGenreData = async () => {
    if (selectedGenreIds.length === 0) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        params: {
          language: "en",
          with_genres: selectedGenreIds.join(","),
          page: 1,
        },
      });

      setSearchMoviesData(response.data.results);
    } catch {
      setErrorMessage("Failed to load movies.");
    } finally {
      setIsLoading(false);
    }
  };

  // Search movies by name
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

  useEffect(() => {
    fetchGenreList();
  }, []);

  useEffect(() => {
    if (searchType === "genre") {
      fetchGenreData();
    }
  }, [JSON.stringify(selectedGenreIds), searchType]);

  useEffect(() => {
    if (searchType === "name" && moviesSearch) {
      fetchSearchMovies();
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [moviesSearch, searchType]);

  // Handle genre selection
  const handleGenreSelection = (genreId: string) => {
    const currentGenres =
      searchParams.get("genresId")?.split(",").filter(Boolean) || [];

    const updatedGenres = currentGenres.includes(genreId)
      ? currentGenres.filter((id) => id !== genreId) // Remove genre
      : [...currentGenres, genreId]; // Add genre

    const queryParams = new URLSearchParams();
    if (updatedGenres.length) {
      queryParams.set("genresId", updatedGenres.join(","));
    }

    push(`/genres?${queryParams.toString()}`);
  };

  // Handle movie click
  const handleMovieClick = (movieId: number) => {
    push(`/detail/${movieId}`);
  };

  return (
    <div className="flex w-full h-auto justify-center">
    <div className="w-full h-full flex flex-col items-center mt-[100px] max-w-[1200px] px-[40px]">
      {/* Search Type Toggle */}
      <div className="w-full flex justify-center gap-4 mb-8 items-center">
        <button
          onClick={() => setSearchType("genre")}
          className={`px-4 py-2 rounded-full ${
            searchType === "genre"
              ? "text-white bg-transparent text-white font-semibold"
              : "text-white bg-transparent text-white font-normal"
          }`}
        >
          Search by Genre
        </button>
      |
        <button
          onClick={() => setSearchType("name")}
          className={`px-4 py-2 rounded-full ${
            searchType === "name"
               ? "text-white bg-transparent text-white font-semibold"
              : "text-white bg-transparent text-white font-normal"
          }`}
        >
          Search by Name
        </button>
      </div>

      {/* Search Bar (Visible only for Search by Name) */}
      {searchType === "name" && (
        <div className="w-full flex items-center justify-center mb-8">
          <div className="relative w-[70%] max-w-[600px]">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            <Input
              className="w-full pl-10 pr-4 h-[40px] rounded-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              placeholder="Search movies by name..."
              value={moviesSearch}
              onChange={(e) => setMoviesSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Genre Filters (Visible only for Search by Genre) */}
      {searchType === "genre" && (
        <div className="w-full flex flex-wrap justify-center gap-2 mb-8">
          {genres.map((genre) => (
            <Badge
              key={genre.id}
              onClick={() => handleGenreSelection(genre.id.toString())}
              variant="outline"
              className={`rounded-full cursor-pointer ${
                selectedGenreIds.includes(genre.id.toString())
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {genre.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Movie Display */}
      <div className="w-full">
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : errorMessage ? (
          <p className="text-center text-red-500">{errorMessage}</p>
        ) : searchMoviesData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {searchMoviesData.map((movie) => (
              <div
                key={movie.id}
                className="bg-[var(--detail-bg)] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleMovieClick(movie.id)}
              >
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                    width={200}
                    height={300}
                    className="w-full h-[300px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[300px] flex items-center justify-center bg-gray-300">
                    <p className="text-center text-gray-600">No Image</p>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <StarSmall />
                    <p className="text-sm font-semibold">
                      {movie.vote_average.toFixed(1)}/10
                    </p>
                  </div>
                  <p className="text-lg font-semibold mt-2">{movie.title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No movies found.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default Page;