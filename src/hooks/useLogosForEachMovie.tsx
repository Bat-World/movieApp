import React from 'react'
import { AxiosError } from 'axios';


const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const TMDB_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_SERVICE_URL;

const useLogosForEachMovie = () => {
    

    const fetchMovieLogo = async (movieId: number) => {
        try {
          const response = await axios.get(
            `${TMDB_BASE_URL}/movie/${movieId}/images`,
            {
              headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
            }
          );
          console.log(`Logos for movie ${movieId}:`, response.data);
      
          const logo = response.data.logos.find((logo: any) => logo.iso_639_1 === "en");
      
          return logo ? logo.file_path : null;
        } catch (error) {
          console.error(`Error fetching logo for movie ${movieId}:`, error);
          return null;
        }
      };
      
      const fetchMoviesWithLogos = async (movies: any[]) => {
        return Promise.all(
          movies.slice(0, 8).map(async (movie) => {
            const logoPath = await fetchMovieLogo(movie.id);
            return { ...movie, logo_path: logoPath };
          })
        );
      };

      const moviesWithLogos = await fetchMoviesWithLogos(response.data.results);
      
  return (
    <div>useLogosForEachMovie</div>
  )
}

export default useLogosForEachMovie