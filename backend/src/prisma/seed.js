const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

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
  console.log('Creando atletas...');
  
  // Generar 100 atletas con datos aleatorios
  const athletes = 100;
  
  for (let i = 0; i < athletes; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    
    await prisma.athlete.upsert({
      where: { email },
      update: {},
      create: {
        name,
        email,
        assignedWorkoutId: workout.id
      }
    });
  }
  
  console.log(`Total de atletas creados: ${athletes}`);
  
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