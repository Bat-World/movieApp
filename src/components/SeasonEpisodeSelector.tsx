import React from 'react';

interface Season {
  season_number: number;
  episode_count: number;
}

interface SeriesData {
  seasons: Season[];
}

interface SeasonEpisodeSelectorProps {
  seriesData: SeriesData;
  selectedSeason: number;
  selectedEpisode: number;
  handleSeasonChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleEpisodeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SeasonEpisodeSelector: React.FC<SeasonEpisodeSelectorProps> = ({
  seriesData,
  selectedSeason,
  selectedEpisode,
  handleSeasonChange,
  handleEpisodeChange,
}) => {
  return (
    <div className="mt-6 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <div className="flex-1">
        <label
          htmlFor="season"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Season
        </label>
        <select
          id="season"
          value={selectedSeason}
          onChange={handleSeasonChange}
          className="w-full p-2 bg-transparent text-white rounded-lg border border-default focus:border-default focus:ring-0"
        >
          {seriesData?.seasons.map((season) => (
            <option key={season.season_number} value={season.season_number}>
              Season {season.season_number}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label
          htmlFor="episode"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Episode
        </label>
        <select
          id="episode"
          value={selectedEpisode}
          onChange={handleEpisodeChange}
          className="w-full p-2 bg-transparent text-white rounded-lg border border-default focus:border-default focus:ring-0"
        >
          {Array.from(
            {
              length:
                seriesData?.seasons[selectedSeason - 1]?.episode_count || 0,
            },
            (_, i) => (
              <option key={i + 1} value={i + 1}>
                Episode {i + 1}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
};

export default SeasonEpisodeSelector;