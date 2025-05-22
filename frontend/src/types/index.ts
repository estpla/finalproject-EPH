
// Define types for our application

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime: number; // in seconds
  notes?: string;
  completed: number; // Number of completed sets
};

export type WorkoutPlan = {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  totalExercises: number;
  completedExercises: number;
};

export type Athlete = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  currentWorkout: WorkoutPlan | null;
  status: 'active' | 'resting' | 'finished' | 'not_started';
  activeSessionId?: number;
  startTime?: Date;
  progressPercentage: number;
};

export type UserRole = 'manager' | 'trainer' | 'athlete' | 'admin';

export type User = {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
};

export interface DashboardStats {
  totalAthletes: number;
  activeAthletes: number;
  totalWorkouts: number;
  completionRate: number;
  athleteStatusDistribution: {
    active: number;
    resting: number;
    finished: number;
    notStarted: number;
  };
  workoutPerformance: Array<{
    id: number;
    name: string;
    athleteCount: number;
  }>;
}