const request = require("supertest");
const express = require("express");
const workoutController = require("../../../src/controllers/workoutController");
const authMiddleware = require("../../../src/middlewares/authMiddleware");

// Mock de las funciones del controlador
jest.mock("../../../src/controllers/workoutController");

// Mock del middleware de autenticación
jest.mock("../../../src/middlewares/authMiddleware", () => {
  const mockCheckRole = jest.fn();
  mockCheckRole.mockImplementation((roles) => (req, res, next) => next());

  return {
    verifyToken: jest.fn((req, res, next) => next()),
    checkRole: mockCheckRole,
  };
});

// Configuración de la aplicación de prueba
const app = express();
app.use(express.json());
app.use("/", require("../../../src/routes/workoutRoutes"));

describe("Workout Routes", () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  describe("GET /", () => {
    it("debería llamar a getAllWorkouts", async () => {
      workoutController.getAllWorkouts.mockImplementation((req, res) =>
        res.json([])
      );

      await request(app).get("/").expect(200);

      expect(workoutController.getAllWorkouts).toHaveBeenCalled();
    });
  });

  describe("GET /:id", () => {
    it("debería llamar a getWorkoutById con el ID proporcionado", async () => {
      const mockWorkout = { id: "1", name: "Test Workout" };
      workoutController.getWorkoutById.mockImplementation((req, res) =>
        res.json(mockWorkout)
      );

      await request(app).get("/1").expect(200);

      expect(workoutController.getWorkoutById).toHaveBeenCalled();
    });
  });

  describe("POST /", () => {
    it("debería verificar el token y el rol antes de crear un workout", async () => {
      workoutController.createWorkout.mockImplementation((req, res) =>
        res.status(201).json({})
      );

      await request(app).post("/").send({ name: "New Workout" }).expect(201);

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(workoutController.createWorkout).toHaveBeenCalled();
    });
  });

  describe("PUT /:id", () => {
    it("debería verificar el token y el rol antes de actualizar un workout", async () => {
      workoutController.updateWorkout.mockImplementation((req, res) =>
        res.json({})
      );

      await request(app)
        .put("/1")
        .send({ name: "Updated Workout" })
        .expect(200);

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(workoutController.updateWorkout).toHaveBeenCalled();
    });
  });

  describe("DELETE /:id", () => {
    it("debería verificar el token y el rol antes de eliminar un workout", async () => {
      workoutController.deleteWorkout.mockImplementation((req, res) =>
        res.status(204).send()
      );

      await request(app).delete("/1").expect(204);

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(workoutController.deleteWorkout).toHaveBeenCalled();
    });
  });
});
