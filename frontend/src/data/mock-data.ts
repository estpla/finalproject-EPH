
import { Athlete, Exercise, WorkoutPlan } from "../types";

// Mock exercises data
export const mockExercises: Exercise[] = [
  {
    id: "ex1",
    name: "Sentadillas",
    sets: 4,
    reps: 10,
    weight: 80,
    restTime: 90,
    notes: "Mantén la espalda recta",
    completed: 2,
  },
  {
    id: "ex2",
    name: "Press de banca",
    sets: 3,
    reps: 12,
    weight: 60,
    restTime: 60,
    completed: 1,
  },
  {
    id: "ex3",
    name: "Peso muerto",
    sets: 5,
    reps: 5,
    weight: 100,
    restTime: 120,
    notes: "No arquear la espalda",
    completed: 0,
  },
  {
    id: "ex4",
    name: "Pull-ups",
    sets: 3,
    reps: 8,
    restTime: 60,
    completed: 3,
  },
  {
    id: "ex5",
    name: "Plancha",
    sets: 3,
    reps: 1,
    restTime: 45,
    notes: "Mantener 60 segundos",
    completed: 2,
  },
];

// Mock workout plans
export const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: "plan1",
    name: "Entrenamiento de fuerza",
    exercises: [mockExercises[0], mockExercises[1], mockExercises[2]],
    totalExercises: 3,
    completedExercises: 1,
  },
  {
    id: "plan2",
    name: "Entrenamiento de calistenia",
    exercises: [mockExercises[3], mockExercises[4]],
    totalExercises: 2,
    completedExercises: 2,
  },
  {
    id: "plan3",
    name: "Cardio y core",
    exercises: [mockExercises[0], mockExercises[4]],
    totalExercises: 2,
    completedExercises: 0,
  },
];

// Mock athletes data
export const mockAthletes: Athlete[] = [
  {
    id: "ath1",
    name: "Juan Pérez",
    avatar: "https://i.pravatar.cc/150?img=1",
    currentWorkout: mockWorkoutPlans[0],
    status: "active",
    startTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago
    progressPercentage: 60,
  },
  {
    id: "ath2",
    name: "Ana Gómez",
    avatar: "https://i.pravatar.cc/150?img=5",
    currentWorkout: mockWorkoutPlans[1],
    status: "resting",
    startTime: new Date(Date.now() - 45 * 60 * 1000), // Started 45 minutes ago
    progressPercentage: 85,
  },
  {
    id: "ath3",
    name: "Carlos Ruiz",
    avatar: "https://i.pravatar.cc/150?img=3",
    currentWorkout: mockWorkoutPlans[2],
    status: "not_started",
    progressPercentage: 0,
  },
  {
    id: "ath4",
    name: "Marta Silva",
    avatar: "https://i.pravatar.cc/150?img=10",
    currentWorkout: mockWorkoutPlans[0],
    status: "finished",
    startTime: new Date(Date.now() - 80 * 60 * 1000), // Started 80 minutes ago
    progressPercentage: 100,
  },
];
