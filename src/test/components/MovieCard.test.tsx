// Component test: MovieCard presentation and poster URL rules with MemoryRouter for <Link>.
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MovieCard from '../../components/MovieCard'
import { TMDB_IMAGE_BASE } from '../../lib/api_client'

describe('MovieCard', () => {
  // Exercises the main card UI:
  // detail link, title/year/rating line, TMDB-relative vs absolute poster URLs, and the no-poster placeholder (three quick scenarios in one test to avoid duplicate router setup).
  it('renders link, meta line, relative poster path, and placeholder when poster is missing', () => {
    const { unmount: u1 } = render(
      <MemoryRouter>
        <ul>
          <MovieCard
            id={42}
            title="Demo Film"
            poster_path="/abc.jpg"
            vote_average={8.25}
            release_date="2019-06-01"
          />
        </ul>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', { name: /view details for demo film/i })
    ).toHaveAttribute('href', '/movie/42')
    expect(
      screen.getByRole('heading', { name: 'Demo Film' })
    ).toBeInTheDocument()
    expect(screen.getByText(/2019/)).toBeInTheDocument()
    expect(screen.getByText(/8\.3/)).toBeInTheDocument()
    const img1 = document.querySelector(
      '.movie-card__poster'
    ) as HTMLImageElement | null
    expect(img1?.getAttribute('src')).toBe(`${TMDB_IMAGE_BASE}/abc.jpg`)

    u1()

    const { unmount: u2 } = render(
      <MemoryRouter>
        <ul>
          <MovieCard
            id={1}
            title="Remote Poster"
            poster_path="https://example.com/poster.png"
            vote_average={7}
            release_date="2020-01-01"
          />
        </ul>
      </MemoryRouter>
    )
    const img2 = document.querySelector(
      '.movie-card__poster'
    ) as HTMLImageElement | null
    expect(img2?.getAttribute('src')).toBe('https://example.com/poster.png')

    u2()

    const { container } = render(
      <MemoryRouter>
        <ul>
          <MovieCard
            id={3}
            title="No Poster"
            poster_path={null}
            vote_average={6}
          />
        </ul>
      </MemoryRouter>
    )
    expect(
      container.querySelector('.movie-card__poster--placeholder')
    ).not.toBeNull()
    expect(container.querySelector('img')).toBeNull()
  })
})
