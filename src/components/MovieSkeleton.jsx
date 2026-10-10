import "../css/MovieSkeleton.css";

function MovieSkeleton({ count = 10 }) {
  return (
    <div className="movie-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div className="movie-skeleton" key={index}>
          <div className="skeleton-poster" />

          <div className="skeleton-info">
            <div className="skeleton-title" />

            <div className="skeleton-meta">
              <div className="skeleton-year" />
              <div className="skeleton-genre" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovieSkeleton;