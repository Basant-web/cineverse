import { useEffect } from "react";
import { X } from "lucide-react";

import "../css/TrailerModal.css";

function TrailerModal({ videoId, movieTitle, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!videoId) {
    return null;
  }

  return (
    <div
      className="trailer-backdrop"
      onClick={onClose}
    >
      <div
        className="trailer-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${movieTitle} trailer`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="trailer-header">
          <h2>{movieTitle} — Trailer</h2>

          <button
            type="button"
            className="trailer-close"
            onClick={onClose}
            aria-label="Close trailer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="trailer-video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
            title={`${movieTitle} official trailer`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

export default TrailerModal;