import { useState } from "react";
import { Heart, Star, Clock } from "lucide-react";
import "../css/MovieCard.css";

function MovieCard({
  movie,
  isFavorite = false,
  onToggleFavorite,
  onSelectMovie,
}) {
  const [imageError, setImageError] = useState(false);

  const poster =
    movie.poster &&
    movie.poster !== "N/A" &&
    movie.poster.trim() !== ""
      ? movie.poster
      : null;

  const rating =
    movie.rating && movie.rating !== "N/A"
      ? movie.rating
      : null;

  function handleFavoriteClick(event) {
    event.stopPropagation();

    if (onToggleFavorite) {
      onToggleFavorite(movie.id, movie);
    }
  }

  function handleMovieClick() {
    if (onSelectMovie) {
      onSelectMovie(movie);
    }
  }

  return (
    <article className="movie-card">
      <div
        className="movie-card-poster"
        onClick={handleMovieClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleMovieClick();
          }
        }}
      >
        {/* Poster: show placeholder if missing or broken */}
        {poster && !imageError ? (
          <img
            src={poster}
            alt={`${movie.title} poster`}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="movie-poster-placeholder">
            <span>{movie.title || "Movie"}</span>
            <small>Poster unavailable</small>
          </div>
        )}

        {/* Watchlist heart — unchanged */}
        <button
          type="button"
          className={`favorite-button ${
            isFavorite ? "active" : ""
          }`}
          onClick={handleFavoriteClick}
          aria-label={
            isFavorite
              ? `Remove ${movie.title} from watchlist`
              : `Add ${movie.title} to watchlist`
          }
        >
          <Heart
            size={20}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Movie information — unchanged */}
      <div className="movie-card-info">
        <h3
          onClick={handleMovieClick}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleMovieClick();
            }
          }}
        >
          {movie.title}
        </h3>

        <div className="movie-card-meta">
          <span>{movie.year || "Unknown year"}</span>

          {rating && (
            <span className="movie-rating">
              <Star size={14} fill="currentColor" />
              {rating}
            </span>
          )}
        </div>

        {movie.duration && (
          <div className="movie-duration">
            <Clock size={14} />
            <span>{movie.duration}</span>
          </div>
        )}

        {movie.genre && movie.genre !== "Movie" && (
          <p className="movie-genre">{movie.genre}</p>
        )}
      </div>
    </article>
  );
}

export default MovieCard;