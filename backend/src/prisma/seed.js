const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de datos...');
  
  // Crear usuario administrador
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gymflow.com' },
    update: {},
    create: {
      email: 'admin@gymflow.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'admin'
    }
  });
  
  console.log('Usuario administrador creado:', admin.email);
  
  // Crear ejercicios
  const exercises = [
    { name: 'Press de banca', category: 'strength' },
    { name: 'Sentadilla', category: 'strength' },
    { name: 'Peso muerto', category: 'strength' },
    { name: 'Dominadas', category: 'strength' },
    { name: 'Carrera en cinta', category: 'cardio' }
  ];
  
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { id: exercises.indexOf(exercise) + 1 },
      update: {},
      create: {
        name: exercise.name,
        category: exercise.category
      }
    });
  }
  
  console.log('Ejercicios creados');
  
  // Crear plan de entrenamiento
  const workout = await prisma.workout.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Plan básico de fuerza',
      description: 'Plan para principiantes enfocado en fuerza'
    }
  });
  
  console.log('Plan de entrenamiento creado:', workout.name);
  
  // Asignar ejercicios al plan
  const workoutExercises = [
    { exerciseId: 1, sets: 3, reps: 10, weight: 50, rest: 90, order: 1 },
    { exerciseId: 2, sets: 3, reps: 12, weight: 60, rest: 120, order: 2 },
    { exerciseId: 3, sets: 3, reps: 8, weight: 70, rest: 120, order: 3 }
  ];
  
  for (const we of workoutExercises) {
    await prisma.workoutExercise.upsert({
      where: { 
        workoutId_exerciseId_order: {
          workoutId: workout.id,
          exerciseId: we.exerciseId,
          order: we.order
        }
      },
      update: {},
      create: {
        workoutId: workout.id,
        exerciseId: we.exerciseId,
        sets: we.sets,
        reps: we.reps,
        weight: we.weight,
        rest: we.rest,
        order: we.order
      }
    });
  }
  
  console.log('Ejercicios asignados al plan');
  
  // Crear atletas
  const athletes = [
    { name: 'Juan Pérez', email: 'juan@example.com' },
    { name: 'María García', email: 'maria@example.com' },
    { name: 'Carlos López', email: 'carlos@example.com' }
  ];
  
  for (const athlete of athletes) {
    await prisma.athlete.upsert({
      where: { email: athlete.email },
      update: {},
      create: {
        name: athlete.name,
        email: athlete.email,
        assignedWorkoutId: workout.id
      }
    });
  }
  
  console.log('Atletas creados');
  
  console.log('Seed completado con éxito');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });