"use client";

import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { SeriesData } from "@/app/types/seriesData";


const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const SeriesDetail = () => {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedSeason, setSelectedSeason] = useState<SeriesData[]>();
  const router = useRouter();


  useEffect(() => {
    if (id) {
      fetchSeriesDetail();
    }
  }, [id]);

  const fetchSeriesDetail = async () => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/tv/${id}`, {
        params: {
          api_key: TMDB_API_KEY,
          append_to_response: "credits,videos",
        },
      });
      setSeries(response.data);
    } catch (error) {
      console.error("Error fetching series details:", error);
      setErrorMessage("Failed to load series details.");
    }
  };

  if (!series && !errorMessage) {
    return <p className="text-white text-center">Loading...</p>;
  }
  if (errorMessage) {
    return <p className="text-white text-center">{errorMessage}</p>;
  }

  return (
    <div className="min-h-screen text-white px-6 md:px-10 py-10 mt-[80px]">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <Image
          src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
          alt={series.name}
          width={350}
          height={500}
          className="rounded-lg shadow-lg"
        />

        <div className="flex-1">
          <h1 className="text-3xl md:text-5xl font-bold">{series.name}</h1>
          <p className="text-gray-400 mt-2">
            {series.first_air_date} | ⭐ {series.vote_average.toFixed(1)}
          </p>
          <p className="mt-4 text-lg">{series.overview}</p>

          {/* Season Selector */}
          {series.seasons && (
            <div className="mt-6">
              <label className="block text-lg font-bold">Select Season:</label>
              <select
                className="mt-2 bg-gray-800 text-white px-4 py-2 rounded-md"
                value={selectedSeason || ""}
                onChange={(e) => setSelectedSeason(e.target.value)}
              >
                <option value="" disabled>Select a Season</option>
                {series.seasons.map((season) => (
                  <option key={season.id} value={season.season_number}>
                    Season {season.season_number}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Episode Selector */}
          {selectedSeason && (
            <div className="mt-4">
              <label className="block text-lg font-bold">Select Episode:</label>
              <select
                className="mt-2 bg-gray-800 text-white px-4 py-2 rounded-md"
                onChange={(e) => router.push(`/watch/tv/${series.id}/${selectedSeason}/${e.target.value}`)}
              >
                <option value="" disabled>Select an Episode</option>
                {Array.from({ length: series.seasons.find(s => s.season_number == selectedSeason)?.episode_count || 0 }, (_, index) => (
                  <option key={index} value={index + 1}>
                    Episode {index + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          {series.credits && (
            <div className="mt-6">
              <p>
                <span className="font-bold">Director:</span>{" "}
                {series.credits.crew.find((person) => person.job === "Director")?.name || "Unknown"}
              </p>
              <p>
                <span className="font-bold">Stars:</span>{" "}
                {series.credits.cast.slice(0, 5).map((actor) => actor.name).join(", ")}
              </p>
            </div>
          )}

          {series.videos?.results.length > 0 && (
            <a
              href={`https://www.youtube.com/watch?v=${series.videos.results[0].key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md text-lg font-semibold"
            >
              ▶ Play Trailer
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;
