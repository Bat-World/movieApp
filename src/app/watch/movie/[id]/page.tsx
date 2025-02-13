"use client";

import { useParams, useRouter } from "next/navigation";
import { MoveLeft } from "lucide-react";
import React, { useState } from "react";

const WatchMovie = () => {
  const params = useParams();
  const router = useRouter();
  const [selectedSource, setSelectedSource] = useState("https://embed.su/embed/movie");

  const sources = [
    "https://vidlink.pro/embed/movie",
    "https://vidsrc.cc/v2/embed/movie",
    "https://embed.su/embed/movie",
    "https://embed.7xtream.com/embed/movie",
    "https://vidbinge.dev/embed/movie",
  ];

  const { id } = params || {};
  if (!id) return <p className="text-white text-center">Loading...</p>;


  const handleBack = () => {
    if (window.history.length > 1) {
      router.back(); 
    } else {
      router.push("/");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center relative">
      {/* Back Button */}
      <MoveLeft
        className="absolute top-4 left-10 cursor-pointer z-[10000] transition-transform duration-300 hover:scale-125"
        onClick={handleBack}
      />

      {/* Source Selection Dropdown */}
      <div className="absolute top-3 right-14 z-[10000]">
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="p-2 bg-transparent text-white rounded cursor-pointer focus:ring-0"
        >
          {sources.map((source, index) => (
            <option key={index} value={source}>
              Server {index + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Video Player */}
      <iframe
        className="w-full h-full"
        src={`${selectedSource}/${id}`}
        allowFullScreen
        allow="autoplay; encrypted-media"
        title="Movie Embed"
      ></iframe>
    </div>
  );
};

export default WatchMovie;
