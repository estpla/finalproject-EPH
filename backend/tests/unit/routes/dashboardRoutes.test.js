const request = require("supertest");
const express = require("express");
const dashboardRoutes = require("../../../src/routes/dashboardRoutes");
const dashboardController = require("../../../src/controllers/dashboardController");
const authMiddleware = require("../../../src/middlewares/authMiddleware");

// Mock the controller and middleware
jest.mock("../../../src/controllers/dashboardController");
jest.mock("../../../src/middlewares/authMiddleware");

describe("Dashboard Routes", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/dashboard", dashboardRoutes);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe("GET /dashboard/stats", () => {
    it("should call getDashboardStats controller when token is valid", async () => {
      const mockVerifyToken = jest.fn((req, res, next) => next());
      const mockGetDashboardStats = jest.fn((req, res) =>
        res.status(200).json({
          totalAthletes: 10,
          totalWorkouts: 25,
          activeSessions: 5,
        })
      );

      authMiddleware.verifyToken.mockImplementation(mockVerifyToken);
      dashboardController.getDashboardStats.mockImplementation(
        mockGetDashboardStats
      );

      const response = await request(app)
        .get("/dashboard/stats")
        .set("Authorization", "Bearer valid-token");

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(dashboardController.getDashboardStats).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("totalAthletes");
      expect(response.body).toHaveProperty("totalWorkouts");
      expect(response.body).toHaveProperty("activeSessions");
    });

    it("should return 401 when token is invalid", async () => {
      const mockVerifyToken = jest.fn((req, res, next) =>
        res.status(401).json({ message: "Invalid token" })
      );
      authMiddleware.verifyToken.mockImplementation(mockVerifyToken);

      const response = await request(app)
        .get("/dashboard/stats")
        .set("Authorization", "Bearer invalid-token");

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(response.status).toBe(401);
    });
  });
});
