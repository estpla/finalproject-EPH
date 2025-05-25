const request = require("supertest");
const express = require("express");
const sessionRoutes = require("../../../src/routes/sessionRoutes");
const sessionController = require("../../../src/controllers/sessionController");
const authMiddleware = require("../../../src/middlewares/authMiddleware");

// Mock the controller and middleware
jest.mock("../../../src/controllers/sessionController");
jest.mock("../../../src/middlewares/authMiddleware");

describe("Session Routes", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/sessions", sessionRoutes);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe("POST /sessions/start", () => {
    it("should call startSession controller", async () => {
      const mockStartSession = jest.fn((req, res) =>
        res.status(201).json({
          sessionId: "123",
          message: "Session started",
        })
      );
      sessionController.startSession.mockImplementation(mockStartSession);

      const response = await request(app)
        .post("/sessions/start")
        .send({ athleteId: 1, workoutId: 1 });

      expect(sessionController.startSession).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("sessionId");
    });
  });

  describe("POST /sessions/end/:sessionId", () => {
    it("should call endSession controller", async () => {
      const mockEndSession = jest.fn((req, res) =>
        res.status(200).json({
          message: "Session ended",
        })
      );
      sessionController.endSession.mockImplementation(mockEndSession);

      const response = await request(app).post("/sessions/end/123");

      expect(sessionController.endSession).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe("GET /sessions/active", () => {
    it("should call getActiveSessions controller when token is valid", async () => {
      const mockVerifyToken = jest.fn((req, res, next) => next());
      const mockGetActiveSessions = jest.fn((req, res) =>
        res.status(200).json({
          sessions: [{ id: "123", athleteId: 1, status: "active" }],
        })
      );

      authMiddleware.verifyToken.mockImplementation(mockVerifyToken);
      sessionController.getActiveSessions.mockImplementation(
        mockGetActiveSessions
      );

      const response = await request(app)
        .get("/sessions/active")
        .set("Authorization", "Bearer valid-token");

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(sessionController.getActiveSessions).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("sessions");
    });

    it("should return 401 when token is invalid", async () => {
      const mockVerifyToken = jest.fn((req, res, next) =>
        res.status(401).json({ message: "Invalid token" })
      );
      authMiddleware.verifyToken.mockImplementation(mockVerifyToken);

      const response = await request(app)
        .get("/sessions/active")
        .set("Authorization", "Bearer invalid-token");

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(response.status).toBe(401);
    });
  });

  describe("GET /sessions/room/status", () => {
    it("should call getRoomStatus controller", async () => {
      const mockGetRoomStatus = jest.fn((req, res) =>
        res.status(200).json({
          roomStatus: "active",
          currentSession: { id: "123", athleteId: 1 },
        })
      );
      sessionController.getRoomStatus.mockImplementation(mockGetRoomStatus);

      const response = await request(app).get("/sessions/room/status");

      expect(sessionController.getRoomStatus).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("roomStatus");
      expect(response.body).toHaveProperty("currentSession");
    });
  });

  describe("POST /sessions/reorder", () => {
    it("should call reorderSessions controller when token is valid", async () => {
      const mockVerifyToken = jest.fn((req, res, next) => next());
      const mockReorderSessions = jest.fn((req, res) =>
        res.status(200).json({
          message: "Sessions reordered",
        })
      );

      authMiddleware.verifyToken.mockImplementation(mockVerifyToken);
      sessionController.reorderSessions.mockImplementation(mockReorderSessions);

      const response = await request(app)
        .post("/sessions/reorder")
        .set("Authorization", "Bearer valid-token")
        .send({ sessionIds: ["123", "456", "789"] });

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(sessionController.reorderSessions).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });

    it("should return 401 when token is invalid", async () => {
      const mockVerifyToken = jest.fn((req, res, next) =>
        res.status(401).json({ message: "Invalid token" })
      );
      authMiddleware.verifyToken.mockImplementation(mockVerifyToken);

      const response = await request(app)
        .post("/sessions/reorder")
        .set("Authorization", "Bearer invalid-token");

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(response.status).toBe(401);
    });
  });
});
