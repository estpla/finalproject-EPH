const athleteService = require('../../../src/services/athleteService');
const { PrismaClient } = require('@prisma/client');

// Mock de Prisma
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    athlete: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

const prisma = new PrismaClient();

describe('Athlete Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getAllAthletes', () => {
    it('debe retornar todos los atletas', async () => {
      // Mock de datos
      const mockAthletes = [
        { id: 1, name: 'Atleta 1' },
        { id: 2, name: 'Atleta 2' }
      ];
      
      // Configurar el mock
      prisma.athlete.findMany.mockResolvedValue(mockAthletes);
      
      // Ejecutar el servicio
      const result = await athleteService.getAllAthletes();
      
      // Verificar resultado
      expect(result).toEqual(mockAthletes);
      expect(prisma.athlete.findMany).toHaveBeenCalledWith({
        include: expect.any(Object)
      });
    });
  });
  
  describe('getAthleteById', () => {
    it('debe retornar un atleta por ID', async () => {
      // Mock de datos
      const mockAthlete = { id: 1, name: 'Atleta 1' };
      
      // Configurar el mock
      prisma.athlete.findUnique.mockResolvedValue(mockAthlete);
      
      // Ejecutar el servicio
      const result = await athleteService.getAthleteById(1);
      
      // Verificar resultado
      expect(result).toEqual(mockAthlete);
      expect(prisma.athlete.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: expect.any(Object)
      });
    });
  });
  
  describe('getAthleteByEmail', () => {
    it('debe retornar un atleta por email', async () => {
      // Mock de datos
      const mockAthlete = { id: 1, name: 'Atleta 1', email: 'atleta1@example.com' };
      
      // Configurar el mock
      prisma.athlete.findUnique.mockResolvedValue(mockAthlete);
      
      // Ejecutar el servicio
      const result = await athleteService.getAthleteByEmail('atleta1@example.com');
      
      // Verificar resultado
      expect(result).toEqual(mockAthlete);
      expect(prisma.athlete.findUnique).toHaveBeenCalledWith({
        where: { email: 'atleta1@example.com' }
      });
    });
  });
  
  describe('createAthlete', () => {
    it('debe crear un nuevo atleta', async () => {
      // Mock de datos
      const athleteData = { name: 'Nuevo Atleta', email: 'nuevo@example.com' };
      const mockCreatedAthlete = { id: 3, ...athleteData };
      
      // Configurar el mock
      prisma.athlete.create.mockResolvedValue(mockCreatedAthlete);
      
      // Ejecutar el servicio
      const result = await athleteService.createAthlete(athleteData);
      
      // Verificar resultado
      expect(result).toEqual(mockCreatedAthlete);
      expect(prisma.athlete.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: athleteData.name,
          email: athleteData.email
        }),
        include: expect.any(Object)
      });
    });
  });
  
  describe('updateAthlete', () => {
    it('debe actualizar un atleta existente', async () => {
      // Mock de datos
      const athleteId = 1;
      const updateData = { name: 'Atleta Actualizado', email: 'actualizado@example.com' };
      const mockUpdatedAthlete = { id: athleteId, ...updateData };
      
      // Configurar el mock
      prisma.athlete.update.mockResolvedValue(mockUpdatedAthlete);
      
      // Ejecutar el servicio
      const result = await athleteService.updateAthlete(athleteId, updateData);
      
      // Verificar resultado
      expect(result).toEqual(mockUpdatedAthlete);
      expect(prisma.athlete.update).toHaveBeenCalledWith({
        where: { id: athleteId },
        data: expect.objectContaining(updateData),
        include: expect.any(Object)
      });
    });
  });
  
  describe('deleteAthlete', () => {
    it('debe eliminar un atleta', async () => {
      // Mock de datos
      const athleteId = 1;
      const mockDeletedAthlete = { id: athleteId, name: 'Atleta Eliminado' };
      
      // Configurar el mock
      prisma.athlete.delete.mockResolvedValue(mockDeletedAthlete);
      
      // Ejecutar el servicio
      const result = await athleteService.deleteAthlete(athleteId);
      
      // Verificar resultado
      expect(result).toEqual(mockDeletedAthlete);
      expect(prisma.athlete.delete).toHaveBeenCalledWith({
        where: { id: athleteId }
      });
    });
  });
  
  describe('assignWorkout', () => {
    it('debe asignar un plan de entrenamiento a un atleta', async () => {
      // Mock de datos
      const athleteId = 1;
      const workoutId = 2;
      const mockUpdatedAthlete = { 
        id: athleteId, 
        name: 'Atleta', 
        assignedWorkoutId: workoutId,
        assignedWorkout: { id: workoutId, name: 'Plan de Entrenamiento' }
      };
      
      // Configurar el mock
      prisma.athlete.update.mockResolvedValue(mockUpdatedAthlete);
      
      // Ejecutar el servicio
      const result = await athleteService.assignWorkout(athleteId, workoutId);
      
      // Verificar resultado
      expect(result).toEqual(mockUpdatedAthlete);
      expect(prisma.athlete.update).toHaveBeenCalledWith({
        where: { id: athleteId },
        data: { assignedWorkoutId: workoutId },
        include: expect.any(Object)
      });
    });
  });
});