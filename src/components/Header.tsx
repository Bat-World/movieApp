"use client";

import NavBarIcon from "@/app/icons/headerIcon";
import { Movie } from "@/app/types/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Clapperboard, MoonIcon, SearchIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const Header = () => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const { setTheme, theme } = useTheme();
  const [moviesSearch, setMoviesSearch] = useState("");
  const [genreList, setGenreList] = useState<{ id: string; name: string }[]>(
    []
  );
  const [searchMoviesData, setSearchMoviesData] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSearchValue, setShowSearchValue] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMoviesSearch(event?.target?.value);
  };

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

  const fetchGenreListData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );

      setGenreList(response.data.genres);
    } catch (err: unknown) {
      console.log(err);
      setErrorMessage("Failed to load genres.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (moviesSearch) {
      setShowSearchValue(true);
      fetchSearchMovies();
    } else {
      setShowSearchValue(false);
    }
  }, [moviesSearch]);

  useEffect(() => {
    fetchGenreListData();
  }, []);

  const { push } = useRouter();

  const handleMovieClick = (movieId: number) => {
    push(`/detail/${movieId}`);
    setShowSearchValue(false);
  };

  const handleGenreClick = (value: string) => {
    router.push(`/genres?page=1&genreIds=${value}`);
  };

  return (
    <div className="fixed w-screen h-auto flex justify-center bg-transparent z-100">
      <div className="header flex justify-center items-center h-auto w-full px-[20px] justify-between lg:w-90% lg:px-[40px] xl:max-w-[1280px]">
        
        <div className="hidden lg:flex w-auto h-[36px] flex-row items-center gap-[8px]">
          <Select onValueChange={handleGenreClick}>
            <SelectTrigger className="hidden w-[180px] lg:flex">
              <Clapperboard width={18} className="mr-2" />
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              {genreList.map((genre, i) => (
                <SelectItem key={i} value={genre.id}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            className=" w-[379px] h-[36px] focus:outline-none focus:ring-0 focus:shadow-none"
            placeholder="Search for movies..."
            value={moviesSearch}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row items-center h-[20px] gap-[8px]">
          <NavBarIcon />
          <p className="text-[20px] font-bold text-[#4338CA] w-[64px]">
            MovieZ
          </p>
        </div>
        <div className="flex flex-row items-center w-[84px] h-[36px] justify-between">
          {!showSearch && (
            <button
              className="flex justify-center items-center w-[36px] h-[36px] rounded-md border-[#E4E4E7] border-solid border "
              onClick={() => setShowSearch(true)}
            >
              <SearchIcon />
            </button>
          )}
          {showSearch && (
            <div className="flex items-center w-[379px]">
              <SearchIcon className="mr-2 text-gray-600 bg-transparent" />
              <Input
                className="hidden w-[100%] h-[36px] focus:outline-none focus:ring-0 border-none"
                placeholder="Search"
                value={moviesSearch}
                onChange={handleChange}
              />
            </div>
          )}
          {theme === "dark" ? (
            <Button
              variant="outline"
              className="w-9 h-9"
              onClick={() => setTheme("light")}
            >
              <SunIcon />
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-9 h-9"
              onClick={() => setTheme("dark")}
            >
              <MoonIcon />
            </Button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {showSearchValue && (
        <div className="bg-[var(--search-bg)] absolute top-16 lg:w-[577px] lg:h-[720px]  border rounded-xl shadow-lg p-4 z-50">
          {isLoading ? (
            <p>Loading...</p>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : searchMoviesData.length > 0 ? (
            <ul>
              {searchMoviesData.map((movie) => (
                <li
                  key={movie.id}
                  className="p-2 border-b flex items-center cursor-pointer lg:w-[551px] lg:h-[116px]"
                  onClick={() => handleMovieClick(movie.id)} // Hide results after click
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w200${movie.backdrop_path}`}
                    alt={movie.title}
                    width={100}
                    height={500}
                    className="mr-2 rounded-[10px]"
                  />
                  <p>{movie.title}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};
