"use client";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import React, { useState } from "react";

const WatchSeries = () => {
  const params = useParams();
  const router = useRouter();
  const [selectedSource, setSelectedSource] = useState(
    "https://embed.su/embed/tv"
  );

  const sources = [
    "https://vidlink.pro",
    "https://vidsrc.cc/v2/embed",
    "https://embed.su/embed",
    "https://embed.7xtream.com/embed",
    "https://vidbinge.dev/embed",
  ];
 const { push } = useRouter();
  // Ensure params are valid
  const { id, season, episode } = params || {};
  if (!id || !season || !episode)
    return <p className="text-white text-center">Loading...</p>;

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center relative">
      <button
        onClick={() => push(`/seriesdetail/${params.id}`)}
        className="absolute top-3 left-7 flex items-center text-white text-base z-[10000] cursor-pointer"
      >
        <ChevronLeft width={18} /> Back
      </button>

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
