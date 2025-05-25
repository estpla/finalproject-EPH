const request = require("supertest");
const express = require("express");
const authRoutes = require("../../../src/routes/authRoutes");
const authController = require("../../../src/controllers/authController");
const authMiddleware = require("../../../src/middlewares/authMiddleware");

// Mock the controller and middleware
jest.mock("../../../src/controllers/authController");
jest.mock("../../../src/middlewares/authMiddleware");

describe("Auth Routes", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/auth", authRoutes);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe("POST /auth/login", () => {
    it("should call login controller", async () => {
      const mockLogin = jest.fn((req, res) =>
        res.status(200).json({ message: "Login successful" })
      );
      authController.login.mockImplementation(mockLogin);

      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(authController.login).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe("POST /auth/register", () => {
    it("should call register controller", async () => {
      const mockRegister = jest.fn((req, res) =>
        res.status(201).json({ message: "Registration successful" })
      );
      authController.register.mockImplementation(mockRegister);

      const response = await request(app).post("/auth/register").send({
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      });

      expect(authController.register).toHaveBeenCalled();
      expect(response.status).toBe(201);
    });
  });

  describe("POST /auth/logout", () => {
    it("should call logout controller", async () => {
      const mockLogout = jest.fn((req, res) =>
        res.status(200).json({ message: "Logout successful" })
      );
      authController.logout.mockImplementation(mockLogout);

      const response = await request(app).post("/auth/logout");

      expect(authController.logout).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe("GET /auth/me", () => {
    it("should call getCurrentUser controller when token is valid", async () => {
      const mockVerifyToken = jest.fn((req, res, next) => next());
      const mockGetCurrentUser = jest.fn((req, res) =>
        res.status(200).json({ user: { id: 1, email: "test@example.com" } })
      );

      authMiddleware.verifyToken.mockImplementation(mockVerifyToken);
      authController.getCurrentUser.mockImplementation(mockGetCurrentUser);

      const response = await request(app)
        .get("/auth/me")
        .set("Authorization", "Bearer valid-token");

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(authController.getCurrentUser).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });

    it("should return 401 when token is invalid", async () => {
      const mockVerifyToken = jest.fn((req, res, next) =>
        res.status(401).json({ message: "Invalid token" })
      );
      authMiddleware.verifyToken.mockImplementation(mockVerifyToken);

      const response = await request(app)
        .get("/auth/me")
        .set("Authorization", "Bearer invalid-token");

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(response.status).toBe(401);
    });
  });
});
