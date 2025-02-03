"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SearchIcon, SunIcon } from "lucide-react";
import NavBarIcon from "@/app/icons/headerIcon";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Movie {
  id: number;
  title: string;
  backdrop_path: string | null;
}

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const Header = () => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const { setTheme, theme } = useTheme();
  const [moviesSearch, setMoviesSearch] = useState("");
  const [searchMoviesData, setSearchMoviesData] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSearchValue, setShowSearchValue] = useState<boolean>(false);
  // const [selectedMoviesData, setSelectedMoviesData] = useState([]);

  const handleChange = (event) => {
    setMoviesSearch(event.target.value);
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



  // const fetchSelectMovies = async () => {
  //   try {
  //     setIsLoading(true);
  //     setErrorMessage("");

  //     const response = await axios.get(
  //       `${TMDB_BASE_URL}  /discover/movie?language=en&with_genres=${genreIds}&page=1`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${TMDB_API_TOKEN}`,
  //         },
  //       }
  //     );

  //     setSelectedMoviesData(response.data.results);
  //   } catch (err) {
  //     setErrorMessage("Failed to load movies.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    if (moviesSearch) {
      setShowSearchValue(true);
      fetchSearchMovies();
      // fetchSelectMovies();
    } else {
      setShowSearchValue(false);
    }
  }, [moviesSearch]);
  
  const { push } = useRouter();

  const handleMovieClick = (movieId: number) => {
    push(`/detail/${movieId}`);
    setShowSearchValue(false);
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-[59px] flex justify-center">
      <div className="header flex justify-center items-center h-[59px] w-full px-[20px] justify-between lg:w-90% lg:px-[40px] xl:max-w-[1280px]">
        <div className="flex flex-row items-center w-[92px] h-[20px] gap-[8px]">
          <NavBarIcon />
          <p className="text-16px font-bold text-[#4338CA] w-[64px]">Movie Z</p>
        </div>
        <div className="hidden lg:flex w-auto h-[36px] flex-row items-center gap-[8px]">
          <Select>
            <SelectTrigger className="w-[90px] h-[36px] flex-row-reverse focus:outline-none focus:ring-0">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Action</SelectItem>
              <SelectItem value="dark">Adventure</SelectItem>
              <SelectItem value="dark">Comedy</SelectItem>
              <SelectItem value="dark">Crime</SelectItem>
              <SelectItem value="dark">Documentary</SelectItem>
              <SelectItem value="dark">Documentary</SelectItem>
              <SelectItem value="dark">Documentary</SelectItem>
              <SelectItem value="dark">Drama</SelectItem>
              <SelectItem value="dark">Family</SelectItem>
              <SelectItem value="dark">Fantasy</SelectItem>
              <SelectItem value="dark">History</SelectItem>
              <SelectItem value="dark">Horror</SelectItem>
              <SelectItem value="dark">Music</SelectItem>
              <SelectItem value="dark">Mystery</SelectItem>
              <SelectItem value="dark">Romance</SelectItem>
              <SelectItem value="dark">Science Fiction</SelectItem>
              <SelectItem value="dark">Thriller</SelectItem>
              <SelectItem value="dark">War</SelectItem>
              <SelectItem value="dark">Eastern</SelectItem>
            </SelectContent>
          </Select>

          <Input
            className="w-[379px] h-[36px] focus:outline-none focus:ring-0 focus:shadow-none"
            placeholder="Search for movies..."
            value={moviesSearch}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row items-center w-[84px] h-[36px] justify-between">
          {!showSearch && (
            <button
              className="flex justify-center items-center w-[36px] h-[36px] rounded-md border-[#E4E4E7] border-solid border lg:hidden"
              onClick={() => setShowSearch(true)}
            >
              <SearchIcon />
            </button>
          )}
          {showSearch && (
            <Input
              className="w-[379px] h-[36px]"
              placeholder="Search for movies..."
              value={moviesSearch}
              onChange={handleChange}
            />
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
        <div className="absolute top-16 w-[400px] bg-black   shadow-lg p-4 z-50">
          {isLoading ? (
            <p>Loading...</p>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : searchMoviesData.length > 0 ? (
            <ul>
              {searchMoviesData.map((movie) => ( 
                <li
                  key={movie.id}
                  className="p-2 border-b flex items-center cursor-pointer"
                  onClick={() => handleMovieClick(movie.id)} // Hide results after click
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w200${movie.backdrop_path}`}
                    alt={movie.title}
                    width={48}
                    height={48}
                    className="mr-2"
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
