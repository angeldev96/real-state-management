import { test, expect } from '@playwright/test';

test.describe('Classification Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to listings which will trigger login redirect
    await page.goto('/listings');
    
    // Check if we are redirected to login
    if (page.url().includes('/login')) {
      await page.locator('#email').fill('admin@eretzrealty.com');
      await page.locator('#password').fill('admin123');
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      // We should specifically land on listings because we came from there
      await page.waitForURL('**/listings');
    }
    
    // Explicitly go to settings classifications
    await page.goto('/settings');
    await page.getByRole('tab', { name: 'Classifications' }).click();
  });

  test('should manage property types', async ({ page }) => {
    const uniqueName = `TestType_${Date.now()}`;
    
    // 1. Add
    const propertyTypesSection = page.locator('div:has(> div > h3:text("Property Types"))');
    await propertyTypesSection.getByRole('button', { name: 'Add Property Types' }).click();
    
    const input = page.getByPlaceholder('Enter name...');
    await input.fill(uniqueName);
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify it exists in settings table
    await expect(propertyTypesSection.locator('table').getByText(uniqueName)).toBeVisible();

    // 2. Check in Listing Form (should be present and active)
    await page.goto('/listings');
    await page.getByRole('button', { name: 'Add Listing' }).click();
    
    // Wait for form to open
    await page.waitForSelector('form');

    // Click SelectTrigger for Property Type
    await page.locator('div:has(> label:text("Property Type"))').locator('button[role="combobox"]').click();
    await expect(page.getByRole('option', { name: uniqueName })).toBeVisible();
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Cancel' }).click();

    // 3. Archive in Settings
    await page.goto('/settings');
    await page.getByRole('tab', { name: 'Classifications' }).click();
    
    const row = propertyTypesSection.locator('tr').filter({ hasText: uniqueName });
    // The toggle button has the Power icon. We can use a more generic locator if needed, 
    // but let's try to find it by its unique position or icon class if possible.
    // In LookupManager it's the second button in the Actions cell (Edit, Toggle, Delete)
    await row.locator('button').nth(1).click(); 
    
    // Verify archived badge
    await expect(row.getByText('Archived')).toBeVisible();

    // 4. Check in Listing Form (should NOT be present for NEW listing)
    await page.goto('/listings');
    await page.getByRole('button', { name: 'Add Listing' }).click();
    
    await page.waitForSelector('form');
    await page.locator('div:has(> label:text("Property Type"))').locator('button[role="combobox"]').click();
    await expect(page.getByRole('option', { name: uniqueName })).not.toBeVisible();
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Cancel' }).click();

    // 5. Cleanup - Delete
    await page.goto('/settings');
    await page.getByRole('tab', { name: 'Classifications' }).click();
    
    // Handle the window.confirm before clicking delete
    page.once('dialog', dialog => dialog.accept());
    
    await propertyTypesSection.locator('tr').filter({ hasText: uniqueName }).locator('button').nth(2).click();
    await expect(propertyTypesSection.getByText(uniqueName)).not.toBeVisible();
  });
});
