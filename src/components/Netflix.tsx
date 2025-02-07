import React, { useState, useEffect } from "react";
import axios from "axios";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const Netflix = () => {
  const [firstMovie, setFirstMovie] = useState(null);

  useEffect(() => {
    const fetchNetflixMovies = async () => {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/discover/tv`, {
          params: {
            api_key: TMDB_API_KEY,
            watch_region: "US",
            with_watch_providers: 8, // Netflix provider ID
            sort_by: "popularity.desc", // Sort by trending/popular
          },
        });

        setFirstMovie(response.data.results[0]); // Should include Squid Game if it's trending
      } catch (error) {
        console.error("Error fetching Netflix movies:", error);
      }
    };

    fetchNetflixMovies();
  }, []);

  return (
    <div className="relative w-full h-[70vh] flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage: firstMovie
          ? `url(https://image.tmdb.org/t/p/original${firstMovie.backdrop_path})`
          : "none",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgb(13,13,13)] via-transparent to-[rgb(13,13,13)]"></div>

      {/* Movie Title */}
      <h1 className="text-white text-4xl font-bold relative z-10">
        {firstMovie ? firstMovie.name || firstMovie.title : "Loading..."}
      </h1>
    </div>
  );
};
