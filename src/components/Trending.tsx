import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY; 

const Top10Movies = () => {
  const [topMovies, setTopMovies] = useState([]);
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
      console.error("Error fetching movies:", error.response ? error.response.data : error.message);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="w-full text-white p-10 h-auto ">
      {/* Title */}
      <div className="flex flex-row items-center justify-center h-auto  text-white">
        <h3 className="text-outline text-6xl sm:text-8xl lg:text-9xl lg:ml-5 font-bold text-fill-black">
          <span className="ml-0 md:-ml-2 letter-shadow-r lg:-ml-3">T</span>
          <span className="-ml-2 letter-shadow-r lg:-ml-3">O</span>
          <span className="mr-1 -ml-2 letter-shadow-r lg:-ml-3">P</span>
          <span className="-ml-2 letter-shadow-r lg:-ml-3">1</span>
          <span className="-ml-2 letter-shadow-r lg:-ml-5 md:-ml-2.5">0</span>
        </h3>
        <div className="text-center mt-4 flex flex-col items-center">
          <h2 className="text-lg tracking-wide">CONTENT OF</h2>
          <h2 className="text-lg tracking-wide">THE WEEK</h2>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

      {/* Movie List */}
      <Swiper spaceBetween={20} slidesPerView={5} className="mt-5">
        {topMovies.map((movie, index) => (
          <SwiperSlide key={movie.id} className="relative flex flex-col items-center">
            <span className="absolute bottom-[-40px] text-[100px] font-extrabold text-red-600 opacity-50">
              {index + 1}
            </span>
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg shadow-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Top10Movies;