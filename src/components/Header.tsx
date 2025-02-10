"use client";

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
import { House } from "lucide-react";
import { Popcorn } from "lucide-react";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const Header = () => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [moviesSearch, setMoviesSearch] = useState("");
  const [genreList, setGenreList] = useState<{ id: string; name: string }[]>(
    []
  );
  const [searchMoviesData, setSearchMoviesData] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSearchValue, setShowSearchValue] = useState<boolean>(false);
  const router = useRouter();




  

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
    fetchGenreListData();
  }, []);

  const { push } = useRouter();



  return (
    <div className="fixed top-0 left-0 w-screen h-[59px] flex justify-center bg-transparent z-[1000]">
      <div className="header flex justify-center items-center h-[59px] w-full px-[20px] justify-between lg:w-90% lg:px-[40px] xl:max-w-[1200px]">
        <div className="flex flex-row items-center h-[20px] gap-[8px]">
          <House
            className="cursor-pointer hover:text-[#4338CA]"
            onClick={() => push(`/`)}
          />
          {/* <p className="hover:text-[#4338CA]">Home</p> */}
        </div>
        <div className="hidden lg:flex w-auto h-[36px] flex-row items-center gap-[8px]">
          {/* <Select onValueChange={handleGenreClick}>
            <SelectTrigger className="hidden w-[180px] lg:flex focus:ring-offset-0">
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
          </Select>  */}

      <Popcorn  className="w-[50px] h-[50px] text-[#4338CA] font-bold"/>
        </div>
        <div className="flex flex-row items-center w-[84px] h-[36px] justify-between">
          {!showSearch && (
            <button
              className="flex justify-center items-center w-[36px] h-[36px] rounded-md border-[#E4E4E7] border-solid border lg:hidden"
              onClick={() => setShowSearch(true)}
            >
              <SearchIcon
                className="cursor-pointer hover:text-[#4338CA]"
                onClick={() => push(`/genres`)}
              />
            </button>
          )}
          {showSearch && (
            <div className="flex items-center w-[379px]">
              <SearchIcon className="mr-2 text-gray-600" />
             
            </div>
          )}
          <SearchIcon
            className="cursor-pointer hover:text-[#4338CA]"
            onClick={() => push(`/genres`)}
          />
        </div>
      </div>


  
    </div>
  );
};
