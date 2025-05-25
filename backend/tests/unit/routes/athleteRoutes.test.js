const request = require("supertest");
const express = require("express");
const athleteRoutes = require("../../../src/routes/athleteRoutes");
const athleteController = require("../../../src/controllers/athleteController");
const authMiddleware = require("../../../src/middlewares/authMiddleware");

// Mock the controller and middleware
jest.mock("../../../src/controllers/athleteController");
jest.mock("../../../src/middlewares/authMiddleware");

describe("Athlete Routes", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/athletes", athleteRoutes);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe("GET /athletes", () => {
    it("should call getAllAthletes controller", async () => {
      const mockGetAllAthletes = jest.fn((req, res) =>
        res.status(200).json({ athletes: [] })
      );
      athleteController.getAllAthletes.mockImplementation(mockGetAllAthletes);

      const response = await request(app).get("/athletes");

      expect(athleteController.getAllAthletes).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe("GET /athletes/:id", () => {
    it("should call getAthleteById controller", async () => {
      const mockGetAthleteById = jest.fn((req, res) =>
        res.status(200).json({ id: 1, name: "Test Athlete" })
      );
      athleteController.getAthleteById.mockImplementation(mockGetAthleteById);

      const response = await request(app).get("/athletes/1");

      expect(athleteController.getAthleteById).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe("POST /athletes", () => {
    it("should call createAthlete controller when token is valid", async () => {
      const mockVerifyToken = jest.fn((req, res, next) => next());
      const mockCreateAthlete = jest.fn((req, res) =>
        res.status(201).json({ message: "Athlete created" })
      );

      authMiddleware.verifyToken.mockImplementation(mockVerifyToken);
      athleteController.createAthlete.mockImplementation(mockCreateAthlete);

      const response = await request(app)
        .post("/athletes")
        .set("Authorization", "Bearer valid-token")
        .send({ name: "New Athlete", email: "athlete@example.com" });

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(athleteController.createAthlete).toHaveBeenCalled();
      expect(response.status).toBe(201);
    });

    it("should return 401 when token is invalid", async () => {
      const mockVerifyToken = jest.fn((req, res, next) =>
        res.status(401).json({ message: "Invalid token" })
      );
      authMiddleware.verifyToken.mockImplementation(mockVerifyToken);

      const response = await request(app)
        .post("/athletes")
        .set("Authorization", "Bearer invalid-token");

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(response.status).toBe(401);
    });
  });

  describe("PUT /athletes/:id", () => {
    it("should call updateAthlete controller when token is valid", async () => {
      const mockVerifyToken = jest.fn((req, res, next) => next());
      const mockUpdateAthlete = jest.fn((req, res) =>
        res.status(200).json({ message: "Athlete updated" })
      );

      authMiddleware.verifyToken.mockImplementation(mockVerifyToken);
      athleteController.updateAthlete.mockImplementation(mockUpdateAthlete);

      const response = await request(app)
        .put("/athletes/1")
        .set("Authorization", "Bearer valid-token")
        .send({ name: "Updated Athlete" });

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(athleteController.updateAthlete).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe("DELETE /athletes/:id", () => {
    it("should call deleteAthlete controller when token is valid", async () => {
      const mockVerifyToken = jest.fn((req, res, next) => next());
      const mockDeleteAthlete = jest.fn((req, res) =>
        res.status(200).json({ message: "Athlete deleted" })
      );

      authMiddleware.verifyToken.mockImplementation(mockVerifyToken);
      athleteController.deleteAthlete.mockImplementation(mockDeleteAthlete);

      const response = await request(app)
        .delete("/athletes/1")
        .set("Authorization", "Bearer valid-token");

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(athleteController.deleteAthlete).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe("POST /athletes/:id/assign-workout", () => {
    it("should call assignWorkout controller when token is valid", async () => {
      const mockVerifyToken = jest.fn((req, res, next) => next());
      const mockAssignWorkout = jest.fn((req, res) =>
        res.status(200).json({ message: "Workout assigned" })
      );

      authMiddleware.verifyToken.mockImplementation(mockVerifyToken);
      athleteController.assignWorkout.mockImplementation(mockAssignWorkout);

      const response = await request(app)
        .post("/athletes/1/assign-workout")
        .set("Authorization", "Bearer valid-token")
        .send({ workoutId: 1 });

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(athleteController.assignWorkout).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });
});
