import { Search, X } from "lucide-react";
import "../css/SearchBar.css";

function SearchBar({
  search,
  setSearch,
  selectedGenre,
  setSelectedGenre,
}) {
  const genres = [
    "All",
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
  ];

  function handleClearSearch() {
    setSearch("");
  }

  return (
    <div className="search-section">
      {/* Search input */}
      <div className="search-input-wrapper">
        <Search size={20} className="search-icon" />

        <input
          type="search"
          placeholder="Search movies by title..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search movies by title"
        />

        {search && (
          <button
            type="button"
            className="clear-search-button"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Genre filters */}
      <div
        className="genre-filters"
        role="group"
        aria-label="Filter movies by genre"
      >
        {genres.map((genre) => (
          <button
            key={genre}
            type="button"
            className={`genre-button ${
              selectedGenre === genre ? "selected" : ""
            }`}
            aria-pressed={selectedGenre === genre}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;