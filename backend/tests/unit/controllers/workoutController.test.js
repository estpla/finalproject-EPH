// Mock PrismaClient and its methods BEFORE requiring the controller
const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockDeleteMany = jest.fn();
const mockExerciseUpdate = jest.fn();

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      workout: {
        findMany: mockFindMany,
        findUnique: mockFindUnique,
        create: mockCreate,
        update: mockUpdate,
        delete: mockDelete,
      },
      workoutExercise: {
        deleteMany: mockDeleteMany,
      },
      exercise: {
        update: mockExerciseUpdate,
      },
    })),
  };
});

const workoutController = require("../../../src/controllers/workoutController");

describe("workoutController", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { body: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe("getAllWorkouts", () => {
    it("should return all workouts", async () => {
      const workouts = [{ id: 1 }, { id: 2 }];
      mockFindMany.mockResolvedValue(workouts);
      await workoutController.getAllWorkouts(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(workouts);
    });
    it("should handle errors", async () => {
      mockFindMany.mockRejectedValue(new Error("fail"));
      await workoutController.getAllWorkouts(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe("getWorkoutById", () => {
    it("should return a workout by id", async () => {
      const workout = { id: 1 };
      mockReq.params = { id: "1" };
      mockFindUnique.mockResolvedValue(workout);
      await workoutController.getWorkoutById(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(workout);
    });
    it("should return 404 if not found", async () => {
      mockReq.params = { id: "1" };
      mockFindUnique.mockResolvedValue(null);
      await workoutController.getWorkoutById(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Plan de entrenamiento no encontrado",
      });
    });
    it("should handle errors", async () => {
      mockReq.params = { id: "1" };
      mockFindUnique.mockRejectedValue(new Error("fail"));
      await workoutController.getWorkoutById(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe("createWorkout", () => {
    it("should return 400 if data is incomplete", async () => {
      mockReq.body = { name: "", exercises: null };
      await workoutController.createWorkout(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Datos incompletos o inválidos",
      });
    });
    it("should create a workout", async () => {
      const workout = { id: 1 };
      mockReq.body = {
        name: "Test",
        exercises: [{ name: "ex1", sets: 1, reps: 1, weight: 1, restTime: 1 }],
      };
      mockCreate.mockResolvedValue(workout);
      await workoutController.createWorkout(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(workout);
    });
    it("should handle errors", async () => {
      mockReq.body = {
        name: "Test",
        exercises: [{ name: "ex1", sets: 1, reps: 1, weight: 1, restTime: 1 }],
      };
      mockCreate.mockRejectedValue(new Error("fail"));
      await workoutController.createWorkout(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe("updateWorkout", () => {
    it("should update a workout and exercises", async () => {
      const workout = { id: 1 };
      mockReq.params = { id: "1" };
      mockReq.body = {
        name: "Test",
        exercises: [
          {
            name: "ex1",
            sets: 1,
            reps: 1,
            weight: 1,
            restTime: 1,
            exerciseId: 2,
          },
        ],
      };
      mockUpdate.mockResolvedValue(workout);
      mockDeleteMany.mockResolvedValue();
      mockExerciseUpdate.mockResolvedValue();
      await workoutController.updateWorkout(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(workout);
    });
    it("should handle errors", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = {
        name: "Test",
        exercises: [
          {
            name: "ex1",
            sets: 1,
            reps: 1,
            weight: 1,
            restTime: 1,
            exerciseId: 2,
          },
        ],
      };
      mockUpdate.mockRejectedValue(new Error("fail"));
      mockDeleteMany.mockResolvedValue();
      mockExerciseUpdate.mockResolvedValue();
      await workoutController.updateWorkout(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
    it("should update workout without exercises", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = { name: "Test", description: "desc" };
      mockUpdate.mockResolvedValue({
        id: 1,
        name: "Test",
        description: "desc",
      });
      mockDeleteMany.mockResolvedValue();
      await workoutController.updateWorkout(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: "Test",
        description: "desc",
      });
    });
    it("should create new exercises if exerciseId is not provided", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = {
        name: "Test",
        exercises: [{ name: "ex2", sets: 2, reps: 2, weight: 2, restTime: 2 }],
      };
      mockUpdate.mockResolvedValue({ id: 1 });
      mockDeleteMany.mockResolvedValue();
      await workoutController.updateWorkout(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe("deleteWorkout", () => {
    it("should delete a workout", async () => {
      mockReq.params = { id: "1" };
      mockDeleteMany.mockResolvedValue();
      mockDelete.mockResolvedValue();
      await workoutController.deleteWorkout(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });
    it("should handle errors", async () => {
      mockReq.params = { id: "1" };
      mockDeleteMany.mockRejectedValue(new Error("fail"));
      await workoutController.deleteWorkout(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });
});
