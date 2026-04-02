import { test, expect } from '@playwright/test'

// Ensures the detail route exposes a back control that returns to the browse URL (works with API key missing—notice state—or with errors/loading that still render the back link).
test('movie detail back link navigates to browse', async ({ page }) => {
  await page.goto('/movie/123')

  await page.getByRole('link', { name: /back to browse/i }).click()

  await expect(page).toHaveURL(/\/$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Movie Explorer' })
  ).toBeVisible()
})
