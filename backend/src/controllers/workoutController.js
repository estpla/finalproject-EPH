const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Obtiene todos los planes de entrenamiento
 */
const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      include: {
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });
    
    res.status(200).json(workouts);
  } catch (error) {
    console.error('Error al obtener workouts:', error);
    res.status(500).json({ error: 'Error al obtener los planes de entrenamiento' });
  }
};

/**
 * Obtiene un plan de entrenamiento por ID
 */
const getWorkoutById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const workout = await prisma.workout.findUnique({
      where: { id: parseInt(id) },
      include: {
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });
    
    if (!workout) {
      return res.status(404).json({ error: 'Plan de entrenamiento no encontrado' });
    }
    
    res.status(200).json(workout);
  } catch (error) {
    console.error('Error al obtener workout por ID:', error);
    res.status(500).json({ error: 'Error al obtener el plan de entrenamiento' });
  }
};

/**
 * Crea un nuevo plan de entrenamiento
 */
const createWorkout = async (req, res) => {
  const { name, description, exercises } = req.body;
  
  if (!name || !exercises || !Array.isArray(exercises)) {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' });
  }
  
  try {
    const workout = await prisma.workout.create({
      data: {
        name,
        description,
        exercises: {
          create: exercises.map(ex => ({
            exercise: {
              connect: { id: ex.exerciseId }
            },
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            restTime: ex.restTime
          }))
        }
      },
      include: {
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });
    
    res.status(201).json(workout);
  } catch (error) {
    console.error('Error al crear workout:', error);
    res.status(500).json({ error: 'Error al crear el plan de entrenamiento' });
  }
};

/**
 * Actualiza un plan de entrenamiento existente
 */
const updateWorkout = async (req, res) => {
  const { id } = req.params;
  const { name, description, exercises } = req.body;
  
  try {
    // Primero eliminamos las relaciones existentes
    await prisma.workoutExercise.deleteMany({
      where: { workoutId: parseInt(id) }
    });
    
    // Luego actualizamos el workout y creamos las nuevas relaciones
    const workout = await prisma.workout.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        exercises: exercises ? {
          create: exercises.map(ex => ({
            exercise: {
              connect: { id: ex.exerciseId }
            },
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            restTime: ex.restTime
          }))
        } : undefined
      },
      include: {
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });
    
    res.status(200).json(workout);
  } catch (error) {
    console.error('Error al actualizar workout:', error);
    res.status(500).json({ error: 'Error al actualizar el plan de entrenamiento' });
  }
};

/**
 * Elimina un plan de entrenamiento
 */
const deleteWorkout = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Primero eliminamos las relaciones
    await prisma.workoutExercise.deleteMany({
      where: { workoutId: parseInt(id) }
    });
    
    // Luego eliminamos el workout
    await prisma.workout.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar workout:', error);
    res.status(500).json({ error: 'Error al eliminar el plan de entrenamiento' });
  }
};

module.exports = {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout
};