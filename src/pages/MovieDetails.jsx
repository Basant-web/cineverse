import { ArrowLeft, Heart, Star, Clock, Calendar, Clapperboard, Users, Play } from "lucide-react";

import { useState } from "react";

import TrailerModal from "../components/TrailerModal";

import "../css/MovieDetails.css";

function MovieDetails({
  movie,
  isFavorite,
  onToggleFavorite,
  onBack,
}) {
  const [showTrailer, setShowTrailer] = useState(false);

  if (!movie) {
    return null;
  }

  const title = movie.title || movie.Title || "Unknown Movie";

  const year = movie.year || movie.Year || "Unknown";

  const poster =
    movie.poster && movie.poster !== "N/A"
      ? movie.poster
      : movie.Poster && movie.Poster !== "N/A"
        ? movie.Poster
        : "";

  const rating =
    movie.rating && movie.rating !== "N/A"
      ? movie.rating
      : movie.imdbRating && movie.imdbRating !== "N/A"
        ? movie.imdbRating
        : null;

  const genre = movie.genre || movie.Genre || "Not available";

  const duration = movie.duration || movie.Runtime || "";

  const overview =
    movie.overview && movie.overview !== "N/A"
      ? movie.overview
      : movie.Plot && movie.Plot !== "N/A"
        ? movie.Plot
        : "No plot information is available.";

  const actors = movie.actors || movie.Actors || "Not available";

  const director =
    movie.director || movie.Director || "Not available";

  const trailerId = movie.trailerId || "";

  function handleFavoriteClick() {
    if (onToggleFavorite) {
      onToggleFavorite(movie.id, movie);
    }
  }

  return (
    <section className="movie-details-page">
      <button
        type="button"
        className="details-back-button"
        onClick={onBack}
      >
        <ArrowLeft size={18} />
        <span>Back to movies</span>
      </button>

      <div className="movie-details-container">
        <div className="movie-details-poster">
          {poster ? (
            <img src={poster} alt={`${title} poster`} />
          ) : (
            <div className="details-poster-placeholder">
              Poster unavailable
            </div>
          )}
        </div>

        <div className="movie-details-content">
          <span className="details-label">
            MOVIE DETAILS
          </span>

          <h1>{title}</h1>

          <div className="details-meta">
            <span>
              <Calendar size={16} />
              {year}
            </span>

            {duration && (
              <span>
                <Clock size={16} />
                {duration}
              </span>
            )}
          </div>

          {rating && (
            <div className="details-rating">
              <Star size={22} fill="currentColor" />
              <strong>{rating}</strong>
              <span>IMDb Rating</span>
            </div>
          )}

          <div className="details-info-block">
            <h3>Genre</h3>
            <p>{genre}</p>
          </div>

          <div className="details-info-block">
            <h3>Overview</h3>
            <p>{overview}</p>
          </div>

          <div className="details-info-block">
            <h3>
              <Clapperboard size={18} />
              Director
            </h3>
            <p>{director}</p>
          </div>

          <div className="details-info-block">
            <h3>
              <Users size={18} />
              Cast
            </h3>
            <p>{actors}</p>
          </div>

          <div className="details-actions">
            <button
              type="button"
              className={`details-watchlist-button ${
                isFavorite ? "favorited" : ""
              }`}
              onClick={handleFavoriteClick}
            >
              <Heart
                size={18}
                fill={isFavorite ? "currentColor" : "none"}
              />

              {isFavorite
                ? "Remove from Watchlist"
                : "Add to Watchlist"}
            </button>

            {trailerId && (
              <button
                type="button"
                className="details-trailer-button"
                onClick={() => setShowTrailer(true)}
              >
                <Play size={18} fill="currentColor" />
                Watch Trailer
              </button>
            )}
          </div>
        </div>
      </div>

      {showTrailer && (
        <TrailerModal
          trailerId={trailerId}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </section>
  );
}

export default MovieDetails;