"use client";

import { SeriesData } from "@/types/seriesData";
import { Movie } from "@/types/movieData";
import StarSmall from "@/icons/StarSmall";
import { MoveRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import axios from "axios";

interface MovieListProps {
  title: string;
  endpoint: string;
  seriesEndpoint: string;
  name: string;
}

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const MovieList = ({ title, endpoint, seriesEndpoint }: MovieListProps) => {
  const [movieData, setMovieData] = useState<Movie[]>([]);
  const [seriesData, setSeriesData] = useState<SeriesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [choosentype, setChoosenType] = useState<"movie" | "series">("movie");

  const { push } = useRouter();

  // Fetch data based on the chosen type
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const url =
        choosentype === "movie"
          ? `${TMDB_BASE_URL}/movie/${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1`
          : `${TMDB_BASE_URL}/tv/${seriesEndpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${TMDB_API_TOKEN}`,
        },
      });

      if (choosentype === "movie") {
        setMovieData(response.data.results.slice(0, 10));
      } else {
        setSeriesData(response.data.results.slice(0, 10));
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(`Error fetching ${choosentype} data:`, err);
      setErrorMessage(`Failed to load ${choosentype} data.`);
    }
  };

  useEffect(() => {
    fetchData();
  }, [choosentype, endpoint, seriesEndpoint]);

  return (
    <div className="MovieList w-full h-auto px-[40px] flex flex-col mt-[50px] items-center">
      <div className="w-full h-[36px] flex flex-row justify-between">
        <div className="w-auto h-full flex flex-row justify-center items-center gap-[10px]">
          <div className="w-[10px] h-[30px] rounded-[20px] bg-[#4338CA]"></div>
          <p className="text-[30px] font-bold">{title}</p>
          {/*Toggle */}
          <div>
            <button
              onClick={() => setChoosenType("movie")}
              className={`px-4 py-2 rounded-[6px] ${
                choosentype === "movie"
                  ? "text-white text-white font-semibold bg-[#4338CA]"
                  : "text-white bg-transparent text-white font-normal"
              }`}
            >
              Movie
            </button>
            <button
              onClick={() => setChoosenType("series")}
              className={`px-4 py-2 rounded-[6px] ${
                choosentype === "series"
                  ? "text-white bg-[#4338CA] text-white font-semibold"
                  : "text-white bg-transparent text-white font-normal"
              }`}
            >
              Series
            </button>
          </div>
        </div>
        <div className="w-auto h-full flex flex-row justify-center items-center gap-[8px]">
          <button
            className="w-auto h-auto text-[15px] bg-transparent font-bold flex flex-row items-center gap-[8px] 
             hover:underline hover:decoration-[#4338CA] decoration-3 underline-offset-20"
            onClick={() => push(`/category/${endpoint}`)}
          >
            See more
            <MoveRightIcon />
          </button>
        </div>
      </div>

      <div className="MovieImgs w-full h-auto mt-[30px]">
        {/* Movie */}
        {choosentype === "movie" && (
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 auto-rows-fr">

            {isLoading ? (
              // Skeleton loading state
              Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex flex-col">
                  <Skeleton className="w-[157px] h-[250px] rounded-[8px] lg:w-[230px] lg:h-[345px]" />
                  <Skeleton className="w-[157px] lg:w-[230px] h-[10px] mt-[10px]" />
                  <Skeleton className="w-[157px] lg:w-[230px] h-[27px] mt-[10px]" />
                </div>
              ))
            ) : errorMessage ? (
              <p>{errorMessage}</p>
            ) : (
              movieData.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-transparent w-[157px] h-[334px] bg-[#E4E4E7] rounded-[8px] flex flex-col lg:w-[230px] lg:h-[440px] hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => push(`/detail/${movie.id}`)}
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                    width={157}
                    height={234}
                    layout="intrinsic"
                    objectFit="cover"
                    className="rounded-t-[8px] rounded-b-[0px] lg:w-[230px] lg:h-[340px] hover:opacity-60"
                  />
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
              ))
            )}
          </div>
        )}

        {/* Series */}
        {choosentype === "series" && (
          <div className="flex flex-wrap gap-5 lg:gap-8 justify-start">
            {isLoading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex flex-col">
                <Skeleton className="w-[157px] h-[250px] rounded-[8px] lg:w-[230px] lg:h-[345px]" />
                <Skeleton className="w-[157px] lg:w-[230px] h-[10px] mt-[10px]" />
                <Skeleton className="w-[157px] lg:w-[230px] h-[27px] mt-[10px]" />
              </div>
            ))
            ) : errorMessage ? (
              <p>{errorMessage}</p>
            ) : (
              seriesData.map((series) => (
                <div
                  key={series.id}
                  className="bg-transparent w-[157px] h-[334px] bg-[#E4E4E7] rounded-[8px] flex flex-col lg:w-[230px] lg:h-[440px] hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => push(`/seriesdetail/${series.id}`)}
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w500/${series.poster_path}`}
                    alt={series.name}
                    width={157}
                    height={234}
                    layout="intrinsic"
                    objectFit="cover"
                    className="rounded-t-[8px] rounded-b-[0px] lg:w-[230px] lg:h-[340px] hover:opacity-60"
                  />
                  <div className="flex flex-col w-auto h-auto items-start mt-2 px-2">
                    <div className="flex flex-row w-auto h-auto items-center gap-[8px]">
                      <StarSmall />
                      <p className="text-[16px] font-semibold">
                        {series.vote_average.toFixed(1)}
                      </p>
                      <p>/10</p>
                    </div>
                    <p className="text-[18px] font-semibold">{series.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieList;
