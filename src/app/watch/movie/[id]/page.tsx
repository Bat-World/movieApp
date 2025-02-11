"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import React from "react";

const Watch = () => {
  const params = useParams();
  const embedUrl = "https://embed.su/embed/movie/";
  const id = params?.id;
  const { push } = useRouter();

  return (
    <div className="relative w-full h-screen">
      <button
        onClick={() => push(`/`)}
        className="absolute top-5 left-7 z-50 flex flex-row text-white text-base cursor-pointer"
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
