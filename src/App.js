import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  const retryTimer = useRef(null);

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        setError("Something went wrong ... Retrying");
        retryTimer.current = setTimeout(fetchMovies, 0);
      } else {
        const data = await response.json();
        const transformedData = data.results.map((movie) => ({
          id: movie.episode_id,
          title: movie.title,
          openingText: movie.opening_crawl,
          releaseDate: movie.release_date,
        }));
        setMovies(transformedData);
        setIsLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }, []);

  const cancelRetry = () => {
    setIsLoading(true);
    clearTimeout(retryTimer.current);
    setError("Retrying cancelled by user");
    setIsLoading(false);
  };
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const content = useMemo(() => {
    if (movies.length > 0) {
      return <MoviesList movies={movies} />;
    }
    if (error) {
      return <p>{error}</p>;
    }
    if (isLoading) {
      return <div className="spinner">Loading....</div>;
    }
    return <p>No movies found</p>;
  }, [movies, error, isLoading]);

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
        <button onClick={cancelRetry}>Cancel</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
