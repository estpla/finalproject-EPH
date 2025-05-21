
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Athlete, Exercise, WorkoutPlan } from "../types";
import { mockAthletes, mockWorkoutPlans } from "../data/mock-data";
import { toast } from "@/components/ui/use-toast";

interface GymContextType {
  athletes: Athlete[];
  activeAthletes: Athlete[];
  workoutPlans: WorkoutPlan[];
  addAthlete: (athlete: Athlete) => void;
  removeAthlete: (athleteId: string) => void;
  updateAthleteStatus: (athleteId: string, status: Athlete["status"]) => void;
  updateAthleteProgress: (athleteId: string, progressPercentage: number) => void;
  updateExerciseCompletion: (athleteId: string, exerciseId: string, completedSets: number) => void;
  assignWorkoutToAthlete: (athleteId: string, workoutPlanId: string) => void;
  addWorkoutPlan: (workoutPlan: WorkoutPlan) => void;
  updateWorkoutPlan: (workoutPlan: WorkoutPlan) => void;
  removeWorkoutPlan: (workoutPlanId: string) => void;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export const GymProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [athletes, setAthletes] = useState<Athlete[]>(mockAthletes);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(mockWorkoutPlans);

  const activeAthletes = athletes.filter(
    (athlete) => athlete.status !== "finished" && athlete.status !== "not_started"
  );

  // Atletas
  const addAthlete = (athlete: Athlete) => {
    setAthletes((prev) => [...prev, athlete]);
    toast({
      title: "Atleta añadido",
      description: `${athlete.name} ha sido añadido al sistema.`,
    });
  };

  const removeAthlete = (athleteId: string) => {
    const athlete = athletes.find((a) => a.id === athleteId);
    if (athlete) {
      setAthletes((prev) => prev.filter((a) => a.id !== athleteId));
      toast({
        title: "Atleta eliminado",
        description: `${athlete.name} ha sido eliminado del sistema.`,
      });
    }
  };

  const updateAthleteStatus = (athleteId: string, status: Athlete["status"]) => {
    setAthletes((prev) =>
      prev.map((athlete) =>
        athlete.id === athleteId
          ? {
              ...athlete,
              status,
              ...(status === "active" && !athlete.startTime
                ? { startTime: new Date() }
                : {}),
            }
          : athlete
      )
    );

    const athlete = athletes.find((a) => a.id === athleteId);
    if (athlete) {
      toast({
        title: "Estado actualizado",
        description: `${athlete.name} ahora está ${
          status === "active"
            ? "activo"
            : status === "resting"
            ? "descansando"
            : status === "finished"
            ? "finalizado"
            : "sin comenzar"
        }.`,
      });
    }
  };

  const updateAthleteProgress = (athleteId: string, progressPercentage: number) => {
    setAthletes((prev) =>
      prev.map((athlete) =>
        athlete.id === athleteId
          ? {
              ...athlete,
              progressPercentage,
              status:
                progressPercentage >= 100
                  ? "finished"
                  : athlete.status === "not_started" && progressPercentage > 0
                  ? "active"
                  : athlete.status,
            }
          : athlete
      )
    );
  };

  const updateExerciseCompletion = (
    athleteId: string,
    exerciseId: string,
    completedSets: number
  ) => {
    setAthletes((prev) =>
      prev.map((athlete) => {
        if (athlete.id !== athleteId || !athlete.currentWorkout) return athlete;

        const updatedExercises = athlete.currentWorkout.exercises.map((exercise) =>
          exercise.id === exerciseId
            ? { ...exercise, completed: completedSets }
            : exercise
        );

        // Calculate total completed exercises
        const totalExercises = updatedExercises.length;
        const completedExercises = updatedExercises.reduce(
          (acc, ex) => acc + (ex.completed === ex.sets ? 1 : 0),
          0
        );

        // Calculate overall progress percentage
        const totalSets = updatedExercises.reduce((acc, ex) => acc + ex.sets, 0);
        const completedTotalSets = updatedExercises.reduce(
          (acc, ex) => acc + ex.completed,
          0
        );
        const progressPercentage = Math.round((completedTotalSets / totalSets) * 100);

        // Update workout plan
        const updatedWorkout = {
          ...athlete.currentWorkout,
          exercises: updatedExercises,
          completedExercises,
          totalExercises,
        };

        return {
          ...athlete,
          currentWorkout: updatedWorkout,
          progressPercentage,
          status: progressPercentage >= 100 ? "finished" : athlete.status,
        };
      })
    );
  };

  const assignWorkoutToAthlete = (athleteId: string, workoutPlanId: string) => {
    const workoutPlan = workoutPlans.find((w) => w.id === workoutPlanId);
    const athlete = athletes.find((a) => a.id === athleteId);

    if (!workoutPlan || !athlete) return;

    setAthletes((prev) =>
      prev.map((a) =>
        a.id === athleteId
          ? {
              ...a,
              currentWorkout: { ...workoutPlan },
              progressPercentage: 0,
              status: "not_started",
            }
          : a
      )
    );

    toast({
      title: "Rutina asignada",
      description: `${workoutPlan.name} ha sido asignada a ${athlete.name}.`,
    });
  };

  // Planes de entrenamiento
  const addWorkoutPlan = (workoutPlan: WorkoutPlan) => {
    setWorkoutPlans((prev) => [...prev, workoutPlan]);
    toast({
      title: "Plan creado",
      description: `El plan "${workoutPlan.name}" ha sido creado exitosamente.`,
    });
  };

  const updateWorkoutPlan = (workoutPlan: WorkoutPlan) => {
    setWorkoutPlans((prev) =>
      prev.map((plan) =>
        plan.id === workoutPlan.id ? workoutPlan : plan
      )
    );

    // Actualizar el plan en atletas que lo estén usando
    setAthletes((prev) =>
      prev.map((athlete) => {
        if (athlete.currentWorkout && athlete.currentWorkout.id === workoutPlan.id) {
          // Mantener el progreso actual del atleta
          const updatedExercises = workoutPlan.exercises.map(ex => {
            const existingEx = athlete.currentWorkout?.exercises.find(e => e.id === ex.id);
            return existingEx ? existingEx : { ...ex, completed: 0 };
          });

          const updatedWorkout = {
            ...workoutPlan,
            exercises: updatedExercises,
            totalExercises: updatedExercises.length,
            completedExercises: updatedExercises.reduce(
              (acc, ex) => acc + (ex.completed === ex.sets ? 1 : 0),
              0
            ),
          };

          return {
            ...athlete,
            currentWorkout: updatedWorkout,
          };
        }
        return athlete;
      })
    );

    toast({
      title: "Plan actualizado",
      description: `El plan "${workoutPlan.name}" ha sido actualizado.`,
    });
  };

  const removeWorkoutPlan = (workoutPlanId: string) => {
    const plan = workoutPlans.find((w) => w.id === workoutPlanId);
    
    // Verificar si algún atleta está usando este plan
    const athletesWithPlan = athletes.filter(
      (a) => a.currentWorkout?.id === workoutPlanId
    );
    
    if (athletesWithPlan.length > 0) {
      // Quitar el plan a los atletas que lo están usando
      setAthletes((prev) =>
        prev.map((athlete) =>
          athlete.currentWorkout?.id === workoutPlanId
            ? { ...athlete, currentWorkout: null, progressPercentage: 0, status: "not_started" }
            : athlete
        )
      );
      
      toast({
        title: "Advertencia",
        description: `${athletesWithPlan.length} atleta(s) tenían asignado este plan y han sido actualizados.`,
      });
    }
    
    // Eliminar el plan
    if (plan) {
      setWorkoutPlans((prev) => prev.filter((w) => w.id !== workoutPlanId));
      toast({
        title: "Plan eliminado",
        description: `El plan "${plan.name}" ha sido eliminado.`,
      });
    }
  };

  const value = {
    athletes,
    activeAthletes,
    workoutPlans,
    addAthlete,
    removeAthlete,
    updateAthleteStatus,
    updateAthleteProgress,
    updateExerciseCompletion,
    assignWorkoutToAthlete,
    addWorkoutPlan,
    updateWorkoutPlan,
    removeWorkoutPlan,
  };

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
};

export const useGym = (): GymContextType => {
  const context = useContext(GymContext);
  if (context === undefined) {
    throw new Error("useGym must be used within a GymProvider");
  }
  return context;
};
