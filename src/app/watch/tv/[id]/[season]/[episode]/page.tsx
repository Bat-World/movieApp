"use client";
import { useParams, useRouter } from "next/navigation";
import { MoveLeft } from "lucide-react";
import React, { useState } from "react";

const WatchSeries = () => {
  const params = useParams();
  const router = useRouter();
  const [selectedSource, setSelectedSource] = useState(
    "https://embed.su/embed/tv"
  );

  const sources = [
    "https://vidlink.pro/tv",
    "https://vidsrc.cc/v2/embed/tv",
    "https://embed.su/embed/tv",
    "https://embed.7xtream.com/embed/tv",
    "https://vidbinge.dev/embed/tv",
  ];
  

  // Ensure params are valid
  const { id, season, episode } = params || {};
  if (!id || !season || !episode)
    return <p className="text-white text-center">Loading...</p>;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back(); 
    } else {
      router.push("/");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center relative">
         <MoveLeft
        className="absolute top-4 left-10 cursor-pointer z-[10000] transition-transform duration-300 hover:scale-125"
        onClick={handleBack}
      />

      {/*Dropdown */}
      <div className="absolute top-3 right-14 z-[10000]">
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="p-2 bg-tranparent text-white rounded cursor-pointer focus:ring-0"
        >
          {sources.map((source, index) => (
            <option key={index} value={source}>
              Server {index + 1}
            </option>
          ))}
        </select>
      </div>

      <iframe
        className="w-full h-full"
        src={`${selectedSource}/${id}/${season}/${episode}`}
        allowFullScreen
        allow="autoplay; encrypted-media"
        title="Video Embed"
      ></iframe>
    </div>
  );
};

export default WatchSeries;
