import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [movie,setMovies] = useState([])
 async function fetchMovies() {
  setIsLoading(true);
  const response = await fetch('https://swapi.dev/api/films/')
  
  const data = await response.json()
    const transformedData =  data.results.map(movie=>{
      return {
        id: movie.episode_id,
        title: movie.title,
        openingText: movie.opening_crawl,
        releaseDate: movie.release_date


      }
    })
    console.log(data)
    
   setMovies(transformedData)
   setTimeout(() => {
    setIsLoading(false)
   }, 1000);
  
  }
 

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section>
       {!isLoading && <MoviesList movies={movie} />}
        {isLoading && <div className="spinner"></div>}
      </section>
    </React.Fragment>
  );
}

export default App;
