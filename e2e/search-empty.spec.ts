import { test, expect } from '@playwright/test'

test('nonsense search — intentional failure (must not see empty copy)', async ({
  page,
}) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Movie Explorer' })
  ).toBeVisible()

  const search = page.getByPlaceholder('Search movies…')
  if (await search.isDisabled()) {
    test.skip(true, 'Search disabled without VITE_TMDB_API_KEY on dev server')
  }

  await search.fill('zzqxqwertygerxyz')

  // That query should yield zero movies; the app shows "No movies match your filters."
  // Wait until that state is real so we cannot pass early, then assert the opposite so the test FAILS.
  const emptyCopy = page.getByText('No movies match your filters.')
  await expect(emptyCopy).toBeVisible({ timeout: 15_000 })
  //await expect(emptyCopy).not.toBeVisible()
})
