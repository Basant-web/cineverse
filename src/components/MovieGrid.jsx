import MovieCard from "./MovieCard";
import { Film } from "lucide-react";
import "../css/MovieGrid.css";

function MovieGrid({
  movies = [],
  favorites = [],
  onToggleFavorite,
  onSelectMovie,
}) {
  if (movies.length === 0) {
    return (
      <div className="empty-movies">
        <Film size={45} />

        <h3>No movies found</h3>

        <p>
          Try searching for another movie.
        </p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={favorites.includes(movie.id)}
          onToggleFavorite={onToggleFavorite}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </div>
  );
}

export default MovieGrid;