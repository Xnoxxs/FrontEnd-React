import { test, expect } from '@playwright/test'

// When VITE_TMDB_API_KEY is not available to the dev server, the browse page should show the status banner telling the developer how to configure the key (skipped automatically if a key is already set).
test('browse page shows API key instructions when search is disabled', async ({
  page,
}) => {
  await page.goto('/')

  const search = page.getByPlaceholder('Search movies…')
  if (!(await search.isDisabled())) {
    test.skip(
      true,
      'Search is enabled (API key present); banner is hidden by design.'
    )
  }

  await expect(page.getByRole('status')).toContainText('VITE_TMDB_API_KEY')
})
