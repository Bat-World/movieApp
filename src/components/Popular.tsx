"use client";

import MovieList from "./MovieList";
const Popular = () => {
  return (
  <MovieList title="Popular" endpoint="popular" seriesEndpoint="popular" name="Popular Movies"/>
  )
};

export default Popular;