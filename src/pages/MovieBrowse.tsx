// Movie browse page: lists popular or searched TMDB movies, filter controls, and links to detail via MovieCard.
import { useEffect, useMemo, useState } from 'react'
import '../css/MovieBrowse.css'
import MovieCard from '../components/MovieCard'
// API calls and types for genre list, movie rows, and card fields.
import {
  fetchMovieGenres,
  fetchMovies,
  searchMovies,
  type Genre,
  type Movie,
} from '../lib/api_client'

// How long to wait after the user stops typing before using search text for TMDB (milliseconds).
const SEARCH_DEBOUNCE_MS = 400

// I have a value that changes often (like every keystroke in search),
//  but I only want to use the value after the user has paused for a bit.
function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value)
  // After `value` stops changing for `ms` milliseconds, update the debounced copy (used so search API calls wait for typing to pause).
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), ms)
    return () => window.clearTimeout(id)
  }, [value, ms])
  return debounced
}

// Toolbar sort dropdown: popularity (default), average rating, or release date (newest first).
type SortOption = 'popularity' | 'rating' | 'release_date'

// Shape of optional static data passed from Storybook so this page renders without TMDB.
export type MovieBrowseStorybookDemo = {
  movies: Movie[]
  genres?: Genre[]
}

type MovieBrowseProps = {
  /** Static data for Storybook (skips API and API key banner). */
  storybookDemo?: MovieBrowseStorybookDemo
}

export default function MovieBrowse({ storybookDemo }: MovieBrowseProps = {}) {
  // Vite injects this at build time; empty string if unset (user sees banner to add .env).
  const apiKey = (import.meta.env.VITE_TMDB_API_KEY ?? '').trim()
  // True if we can call TMDB or Storybook supplied demo data (hides key banner and enables controls).
  const hasApiKey = apiKey.length > 0 || Boolean(storybookDemo)

  // When `storybookDemo` is set, normalize movies (ensure genre_ids arrays); otherwise null so we use API state.
  const demoMovies = useMemo(
    () =>
      storybookDemo
        ? storybookDemo.movies.map((m) => ({
            ...m,
            genre_ids: m.genre_ids ?? [],
          }))
        : null,
    [storybookDemo]
  )
  // Storybook-only genre list for the dropdown; null means use `fetchedGenres` from TMDB.
  const demoGenres = useMemo(
    () => (storybookDemo ? (storybookDemo.genres ?? []) : null),
    [storybookDemo]
  )

  // fetchedGenres — the current list of genres from the API (after fetchMovieGenres succeeds, or [] after an error / before load).
  // setFetchedGenres — the function you call to replace that list, e.g. setFetchedGenres(newArray). React will re-render when you call it.
  const [fetchedGenres, setFetchedGenres] = useState<Genre[]>([])
  // Genres for the filter `<select>`: demo copy in Storybook, otherwise TMDB genre/list.
  const genres = demoGenres ?? fetchedGenres

  const [fetchedMovies, setFetchedMovies] = useState<Movie[]>([])
  // Rows shown before filters/sort: demo list or latest successful popular/search response.
  const movies = demoMovies ?? fetchedMovies

  // Raw search box value; debounced copy below drives API search to reduce requests while typing.
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS)

  // Filter state: selected genre id string ('all' or TMDB id), minimum vote average, and sort mode.
  const [genreId, setGenreId] = useState<string>('all')
  const [minRating, setMinRating] = useState<string>('0')
  const [sortBy, setSortBy] = useState<SortOption>('popularity')

  // Async status for the movie list request (ignored in Storybook when using demo data).
  const [fetchLoading, setFetchLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const loading = storybookDemo ? false : fetchLoading
  const error = storybookDemo ? null : fetchError

  // Load TMDB genre list for the genre filter (skipped in Storybook or without an API key; on failure genres stay empty).
  useEffect(() => {
    if (storybookDemo) return
    if (!apiKey) return
    fetchMovieGenres(apiKey)
      .then(setFetchedGenres)
      .catch(() => {
        setFetchedGenres([])
      })
  }, [storybookDemo, apiKey])

  // Load popular movies or search results from TMDB when the debounced query or credentials change; cancels in-flight work if deps change again (skipped in Storybook or without a key).
  useEffect(() => {
    if (storybookDemo) return
    if (!apiKey) return

    // Flipped true in the effect cleanup so an older request cannot overwrite state after deps change or unmount.
    let cancelled = false

    const fetchData = async () => {
      try {
        setFetchLoading(true)
        setFetchError(null)

        const q = debouncedSearch.trim()
        // Empty query → trending popular list; otherwise TMDB text search.
        const results =
          q === '' ? await fetchMovies(apiKey) : await searchMovies(apiKey, q)

        if (!cancelled) {
          setFetchedMovies(
            results.map((m) => ({
              ...m,
              genre_ids: m.genre_ids ?? [],
            }))
          )
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setFetchError(e instanceof Error ? e.message : 'Something went wrong')
          setFetchedMovies([])
        }
      } finally {
        if (!cancelled) {
          setFetchLoading(false)
        }
      }
    }

    void fetchData() // fire-and-forget async work; React runs cleanup on dependency change/unmount

    return () => {
      cancelled = true
    }
  }, [storybookDemo, apiKey, debouncedSearch])

  // Derived list: copy of `movies`, then genre + min-rating filters, then sort (recalculates when inputs change).
  const displayedMovies = useMemo(() => {
    let list = [...movies]

    const gid = genreId === 'all' ? null : Number(genreId)
    if (gid !== null && !Number.isNaN(gid)) {
      list = list.filter((m) => (m.genre_ids ?? []).includes(gid))
    }

    const min = Number(minRating)
    if (!Number.isNaN(min) && min > 0) {
      list = list.filter((m) => m.vote_average >= min)
    }

    const sorted = [...list]
    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => b.vote_average - a.vote_average)
        break
      case 'release_date':
        sorted.sort((a, b) => {
          const da = a.release_date || ''
          const db = b.release_date || ''
          if (!da && !db) return 0
          if (!da) return 1
          if (!db) return -1
          return db.localeCompare(da)
        })
        break
      case 'popularity':
      default:
        sorted.sort((a, b) => b.popularity - a.popularity)
    }
    return sorted
  }, [movies, genreId, minRating, sortBy])

  return (
    <div className="movie-app">
      {!hasApiKey && (
        <p className="movie-app__banner" role="status">
          Add <code>VITE_TMDB_API_KEY</code> to a <code>.env</code> file in the
          project root (same folder as <code>package.json</code>), then restart{' '}
          <code>npm run dev</code>. Until then, search and filters are disabled.
        </p>
      )}
      <header className="movie-app__header">
        <h1>Movie Explorer</h1>
        <div className="movie-app__toolbar">
          <label className="movie-app__field">
            <span className="movie-app__label">Search</span>
            <input
              type="search"
              className="movie-app__input"
              placeholder="Search movies…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoComplete="off"
              disabled={!hasApiKey}
            />
          </label>
          <label className="movie-app__field">
            <span className="movie-app__label">Genre</span>
            <select
              className="movie-app__select"
              value={genreId}
              onChange={(e) => setGenreId(e.target.value)}
              disabled={!hasApiKey}
            >
              <option value="all">All genres</option>
              {genres.map((g) => (
                <option key={g.id} value={String(g.id)}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
          <label className="movie-app__field">
            <span className="movie-app__label">Min rating</span>
            <select
              className="movie-app__select"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              disabled={!hasApiKey}
            >
              <option value="0">Any</option>
              <option value="6">6+</option>
              <option value="7">7+</option>
              <option value="8">8+</option>
            </select>
          </label>
          <label className="movie-app__field">
            <span className="movie-app__label">Sort</span>
            <select
              className="movie-app__select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              disabled={!hasApiKey}
            >
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="release_date">Release date</option>
            </select>
          </label>
        </div>
      </header>

      {hasApiKey && loading && <p className="movie-app__status">Loading…</p>}
      {hasApiKey && error && <p className="movie-app__error">{error}</p>}

      {hasApiKey && !loading && !error && displayedMovies.length === 0 && (
        <p className="movie-app__empty">No movies match your filters.</p>
      )}

      {!hasApiKey && (
        <p className="movie-app__empty">
          Movies will load here after you add your API key and restart the dev
          server.
        </p>
      )}

      <ul className="movie-grid">
        {displayedMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            poster_path={movie.poster_path}
            vote_average={movie.vote_average}
            release_date={movie.release_date}
          />
        ))}
      </ul>
    </div>
  )
}
