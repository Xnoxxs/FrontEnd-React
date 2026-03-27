import { useEffect, useState } from 'react'
import '../css/MovieDetail.css'
import { Link, useParams } from 'react-router-dom'
import {
  TMDB_BACKDROP_BASE,
  TMDB_POSTER_LARGE,
  fetchMovieDetails,
  type MovieDetails,
} from '../lib/api_client'

function formatUsd(n: number): string {
  if (n <= 0) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

function formatRuntime(minutes: number | null): string {
  if (minutes == null || minutes <= 0) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function resolveTmdbImage(base: string, path: string | null): string | null {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  return `${base}${path}`
}

type MovieDetailProps = {
  /** Static data for Storybook (skips API and API key banner). */
  storybookDemo?: MovieDetails
}

export default function MovieDetail({ storybookDemo }: MovieDetailProps = {}) {
  const { movieId } = useParams<{ movieId: string }>()
  const id = movieId ? Number.parseInt(movieId, 10) : Number.NaN
  const apiKey = (import.meta.env.VITE_TMDB_API_KEY ?? '').trim()
  const hasApiKey = apiKey.length > 0 || Boolean(storybookDemo)

  const [fetchedMovie, setFetchedMovie] = useState<MovieDetails | null>(null)
  const [fetchLoading, setFetchLoading] = useState(() => {
    if (storybookDemo) return false
    if (!apiKey) return false
    return true
  })
  const [fetchError, setFetchError] = useState<string | null>(null)

  const movie = storybookDemo ?? fetchedMovie
  const loading = storybookDemo ? false : fetchLoading
  const error = storybookDemo ? null : fetchError

  useEffect(() => {
    if (storybookDemo) return
    let cancelled = false
    void Promise.resolve().then(() => {
      if (cancelled) return
      if (!hasApiKey) {
        setFetchLoading(false)
        return
      }
      if (Number.isNaN(id) || id <= 0) {
        setFetchLoading(false)
        setFetchError('Invalid movie ID.')
        setFetchedMovie(null)
        return
      }
      setFetchLoading(true)
      setFetchError(null)
      void fetchMovieDetails(apiKey, id)
        .then((data) => {
          if (!cancelled) setFetchedMovie(data)
        })
        .catch((e: unknown) => {
          if (!cancelled) {
            setFetchError(
              e instanceof Error ? e.message : 'Could not load movie.',
            )
            setFetchedMovie(null)
          }
        })
        .finally(() => {
          if (!cancelled) setFetchLoading(false)
        })
    })
    return () => {
      cancelled = true
    }
  }, [storybookDemo, apiKey, hasApiKey, id])

  if (!hasApiKey) {
    return (
      <div className="movie-detail movie-detail--notice">
        <Link to="/" className="movie-detail__back">
          ← Back to browse
        </Link>
        <p className="movie-app__banner" role="status">
          Add <code>VITE_TMDB_API_KEY</code> to <code>.env</code> and restart
          the dev server.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="movie-detail movie-detail--notice">
        <Link to="/" className="movie-detail__back">
          ← Back to browse
        </Link>
        <p className="movie-app__status">Loading…</p>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="movie-detail movie-detail--notice">
        <Link to="/" className="movie-detail__back">
          ← Back to browse
        </Link>
        <p className="movie-app__error">{error ?? 'Movie not found.'}</p>
      </div>
    )
  }

  const backdropUrl = resolveTmdbImage(
    TMDB_BACKDROP_BASE,
    movie.backdrop_path,
  )
  const posterUrl = resolveTmdbImage(TMDB_POSTER_LARGE, movie.poster_path)

  return (
    <article className="movie-detail">
      <div
        className={
          backdropUrl
            ? 'movie-detail__hero movie-detail__hero--backdrop'
            : 'movie-detail__hero'
        }
        style={
          backdropUrl
            ? {
                backgroundImage: `linear-gradient(
                  to bottom,
                  rgba(6, 7, 10, 0.88) 0%,
                  rgba(6, 7, 10, 0.72) 38%,
                  rgba(6, 7, 10, 0.5) 62%,
                  var(--bg) 100%
                ), url(${backdropUrl})`,
              }
            : undefined
        }
      >
        <div className="movie-detail__hero-inner">
          <Link
            to="/"
            className="movie-detail__back movie-detail__back--on-hero"
          >
            ← Back to browse
          </Link>
          <div className="movie-detail__layout">
            <div className="movie-detail__poster-col">
              {posterUrl ? (
                <img
                  className="movie-detail__poster"
                  src={posterUrl}
                  alt={`${movie.title} poster`}
                />
              ) : (
                <div
                  className="movie-detail__poster movie-detail__poster--placeholder"
                  aria-hidden
                />
              )}
            </div>
            <div className="movie-detail__main">
              <h1 className="movie-detail__title">{movie.title}</h1>
              {movie.original_title !== movie.title && (
                <p className="movie-detail__original">
                  Original title: {movie.original_title}
                </p>
              )}
              {movie.tagline && (
                <p className="movie-detail__tagline">{movie.tagline}</p>
              )}

              <dl className="movie-detail__stats">
                <div className="movie-detail__stat">
                  <dt>Rating</dt>
                  <dd>
                    ★ {movie.vote_average.toFixed(1)}{' '}
                    <span className="movie-detail__muted">
                      ({movie.vote_count.toLocaleString()} votes)
                    </span>
                  </dd>
                </div>
                <div className="movie-detail__stat">
                  <dt>Released</dt>
                  <dd>{movie.release_date || '—'}</dd>
                </div>
                <div className="movie-detail__stat">
                  <dt>Runtime</dt>
                  <dd>{formatRuntime(movie.runtime)}</dd>
                </div>
                <div className="movie-detail__stat">
                  <dt>Status</dt>
                  <dd>{movie.status || '—'}</dd>
                </div>
              </dl>

              {movie.genres.length > 0 && (
                <ul className="movie-detail__genres">
                  {movie.genres.map((g) => (
                    <li key={g.id}>{g.name}</li>
                  ))}
                </ul>
              )}

              {movie.overview && (
                <section className="movie-detail__section">
                  <h2 className="movie-detail__section-title">Overview</h2>
                  <p className="movie-detail__overview">{movie.overview}</p>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="movie-detail__meta-grid-wrap">
        <h2 className="movie-detail__section-title movie-detail__section-title--grid">
          Details
        </h2>
        <dl className="movie-detail__meta-grid">
          <div>
            <dt>Original language</dt>
            <dd>{movie.original_language.toUpperCase()}</dd>
          </div>
          <div>
            <dt>Popularity</dt>
            <dd>{movie.popularity.toFixed(1)}</dd>
          </div>
          <div>
            <dt>Budget</dt>
            <dd>{formatUsd(movie.budget)}</dd>
          </div>
          <div>
            <dt>Revenue</dt>
            <dd>{formatUsd(movie.revenue)}</dd>
          </div>
          {movie.homepage && (
            <div className="movie-detail__meta-span">
              <dt>Homepage</dt>
              <dd>
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="movie-detail__link"
                >
                  {movie.homepage}
                </a>
              </dd>
            </div>
          )}
          {movie.imdb_id && (
            <div>
              <dt>IMDb</dt>
              <dd>
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="movie-detail__link"
                >
                  {movie.imdb_id}
                </a>
              </dd>
            </div>
          )}
        </dl>

        {movie.production_countries.length > 0 && (
          <section className="movie-detail__subsection">
            <h3 className="movie-detail__subsection-title">Countries</h3>
            <p className="movie-detail__inline-list">
              {movie.production_countries.map((c) => c.name).join(', ')}
            </p>
          </section>
        )}

        {movie.spoken_languages.length > 0 && (
          <section className="movie-detail__subsection">
            <h3 className="movie-detail__subsection-title">Languages</h3>
            <p className="movie-detail__inline-list">
              {movie.spoken_languages.map((l) => l.english_name).join(', ')}
            </p>
          </section>
        )}

        {movie.production_companies.length > 0 && (
          <section className="movie-detail__subsection">
            <h3 className="movie-detail__subsection-title">
              Production companies
            </h3>
            <ul className="movie-detail__companies">
              {movie.production_companies.map((c) => (
                <li key={c.id}>{c.name}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}
