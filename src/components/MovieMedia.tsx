import React from "react";
import Image from "next/image";
import { Play, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

interface MovieMediaProps {
  movieData: {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    runtime: number;
    adult: boolean;
    genres: { id: number; name: string }[];
  } | null;
  isLoading: boolean;
}

const MovieMedia: React.FC<MovieMediaProps> = ({ movieData, isLoading }) => {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen flex items-center justify-center px-6 md:px-12">
      <div className="absolute inset-0 w-full h-full">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <Image
            src={`https://image.tmdb.org/t/p/original${movieData?.backdrop_path}`}
            alt={movieData?.title || "Backdrop Image"}
            layout="fill"
            objectFit="cover"
            className="opacity-40"
          />
        )}
      </div>

      {/* Content */}
      <div className="z-10 flex flex-col md:flex-row gap-6 max-w-5xl w-full">
        {/* Movie Poster */}
        {isLoading ? (
          <Skeleton className="w-[250px] h-[375px] md:w-[350px] md:h-[500px] rounded-lg" />
        ) : (
          <Image
            src={`https://image.tmdb.org/t/p/original${movieData?.poster_path}`}
            alt={movieData?.title || "Movie Poster"}
            width={350}
            height={500}
            className="w-[250px] h-[375px] md:w-[350px] md:h-[500px] rounded-lg shadow-lg"
          />
        )}

        {/* Movie Info */}
        <div className="flex flex-col w-full max-w-lg">
          {/* Title */}
          {isLoading ? (
            <Skeleton className="h-8 w-3/4 mb-2" />
          ) : (
            <h1 className="text-[36px] md:text-[48px] font-bold leading-tight">
              {movieData?.title}
            </h1>
          )}
         <div className="flex items-center space-x-4 text-gray-400 text-sm mt-2">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : (
              <>
                <span>{movieData?.release_date}</span>
                <span>• {movieData?.adult ? "R" : "PG"}</span>
                <span>• {movieData?.runtime}m</span>
                <div className="flex items-center text-yellow-500 font-semibold">
                  ⭐ <span className="ml-1">{movieData?.vote_average.toFixed(1)}/10</span>
                  <span className="text-gray-400 ml-2 text-xs">
                    {movieData?.vote_count} votes
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </>
            ) : (
              movieData?.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-[#4338CA] text-white text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {genre.name}
                </span>
              ))
            )}
          </div>
          {/* Scrollable Overview */}
          <div className="mt-4 p-3 bg-transparent rounded-lg max-h-[100px] overflow-y-auto text-gray-300 text-sm md:text-base leading-relaxed">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </>
            ) : (
              <p>{movieData?.overview}</p>
            )}
          </div>


          <div className="flex gap-4 mt-5">
            <Button
              onClick={() => router.push(`/watch/movie/${movieData?.id}`)}
              variant="outline"
              className="text-base font-bold text-white flex items-center bg-white/20 px-5 py-2 rounded-lg hover:bg-black/30 transition"
            >
              <Play className="mr-2" />
              Play
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieMedia;
