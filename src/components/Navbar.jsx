import {
  Clapperboard,
  Compass,
  Heart,
  Search,
  X,
} from "lucide-react";

import "../css/Navbar.css";

function Navbar({
  activePage,
  setActivePage,
  onSearchMovie,
  searchValue = "",
  onSearchChange,
}) {
  function handleSubmit(event) {
    event.preventDefault();

    const query = searchValue.trim();

    if (query) {
      onSearchMovie(query);
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <button
          type="button"
          className="navbar-logo"
          onClick={() => setActivePage("Home")}
        >
          <Clapperboard size={28} />

          <span>
            Cine<span className="logo-highlight">Verse</span>
          </span>
        </button>

        {/* Show header search only on Home */}
        {activePage === "Home" && (
          <form
            className="navbar-search"
            onSubmit={handleSubmit}
          >
            <Search size={19} />

            <input
              type="text"
              placeholder="Search movies..."
              value={searchValue}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              aria-label="Search movies"
            />

            {searchValue && (
              <button
                type="button"
                className="navbar-clear"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}

            <button
              type="submit"
              className="navbar-search-button"
            >
              Search
            </button>
          </form>
        )}

        {/* Navigation */}
        <nav className="navbar-links">
          <button
            type="button"
            className={`nav-link ${
              activePage === "Home" ? "active" : ""
            }`}
            onClick={() => setActivePage("Home")}
          >
            Home
          </button>

          <button
            type="button"
            className={`nav-link ${
              activePage === "Discover" ? "active" : ""
            }`}
            onClick={() => setActivePage("Discover")}
          >
            <Compass size={18} />
            Discover
          </button>

          <button
            type="button"
            className={`nav-link ${
              activePage === "Watchlist" ? "active" : ""
            }`}
            onClick={() => setActivePage("Watchlist")}
          >
            <Heart size={18} />
            Watchlist
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;