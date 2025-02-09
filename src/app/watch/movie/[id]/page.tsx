"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import React from "react";

const Watch = () => {
  const params = useParams();
  const router = useRouter();
  const embedUrl = "https://embed.su/embed/movie/";
  const id = params?.id;

  return (
    <div className="relative w-full h-screen">
      <button 
        onClick={() => router.back()} 
        className="absolute top-3 left-7 z-50 flex flex-row text-white text-base"
      >
        <ChevronLeft width={18} />
        Back
      </button>
      <div className="w-full h-full flex justify-center items-center">
        {id ? (
          <iframe 
            className="w-full h-full" 
            src={`${embedUrl}${id}`} 
            allowFullScreen 
            title="Video Embed"
          ></iframe>
        ) : (
          <p className="text-white">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Watch;
