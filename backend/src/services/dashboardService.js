const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Servicio para la lógica de negocio relacionada con el dashboard
const dashboardService = {
  // Obtener estadísticas para el dashboard
  async getDashboardStats() {
    // Obtener conteo de atletas
    const totalAthletes = await prisma.athlete.count();
    
    // Obtener conteo de rutinas
    const totalWorkouts = await prisma.workout.count();
    
    // Obtener sesiones finalizadas
    const finishedSessions = await prisma.trainingSession.count({
      where: {
        endedAt: { not: null }
      }
    });
    
    // Calcular tasa de finalización
    const totalSessions = await prisma.trainingSession.count();
    const completionRate = totalSessions > 0 
      ? Math.round((finishedSessions / totalSessions) * 100) 
      : 0;
    
    // Obtener fecha de inicio del mes actual
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    // Atletas activos: con al menos una sesión en el último mes con fecha de endedAt
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const activeAthletes = await prisma.athlete.count({
      where: {
        sessions: {
          some: {
            endedAt: {
              gte: oneMonthAgo
            }
          }
        }
      }
    });
    
    // Sesiones finalizadas en el mes actual
    const finishedSessionsThisMonth = await prisma.trainingSession.count({
      where: {
        endedAt: {
          gte: firstDayOfMonth,
          not: null
        }
      }
    });
    
    // Atletas sin sesiones este mes
    const athletesWithoutSessionsThisMonth = await prisma.athlete.count({
      where: {
        sessions: {
          none: {
            startedAt: {
              gte: firstDayOfMonth
            }
          }
        }
      }
    });
    
    // Obtener distribución de estados de atletas
    const athleteStatusDistribution = {
      active: activeAthletes,
      finished: finishedSessionsThisMonth,
      notStarted: athletesWithoutSessionsThisMonth
    };
    
    // Obtener las rutinas más populares
    const popularWorkouts = await prisma.workout.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { athletes: true }
        }
      },
      orderBy: {
        athletes: {
          _count: 'desc'
        }
      },
      take: 5
    });
    
    // Formatear las rutinas populares
    const workoutPerformance = popularWorkouts.map(workout => ({
      id: workout.id,
      name: workout.name,
      athleteCount: workout._count.athletes
    }));
    
    return {
      totalAthletes,
      activeAthletes,
      totalWorkouts,
      completionRate,
      athleteStatusDistribution,
      workoutPerformance
    };
  }
};

module.exports = dashboardService;