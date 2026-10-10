import { Play, Info, Star } from "lucide-react";
import "../css/Hero.css";

function Hero({ movie, loading, error, onSelectMovie }) {
  if (loading) {
    return (
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="hero-badge">
              #1 FEATURED MOVIE
            </span>

            <h1>Finding your movie...</h1>

            <p className="hero-description">
              Searching the movie database.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!movie) {
    return (
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="hero-badge">
              CINEVERSE
            </span>

            <h1>Discover Your Next Movie</h1>

            <p className="hero-description">
              Search for a movie in the header to feature it here.
            </p>

            {error && <p role="alert">{error}</p>}
          </div>
        </div>
      </section>
    );
  }

  const rating =
    movie.rating && movie.rating !== "N/A"
      ? movie.rating
      : movie.imdbRating && movie.imdbRating !== "N/A"
        ? movie.imdbRating
        : null;

  const genre =
    movie.genre && movie.genre !== "Unknown"
      ? movie.genre
      : movie.Genre && movie.Genre !== "N/A"
        ? movie.Genre
        : "";

  const duration =
    movie.duration && movie.duration !== "N/A"
      ? movie.duration
      : movie.Runtime && movie.Runtime !== "N/A"
        ? movie.Runtime
        : "";

  const overview =
    movie.overview && movie.overview !== "N/A"
      ? movie.overview
      : movie.Plot && movie.Plot !== "N/A"
        ? movie.Plot
        : "Explore the movie to discover its story and details.";

  return (
    <section
      className="hero"
      style={
        movie.poster
          ? {
              backgroundImage: `url("${movie.poster}")`,
            }
          : undefined
      }
    >
      <div className="hero-overlay">
        <div className="hero-content">
          <span className="hero-badge">
            #1 FEATURED MOVIE
          </span>

          <h1>{movie.title || movie.Title}</h1>

          <div className="hero-meta">
            {rating && (
              <span className="hero-rating">
                <Star size={18} fill="currentColor" />
                {rating}
              </span>
            )}

            <span>{movie.year || movie.Year}</span>

            {duration && <span>{duration}</span>}

            {genre && (
              <span className="hero-genre">{genre}</span>
            )}
          </div>

          <p className="hero-description">{overview}</p>

          <div className="hero-buttons">
            <button
              type="button"
              className="hero-btn primary-btn"
              onClick={() => onSelectMovie(movie)}
            >
              <Play size={18} fill="currentColor" />
              Explore Movie
            </button>

            <button
              type="button"
              className="hero-btn secondary-btn"
              onClick={() => onSelectMovie(movie)}
            >
              <Info size={18} />
              More Details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;