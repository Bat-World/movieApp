import { useState, useEffect } from "react";
import axios from "axios";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const UpcomingMovies = () => {
  const [upcomingMovieData, setUpcomingMovieData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getUpcomingMovies = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );
      setUpcomingMovieData(response.data.results.slice(0, 10)); // Get the first 10 upcoming movies
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("Error fetching upcoming movies", err);
      setErrorMessage("Failed to load movies.");
    }
  };

  useEffect(() => {
    getUpcomingMovies();
  }, []);

  return (
    <div className="MovieList w-full h-auto px-[20px] flex flex-col mt-[32px]">
      <div className="w-full h-[36px] flex flex-row justify-between">
        <div className="w-[114px] h-full flex justify-center items-center">
          <p className="text-[24px] font-semibold">Upcoming</p>
        </div>
        <div className="w-[120px] h-full flex flex-row justify-center items-center gap-[8px]">
          <p className="text-[14px] font-medium text-[#09090B]">See more</p>
        </div>
      </div>

      <div className="MovieImgs w-full h-auto mt-[20px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 mt-6 2xl:gap-[30px]">
          {isLoading ? (
            <p>Loading...</p>
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : (
            upcomingMovieData.map((movie) => (
              <div
                key={movie.id}
                className="w-[175px] h-[233px] bg-[#E4E4E7] rounded-[8px] lg:w-[230px] lg:h-[440px]"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-[8px]"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingMovies;
