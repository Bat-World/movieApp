"use client";
import React from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  console.log(params.id);

  return <div>movie {params.id}</div>;
};

export default Page;
