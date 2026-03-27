import { Link } from 'react-router-dom'
import '../css/MovieCard.css'
import { TMDB_IMAGE_BASE } from '../lib/api_client'

function resolvePosterSrc(poster_path: string | null): string | null {
  if (!poster_path) return null
  if (/^https?:\/\//i.test(poster_path)) return poster_path
  return `${TMDB_IMAGE_BASE}${poster_path}`
}

export type MovieCardProps = {
  id: number
  title: string
  poster_path: string | null
  vote_average: number
  release_date?: string
}

export default function MovieCard({
  id,
  title,
  poster_path,
  vote_average,
  release_date,
}: MovieCardProps) {
  return (
    <li>
      <Link
        to={`/movie/${id}`}
        className="movie-card"
        aria-label={`View details for ${title}`}
      >
        <div className="movie-card__poster-wrap">
          {poster_path ? (
            <img
              className="movie-card__poster"
              src={resolvePosterSrc(poster_path) ?? ''}
              alt=""
            />
          ) : (
            <div
              className="movie-card__poster movie-card__poster--placeholder"
              aria-hidden
            />
          )}
        </div>
        <div className="movie-card__body">
          <h2 className="movie-card__title">{title}</h2>
          <p className="movie-card__meta">
            {release_date ? release_date.slice(0, 4) : '—'} · ★{' '}
            {vote_average.toFixed(1)}
          </p>
        </div>
      </Link>
    </li>
  )
}
