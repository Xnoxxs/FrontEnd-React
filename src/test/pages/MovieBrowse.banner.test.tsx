// Component test: MovieBrowse “no API key” UX (banner + disabled search) using a stubbed empty VITE_TMDB_API_KEY.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MovieBrowse from '../../pages/MovieBrowse'

describe('MovieBrowse (no API key)', () => {
  beforeEach(() => {
    // Force the same "missing key" state as a fresh clone without .env so the browse page shows setup instructions instead of calling TMDB.
    vi.stubEnv('VITE_TMDB_API_KEY', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  // Confirms the status banner and disabled search match the product copy when TMDB cannot be called (mirrors what users see before configuring VITE_TMDB_API_KEY).
  it('shows the API key setup banner and disables search when the env key is empty', () => {
    render(
      <MemoryRouter>
        <MovieBrowse />
      </MemoryRouter>
    )

    expect(screen.getByRole('status')).toHaveTextContent('VITE_TMDB_API_KEY')
    expect(screen.getByPlaceholderText('Search movies…')).toBeDisabled()
  })
})
