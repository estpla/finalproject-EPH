const dashboardController = require("../../../src/controllers/dashboardController");
const dashboardService = require("../../../src/services/dashboardService");

jest.mock("../../../src/services/dashboardService");

describe("dashboardController", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("getDashboardStats", () => {
    it("should return dashboard stats", async () => {
      const stats = { users: 10, sessions: 5 };
      dashboardService.getDashboardStats.mockResolvedValue(stats);
      await dashboardController.getDashboardStats(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(stats);
    });
    it("should handle errors and call next", async () => {
      const error = new Error("fail");
      dashboardService.getDashboardStats.mockRejectedValue(error);
      await dashboardController.getDashboardStats(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
