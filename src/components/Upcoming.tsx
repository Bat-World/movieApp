"use client";

import MovieList from "./MovieList";

const UpcomingMovies = () => {
  return <MovieList title="Upcoming" endpoint="upcoming" seriesEndpoint="on_the_air"/>;
};

export default UpcomingMovies;