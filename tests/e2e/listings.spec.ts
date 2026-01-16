import { test, expect } from '@playwright/test';

test.describe('Listings Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to listings - will redirect to login
    await page.goto('/listings');
    
    // Check if we are on login page
    if (page.url().includes('/login')) {
      await page.locator('#email').fill('admin@eretzrealty.com');
      await page.locator('#password').fill('admin123');
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      // Wait for navigation back to listings
      await page.waitForURL('/listings');
    }
  });

  test('should display the listings table', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible();
    await expect(page.getByText('Address', { exact: true })).toBeVisible();
  });

  test('should toggle column visibility', async ({ page }) => {
    await page.getByRole('button', { name: 'Columns' }).click();
    
    // Toggle Price off
    await page.getByRole('menuitemcheckbox', { name: 'Price' }).click();
    await expect(page.getByRole('columnheader', { name: 'Price' })).not.toBeVisible();
    
    // Close dropdown
    await page.keyboard.press('Escape');
  });

  test('should filter by search term', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Filter address...');
    await searchInput.fill('1634'); // From seed data
    
    // Should show at least the matching row
    await expect(page.getByText('1634 59th St')).toBeVisible();
  });
});
