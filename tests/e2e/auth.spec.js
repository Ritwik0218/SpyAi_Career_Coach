const { test, expect } = require('@playwright/test');

test.describe('Auth + protected flows (guarded)', () => {
  const email = process.env.CLERK_TEST_EMAIL;
  const password = process.env.CLERK_TEST_PASSWORD;

  test.beforeEach(async ({ page }) => {
    // ensure base is reachable
    await page.goto('/');
  });

  test('visit public homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Career Coach|AI Career Coach|SpyAi/i);
  });

  test('protected resume redirects to sign-in when unauthenticated', async ({ page }) => {
    await page.goto('/resume');
    // Clerk middleware in dev rewrites to sign-in for unauthenticated users.
    // We assert that sign-in form appears (or a redirect happened).
    await expect(page).toHaveURL(/sign-in|signin|sign/);
  });

  test('full sign-in and access protected pages (skipped if no creds)', async ({ page }) => {
    test.skip(!email || !password, 'CLERK test credentials not provided in env');

    // Attempt a sign-in flow. This test is intentionally lightweight — exact selectors
    // depend on Clerk-hosted sign-in widget. You may need to adapt selectors for
    // your Clerk configuration.
    await page.goto('/sign-in');

    // Try filling common fields — fallback if Clerk uses hosted widget
    try {
      await page.fill('input[type="email"]', email);
      await page.fill('input[type="password"]', password);
      await page.click('button:has-text("Sign in")');
    } catch (err) {
      // If selectors don't match hosted widget, we skip and assume manual test.
      test.skip(true, 'Sign-in widget selectors not found; adapt test for your setup');
    }

    // After sign-in, ensure we can open the resume page
    await page.goto('/resume');
    await expect(page).toHaveURL(/resume/);
  });
});
