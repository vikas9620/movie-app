import React, { useEffect, useState, useRef } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const retryTimer = useRef(null); // Declare retryTimer using useRef

  useEffect(() => {
    return () => {
      clearTimeout(retryTimer.current); // Clean up the retry timer
    };
  }, []);

  async function fetchMovies() {
    clearTimeout(retryTimer.current); // Clear previous retry timer
    retryTimer.current = null; // Reset retryTimer ref

    setIsLoading(true);
    setError(null);

    retryTimer.current = setTimeout(async () => {
      try {
        const response = await fetch("https://swapi.dev/api/films/");
        if (response.ok) {
          const data = await response.json();
          const transformedData = data.results.map((movie) => {
            return {
              id: movie.episode_id,
              title: movie.title,
              openingText: movie.opening_crawl,
              releaseDate: movie.release_date,
            };
          });
          setMovies(transformedData);
          setIsLoading(false);
        } else {
          setError("Something went wrong ... Retrying");
          fetchMovies(); // Retry the API call
        }
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    }, 500);
  }

  const cancelRetry = () => {
    setIsLoading(true)
    clearTimeout(retryTimer.current);
    setError("Retrying cancelled by user");// Reset retryTimer ref
    setIsLoading(false)
  };

  let content = <p>No movies found</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <div className="spinner">Loading....</div>;
  }

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
