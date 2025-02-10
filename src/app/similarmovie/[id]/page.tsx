"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import StarSmall from "@/app/icons/StarSmall";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [totalPages, setTotalPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const params = useParams();
  const { push } = useRouter();

  const fetchMovieData = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${params.id}/similar?language=en-US&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_TOKEN}`,
          },
        }
      );

      console.log("appear here pls", response.data.results);

      setSimilarData(response.data.results);
    } catch (err) {
      console.error("Failed to load similar movies:", err);
      setErrorMessage("Failed to load similar movies.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchMovieData(currentPage);
  }, [params.id, currentPage]);

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
    <div className="MovieList w-full h-auto px-[20px] flex flex-col">
      <div className="w-full h-[36px] flex flex-row justify-between mt-[92px]">
        <div className="w-auto h-full flex justify-center items-center">
          <p className="text-[30px] font-semibold">Similar Movies</p>
        </div>
      </div>

      <div className="MovieImgs w-full h-auto mt-[20px]">
        <div className="flex flex-wrap gap-5 lg:gap-8 justify-start">
          {isLoading ? (
            <p>Loading</p>
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
              >
                Previous
              </Button>
            </PaginationItem>

            {renderPageNumbers().map((page, index) =>
              typeof page === "number" ? (
                <PaginationItem key={index}>
                  <Button
                    variant={page === currentPage ? "default" : "ghost"}
                    onClick={() => setCurrentPage(page)}
                    className={
                      page === currentPage ? "bg-white text-black" : ""
                    }
                  >
                    {page}
                  </Button>
                </PaginationItem>
              ) : (
                <PaginationItem key={index} className="text-gray-500 px-2">
                  ...
                </PaginationItem>
              )
            )}

            {/* Next Button */}
            <PaginationItem>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Page;
