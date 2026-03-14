import { expect, test } from "@playwright/test";

test("sign in page loads", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByRole("heading", { name: /calmer operating system/i })).toBeVisible();
});

test("patient sign up form is available", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
});
