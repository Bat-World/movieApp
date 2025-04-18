"use client";

import MovieList from "./MovieList";

const TopRatedMovies = () => {
  return <MovieList title="Top Rated" endpoint="top_rated" seriesEndpoint="top_rated" name="Top Rated Movies"/>;
};

export default TopRatedMovies;