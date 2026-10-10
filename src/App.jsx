import { useCallback, useEffect, useRef, useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MovieGrid from "./components/MovieGrid";
import SearchBar from "./components/SearchBar";
import MovieDetails from "./pages/MovieDetails";
import MovieSkeleton from "./components/MovieSkeleton";
import MovieDetailsSkeleton from "./components/MovieDetailsSkeleton";

import movies from "./data/movies";

import {
  searchMovies,
  getMovieDetails,
  getMovieRatings,
} from "./services/movieApi";

import "./App.css";

// ========================================
// RANDOM DISCOVER SEARCHES
// ========================================

const DISCOVER_SEARCHES = [
  "Avengers",
  "Spider-Man",
  "Batman",
  "Harry Potter",
  "Mission Impossible",
  "Jurassic Park",
  "Star Wars",
  "John Wick",
  "Transformers",
  "The Matrix",
  "Deadpool",
  "Toy Story",
  "James Bond",
  "The Hunger Games",
  "Kung Fu Panda",
  "Pirates of the Caribbean",
  "Godzilla",
  "The Lord of the Rings",
  "Fast and Furious",
  "Planet of the Apes",
  "Interstellar",
  "Inception",
  "Titanic",
  "Joker",
  "Dune",
  "The Lion King",
  "Iron Man",
  "Thor",
  "Black Panther",
  "Doctor Strange",
];

// ========================================
// FEATURED MOVIES
// ========================================

const FEATURED_SEARCHES = [
  "Interstellar",
  "Inception",
  "The Dark Knight",
  "Avatar",
  "Avengers",
  "Dune",
  "Joker",
  "Titanic",
];

// ========================================
// HELPERS
// ========================================

function getSavedValue(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function formatMovie(movie) {
  return {
    id: movie.imdbID || movie.id,
    imdbID: movie.imdbID || movie.id,

    title: movie.Title || movie.title || "Untitled",
    year: movie.Year || movie.year || "",

    rating:
      movie.imdbRating && movie.imdbRating !== "N/A"
        ? movie.imdbRating
        : movie.rating || "N/A",

    genre:
      movie.Genre && movie.Genre !== "N/A"
        ? movie.Genre
        : movie.genre || "Unknown",

    duration:
      movie.Runtime && movie.Runtime !== "N/A"
        ? movie.Runtime
        : movie.duration || "",

    overview:
      movie.Plot && movie.Plot !== "N/A"
        ? movie.Plot
        : movie.overview || "",

    poster:
      movie.Poster && movie.Poster !== "N/A"
        ? movie.Poster
        : movie.poster && movie.poster !== "N/A"
          ? movie.poster
          : "",

    actors: movie.Actors || movie.actors || "",
    director: movie.Director || movie.director || "",
  };
}

// ========================================
// HOME PAGE
// ========================================

function Home({
  featuredMovie,
  featuredLoading,
  featuredError,
  featuredMovies,
  featuredMoviesLoading,
  featuredMoviesError,
  favorites,
  onToggleFavorite,
  onSelectMovie,
  onRetryFeatured,
  onRetryCollection,
}) {
  return (
    <>
      <Hero
        movie={featuredMovie}
        loading={featuredLoading}
        error={featuredError}
        onSelectMovie={onSelectMovie}
        onRetry={onRetryFeatured}
      />

      <section className="movies-section">
        <div className="section-heading">
          <span className="section-label">
            HANDPICKED FOR YOU
          </span>

          <h2>Featured Movies</h2>

          <p>
            Discover great movies for your next movie night.
          </p>
        </div>

        {featuredMoviesLoading && <MovieSkeleton count={8} />}

        {!featuredMoviesLoading && featuredMoviesError && (
          <div className="api-error" role="alert">
            <p>{featuredMoviesError}</p>

            <button
              type="button"
              onClick={onRetryCollection}
            >
              Try Again
            </button>
          </div>
        )}

        {!featuredMoviesLoading &&
          !featuredMoviesError &&
          featuredMovies.length > 0 && (
            <MovieGrid
              movies={featuredMovies}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              onSelectMovie={onSelectMovie}
            />
          )}
      </section>
    </>
  );
}

// ========================================
// DISCOVER PAGE
// ========================================

function Discover({
  favorites,
  onToggleFavorite,
  onSelectMovie,
  discoverSearch,
  setDiscoverSearch,
  selectedGenre,
  setSelectedGenre,
}) {
  const [apiMovies, setApiMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [collectionIndex, setCollectionIndex] = useState(() =>
    Math.floor(Math.random() * DISCOVER_SEARCHES.length)
  );

  const [randomCollection, setRandomCollection] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const requestIdRef = useRef(0);

  const searchTerm = discoverSearch.trim();

  const activeQuery = searchTerm
    ? searchTerm
    : DISCOVER_SEARCHES[collectionIndex];

  // Fetch Discover movies.
  useEffect(() => {
    const requestId = ++requestIdRef.current;
    let cancelled = false;

    async function fetchMovies() {
      setLoading(true);
      setError("");

      try {
        const result = await searchMovies(
          activeQuery,
          searchTerm ? page : 1
        );

        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }

        setTotalResults(result.totalResults);

        const ratedMovies = await getMovieRatings(result.movies);

        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }

        setApiMovies(ratedMovies.map(formatMovie));
      } catch (err) {
        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }

        setApiMovies([]);
        setTotalResults(0);

        setError(
          err.message || "Unable to load movies."
        );
      } finally {
        if (!cancelled && requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }

    const timer = setTimeout(fetchMovies, searchTerm ? 350 : 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    activeQuery,
    page,
    searchTerm,
    retryCount,
    randomCollection,
  ]);

  // Search input changes reset pagination.
  function handleDiscoverSearch(value) {
    setDiscoverSearch(value);
    setPage(1);
    setSelectedGenre("All");
  }

  // Select a different random collection.
  function handleNext() {
    if (loading) return;

    if (searchTerm) {
      const totalPages = Math.ceil(totalResults / 10);

      if (page < totalPages) {
        setPage((current) => current + 1);
      }

      return;
    }

    let nextIndex = collectionIndex;

    // Avoid selecting the same collection twice in a row.
    while (
      DISCOVER_SEARCHES.length > 1 &&
      nextIndex === collectionIndex
    ) {
      nextIndex = Math.floor(
        Math.random() * DISCOVER_SEARCHES.length
      );
    }

    setCollectionIndex(nextIndex);
    setRandomCollection((current) => !current);
    setPage(1);
  }

  function handlePrevious() {
    if (loading) return;

    if (searchTerm) {
      setPage((current) => Math.max(1, current - 1));
      return;
    }

    let previousIndex = collectionIndex;

    while (
      DISCOVER_SEARCHES.length > 1 &&
      previousIndex === collectionIndex
    ) {
      previousIndex = Math.floor(
        Math.random() * DISCOVER_SEARCHES.length
      );
    }

    setCollectionIndex(previousIndex);
    setRandomCollection((current) => !current);
    setPage(1);
  }

  // Filter by genre.
  const filteredMovies = apiMovies.filter((movie) => {
    if (selectedGenre === "All") {
      return true;
    }

    if (!movie.genre || movie.genre === "Unknown") {
      return true;
    }

    return movie.genre
      .split(",")
      .some(
        (genre) =>
          genre.trim().toLowerCase() ===
          selectedGenre.toLowerCase()
      );
  });

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <section className="movies-section">
      <div className="section-heading">
        <span className="section-label">
          FIND YOUR NEXT FAVORITE
        </span>

        <h2>Discover Movies</h2>

        <p>
          {searchTerm
            ? `Search results for "${searchTerm}"`
            : "Explore a random collection of movies."}
        </p>
      </div>

      {/* Discover has its OWN search state */}
      <SearchBar
        search={discoverSearch}
        setSearch={handleDiscoverSearch}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
      />

      {loading && <MovieSkeleton count={10} />}

      {!loading && error && (
        <div className="api-error" role="alert">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <MovieGrid
            movies={filteredMovies}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onSelectMovie={onSelectMovie}
          />

          <div className="pagination">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={
                loading ||
                (searchTerm
                  ? page <= 1
                  : false)
              }
            >
              Previous
            </button>

            <span>
              {searchTerm
                ? `Page ${page} of ${Math.max(1, totalPages)}`
                : "Random Collection"}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={
                loading ||
                (searchTerm &&
                  (totalPages === 0 || page >= totalPages))
              }
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

// ========================================
// WATCHLIST
// ========================================

function Watchlist({
  favorites,
  favoriteMovies,
  onToggleFavorite,
  onSelectMovie,
}) {
  const savedMovies = favoriteMovies.filter((movie) =>
    favorites.includes(movie.id)
  );

  return (
    <section className="movies-section">
      <div className="section-heading">
        <span className="section-label">
          YOUR PERSONAL COLLECTION
        </span>

        <h2>My Watchlist</h2>

        <p>All your saved movies in one place.</p>
      </div>

      {savedMovies.length === 0 ? (
        <div className="empty-watchlist">
          <h3>Your watchlist is empty</h3>

          <p>
            Click the heart on a movie to add it to your
            personal collection.
          </p>
        </div>
      ) : (
        <MovieGrid
          movies={savedMovies}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onSelectMovie={onSelectMovie}
        />
      )}
    </section>
  );
}

// ========================================
// MAIN APP
// ========================================

function App() {
  const [activePage, setActivePage] = useState("Home");

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Independent search states.
  const [headerSearch, setHeaderSearch] = useState("");
  const [discoverSearch, setDiscoverSearch] = useState("");

  const [selectedGenre, setSelectedGenre] = useState("All");

  // Main Featured Movie.
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState("");
  const [featuredSearchTerm, setFeaturedSearchTerm] =
    useState("Interstellar");

  // Independent Featured Movies collection.
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [featuredMoviesLoading, setFeaturedMoviesLoading] =
    useState(false);
  const [featuredMoviesError, setFeaturedMoviesError] =
    useState("");
  const [collectionRetry, setCollectionRetry] = useState(0);

  const featuredRequestRef = useRef(0);
  const detailsRequestRef = useRef(0);
  const collectionRequestRef = useRef(0);

  // ========================================
  // WATCHLIST
  // ========================================

  const [favorites, setFavorites] = useState(() =>
    getSavedValue("cineverse-watchlist", [])
  );

  const [favoriteMovies, setFavoriteMovies] = useState(() =>
    getSavedValue("cineverse-favorite-movies", [])
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        "cineverse-watchlist",
        JSON.stringify(favorites)
      );

      localStorage.setItem(
        "cineverse-favorite-movies",
        JSON.stringify(favoriteMovies)
      );
    } catch (error) {
      console.error("Could not save Watchlist:", error);
    }
  }, [favorites, favoriteMovies]);

  // ========================================
  // LOAD FEATURED MOVIES COLLECTION
  // ========================================

  const loadFeaturedMovies = useCallback(async () => {
    const requestId = ++collectionRequestRef.current;

    setFeaturedMoviesLoading(true);
    setFeaturedMoviesError("");

    try {
      const results = await Promise.all(
        FEATURED_SEARCHES.map(async (title) => {
          try {
            const result = await searchMovies(title, 1);

            const exact = result.movies.find(
              (movie) =>
                movie.Title?.toLowerCase() === title.toLowerCase()
            );

            return exact || result.movies[0] || null;
          } catch {
            return null;
          }
        })
      );

      if (requestId !== collectionRequestRef.current) {
        return;
      }

      const uniqueMovies = Array.from(
        new Map(
          results
            .filter(Boolean)
            .map((movie) => [movie.imdbID, movie])
        ).values()
      );

      const ratedMovies = await getMovieRatings(uniqueMovies);

      if (requestId !== collectionRequestRef.current) {
        return;
      }

      setFeaturedMovies(ratedMovies.map(formatMovie));
    } catch (error) {
      if (requestId !== collectionRequestRef.current) {
        return;
      }

      setFeaturedMoviesError(
        error.message || "Unable to load featured movies."
      );
    } finally {
      if (requestId === collectionRequestRef.current) {
        setFeaturedMoviesLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadFeaturedMovies();

    return () => {
      collectionRequestRef.current += 1;
    };
  }, [loadFeaturedMovies, collectionRetry]);

  // ========================================
  // HEADER SEARCH
  // ========================================

  const handleHeaderSearch = useCallback(async (query) => {
    const queryText = query.trim();

    if (!queryText) return;

    const requestId = ++featuredRequestRef.current;

    setHeaderSearch(queryText);
    setFeaturedSearchTerm(queryText);
    setActivePage("Home");

    setSelectedMovie(null);
    setDetailsLoading(false);
    setFeaturedLoading(true);
    setFeaturedError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    try {
      const result = await searchMovies(queryText, 1);

      if (requestId !== featuredRequestRef.current) {
        return;
      }

      if (!result.movies.length) {
        throw new Error("No matching movies found.");
      }

      const firstMovie = formatMovie(result.movies[0]);

      setFeaturedMovie(firstMovie);

      const details = await getMovieDetails(firstMovie.imdbID);

      if (requestId !== featuredRequestRef.current) {
        return;
      }

      setFeaturedMovie(formatMovie(details));
    } catch (error) {
      if (requestId !== featuredRequestRef.current) {
        return;
      }

      setFeaturedError(
        error.message || "Unable to search for this movie."
      );
    } finally {
      if (requestId === featuredRequestRef.current) {
        setFeaturedLoading(false);
      }
    }
  }, []);

  // Initial Featured Movie.
  useEffect(() => {
    handleHeaderSearch("Interstellar");
  }, [handleHeaderSearch]);

  // ========================================
  // TOGGLE FAVORITE
  // ========================================

  function toggleFavorite(movieId, movieObject = null) {
    const movie =
      movieObject ||
      (selectedMovie?.id === movieId ? selectedMovie : null) ||
      (featuredMovie?.id === movieId ? featuredMovie : null) ||
      featuredMovies.find((item) => item.id === movieId) ||
      movies.find((item) => item.id === movieId);

    const isCurrentlyFavorite = favorites.includes(movieId);

    setFavorites((previous) =>
      previous.includes(movieId)
        ? previous.filter((id) => id !== movieId)
        : [...previous, movieId]
    );

    if (isCurrentlyFavorite) {
      setFavoriteMovies((previous) =>
        previous.filter(
          (item) =>
            item.id !== movieId &&
            item.imdbID !== movieId
        )
      );

      return;
    }

    if (movie) {
      setFavoriteMovies((previous) => [
        ...previous.filter(
          (item) =>
            item.id !== movieId &&
            item.imdbID !== movieId
        ),
        { ...movie, id: movieId },
      ]);
    }
  }

  // ========================================
  // MOVIE DETAILS
  // ========================================

  async function openMovieDetails(movie) {
    const requestId = ++detailsRequestRef.current;

    setSelectedMovie(movie);
    setDetailsLoading(Boolean(movie.imdbID));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (!movie.imdbID) {
      setDetailsLoading(false);
      return;
    }

    try {
      const details = await getMovieDetails(movie.imdbID);

      if (requestId !== detailsRequestRef.current) {
        return;
      }

      const updatedMovie = formatMovie(details);

      setSelectedMovie(updatedMovie);

      setFavoriteMovies((previous) =>
        previous.map((item) =>
          item.id === movie.id || item.imdbID === movie.imdbID
            ? updatedMovie
            : item
        )
      );

      setFeaturedMovie((current) =>
        current?.imdbID === movie.imdbID
          ? updatedMovie
          : current
      );
    } catch (error) {
      console.error("Could not load movie details:", error);
    } finally {
      if (requestId === detailsRequestRef.current) {
        setDetailsLoading(false);
      }
    }
  }

  function closeMovieDetails() {
    detailsRequestRef.current += 1;
    setSelectedMovie(null);
    setDetailsLoading(false);
  }

  // ========================================
  // NAVIGATION
  // ========================================

  function navigateToPage(page) {
    detailsRequestRef.current += 1;

    setSelectedMovie(null);
    setDetailsLoading(false);
    setActivePage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ========================================
  // RENDER PAGE
  // ========================================

  function renderPage() {
    if (selectedMovie) {
      if (detailsLoading) {
        return <MovieDetailsSkeleton />;
      }

      return (
        <MovieDetails
          movie={selectedMovie}
          isFavorite={favorites.includes(selectedMovie.id)}
          onToggleFavorite={toggleFavorite}
          onBack={closeMovieDetails}
        />
      );
    }

    if (activePage === "Discover") {
      return (
        <Discover
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onSelectMovie={openMovieDetails}
          discoverSearch={discoverSearch}
          setDiscoverSearch={setDiscoverSearch}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
        />
      );
    }

    if (activePage === "Watchlist") {
      const savedMovies = [
        ...movies.filter((movie) =>
          favorites.includes(movie.id)
        ),

        ...favoriteMovies.filter(
          (movie) =>
            favorites.includes(movie.id) &&
            !movies.some(
              (localMovie) => localMovie.id === movie.id
            )
        ),
      ];

      return (
        <Watchlist
          favorites={favorites}
          favoriteMovies={savedMovies}
          onToggleFavorite={toggleFavorite}
          onSelectMovie={openMovieDetails}
        />
      );
    }

    return (
      <Home
        featuredMovie={featuredMovie}
        featuredLoading={featuredLoading}
        featuredError={featuredError}
        featuredMovies={featuredMovies}
        featuredMoviesLoading={featuredMoviesLoading}
        featuredMoviesError={featuredMoviesError}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onSelectMovie={openMovieDetails}
        onRetryFeatured={() =>
          handleHeaderSearch(featuredSearchTerm)
        }
        onRetryCollection={() =>
          setCollectionRetry((count) => count + 1)
        }
      />
    );
  }

  // ========================================
  // APP UI
  // ========================================

  return (
    <div className="app">
      {!selectedMovie && (
        <Navbar
          activePage={activePage}
          setActivePage={navigateToPage}
          onSearchMovie={handleHeaderSearch}
          searchValue={headerSearch}
          onSearchChange={setHeaderSearch}
        />
      )}

      <main>{renderPage()}</main>
    </div>
  );
}

export default App;