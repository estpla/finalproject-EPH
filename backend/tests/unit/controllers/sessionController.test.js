const sessionController = require("../../../src/controllers/sessionController");
const sessionService = require("../../../src/services/sessionService");
const socketModule = require("../../../src/sockets");

// Mock dependencies
jest.mock("../../../src/services/sessionService");
jest.mock("../../../src/sockets", () => ({
  io: {
    emit: jest.fn(),
  },
}));

describe("SessionController", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock request, response and next function
    mockReq = {
      body: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("startSession", () => {
    it("should return 400 if athleteId is missing", async () => {
      mockReq.body = {};

      await sessionController.startSession(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Se requiere el ID del atleta",
      });
    });

    it("should return 400 if athlete has an active session", async () => {
      const activeSession = { id: 1, athleteId: 1 };
      mockReq.body = { athleteId: 1 };
      sessionService.getActiveSessionByAthleteId.mockResolvedValue(
        activeSession
      );

      await sessionController.startSession(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "El atleta ya tiene una sesión activa",
        session: activeSession,
      });
    });

    it("should successfully create a new session", async () => {
      const newSession = { id: 1, athleteId: 1 };
      mockReq.body = { athleteId: 1 };
      sessionService.getActiveSessionByAthleteId.mockResolvedValue(null);
      sessionService.createSession.mockResolvedValue(newSession);

      await sessionController.startSession(mockReq, mockRes, mockNext);

      expect(sessionService.createSession).toHaveBeenCalledWith(1);
      expect(socketModule.io.emit).toHaveBeenCalledWith(
        "session:started",
        newSession
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(newSession);
    });

    it("should call next on unexpected error", async () => {
      mockReq.body = { athleteId: 1 };
      sessionService.getActiveSessionByAthleteId.mockRejectedValue(
        new Error("fail")
      );
      await sessionController.startSession(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("endSession", () => {
    it("should return 404 if session is not found", async () => {
      mockReq.params = { sessionId: "1" };
      sessionService.endSession.mockResolvedValue(null);

      await sessionController.endSession(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Sesión no encontrada",
      });
    });

    it("should successfully end a session", async () => {
      const endedSession = { id: 1, athleteId: 1, endTime: new Date() };
      mockReq.params = { sessionId: "1" };
      sessionService.endSession.mockResolvedValue(endedSession);

      await sessionController.endSession(mockReq, mockRes, mockNext);

      expect(sessionService.endSession).toHaveBeenCalledWith("1");
      expect(socketModule.io.emit).toHaveBeenCalledWith(
        "session:ended",
        endedSession
      );
      expect(mockRes.json).toHaveBeenCalledWith(endedSession);
    });

    it("should call next on unexpected error", async () => {
      mockReq.params = { sessionId: "1" };
      sessionService.endSession.mockRejectedValue(new Error("fail"));
      await sessionController.endSession(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getActiveSessions", () => {
    it("should return all active sessions", async () => {
      const activeSessions = [
        { id: 1, athleteId: 1 },
        { id: 2, athleteId: 2 },
      ];
      sessionService.getActiveSessions.mockResolvedValue(activeSessions);

      await sessionController.getActiveSessions(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(activeSessions);
    });

    it("should call next on unexpected error", async () => {
      sessionService.getActiveSessions.mockRejectedValue(new Error("fail"));
      await sessionController.getActiveSessions(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getRoomStatus", () => {
    it("should return room status", async () => {
      const roomStatus = {
        activeSessions: 2,
        totalAthletes: 5,
      };
      sessionService.getRoomStatus.mockResolvedValue(roomStatus);

      await sessionController.getRoomStatus(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(roomStatus);
    });

    it("should call next on unexpected error", async () => {
      sessionService.getRoomStatus.mockRejectedValue(new Error("fail"));
      await sessionController.getRoomStatus(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("reorderSessions", () => {
    it("should return 400 if sessionsOrder is invalid", async () => {
      mockReq.body = {};

      await sessionController.reorderSessions(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Se requiere un array con el orden de las sesiones",
      });
    });

    it("should successfully reorder sessions", async () => {
      const updatedSessions = [
        { id: 2, athleteId: 2 },
        { id: 1, athleteId: 1 },
      ];
      mockReq.body = { sessionsOrder: ["2", "1"] };
      sessionService.reorderSessions.mockResolvedValue(updatedSessions);

      await sessionController.reorderSessions(mockReq, mockRes, mockNext);

      expect(sessionService.reorderSessions).toHaveBeenCalledWith([2, 1]);
      expect(socketModule.io.emit).toHaveBeenCalledWith(
        "sessions:reordered",
        updatedSessions
      );
      expect(mockRes.json).toHaveBeenCalledWith(updatedSessions);
    });

    it("should call next on unexpected error", async () => {
      mockReq.body = { sessionsOrder: [1, 2] };
      sessionService.reorderSessions.mockRejectedValue(new Error("fail"));
      await sessionController.reorderSessions(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
