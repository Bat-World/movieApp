"use client"; // Add this if using Next.js App Router

import Image from "next/image";
import { useRouter } from "next/navigation"; // Correct import for App Router

interface Movie {
  id: number;
  poster_path: string;
  title: string;
}

interface SimilarMoviesProps {
  similarMovies: Movie[];
}

const SimilarMovies = ({ similarMovies }: SimilarMoviesProps) => {
  const router = useRouter(); // Get router instance

  return (
    <div className="flex flex-wrap gap-5 lg:gap-8 justify-start mt-[30px]">
      {similarMovies?.map((movie) => (
        <div
          key={movie.id}
          className="bg-transparent w-[157px] h-[334px] bg-[#E4E4E7] rounded-[8px] flex flex-col lg:w-[230px] lg:h-[440px] cursor-pointer"
          onClick={() => router.push(`/detail/${movie.id}`)}
        >
          <Image
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title}
            width={230}
            height={340}
            className="rounded-t-[8px] lg:w-[230px] lg:h-[340px] hover:opacity-60"
          />
          <div className="flex flex-col w-auto h-auto items-start mt-2 px-2 overflow-hidden">
            <p className="text-[18px] font-semibold">{movie.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SimilarMovies;
