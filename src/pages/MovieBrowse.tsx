import { useEffect, useMemo, useState } from 'react'
import '../css/MovieBrowse.css'
import MovieCard from '../components/MovieCard'
import {
  fetchMovieGenres,
  fetchPopularMovies,
  searchMovies,
  type Genre,
  type Movie,
} from '../lib/api_client'

const SEARCH_DEBOUNCE_MS = 400

function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), ms)
    return () => window.clearTimeout(id)
  }, [value, ms])
  return debounced
}

type SortOption = 'popularity' | 'rating' | 'release_date'

export type MovieBrowseStorybookDemo = {
  movies: Movie[]
  genres?: Genre[]
}

type MovieBrowseProps = {
  /** Static data for Storybook (skips API and API key banner). */
  storybookDemo?: MovieBrowseStorybookDemo
}

export default function MovieBrowse({ storybookDemo }: MovieBrowseProps = {}) {
  const apiKey = (import.meta.env.VITE_TMDB_API_KEY ?? '').trim()
  const hasApiKey = apiKey.length > 0 || Boolean(storybookDemo)

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
  const demoGenres = useMemo(
    () => (storybookDemo ? (storybookDemo.genres ?? []) : null),
    [storybookDemo]
  )

  const [fetchedMovies, setFetchedMovies] = useState<Movie[]>([])
  const [fetchedGenres, setFetchedGenres] = useState<Genre[]>([])
  const movies = demoMovies ?? fetchedMovies
  const genres = demoGenres ?? fetchedGenres

  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS)

  const [genreId, setGenreId] = useState<string>('all')
  const [minRating, setMinRating] = useState<string>('0')
  const [sortBy, setSortBy] = useState<SortOption>('popularity')

  const [fetchLoading, setFetchLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const loading = storybookDemo ? false : fetchLoading
  const error = storybookDemo ? null : fetchError

  useEffect(() => {
    if (storybookDemo) return
    if (!apiKey) return
    fetchMovieGenres(apiKey)
      .then(setFetchedGenres)
      .catch(() => {
        setFetchedGenres([])
      })
  }, [storybookDemo, apiKey])

  useEffect(() => {
    if (storybookDemo) return
    if (!apiKey) return
    let cancelled = false
    void Promise.resolve().then(() => {
      if (cancelled) return
      setFetchLoading(true)
      setFetchError(null)
      const q = debouncedSearch.trim()
      const promise =
        q === '' ? fetchPopularMovies(apiKey) : searchMovies(apiKey, q)
      void promise
        .then((results) => {
          if (!cancelled) {
            setFetchedMovies(
              results.map((m) => ({
                ...m,
                genre_ids: m.genre_ids ?? [],
              }))
            )
          }
        })
        .catch((e: unknown) => {
          if (!cancelled) {
            setFetchError(
              e instanceof Error ? e.message : 'Something went wrong'
            )
            setFetchedMovies([])
          }
        })
        .finally(() => {
          if (!cancelled) {
            setFetchLoading(false)
          }
        })
    })
    return () => {
      cancelled = true
    }
  }, [storybookDemo, apiKey, debouncedSearch])

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
