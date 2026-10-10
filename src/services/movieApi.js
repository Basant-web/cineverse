const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

// Cache movie details to reduce repeated API requests.
const detailsCache = new Map();

// ========================================
// SEARCH MOVIES
// ========================================

export async function searchMovies(movieName, page = 1) {
  if (!API_KEY) {
    throw new Error(
      "API key is missing. Check your .env file."
    );
  }

  const params = new URLSearchParams({
    apikey: API_KEY,
    s: movieName,
    type: "movie",
    page: String(page),
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error("Unable to connect to the movie API.");
  }

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "No movies found.");
  }

  return {
    movies: data.Search || [],
    totalResults: Number(data.totalResults) || 0,
  };
}

// ========================================
// GET COMPLETE MOVIE DETAILS
// ========================================

export async function getMovieDetails(imdbID) {
  if (!API_KEY) {
    throw new Error(
      "API key is missing. Check your .env file."
    );
  }

  if (detailsCache.has(imdbID)) {
    return detailsCache.get(imdbID);
  }

  const params = new URLSearchParams({
    apikey: API_KEY,
    i: imdbID,
    plot: "full",
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error("Unable to fetch movie details.");
  }

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(
      data.Error || "Movie details not found."
    );
  }

  detailsCache.set(imdbID, data);

  return data;
}

// ========================================
// GET RATINGS, GENRES, AND RUNTIME
// ========================================

export async function getMovieRatings(movieList) {
  return Promise.all(
    movieList.map(async (movie) => {
      try {
        const details = await getMovieDetails(
          movie.imdbID
        );

        return {
          ...movie,

          imdbRating:
            details.imdbRating &&
            details.imdbRating !== "N/A"
              ? details.imdbRating
              : "N/A",

          Genre:
            details.Genre &&
            details.Genre !== "N/A"
              ? details.Genre
              : "Unknown",

          Runtime:
            details.Runtime &&
            details.Runtime !== "N/A"
              ? details.Runtime
              : "N/A",
        };
      } catch (error) {
        console.error(
          `Could not fetch details for ${movie.Title}:`,
          error
        );

        return {
          ...movie,
          imdbRating: "N/A",
          Genre: "Unknown",
          Runtime: "N/A",
        };
      }
    })
  );
}