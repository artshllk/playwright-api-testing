import { test, expect, request } from "@playwright/test";

test.describe("API Testing", () => {
  let apiContext;

  test.beforeAll(async () => {
    apiContext = await request.newContext();
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test("Validate GET endpoint: Fetch Users", async () => {
    const response = await apiContext.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    expect(response.ok()).toBeTruthy();
    const users = await response.json();
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toHaveProperty("id");
  });

  test("Validate POST endpoint: Create a Post", async () => {
    const postPayload = {
      title: "foo",
      body: "bar",
      userId: 1,
    };
    const response = await apiContext.post(
      "https://jsonplaceholder.typicode.com/posts",
      {
        data: postPayload,
      }
    );
    expect(response.ok()).toBeTruthy();
    const post = await response.json();
    expect(post).toMatchObject(postPayload);
  });
});
