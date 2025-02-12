export type SeriesData = {
    adult: boolean;
    backdrop_path: string;
    created_by: Array<{ id: number; name: string; credit_id: string }>; // Example structure
    credits: {
      cast: Array<{ id: number; name: string; character: string }>; // Example structure
      crew: Array<{ id: number; name: string; job: string }>; // Example structure
    };
    episode_run_time: number[];
    first_air_date: string;
    genres: Array<{ id: number; name: string }>; // Example structure
    homepage: string;
    id: number;
    in_production: boolean;
    languages: string[];
    last_air_date: string;
    last_episode_to_air: {
      id: number;
      name: string;
      overview: string;
      vote_average: number;
      vote_count: number;
    };
    name: string;
    networks: Array<{ id: number; name: string; logo_path: string }>; // Example structure
    next_episode_to_air: {
      id: number;
      name: string;
      overview: string;
      vote_average: number;
      vote_count: number;
    };
    number_of_episodes: number;
    number_of_seasons: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: Array<{ id: number; name: string; logo_path: string }>; // Example structure
    production_countries: Array<{ iso_3166_1: string; name: string }>; // Example structure
    seasons: Array<{
      id: number;
      name: string;
      overview: string;
      season_number: number;
      episode_count: number;
    }>; // Example structure
    spoken_languages: Array<{ english_name: string; iso_639_1: string; name: string }>; // Example structure
    status: string;
    tagline: string;
    type: string;
    videos: {
      results: Array<{ id: string; key: string; name: string; site: string }>; // Example structure
    };
    vote_average: number;
    vote_count: number;
  }
  
  