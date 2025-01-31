"use client";
import React from "react";
import { useParams } from "next/navigation";
import CategoryList from "@/components/CategoryList";



const Page = () => {
  const params = useParams();
console.log(params);


  return (
    <div>
      <CategoryList title={Array.isArray(params.movie) ? params.movie.join(", ") : params.movie || ""} endpoint={Array.isArray(params.movie) ? params.movie.join(", ") : params.movie || ""} />
    </div>
  );
};

export default Page;