const { test, expect } = require("@playwright/test");

test.describe("Mock API Testing", () => {
  test("Mock a successful API response", async ({ page }) => {
    await page.route("https://jsonplaceholder.typicode.com/posts", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: 1, title: "Mock Post", body: "This is a mock post." },
        ]),
      });
    });

    const response = await page.evaluate(async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      return res.json();
    });

    expect(response).toHaveLength(1);
    expect(response[0]).toMatchObject({
      id: 1,
      title: "Mock Post",
      body: "This is a mock post.",
    });
  });

  test("Mock a failed API response", async ({ page }) => {
    await page.route("https://jsonplaceholder.typicode.com/posts", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    const response = await page.evaluate(async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        return res.json();
      } catch (err) {
        return { error: err.message };
      }
    });

    expect(response).toMatchObject({ error: "Internal Server Error" });
  });
});
