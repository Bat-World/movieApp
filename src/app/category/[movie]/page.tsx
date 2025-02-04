"use client";
import React from "react";
import { useParams } from "next/navigation";
import CategoryList from "@/components/CategoryList";



const Page = () => {
  const params = useParams();
console.log(params);

const movieParam = Array.isArray(params.movie) ? params.movie.join(", ") : params.movie || "";




  return (
    <div>
      <CategoryList title={movieParam} endpoint={movieParam} />
    </div>
  );
};

export default Page;