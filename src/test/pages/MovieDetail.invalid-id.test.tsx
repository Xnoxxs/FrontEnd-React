// Component test: MovieDetail validation path for movieId that is not a positive integer (no TMDB fetch).
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import MovieDetail from '../../pages/MovieDetail'

describe('MovieDetail (invalid id)', () => {
  beforeEach(() => {
    // A non-empty key makes hasApiKey true so the detail page runs validation; invalid numeric ids should error before any fetch.
    vi.stubEnv('VITE_TMDB_API_KEY', 'test-key')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  // Route param movieId "0" parses to id 0, which the effect treats as invalid—user should see the inline error, not a loading spinner forever.
  it('shows Invalid movie ID when the route param is not a positive integer', async () => {
    render(
      <MemoryRouter initialEntries={['/movie/0']}>
        <Routes>
          <Route path="/movie/:movieId" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Invalid movie ID.')).toBeInTheDocument()
    })
  })
})
