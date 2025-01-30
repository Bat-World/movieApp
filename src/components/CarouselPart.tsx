
import { Button } from "./ui/button";
import Starx from "@/app/icons/Star";
import { useState, useEffect } from "react";
import axios
 from "axios";


 const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
 const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
 const TMDB_API_KEY = process.env.TMDB_API_KEY;

export const ImageShiftPart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [popularMovieData, setPopularMovieData] = useState([]);

  const getMovieData = async () => {
    try {
      setIsLoading(true);
      console.log("this is running");
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
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
  console.log("This is the error", errorMessage);
  console.log(isLoading);
  console.log("This is the data", popularMovieData);


  useEffect(() => {
    getMovieData();
  }, []);

  return (
    <div className="w-screen h-auto flex flex-col lg:relative">
      <div className="ImageContainer w-full h-[246px] flex justify-center items-center lg:h-[600px]">

      </div>
      <div className="AboutMovie w-full h-auto px-[20px] py-[20px] flex flex-col gap-[16px] justify-content lg:absolute lg:top-[40%] lg:left-[10%] lg:w-[302px] lg:h-[246px] lg:rounded-[8px] lg:bg-transparent">
        <div className="w-full h-auto">
          <div className="flex flex-row w-auto h-auto justify-between lg:flex-col lg:gap-[8px]">
            <div>
              <div className="w-full h-[20px]">
                <p className="text-[14px] font-normal">Now playing:</p>
              </div>
              <div className="w-full h-[32px]">
                <p className="text-[24px] font-semibold">Name</p>
              </div>
            </div>
            <div className="flex flex-row w-auto h-auto items-center gap-[8px]">
              <Starx />
              <p className="text-[16px] font-semibold">6.9</p>
              <p>/10</p>
            </div>
          </div>
          <div className="flex flex-row"></div>
        </div>
        <div className="w-full h-auto">
          Elp, a misunderstood young woman because of her green skin, and Gal,
          a popular girl, become friends at NewYork University in the Land of
          Oz. After an encounter with the Wonderful Wizard of Oz, their
          friendship reaches a crossroads.
        </div>
        <div className="w-full h-[40px]">
          <Button variant="outline">Play Trailer</Button>
        </div>
      </div>
    </div>
  );
};

