import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movie,setMovies] = useState([])
 async function fetchMovies() {
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
    
   setMovies(transformedData)}
 

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={movie} />
      </section>
    </React.Fragment>
  );
}

export default App;
