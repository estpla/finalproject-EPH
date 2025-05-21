const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const athleteService = require('../services/athleteService');

// Controlador para gestionar atletas
const athleteController = {
  // Obtener todos los atletas
  async getAllAthletes(req, res, next) {
    try {
      const athletes = await athleteService.getAllAthletes();
      res.json(athletes);
    } catch (error) {
      next(error);
    }
  },
  
  // Obtener un atleta por ID
  async getAthleteById(req, res, next) {
    try {
      const { id } = req.params;
      
      const athlete = await athleteService.getAthleteById(id);
      
      if (!athlete) {
        return res.status(404).json({ error: 'Atleta no encontrado' });
      }
      
      res.json(athlete);
    } catch (error) {
      next(error);
    }
  },
  
  // Crear un nuevo atleta
  async createAthlete(req, res, next) {
    try {
      const { name, email, assignedWorkoutId } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'El nombre del atleta es requerido' });
      }
      
      // Verificar si el email ya está en uso
      if (email) {
        const existingAthlete = await athleteService.getAthleteByEmail(email);
        
        if (existingAthlete) {
          return res.status(400).json({ error: 'El email ya está en uso' });
        }
      }
      
      // Crear atleta
      const athlete = await athleteService.createAthlete({
        name,
        email,
        assignedWorkoutId: assignedWorkoutId ? parseInt(assignedWorkoutId) : null
      });
      
      res.status(201).json(athlete);
    } catch (error) {
      next(error);
    }
  },
  
  // Actualizar un atleta
  async updateAthlete(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, assignedWorkoutId } = req.body;
      
      // Verificar si el atleta existe
      const existingAthlete = await athleteService.getAthleteById(id);
      
      if (!existingAthlete) {
        return res.status(404).json({ error: 'Atleta no encontrado' });
      }
      
      // Verificar si el email ya está en uso por otro atleta
      if (email && email !== existingAthlete.email) {
        const athleteWithEmail = await athleteService.getAthleteByEmail(email);
        
        if (athleteWithEmail && athleteWithEmail.id !== parseInt(id)) {
          return res.status(400).json({ error: 'El email ya está en uso por otro atleta' });
        }
      }
      
      // Actualizar atleta
      const athlete = await athleteService.updateAthlete(id, {
        name,
        email,
        assignedWorkoutId: assignedWorkoutId ? parseInt(assignedWorkoutId) : null
      });
      
      res.json(athlete);
    } catch (error) {
      next(error);
    }
  },
  
  // Eliminar un atleta
  async deleteAthlete(req, res, next) {
    try {
      const { id } = req.params;
      
      // Verificar si el atleta existe
      const existingAthlete = await athleteService.getAthleteById(id);
      
      if (!existingAthlete) {
        return res.status(404).json({ error: 'Atleta no encontrado' });
      }
      
      // Verificar si el atleta tiene una sesión activa
      if (existingAthlete.activeSessionId) {
        return res.status(400).json({ 
          error: 'No se puede eliminar un atleta con una sesión activa',
          activeSessionId: existingAthlete.activeSessionId
        });
      }
      
      // Eliminar atleta
      await athleteService.deleteAthlete(id);
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
  
  // Asignar un plan de entrenamiento a un atleta
  async assignWorkout(req, res, next) {
    try {
      const { id } = req.params;
      const { workoutId } = req.body;
      
      if (!workoutId) {
        return res.status(400).json({ error: 'El ID del plan de entrenamiento es requerido' });
      }
      
      // Verificar si el atleta existe
      const existingAthlete = await athleteService.getAthleteById(id);
      
      if (!existingAthlete) {
        return res.status(404).json({ error: 'Atleta no encontrado' });
      }
      
      // Verificar si el plan de entrenamiento existe
      const workout = await prisma.workout.findUnique({
        where: { id: parseInt(workoutId) }
      });
      
      if (!workout) {
        return res.status(404).json({ error: 'Plan de entrenamiento no encontrado' });
      }
      
      // Asignar plan de entrenamiento
      const athlete = await athleteService.assignWorkout(id, workoutId);
      
      res.json(athlete);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = athleteController;