import React, { useEffect ,useState } from "react";
import { Search } from "./components/Search";
import { Spinner } from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTION = {
  method: 'GET',
  headers: {
    accept: 'application/json'
  }
};

export const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm  ] = useState('');
  const [searchTerm, setSearchTerm] = useState("");

  const [movieList, setMovieList  ] = useState([]);
  const [errorMessage, setErrorMessage  ] = useState("");
  const [isLoading, setIsLoading  ] = useState(false);
  
  const [trendingMovies, setTrendingMovies  ] = useState([]);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

     try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;

      const response = await fetch(endpoint, API_OPTION);      

      if (!response.ok) {
        throw new Error('failed to fetch movies');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }
      
      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0])     
      }

     } catch (error) {
      console.error(`Error fetching Movies`)
      setErrorMessage('Error fetching movies. Please try again later.')
     } finally {
      setIsLoading(false);
     }
  }

  const loadTrendingMovies = async() => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error('Error fetching trending movies');
    }
  }
  useEffect( () => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  useEffect( () => {
    loadTrendingMovies()
  }, [])
  
  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="hero-banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without Hassle
          </h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> {/* passing state as a prop */}
        </header>

        {trendingMovies.length > 0 && (
          console.log(trendingMovies),
          
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}


        <section className="all-movies">
          <h2 >All Movies</h2>

          {isLoading ? (
           <Spinner/>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ): (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
