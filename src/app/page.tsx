"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Carousel } from "@/components/ui/carousel";
import { ImageShiftPart } from "@/components/CarouselPart";
import UpcomingMovies from "@/components/Upcoming";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export default function Home() {
  const [popularMovieData, setPopularMovieData] = useState([]);

  
  const getMovieData = async () => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );
      setPopularMovieData(response.data.results);
    } catch (err) {
      console.log("Error fetching popular movies", err);
    }
  };

  const getUpcomingMovies = async () => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );
      setUpcomingMovieData(response.data.results);
    } catch (err) {
      console.log("Error fetching upcoming movies", err);
    }
  };

  useEffect(() => {
    getMovieData();
    getUpcomingMovies();
  }, []);

  return (
    <>
    <ImageShiftPart/>
      <div className="w-screen h-auto flex justify-center ">
        <div className="w-100% h-auto lg:w-90% lg:px-[40px] xl:max-w-[1280px]">
          <UpcomingMovies/>
        </div>
      </div>
    </>
  );
}
