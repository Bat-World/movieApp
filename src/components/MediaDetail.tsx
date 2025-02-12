"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StarSmall from "@/app/icons/StarSmall";
import RightArrow from "@/app/icons/RightArrow";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

const MediaDetail = ({ mediaType }) => {
  const { id } = useParams();
  const router = useRouter();
  const [mediaData, setMediaData] = useState(null);
  const [videoData, setVideoData] = useState([]);
  const [creditData, setCreditData] = useState(null);
  const [similarMedia, setSimilarMedia] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [mediaRes, videoRes, creditRes, similarRes] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/${mediaType}/${id}`, {
          params: { api_key: TMDB_API_KEY, append_to_response: "credits,videos" },
        }),
        axios.get(`${TMDB_BASE_URL}/${mediaType}/${id}/videos`, {
          params: { api_key: TMDB_API_KEY },
        }),
        axios.get(`${TMDB_BASE_URL}/${mediaType}/${id}/credits`, {
          params: { api_key: TMDB_API_KEY },
        }),
        axios.get(`${TMDB_BASE_URL}/${mediaType}/${id}/similar`, {
          params: { api_key: TMDB_API_KEY, page: 1 },
        }),
      ]);

      setMediaData(mediaRes.data);
      setVideoData(videoRes.data.results);
      setCreditData(creditRes.data);
      setSimilarMedia(similarRes.data.results.slice(0, 10));
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const trailer = videoData?.find((video) => video.type === "Trailer");
  const director = creditData?.crew.find((member) => member.job === "Director");
  const topCast = creditData?.cast.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 mt-[80px]">
      {/* Title & Details */}
      {isLoading ? <Skeleton className="h-8 w-3/4 mb-2" /> : <h1 className="text-3xl font-bold">{mediaData?.title || mediaData?.name}</h1>}
      
      {/* Thumbnail & Trailer */}
      <div className="relative mt-4">
        {isLoading ? (
          <Skeleton className="w-full h-64 rounded-lg" />
        ) : (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/w1280${mediaData.backdrop_path}`}
              alt={mediaData?.title || mediaData?.name}
              width={800}
              height={450}
              className="w-full rounded-lg"
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              {trailer && <Button onClick={() => setIsTrailerModalOpen(true)}>▶ Play trailer</Button>}
              <Button onClick={() => router.push(`/watch/${mediaType}/${id}`)} variant="outline">PLAY</Button>
            </div>
          </>
        )}
      </div>

      {/* Season & Episode Selection (For Series) */}
      {mediaType === "tv" && mediaData?.seasons && (
        <div className="mt-6">
          <label>Select Season:</label>
          <select className="bg-gray-800 text-white px-4 py-2" value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)}>
            <option value="">Select a Season</option>
            {mediaData.seasons.map((season) => (
              <option key={season.id} value={season.season_number}>Season {season.season_number}</option>
            ))}
          </select>
        </div>
      )}

      {/* Similar Media */}
      <div className="mt-10">
        <h2 className="text-xl font-bold">You may like</h2>
        <div className="flex flex-wrap gap-5 mt-4">
          {similarMedia.map((media) => (
            <div key={media.id} className="cursor-pointer" onClick={() => router.push(`/detail/${mediaType}/${media.id}`)}>
              <Image src={`https://image.tmdb.org/t/p/w500/${media.poster_path}`} alt={media.title || media.name} width={150} height={225} className="rounded-lg" />
              <p className="text-sm mt-2 font-semibold">{media.title || media.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaDetail;
