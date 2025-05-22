const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Servicio para la lógica de negocio relacionada con atletas
const athleteService = {
  // Obtener todos los atletas
  async getAllAthletes() {
    return prisma.athlete.findMany({
      include: {
        assignedWorkout: {
          include: {
            exercises: true
          }
        }
      }
    });
  },
  
  // Obtener un atleta por ID
  async getAthleteById(id) {
    return prisma.athlete.findUnique({
      where: { id: parseInt(id) },
      include: {
        assignedWorkout: true,
        sessions: {
          where: { endedAt: null },
          take: 1
        }
      }
    });
  },
  
  // Obtener un atleta por email
  async getAthleteByEmail(email) {
    return prisma.athlete.findUnique({
      where: { email }
    });
  },
  
  // Crear un nuevo atleta
  async createAthlete(data) {
    return prisma.athlete.create({
      data: {
        name: data.name,
        email: data.email,
        assignedWorkoutId: data.assignedWorkoutId
      },
      include: {
        assignedWorkout: true
      }
    });
  },
  
  // Actualizar un atleta
  async updateAthlete(id, data) {
    return prisma.athlete.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        email: data.email,
        assignedWorkoutId: data.assignedWorkoutId
      },
      include: {
        assignedWorkout: true
      }
    });
  },
  
  // Eliminar un atleta
  async deleteAthlete(id) {
    return prisma.athlete.delete({
      where: { id: parseInt(id) }
    });
  },
  
  // Asignar un plan de entrenamiento a un atleta
  async assignWorkout(athleteId, workoutId) {
    return prisma.athlete.update({
      where: { id: parseInt(athleteId) },
      data: {
        assignedWorkoutId: parseInt(workoutId)
      },
      include: {
        assignedWorkout: true
      }
    });
  }
};

module.exports = athleteService;