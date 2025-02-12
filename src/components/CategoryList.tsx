import { useState, useEffect } from "react";
import axios from "axios";
import { Movie } from "@/app/types/movieData";
import Image from "next/image";
import StarSmall from "@/app/icons/StarSmall";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import RightArrow from "@/app/icons/RightArrow";

interface MovieListProps {
  title: string;
  endpoint: string;
}

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const CategoryList = ({ title, endpoint }: MovieListProps) => {
  const [movieData, setMovieData] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalPages, setTotalPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMovies = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );
      setMovieData(response.data.results);
      setTotalPages(response.data.total_pages || 10);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(`Error fetching ${title} movies`, err);
      setErrorMessage("Failed to load movies.");
    }
  };

  useEffect(() => {
    fetchMovies(currentPage);
  }, [endpoint, currentPage]);

  const { push } = useRouter();

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Display page number above
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 3;

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 2) {
        pages.push("...");
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="MovieList w-full h-auto px-[20px] flex flex-col items-center gap-[32px]">
      <div className="w-full h-[36px] flex flex-row justify-between mt-[92px] max-w-[1280px]">
        <div className="w-[114px] h-full flex justify-center items-center">
          <p className="text-[30px] font-semibold">
            {title.charAt(0).toUpperCase() + title.slice(1)}
          </p>
        </div>
      </div>

      <div className="MovieImgs w-full h-auto mt-[20px] flex justify-center max-w-[1280px]">
        <div className="flex flex-wrap gap-5 lg:gap-8 w-auto">
          {isLoading ? (
            <p>Loading...</p>
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : (
            movieData.map((movie) => (
              <div
                key={movie.id}
                className="bg-transparent w-[157px] h-[334px] bg-[#E4E4E7] rounded-[8px] flex flex-col lg:w-[230px] lg:h-[440px] cursor-pointer"
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
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent className="flex items-center space-x-2">
            {/* Previous Button */}
            <PaginationItem>
              <Button
                variant="outline"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="bg-transparent border-none"
              >
                Previous
              </Button>
            </PaginationItem>

            {/* Page Numbers */}
            {renderPageNumbers().map((page, index) =>
              page === "..." ? (
                <PaginationItem key={index} className="text-gray-500 px-2">
                  ...
                </PaginationItem>
              ) : (
                <PaginationItem key={index}>
                  <Button
                    variant={page === currentPage ? "default" : "ghost"}
                    onClick={() => setCurrentPage(page as number)}
                    className={
                      page === currentPage ? "bg-white text-black" : ""
                    }
                  >
                    {page}
                  </Button>
                </PaginationItem>
              )
            )}

            {/* Next Button */}
            <PaginationItem>
              <Button
                className="bg-transparent border-none"
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <RightArrow />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default CategoryList;
