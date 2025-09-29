import { test, expect } from '@playwright/test';

test('home renders and nav links work', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Load RDF Dataset')).toBeVisible();
  await page.getByRole('link', { name: 'Graph' }).click();
  await expect(page.locator('text=Graph')).toBeVisible();
  await page.getByRole('link', { name: 'Validate' }).click();
  await expect(page.locator('text=Validate')).toBeVisible();
});
