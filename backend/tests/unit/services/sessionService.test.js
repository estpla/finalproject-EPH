// Define mock functions first
const mockFindFirst = jest.fn();
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockFindMany = jest.fn();

// Mock @prisma/client using the above functions
jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      trainingSession: {
        findFirst: mockFindFirst,
        findUnique: mockFindUnique,
        create: mockCreate,
        update: mockUpdate,
        findMany: mockFindMany,
      },
      athlete: {
        findUnique: mockFindUnique,
        update: mockUpdate,
      },
      exerciseProgress: {
        findMany: mockFindMany,
      },
    })),
  };
});

// Now import the service (after the mock is set up)
const sessionService = require("../../../src/services/sessionService");

describe("sessionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getActiveSessionByAthleteId", () => {
    it("should return active session for athlete", async () => {
      const session = { id: 1, athleteId: 1 };
      mockFindFirst.mockResolvedValue(session);
      const result = await sessionService.getActiveSessionByAthleteId(1);
      expect(result).toEqual(session);
    });
  });

  describe("createSession", () => {
    it("should create a new session", async () => {
      const athlete = { id: 1, assignedWorkout: { id: 1 } };
      const session = { id: 1, athleteId: 1, workoutId: 1 };
      mockFindUnique.mockResolvedValueOnce(athlete);
      mockFindMany.mockResolvedValueOnce([]);
      mockCreate.mockResolvedValue(session);
      mockUpdate.mockResolvedValue({ ...athlete, activeSessionId: 1 });
      const result = await sessionService.createSession(1);
      expect(result).toEqual(session);
    });
    it("should throw error if athlete not found", async () => {
      mockFindUnique.mockResolvedValueOnce(null);
      await expect(sessionService.createSession(1)).rejects.toThrow(
        "Atleta no encontrado"
      );
    });
    it("should throw error if athlete has no assigned workout", async () => {
      const athlete = { id: 1, assignedWorkout: null };
      mockFindUnique.mockResolvedValueOnce(athlete);
      await expect(sessionService.createSession(1)).rejects.toThrow(
        "El atleta no tiene un plan de entrenamiento asignado"
      );
    });
  });

  describe("endSession", () => {
    it("should end a session", async () => {
      const session = { id: 1, athlete: { id: 1 } };
      mockFindUnique.mockResolvedValueOnce(session);
      mockUpdate.mockResolvedValueOnce({ ...session, endedAt: new Date() });
      mockUpdate.mockResolvedValueOnce({
        ...session.athlete,
        activeSessionId: null,
      });
      const result = await sessionService.endSession(1);
      expect(result).toEqual({ ...session, endedAt: expect.any(Date) });
    });
    it("should return null if session not found or already ended", async () => {
      mockFindUnique.mockResolvedValueOnce(null);
      const result = await sessionService.endSession(1);
      expect(result).toBeNull();
    });
  });

  describe("getActiveSessions", () => {
    it("should return all active sessions", async () => {
      const sessions = [{ id: 1 }, { id: 2 }];
      mockFindMany.mockResolvedValue(sessions);
      const result = await sessionService.getActiveSessions();
      expect(result).toEqual(sessions);
    });
  });

  describe("getRoomStatus", () => {
    it("should return room status with active sessions and progress", async () => {
      const sessions = [
        { id: 1, foo: "bar" },
        { id: 2, foo: "baz" },
      ];
      const progress1 = [{ id: 1, sessionId: 1 }];
      const progress2 = [{ id: 2, sessionId: 2 }];
      // First call returns sessions, then one call per session for progress
      mockFindMany
        .mockImplementationOnce(() => sessions)
        .mockImplementationOnce(() => progress1)
        .mockImplementationOnce(() => progress2);
      const result = await sessionService.getRoomStatus();
      expect(result).toEqual({
        activeCount: 2,
        sessions: [
          expect.objectContaining({
            id: 1,
            foo: "bar",
            progress: progress1,
          }),
          expect.objectContaining({
            id: 2,
            foo: "baz",
            progress: progress2,
          }),
        ],
      });
    });
  });

  describe("reorderSessions", () => {
    it("should reorder sessions", async () => {
      const sessions = [{ id: 1 }, { id: 2 }];
      mockFindMany.mockResolvedValueOnce(sessions);
      mockUpdate.mockResolvedValueOnce({ id: 1, position: 0 });
      mockUpdate.mockResolvedValueOnce({ id: 2, position: 1 });
      const result = await sessionService.reorderSessions([1, 2]);
      expect(result).toEqual([
        { id: 1, position: 0 },
        { id: 2, position: 1 },
      ]);
    });
    it("should throw error if some session IDs are invalid", async () => {
      const sessions = [{ id: 1 }];
      mockFindMany.mockResolvedValueOnce(sessions);
      await expect(sessionService.reorderSessions([1, 2])).rejects.toThrow(
        "Algunos IDs de sesión no corresponden a sesiones activas"
      );
    });
  });
});
