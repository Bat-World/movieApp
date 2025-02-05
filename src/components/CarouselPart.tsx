import Starx from "@/app/icons/Star";
import { useState, useEffect } from "react";
import axios from "axios";
import { Movie } from "@/app/types/types";
import PlayIcon from "@/app/icons/PlayIcon";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "./ui/card";
import { CardContent } from "./ui/card";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { log } from "console";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const ImageShiftPart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [popularMovieData, setPopularMovieData] = useState<Movie[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
 

  const getMovieData = async () => {
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
      
      setPopularMovieData(response.data.results);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data.statusmessage_message);
      }
      console.log(err);
    }
  };

  useEffect(() => {
    getMovieData();
  }, []);

   // Get currently active movie details
   const activeMovie = popularMovieData[activeIndex];

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));

  return (
    <div>
      <Carousel
        plugins={[plugin.current]}
        className="w-screen h-auto flex flex-col lg:relative mt-[84px] z-[-1]"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        onSlideChange={(embla) => setActiveIndex(embla.selectedScrollSnap())}
      >
        <CarouselContent>
          {popularMovieData.map((movie) => (
            <CarouselItem key={movie.id} className="w-full h-[246px] lg:relative lg:h-[600px] ">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
                }}
              ></div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="AboutMovie w-full h-auto px-[20px] py-[20px] flex flex-col gap-[16px] justify-content lg:absolute lg:top-[20%] lg:left-[10%] lg:w-[302px] lg:h-[246px] lg:rounded-[8px] lg:bg-transparent z-[]">
        <div className="w-full h-auto">
          <div className="flex flex-row w-auto h-auto justify-between lg:flex-col lg:gap-[8px]">
            <div>
              <div className="w-full h-[20px]">
                <p className="text-[14px] font-normal lg:text-white">Now playing:</p>
              </div>
              <div className="w-full h-[32px]">
                <p className="text-[24px] font-semibold lg:text-white">
                  {activeMovie?.original_title}
                </p>
              </div>
            </div>
            <div className="flex flex-row w-auto h-auto items-center gap-[8px]">
              <Starx />
              <p className="text-[16px] font-semibold lg:text-white">
                {activeMovie?.vote_average}
              </p>
              <p className=" lg:text-white">/10</p>
            </div>
          </div>
          <div className="flex flex-row"></div>
        </div>
        <div className="w-[320px] h-auto lg:h-auto">
          {" "}
          <p className="text-[14px] lg:text-white">{activeMovie?.overview}</p>
        </div>
        <div className="w-full h-[40px]">
          <button className="flex flex-row items-center text-white px-4 py-2 rounded-lg text-sm bg-[var(--button-bg)] gap-[4px]">
            <PlayIcon />
            <p className="text-[var(--text-color)] text-[14px] font-semibold">
              Play trailer
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
