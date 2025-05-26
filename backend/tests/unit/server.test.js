const request = require("supertest");
const originalEnv = process.env;

describe("Server CORS Configuration", () => {
  beforeEach(() => {
    jest.resetModules();
    // Ensure we start with a clean environment
    process.env = {
      NODE_ENV: "test",
      JWT_SECRET: "test_secret",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should use default origin when FRONTEND_URL is not set", async () => {
    // Explicitly ensure FRONTEND_URL is not set
    delete process.env.FRONTEND_URL;

    // Import the server after setting the environment
    const app = require("../../src/server");

    // Make a request to trigger CORS middleware
    const res = await request(app)
      .get("/api/health")
      .set("Origin", "http://localhost:8080");

    // Log the actual headers for debugging
    console.log("Response headers:", res.headers);
    console.log("Environment variables:", process.env);

    // Verify CORS headers
    expect(res.headers["access-control-allow-origin"]).toBe(
      "http://localhost:8080"
    );
  });

  it("should use FRONTEND_URL when available", async () => {
    // Set the environment variable
    process.env.FRONTEND_URL = "https://test-frontend.com";

    // Import the server after setting the environment
    const app = require("../../src/server");

    // Make a request to trigger CORS middleware
    const res = await request(app)
      .get("/api/health")
      .set("Origin", "https://test-frontend.com");

    // Log the actual headers for debugging
    console.log("Response headers:", res.headers);
    console.log("Environment variables:", process.env);

    // Verify CORS headers
    expect(res.headers["access-control-allow-origin"]).toBe(
      "https://test-frontend.com"
    );
  });

  it("should handle empty FRONTEND_URL", async () => {
    // Set FRONTEND_URL to empty string
    process.env.FRONTEND_URL = "";

    // Import the server after setting the environment
    const app = require("../../src/server");

    // Make a request to trigger CORS middleware
    const res = await request(app)
      .get("/api/health")
      .set("Origin", "http://localhost:8080");

    // Verify CORS headers
    expect(res.headers["access-control-allow-origin"]).toBe(
      "http://localhost:8080"
    );
  });
});
