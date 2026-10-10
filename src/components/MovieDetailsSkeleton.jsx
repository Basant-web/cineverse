import "../css/MovieDetailsSkeleton.css";

function MovieDetailsSkeleton() {
  return (
    <div className="details-skeleton">
      <div className="details-skeleton-poster"></div>

      <div className="details-skeleton-content">
        <div className="details-skeleton-title"></div>
        <div className="details-skeleton-meta"></div>
        <div className="details-skeleton-description"></div>
        <div className="details-skeleton-description short"></div>

        <div className="details-skeleton-buttons">
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsSkeleton;