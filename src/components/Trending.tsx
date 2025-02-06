import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const TMDB_BASE_URL = "https://api.themoviedb.org/3"; // Use the fixed base URL
const TMDB_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN; // Use the token

const Top10Movies = () => {
  const [topMovies, setTopMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
          headers: {
            Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        setTopMovies(response.data.results.slice(0, 10));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="w-full bg-black text-white p-10">
      {/* Title */}
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
  
  <h3 className="text-outline text-6xl sm:text-8xl lg:text-9xl lg:ml-5 font-bold text-fill-black">
    <span className="ml-0 md:-ml-2 letter-shadow-r lg:-ml-3">T</span>
    <span className="-ml-2 letter-shadow-r lg:-ml-3">O</span>
    <span className="mr-1 -ml-2 letter-shadow-r lg:-ml-3">P</span>
    <span className="-ml-2 letter-shadow-r lg:-ml-3">1</span>
    <span className="-ml-2 letter-shadow-r lg:-ml-5 md:-ml-2.5">0</span>
  </h3>
  <div className="text-center mt-4 flex felx-col items-center">
    <h2 className="text-lg tracking-wide">CONTENT OF</h2>
    <h2 className="text-lg tracking-wide">THE WEEK</h2>
  </div>
</div>

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
