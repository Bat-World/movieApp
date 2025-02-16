"use client";

import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import CastAndCrew from "@/components/CastandCrew";
import { MoveLeft } from "lucide-react";
import MovieMedia from "@/components/MovieMedia";
import SeasonEpisodeSelector from "@/components/SeasonEpisodeSelector";

// Type Definitions
interface Credit {
  cast: { name: string }[];
  crew: { name: string; job: string }[];
}

interface Genre {
  id: number;
  name: string;
}

interface SeriesDetail {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  adult: boolean;
  genres: Genre[]; // Add this line
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
  const [similarSeries, setSimilarSeries] = useState<SimilarSeries[] | null>(
    null
  );
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
        axios.get(
          `${TMDB_BASE_URL}/tv/${params.id}/credits?api_key=${TMDB_API_KEY}&language=en-US`,
          {
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }
        ),
        axios.get(
          `${TMDB_BASE_URL}/tv/${params.id}/similar?language=en-US&page=1`,
          {
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }
        ),
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
  const writers = creditData?.crew
    .filter((member) => member.job === "Writer")
    .slice(0, 3);
  const topCast = creditData?.cast.slice(0, 3);

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(Number(e.target.value));
    setSelectedEpisode(1); 
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
    <div>
      <MovieMedia movieData={seriesData} isLoading={isLoading} />
      <div className="max-w-2xl mx-auto px-4 mt-[80px] md:max-w-4xl lg:max-w-6xl">
        <MoveLeft
          className="absolute top-4 left-10 cursor-pointer z-[10000] transition-transform duration-300 hover:scale-125"
          onClick={handleBack}
        />
        

        {/* Season and Episode Selector */}
      {seriesData && (
        <SeasonEpisodeSelector
          seriesData={seriesData}
          selectedSeason={selectedSeason}
          selectedEpisode={selectedEpisode}
          handleSeasonChange={handleSeasonChange}
          handleEpisodeChange={handleEpisodeChange}
        />
      )}

        {/* Cast & Crew */}
        <CastAndCrew
          director={director || null}
          writers={writers || []}
          topCast={topCast || []}
          isLoading={isLoading}
        />

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
              <div
                key={series.id}
                className="cursor-pointer"
                onClick={() => router.push(`/seriesdetail/${series.id}`)}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500/${series.poster_path}`}
                  alt={series.name}
                  width={230}
                  height={340}
                  className="rounded-lg hover:opacity-60"
                />
                <p className="text-[18px] font-semibold mt-2">{series.name}</p>
              </div>
            ))
          ) : (
            <p>No similar series found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;
