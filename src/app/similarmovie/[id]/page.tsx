"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import StarSmall from "@/app/icons/StarSmall";


const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

const Page = () => {
  interface Movie {
    id: number;
    poster_path: string;
    title: string;
    vote_average: number;
  }

  const [similarData, setSimilarData] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const params = useParams();
  const { push } = useRouter();

  const fetchMovieData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${params.id}/similar?language=en-US&page=4`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );

      console.log("appear here pls",response.data.results);
      
      setSimilarData(response.data.results);
    } catch (err) {
      console.error("Failed to load similar movies:", err);
      setErrorMessage("Failed to load similar movies.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    
      fetchMovieData();
  }, []);

  return (
    <div className="MovieList w-full h-auto px-[20px] flex flex-col">
      <div className="w-full h-[36px] flex flex-row justify-between mt-[92px]">
        <div className="w-[114px] h-full flex justify-center items-center">
          <p className="text-[30px] font-semibold">Title</p>
        </div>
      </div>

      <div className="MovieImgs w-full h-auto mt-[20px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 mt-6 2xl:gap-[30px]">
          {isLoading ? (
            <p>Loading...</p>
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : similarData.length > 0 ? (
            similarData.map((movie) => (
              <div
                key={movie.id}
                className="bg-[var(--detail-bg)] w-[157px] h-[334px] bg-[#E4E4E7] rounded-[8px] flex flex-col lg:w-[230px] lg:h-[440px] cursor-pointer"
                onClick={() => push(`/detail/${movie.id}`)}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                  width={157}
                  height={234}
                  layout="intrinsic"
                  objectFit="cover"
                  className="rounded-t-[8px] lg:w-[230px] lg:h-[340px] hover:opacity-60"
                />
                <div className="flex flex-col w-auto h-auto items-start mt-2 px-2">
                  <div className="flex flex-row w-auto h-auto items-center gap-[8px]">
                    <StarSmall />
                    <p className="text-[16px] font-semibold">
                      {movie.vote_average.toFixed(1)}
                    </p>
                    <p>/10</p>
                  </div>
                  <p className="text-[18px] font-semibold">{movie.title}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No similar movies found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
