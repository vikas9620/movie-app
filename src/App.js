import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  const retryTimer = useRef(null);

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-movie-app-7b828-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        setError("Something went wrong ... Retrying");
        retryTimer.current = setTimeout(fetchMovies, 0);
      } else {
        const data = await response.json();
        const loadedMovies = []
        for(const key in data) {
          loadedMovies.push({
            id: key,
            title: data[key].title,
            openingText: data[key].openingText,
            releaseDate: data[key].releaseDate
          })
        }
        
        setMovies(loadedMovies);
        setIsLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }, []);
  const deleteMovieHandler = async (movieId) => {
    console.log(movieId)
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://react-movie-app-7b828-default-rtdb.firebaseio.com/movies/${movieId}.json`,
        {
          method: "DELETE",
         
        }
      );console.log(movieId)
      if (!response.ok) {
        throw new Error("Failed to delete movie.");
      }
      console.log(movieId)
      // Filter out the deleted movie from the movies state
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId)
      );
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };
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
      return <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />;
    }
    if (error) {
      return <p>{error}</p>;
    }
    if (isLoading) {
      return <div className="spinner">Loading....</div>;
    }
    return <p>No movies found</p>;
  }, [movies, error, isLoading]);
  async function addMovieHandler(movie) {
  const response = await  fetch(
      "https://react-movie-app-7b828-default-rtdb.firebaseio.com/movies.json",{
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          'content-type': 'application/json'
        }
      }
    );
    const data = await response.json();
    console.log(data);
  };
 
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
        <button onClick={cancelRetry}>Cancel</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
