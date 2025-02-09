"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const SeriesDetail = () => {
  const { id } = useParams(); // ✅ Use useParams() instead of query
  const [series, setSeries] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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
    <div className="min-h-screen bg-black text-white px-6 md:px-10 py-10">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Series Poster */}
        <Image
          src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
          alt={series.name}
          width={350}
          height={500}
          className="rounded-lg shadow-lg"
        />

        {/* Series Details */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-5xl font-bold">{series.name}</h1>
          <p className="text-gray-400 mt-2">
            {series.first_air_date} | ⭐ {series.vote_average.toFixed(1)}
          </p>
          <p className="mt-4 text-lg">{series.overview}</p>

          {/* Director & Cast */}
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

          {/* Trailer Button */}
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
