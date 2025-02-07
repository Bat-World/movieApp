import { useState, useEffect } from "react";
import axios from "axios";
import { Movie } from "@/app/types/types";
import Image from "next/image";
import StarSmall from "@/app/icons/StarSmall";
import { useRouter } from "next/navigation";
import { MoveRightIcon } from "lucide-react";

interface MovieListProps {
  title: string;
  endpoint: string;
}

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

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

  return (
    <div className="MovieList w-full h-auto px-[40px] flex flex-col mt-[50px] items-center justify-center">

      <div className="w-full h-[36px] flex flex-row justify-between">
        <div className="w-auto h-full flex flex-row justify-center items-center gap-[10px]">
          <div className="w-[10px] h-[30px] rounded-[20px] bg-[#4338CA]"></div>
          <p className="text-[30px] font-bold">{title}</p>
        </div>
        <div className="w-[120px] h-full flex flex-row justify-center items-center gap-[8px]">
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

        <div className="flex flex-wrap gap-5 lg:gap-8 flex justify-center">
          {isLoading ? (
            <p>Loading...</p>
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : (
            movieData.map((movie) => (
              <div
                key={movie.id}
                className="bg-[var(--detail-bg)] w-[157px] h-[334px] bg-[#E4E4E7] rounded-[8px] flex flex-col lg:w-[230px] lg:h-[440px]"
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
                <div className=" flex flex-col w-auto h-auto items-start mt-2 px-2">
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
      </div>
    </div>
  );
};

export default MovieList;
