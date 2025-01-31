"use client";
import React from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  console.log(params);

  return <div>movie </div>;
};

export default Page;
