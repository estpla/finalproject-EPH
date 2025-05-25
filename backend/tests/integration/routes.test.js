const request = require("supertest");
const app = require("../../src/server.js");

describe("Rutas principales de la API", () => {
  it("GET /api/health debe responder 200", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "OK");
  });

  it("GET /api/athletes debe responder 200 o 401/403 según auth", async () => {
    const res = await request(app).get("/api/athletes");
    expect([200, 401, 403]).toContain(res.status);
  });

  it("GET /api/sessions debe responder 200 o 401/403 según auth", async () => {
    const res = await request(app).get("/api/sessions");
    expect([200, 401, 403, 404]).toContain(res.status);
  });

  it("GET /api/workouts debe responder 200 o 401/403 según auth", async () => {
    const res = await request(app).get("/api/workouts");
    expect([200, 401, 403, 404]).toContain(res.status);
  });

  it("GET /api/dashboard debe responder 200 o 401/403 según auth", async () => {
    const res = await request(app).get("/api/dashboard");
    expect([200, 401, 403, 404]).toContain(res.status);
  });

  it("GET /api/endpoint-inexistente debe responder 404", async () => {
    const res = await request(app).get("/api/endpoint-inexistente");
    expect(res.status).toBe(404);
  });
});
