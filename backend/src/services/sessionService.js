const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Servicio para la lógica de negocio relacionada con sesiones
const sessionService = {
  // Obtener sesión activa por ID de atleta
  async getActiveSessionByAthleteId(athleteId) {
    return prisma.trainingSession.findFirst({
      where: {
        athleteId: parseInt(athleteId),
        endedAt: null
      },
      include: {
        athlete: true,
        workout: {
          include: {
            exercises: true
          }
        }
      }
    });
  },
  
  // Crear una nueva sesión de entrenamiento
  async createSession(athleteId) {
    // Buscar el atleta
    const athlete = await prisma.athlete.findUnique({
      where: { id: parseInt(athleteId) },
      include: { assignedWorkout: true }
    });
    
    if (!athlete) {
      throw new Error('Atleta no encontrado');
    }
    
    // Si el atleta no tiene un plan asignado, lanzar error
    if (!athlete.assignedWorkout) {
      throw new Error('El atleta no tiene un plan de entrenamiento asignado');
    }
    
    // Obtener la posición más alta actual para colocar la nueva sesión al final
    const activeSessions = await this.getActiveSessions();
    const maxPosition = activeSessions.length > 0 
      ? Math.max(...activeSessions.map(session => session.position))
      : -1;
    
    // Crear la sesión con la posición al final
    const session = await prisma.trainingSession.create({
      data: {
        startedAt: new Date(),
        athleteId: athlete.id,
        workoutId: athlete.assignedWorkout.id,
        position: maxPosition + 1 // Asignar posición al final
      },
      include: {
        athlete: true,
        workout: {
          include: {
            exercises: true
          }
        }
      }
    });
    
    // Actualizar el estado del atleta
    await prisma.athlete.update({
      where: { id: athlete.id },
      data: { activeSessionId: session.id }
    });
    
    return session;
  },
  
  // Finalizar una sesión de entrenamiento
  async endSession(sessionId) {
    const session = await prisma.trainingSession.findUnique({
      where: { id: parseInt(sessionId) },
      include: { athlete: true }
    });
    
    if (!session || session.endedAt) {
      return null;
    }
    
    // Actualizar la sesión
    const updatedSession = await prisma.trainingSession.update({
      where: { id: parseInt(sessionId) },
      data: { endedAt: new Date() },
      include: {
        athlete: true,
        workout: true
      }
    });
    
    // Actualizar el estado del atleta
    await prisma.athlete.update({
      where: { id: session.athlete.id },
      data: { activeSessionId: null }
    });
    
    return updatedSession;
  },
  
  // Obtener todas las sesiones activas
  async getActiveSessions() {
    return prisma.trainingSession.findMany({
      where: { endedAt: null },
      include: {
        athlete: true,
        workout: {
          include: {
            exercises: {
              include: {
                exercise: true
              }
            }
          }
        }
      },
      orderBy: { position: 'asc' }
    });
  },
  
  // Obtener el estado actual de la sala (para monitor)
  async getRoomStatus() {
    const activeSessions = await this.getActiveSessions();
    
    // Obtener el progreso para cada sesión activa
    const sessionsWithProgress = await Promise.all(
      activeSessions.map(async (session) => {
        const progress = await prisma.exerciseProgress.findMany({
          where: { sessionId: session.id }
        });
        
        return {
          ...session,
          progress
        };
      })
    );
    
    return {
      activeCount: sessionsWithProgress.length,
      sessions: sessionsWithProgress
    };
  },
  
  // Reordenar sesiones activas
  async reorderSessions(sessionsOrder) {
    // Validar que todos los IDs correspondan a sesiones activas
    const activeSessions = await this.getActiveSessions();
    const activeSessionIds = activeSessions.map(session => session.id);
    
    // Verificar que todos los IDs en sessionsOrder existan en activeSessionIds
    const allIdsExist = sessionsOrder.every(id => activeSessionIds.includes(id));
    
    if (!allIdsExist) {
      throw new Error('Algunos IDs de sesión no corresponden a sesiones activas');
    }
    
    // Actualizar la posición de cada sesión
    const updatedSessions = await Promise.all(
      sessionsOrder.map(async (sessionId, index) => {
        return prisma.trainingSession.update({
          where: { id: sessionId },
          data: { position: index },
          include: {
            athlete: true,
            workout: {
              include: {
                exercises: true
              }
            }
          }
        });
      })
    );
    
    return updatedSessions;
  }
};

module.exports = sessionService;