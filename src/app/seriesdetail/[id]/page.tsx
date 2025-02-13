"use client";

import axios from "axios";
import Image from "next/image";
import { Play } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CastAndCrew from "@/components/CastandCrew";
import { MoveLeft } from "lucide-react";

// Type Definitions
interface Credit {
  cast: { name: string }[];
  crew: { name: string; job: string }[];
}

interface SeriesDetail {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: {
    season_number: number;
    episode_count: number;
  }[];
}

interface SimilarSeries {
  id: number;
  name: string;
  poster_path: string;
  vote_average: number;
}

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const SeriesDetail = () => {
  const [seriesData, setSeriesData] = useState<SeriesDetail | null>(null);
  const [creditData, setCreditData] = useState<Credit | null>(null);
  const [similarSeries, setSimilarSeries] = useState<SimilarSeries[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);

  const params = useParams();
  const router = useRouter();

  // Fetch Data from API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [seriesRes, creditRes, similarRes] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/tv/${params.id}?language=en-US`, {
          headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        }),
        axios.get(`${TMDB_BASE_URL}/tv/${params.id}/credits?api_key=${TMDB_API_KEY}&language=en-US`, {
          headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        }),
        axios.get(`${TMDB_BASE_URL}/tv/${params.id}/similar?language=en-US&page=1`, {
          headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        }),
      ]);

      setSeriesData(seriesRes.data);
      setCreditData(creditRes.data);
      setSimilarSeries(similarRes.data.results.slice(0, 10));
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setErrorMessage("Failed to load series details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const director = creditData?.crew.find((member) => member.job === "Director");
  const writers = creditData?.crew.filter((member) => member.job === "Writer").slice(0, 3);
  const topCast = creditData?.cast.slice(0, 3);

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(Number(e.target.value));
    setSelectedEpisode(1); // Reset episode to 1 when season changes
  };

  const handleEpisodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEpisode(Number(e.target.value));
  };

  const handlePlay = () => {
    router.push(`/watch/tv/${params.id}/${selectedSeason}/${selectedEpisode}`);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back(); 
    } else {
      router.push("/");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 mt-[80px] md:max-w-4xl lg:max-w-6xl">
         <MoveLeft
        className="absolute top-4 left-10 cursor-pointer z-[10000] transition-transform duration-300 hover:scale-125"
        onClick={handleBack}
      />
      {/* Title & Details */}
      <div className="mt-6">
        {isLoading ? (
          <Skeleton className="h-8 w-3/4 mb-2" />
        ) : (
          <h1 className="text-[24px] lg:text-[36px] font-bold">{seriesData?.name}</h1>
        )}
        <div className="flex items-center space-x-4 text-gray-500 text-sm mt-1">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-24" />
            </>
          ) : (
            <>
              <span>{seriesData?.first_air_date}</span>
              <span>• {seriesData?.number_of_seasons} Seasons</span>
              <span>• {seriesData?.number_of_episodes} Episodes</span>
              <div className="flex items-center text-yellow-500 font-semibold">
                ⭐ <span className="ml-1">{seriesData?.vote_average.toFixed(1)}/10</span>
                <span className="text-gray-400 ml-2 text-xs">{seriesData?.vote_count}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail */}
      <div className="relative mt-4 flex flex-row justify-between">
        {isLoading ? (
          <Skeleton className="w-full h-64 rounded-lg" />
        ) : (
          <>
            {/* Poster Image */}
            <Image
              src={`https://image.tmdb.org/t/p/w1280${seriesData?.poster_path}`}
              alt={seriesData?.name || "Series Poster"}
              width={800}
              height={450}
              objectFit="cover"
              className="hidden sm:hidden lg:block w-[222px] h-[428px] rounded-lg"
            />
            <div className="relative">
              <Image
                src={`https://image.tmdb.org/t/p/w1280${seriesData?.backdrop_path}`}
                alt={seriesData?.name || "Series Backdrop"}
                width={800}
                height={450}
                className="lg:w-[760px] lg:h-[428px] rounded-lg w-[375px] h-auto"
              />
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Button
                  onClick={handlePlay}
                  variant="outline"
                  className="text-base font-bold text-[#1A1D29] flex items-center bg-white/80 px-4 py-2 rounded-lg"
                >
                  <Play className="fill-[#1A1D29]" />
                  PLAY
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Overview */}
      {isLoading ? (
        <Skeleton className="h-16 w-full mt-4" />
      ) : (
        <p className="text-white font-semibold md:text-lg mt-4 text-sm leading-relaxed">{seriesData?.overview}</p>
      )}

      {/* Season and Episode Selector */}
      <div className="mt-6 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <label htmlFor="season" className="block text-sm font-medium text-gray-300 mb-1">
            Season
          </label>
          <select
            id="season"
            value={selectedSeason}
            onChange={handleSeasonChange}
            className="w-full p-2 bg-[#1A1D29] text-white rounded-lg border border-gray-600 focus:border-[#4338CA] focus:ring-0"
          >
            {seriesData?.seasons.map((season) => (
              <option key={season.season_number} value={season.season_number}>
                Season {season.season_number}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="episode" className="block text-sm font-medium text-gray-300 mb-1">
            Episode
          </label>
          <select
            id="episode"
            value={selectedEpisode}
            onChange={handleEpisodeChange}
            className="w-full p-2 bg-[#1A1D29] text-white rounded-lg border border-gray-600 focus:border-[#4338CA] focus:ring-0"
          >
            {Array.from({ length: seriesData?.seasons[selectedSeason - 1]?.episode_count || 0 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Episode {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cast & Crew */}
      <CastAndCrew director={director} writers={writers} topCast={topCast} isLoading={isLoading} />

      {/* Similar Series */}
      <div className="flex flex-row justify-between mt-[50px]">
        <div className="flex flex-row gap-[10px] items-center">
          <div className="w-[10px] h-[30px] rounded-[20px] bg-[#4338CA] mt-[30px]"></div>
          <p className="mt-[30px] text-[24px] font-semibold">You may like</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-5 lg:gap-8 justify-start mt-[30px]">
        {isLoading ? (
          <Skeleton className="w-full h-64" />
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : similarSeries?.length ? (
          similarSeries.map((series) => (
            <div key={series.id} className="cursor-pointer" onClick={() => router.push(`/seriesdetail/${series.id}`)}>
              <Image src={`https://image.tmdb.org/t/p/w500/${series.poster_path}`} alt={series.name} width={230} height={340} className="rounded-lg hover:opacity-60" />
              <p className="text-[18px] font-semibold mt-2">{series.name}</p>
            </div>
          ))
        ) : (
          <p>No similar series found.</p>
        )}
      </div>
    </div>
  );
};

export default SeriesDetail;