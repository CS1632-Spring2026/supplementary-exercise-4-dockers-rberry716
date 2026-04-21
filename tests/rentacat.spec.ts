import { test, expect } from '@playwright/test';

var baseURL = 'http://localhost:8080/';

test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
  await page.evaluate(() => {
    document.cookie = '1=false';
    document.cookie = '2=false';
    document.cookie = '3=false';
  });
  await page.reload();
});

test('TEST-1-RESET', async ({ page }) => {
  await page.evaluate(() => {
    document.cookie = '1=true';
    document.cookie = '2=true';
    document.cookie = '3=true';
  });
  await page.reload();
  await page.getByRole('link', { name: 'Reset'}).click();
  const catListing = page.getByRole('listitem').filter({ hasText: /^(ID \d\.|Rented out)/ });
  await expect(catListing.nth(0)).toContainText('ID 1. Jennyanydots');
  await expect(catListing.nth(1)).toContainText('ID 2. Old Deuteronomy');
  await expect(catListing.nth(2)).toContainText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog'}).click();
  await expect(page.locator('img').nth(1)).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog'}).click();

  const catListing = page.getByRole('listitem').filter({ hasText: /^(ID \d\.|Rented out)/ });
  await expect(catListing).toHaveCount(3);
  await expect(catListing.nth(2)).toContainText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Rent-A-Cat'}).click();
  await expect(page.getByRole('button', { name: 'Rent'})).toBeVisible();
  await expect(page.getByRole('button', { name: 'Return'})).toBeVisible();
});

test('TEST-5-RENT', async ({ page }) => {
  await page.getByRole('link', { name: 'Rent-A-Cat'}).click();
  await page.getByRole('textbox').nth(0).fill('1');
  await page.getByRole('button', { name: 'Rent'}).click();

  const catListing = page.getByRole('listitem').filter({ hasText: /^(ID \d\.|Rented out)/ });
  await expect(catListing.nth(0)).toContainText('Rented out');
  await expect(catListing.nth(1)).toContainText('ID 2. Old Deuteronomy');
  await expect(catListing.nth(2)).toContainText('ID 3. Mistoffelees');
  await expect(page.locator('#rentResult')).toContainText('Success!');
});

test('TEST-6-RETURN', async ({ page }) => {
  await page.evaluate(() => {
    document.cookie = '1=false';
    document.cookie = '2=true';
    document.cookie = '3=true';
  });
  await page.reload();
  await page.getByRole('link', { name: 'Rent-A-Cat'}).click();
  await page.getByRole('textbox').nth(1).fill('2');
  await page.getByRole('button', { name: 'Return'}).click();

  const catListing = page.getByRole('listitem').filter({ hasText: /^(ID \d\.|Rented out)/ });
  await expect(catListing.nth(0)).toContainText('ID 1. Jennyanydots');
  await expect(catListing.nth(1)).toContainText('ID 2. Old Deuteronomy');
  await expect(catListing.nth(2)).toContainText('Rented out');
  await expect(page.locator('#returnResult')).toContainText('Success!');
});

test('TEST-7-FEED-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Feed-A-Cat'}).click();
  await expect(page.getByRole('button', { name: 'Feed'})).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => {
  await page.getByRole('link', { name: 'Feed-A-Cat'}).click();
  await page.getByRole('textbox').fill('6');
  await page.getByRole('button', { name: 'Feed'}).click();
  await expect(page.locator('#feedResult')).toContainText('Nom, nom, nom.', { timeout: 10000 });
});

test('TEST-9-GREET-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Greet-A-Cat'}).click();
  await expect(page.getByText('Meow!Meow!Meow!')).toBeVisible();
});

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
  await page.goto(baseURL + 'greet-a-cat/Jennyanydots');
  await expect(page.getByText('Meow! from Jennyanydots.')).toBeVisible();
});

test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
  await page.evaluate(() => {
    document.cookie = '1=true';
    document.cookie = '2=true';
    document.cookie = '3=true';
  });
  await page.reload();
  await page.getByRole('link', { name: 'Feed-A-Cat'}).click();
  await expect(page.locator('body')).toHaveScreenshot();
});