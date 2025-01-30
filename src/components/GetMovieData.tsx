import { useEffect, useState } from "react";
import axios from "axios";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const useMovieData = () => {
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
      if(axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data.statusmessage_message);
      }
      console.log(err);
  
    }
  };
  console.log("This is the error",errorMessage);
  console.log(isLoading);
  
  console.log("This is the error",popularMovieData);
  
  
    
    useEffect(() => { 
      getMovieData();
    }, []);
}

export default useMovieData;