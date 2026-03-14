import { expect, test } from "@playwright/test";

const providerEmail = process.env.E2E_PROVIDER_EMAIL ?? "provider@luma.health";
const providerPassword = process.env.E2E_PROVIDER_PASSWORD ?? "LumaProvider123!";
const encounterId = "aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1";

async function signInAsProvider(page: import("@playwright/test").Page) {
  await page.goto("/sign-in");
  await page.getByLabel("Email").first().fill(providerEmail);
  await page.getByLabel("Password").first().fill(providerPassword);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page).toHaveURL(/schedule|dashboard/);
}

test.describe("staff workflows", () => {
  test("provider can create a patient chart, schedule an appointment, and sign a SOAP note", async ({ page }) => {
    const timestamp = Date.now();
    const firstName = `Taylor${timestamp}`;
    const lastName = "Morris";

    await signInAsProvider(page);

    await page.goto("/patients/new");
    await page.locator('input[name="firstName"]').fill(firstName);
    await page.locator('input[name="lastName"]').fill(lastName);
    await page.locator('input[name="dateOfBirth"]').fill("1990-01-03");
    await page.locator('select[name="sex"]').selectOption("Female");
    await page.locator('input[name="genderIdentity"]').fill("Woman");
    await page.locator('input[name="email"]').fill(`taylor.${timestamp}@example.com`);
    await page.locator('input[name="phone"]').fill("9175550100");
    await page.locator('input[name="addressLine1"]').fill("100 Main Street");
    await page.locator('input[name="city"]').fill("New York");
    await page.locator('input[name="state"]').fill("NY");
    await page.locator('input[name="postalCode"]').fill("10001");
    await page.locator('textarea[name="medicalHistorySummary"]').fill("Seasonal allergies and intermittent fatigue.");
    await page.locator('textarea[name="insuranceNotes"]').fill("Employer PPO placeholder.");
    await page.locator('input[name="emergencyContactName"]').fill("Alex Morris");
    await page.locator('input[name="emergencyContactRelationship"]').fill("Sibling");
    await page.locator('input[name="emergencyContactPhone"]').fill("9175550198");
    await page.locator('input[name="consentAcknowledged"]').check();
    await page.getByRole("button", { name: /create patient chart/i }).click();

    await expect(page).toHaveURL(/\/patients\/(?!new$)[^/]+$/);
    await expect(page.getByRole("heading", { name: new RegExp(firstName, "i") })).toBeVisible();

    await page.goto("/appointments");
    await page.locator('select[name="patientId"]').selectOption({ label: `${firstName} ${lastName}` });
    await page.locator('input[name="appointmentType"]').fill("New patient visit");
    await page.locator('textarea[name="visitReason"]').fill("Initial virtual primary care visit.");
    await page.locator('input[name="scheduledStart"]').fill("2026-03-21T10:00");
    await page.locator('input[name="scheduledEnd"]').fill("2026-03-21T10:30");
    await page.locator('input[name="locationName"]').fill("Virtual visit");
    await page.locator('textarea[name="notes"]').fill("Booked during end-to-end validation.");
    await page.getByRole("button", { name: /schedule appointment/i }).click();

    await expect(page).toHaveURL(/\/appointments\/[^/]+$/);
    await expect(page.getByText(/new patient visit/i)).toBeVisible();

    await page.goto(`/notes/${encounterId}`);
    await page.locator('textarea[name="subjective"]').fill("Patient reports improved fatigue after hydration changes.");
    await page.locator('textarea[name="objective"]').fill("No respiratory distress observed on video. Speaking in full sentences.");
    await page.locator('textarea[name="assessment"]').fill("Symptoms improving. Continue monitoring and lab follow-up.");
    await page.locator('textarea[name="plan"]').fill("Maintain hydration, repeat ferritin, and reassess in two weeks.");
    await page.locator('textarea[name="followUp"]').fill("Return sooner for worsening dyspnea or dizziness.");
    await page.getByRole("button", { name: /sign soap note/i }).click();

    await expect(page).toHaveURL(new RegExp(`/notes/${encounterId}$`));
    await expect(page.locator('textarea[name="assessment"]')).toHaveValue(/symptoms improving/i);
  });
});
