const sessionService = require('../../src/services/sessionService');
const { PrismaClient } = require('@prisma/client');

// Mock de Prisma
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    trainingSession: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    },
    athlete: {
      findUnique: jest.fn(),
      update: jest.fn()
    },
    exerciseProgress: {
      findMany: jest.fn()
    }
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

const prisma = new PrismaClient();

describe('Session Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getActiveSessionByAthleteId', () => {
    it('debe retornar la sesión activa de un atleta', async () => {
      // Mock de datos
      const mockSession = {
        id: 1,
        athleteId: 1,
        startedAt: new Date(),
        endedAt: null
      };
      
      // Configurar el mock
      prisma.trainingSession.findFirst.mockResolvedValue(mockSession);
      
      // Ejecutar el servicio
      const result = await sessionService.getActiveSessionByAthleteId(1);
      
      // Verificar resultado
      expect(result).toEqual(mockSession);
      expect(prisma.trainingSession.findFirst).toHaveBeenCalledWith({
        where: {
          athleteId: 1,
          endedAt: null
        },
        include: expect.any(Object)
      });
    });
  });
  
  // Más tests aquí...
});