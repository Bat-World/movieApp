import { useState, useEffect } from "react";
import axios from "axios";
import { Movie } from "@/app/types/types";
import Image from "next/image";
import StarSmall from "@/app/icons/StarSmall";
import { useRouter } from "next/navigation";

interface MovieListProps {
  title: string;
  endpoint: string;
}

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const MovieList = ({ title, endpoint }: MovieListProps) => {
  const [movieData, setMovieData] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );
      setMovieData(response.data.results.slice(0, 10)); // Get the first 10 movies
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(`Error fetching ${title} movies`, err);
      setErrorMessage("Failed to load movies.");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [endpoint]);

  const { push } = useRouter();

  const renderSkeleton = () => {
    return Array(10)
      .fill(0)
      .map((_, index) => (
        <div
          key={index}
          className="w-[157px] h-[334px] bg-[#E4E4E7] rounded-[8px] flex flex-col lg:w-[230px] lg:h-[440px] animate-pulse"
        >
          <div className="w-full h-[234px] bg-gray-300 rounded-t-[8px] lg:h-[340px]"></div>
          <div className="flex flex-col w-auto h-auto items-start mt-2 px-2">
            <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
            <div className="flex flex-row w-auto h-auto items-center gap-[8px] mt-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="w-8 h-4 bg-gray-300 rounded"></div>
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ));
  };

  return (
    <div className="MovieList w-full h-auto px-[20px] flex flex-col mt-[32px]">
      <div className="w-full h-[36px] flex flex-row justify-between">
        <div className="w-[114px] h-full flex justify-center items-center">
          <p className="text-[24px] font-semibold">{title}</p>
        </div>
        <div className="w-[120px] h-full flex flex-row justify-center items-center gap-[8px]">
          <button
            className="w-auto h-auto text-[14px] font-medium bg-transparent"
            onClick={() => push(`/category/${endpoint}`)}
          >
            See more
          </button>
        </div>
      </div>

      <div className="MovieImgs w-full h-auto mt-[20px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 mt-6 2xl:gap-[30px]">
          {isLoading ? (
            renderSkeleton()
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : (
            movieData.map((movie) => (
              <div
                key={movie.id}
                className="w-[157px] h-[334px] bg-[#E4E4E7] rounded-[8px] flex flex-col lg:w-[230px] lg:h-[440px]"
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
                  <p className="text-[16px] font-semibold">{movie.title}</p>
                  <div className="flex flex-row w-auto h-auto items-center gap-[8px]">
                    <StarSmall />
                    <p className="text-[16px] font-semibold">
                      {movie.vote_average}
                    </p>
                    <p>/10</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieList;