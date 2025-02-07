import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const Top10Movies = () => {
  interface Movie {
    id: number;
    title: string;
    poster_path: string;
  }

  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
        params: {
          api_key: TMDB_API_KEY,
        },
      });

      setTopMovies(response.data.results.slice(0, 10));
    } catch (error) {
      console.error(
        "Error fetching movies:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage("Failed to fetch movies. Please try again later.");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const { push } = useRouter();

  return (
    <div className="w-full text-white p-10 h-auto mt-[50px]">
      {/* Title */}
      <div className="flex flex-start gap-[30px]">
        <div className="flex flex-row items-center justify-center h-auto text-white">
          <h3 className="text-outline text-6xl sm:text-8xl lg:text-9xl lg:ml-5 font-bold text-[#4338CA] leading-[128px]">
            <span className="ml-0 md:-ml-2 letter-shadow-r lg:-ml-3">T</span>
            <span className="-ml-2 letter-shadow-r lg:-ml-3">O</span>
            <span className="mr-1 -ml-2 letter-shadow-r lg:-ml-3">P</span>
            <span className="-ml-2 letter-shadow-r lg:-ml-3">1</span>
            <span className="-ml-2 letter-shadow-r lg:-ml-5 md:-ml-2.5">0</span>
          </h3>
        </div>
        <div className="text-center mt-4 flex flex-col items-start ml-[5px]">
          <h2 className="text-[20px] tracking-widest text-center font-semibold leading-[24px]">
            CONTENT OF
          </h2>
          <h2 className="text-[20px] tracking-widest text-center font-semibold leading-[24px]">
            THE WEEK
          </h2>
        </div>
      </div>

  
      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}


      <Swiper spaceBetween={20} slidesPerView={5} className="mt-5">
        {topMovies.map((movie, index) => (
          <SwiperSlide
            key={movie.id}
            className="relative flex flex-col items-center group"
          >
        
            <span className="absolute text-[200px] font-extrabold text-[#4338CA] opacity-40 transition-opacity duration-300 group-hover:opacity-100 -z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {index + 1}
            </span>

            <Image
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              width={300}
              height={450}
              className="rounded-lg shadow-lg relative z-10"
              onClick={() => push(`/detail/${movie.id}`)}
              priority={true}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Top10Movies;
