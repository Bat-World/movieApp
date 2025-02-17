"use client";

import MovieList from "./MovieList";

const UpcomingMovies = () => {
  return <MovieList title="Upcoming" endpoint="upcoming" seriesEndpoint="on_the_air" name="Upcoming Movies"/>;
};

export default UpcomingMovies;