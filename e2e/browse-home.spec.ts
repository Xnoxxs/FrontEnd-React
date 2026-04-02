import { test, expect } from '@playwright/test'

// Confirms the dev server serves the browse route and the main heading is visible (smoke test independent of TMDB).
test('browse page shows the Movie Explorer heading', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Movie Explorer' })
  ).toBeVisible()
})
