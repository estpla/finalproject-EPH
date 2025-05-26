// Mocks para los métodos de PrismaClient usados en dashboardService
const mockAthleteCount = jest.fn();
const mockWorkoutCount = jest.fn();
const mockTrainingSessionCount = jest.fn();
const mockWorkoutFindMany = jest.fn();

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      athlete: { count: mockAthleteCount },
      workout: { count: mockWorkoutCount, findMany: mockWorkoutFindMany },
      trainingSession: { count: mockTrainingSessionCount },
    })),
  };
});

const dashboardService = require("../../../src/services/dashboardService");

describe("dashboardService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return dashboard stats with correct structure", async () => {
    mockAthleteCount.mockResolvedValueOnce(10); // totalAthletes
    mockWorkoutCount.mockResolvedValueOnce(5); // totalWorkouts
    mockTrainingSessionCount.mockResolvedValueOnce(8); // finishedSessions
    mockTrainingSessionCount.mockResolvedValueOnce(10); // totalSessions
    mockAthleteCount.mockResolvedValueOnce(7); // activeAthletes
    mockTrainingSessionCount.mockResolvedValueOnce(3); // finishedSessionsThisMonth
    mockAthleteCount.mockResolvedValueOnce(2); // athletesWithoutSessionsThisMonth
    mockWorkoutFindMany.mockResolvedValueOnce([
      { id: 1, name: "Rutina 1", _count: { athletes: 4 } },
      { id: 2, name: "Rutina 2", _count: { athletes: 2 } },
    ]);

    const stats = await dashboardService.getDashboardStats();
    expect(stats).toEqual({
      totalAthletes: 10,
      activeAthletes: 7,
      totalWorkouts: 5,
      completionRate: 80,
      athleteStatusDistribution: {
        active: 7,
        finished: 3,
        notStarted: 2,
      },
      workoutPerformance: [
        { id: 1, name: "Rutina 1", athleteCount: 4 },
        { id: 2, name: "Rutina 2", athleteCount: 2 },
      ],
    });
  });

  it("should handle zero totalSessions for completionRate", async () => {
    mockAthleteCount.mockResolvedValueOnce(1); // totalAthletes
    mockWorkoutCount.mockResolvedValueOnce(1); // totalWorkouts
    mockTrainingSessionCount.mockResolvedValueOnce(0); // finishedSessions
    mockTrainingSessionCount.mockResolvedValueOnce(0); // totalSessions
    mockAthleteCount.mockResolvedValueOnce(0); // activeAthletes
    mockTrainingSessionCount.mockResolvedValueOnce(0); // finishedSessionsThisMonth
    mockAthleteCount.mockResolvedValueOnce(0); // athletesWithoutSessionsThisMonth
    mockWorkoutFindMany.mockResolvedValueOnce([]);

    const stats = await dashboardService.getDashboardStats();
    expect(stats.completionRate).toBe(0);
  });
});
