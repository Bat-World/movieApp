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
        params: { api_key: TMDB_API_KEY },
      });
      setTopMovies(response.data.results.slice(0, 10));
    } catch (error) {
      console.error("Error fetching movies:", error.response ? error.response.data : error.message);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const { push } = useRouter();

  return (
    <div className="w-full text-white px-6 md:px-10 py-10 h-auto mt-[50px]">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
        <div className="flex flex-row items-center justify-center">
          <h3 className="text-outline text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-[#4338CA] leading-tight">
            <span className="letter-shadow-r">T</span>
            <span className="letter-shadow-r">O</span>
            <span className="letter-shadow-r">P</span>
            <span className="letter-shadow-r">1</span>
            <span className="letter-shadow-r">0</span>
          </h3>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-lg md:text-xl tracking-widest font-semibold leading-[24px]">
            CONTENT OF
          </h2>
          <h2 className="text-lg md:text-xl tracking-widest font-semibold leading-[24px]">
            THE WEEK
          </h2>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}

      {/* Swiper Slider */}
      <Swiper
        spaceBetween={15}
        breakpoints={{
          320: { slidesPerView: 2 }, // Mobile
          480: { slidesPerView: 3 },
          768: { slidesPerView: 4 }, // Tablets
          1024: { slidesPerView: 5 }, // Small laptops
          1280: { slidesPerView: 6 }, // Large screens
        }}
        className="mt-6"
      >
        {topMovies.map((movie, index) => (
          <SwiperSlide key={movie.id} className="relative flex flex-col items-center group">
            {/* Background Number */}
            <span className="absolute text-[100px] sm:text-[140px] md:text-[160px] lg:text-[200px] font-extrabold text-[#4338CA] opacity-40 transition-opacity duration-300 group-hover:opacity-100 -z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {index + 1}
            </span>

            {/* Movie Poster */}
            <Image
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              width={250}
              height={375}
              className="rounded-lg shadow-lg cursor-pointer"
              onClick={() => push(`/detail/${movie.id}`)}
              priority
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Top10Movies;
