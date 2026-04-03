import { test, expect } from '@playwright/test'

// Fixed “popular” payload so min-rating filtering is deterministic (no reliance on live TMDB order or scores).
const popularJson = {
  results: [
    {
      id: 91001,
      title: 'E2E MinRating High',
      overview: 'End-to-end fixture — high score.',
      poster_path: null,
      release_date: '2020-01-01',
      vote_average: 8.7,
      vote_count: 10,
      popularity: 100,
      genre_ids: [28],
    },
    {
      id: 91002,
      title: 'E2E MinRating Low',
      overview: 'End-to-end fixture — below 8.',
      poster_path: null,
      release_date: '2020-01-02',
      vote_average: 7.2,
      vote_count: 10,
      popularity: 99,
      genre_ids: [28],
    },
  ],
}

const genreListJson = {
  genres: [{ id: 28, name: 'Action' }],
}

test('min rating 8+ shows only movies with vote average ≥ 8', async ({
  page,
}) => {
  await page.route('**/3/movie/popular*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json; charset=utf-8',
      body: JSON.stringify(popularJson),
    })
  })
  await page.route('**/3/genre/movie/list*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json; charset=utf-8',
      body: JSON.stringify(genreListJson),
    })
  })

  await page.goto('/')

  const search = page.getByPlaceholder('Search movies…')
  if (await search.isDisabled()) {
    test.skip(
      true,
      'Controls disabled without VITE_TMDB_API_KEY on dev server (mock still needs a non-empty key so the UI enables).'
    )
  }

  const highLink = page.getByRole('link', {
    name: 'View details for E2E MinRating High',
  })
  const lowLink = page.getByRole('link', {
    name: 'View details for E2E MinRating Low',
  })

  await expect(highLink).toBeVisible({ timeout: 15_000 })
  await expect(lowLink).toBeVisible()

  await page.getByLabel('Min rating').selectOption('8')

  await expect(highLink).toBeVisible()
  // Filtered rows are unmounted, not merely hidden.
  await expect(lowLink).toHaveCount(0)
})
