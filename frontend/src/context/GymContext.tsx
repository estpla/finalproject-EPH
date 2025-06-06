/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from "react";
import { Athlete, DashboardStats, WorkoutPlan } from "../types";
import { mockWorkoutPlans } from "../data/mock-data";
import { toast } from "@/components/ui/use-toast";
import { io, Socket } from "socket.io-client";

// URL del backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface GymContextType {
  athletes: Athlete[];
  activeAthletes: Athlete[];
  workoutPlans: WorkoutPlan[];
  activeSessions: any[];
  roomStatus: any;
  addAthlete: (athlete: Athlete) => void;
  removeAthlete: (athleteId: string) => void;
  updateAthlete: (athlete: Athlete) => Promise<void>;
  updateAthleteStatus: (athleteId: string, status: Athlete["status"]) => void;
  updateAthleteProgress: (athleteId: string, progressPercentage: number) => void;
  updateExerciseCompletion: (athleteId: string, exerciseId: string, completedSets: number) => void;
  assignWorkoutToAthlete: (athleteId: string, workoutPlanId: string) => void;
  addWorkoutPlan: (workoutPlan: WorkoutPlan) => Promise<void>;
  updateWorkoutPlan: (workoutPlan: WorkoutPlan) => Promise<void>;
  removeWorkoutPlan: (workoutPlanId: string) => Promise<void>;
  endSession: (sessionId: string) => Promise<void>;
  updateRoomOrder: (sessionIds: number[]) => Promise<boolean>;
  loading: boolean;
  fetchAthletes: () => Promise<void>;
  fetchWorkoutPlans: () => Promise<void>;
  fetchRoomStatus: () => Promise<void>;
  dashboardStats: DashboardStats | null;
  fetchDashboardStats: () => Promise<void>;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export const GymProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [roomStatus, setRoomStatus] = useState<any>({activeCount: 0, sessions: []});
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Referencia para el socket
  const socketRef = useRef<Socket | null>(null);

  const activeAthletes = athletes.filter(
    (athlete) => athlete.status !== "finished" && athlete.status !== "not_started"
  );

  // Función para obtener atletas desde la API
  const fetchAthletes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/athletes`);
      
      if (!response.ok) {
        throw new Error('Error al obtener los atletas');
      }
      
      const data = await response.json();

      // Transformar los datos del backend al formato que espera el frontend
      const formattedAthletes: Athlete[] = data.map((athlete: any) => {
        // Buscar el plan de entrenamiento completo si el atleta tiene uno asignado
        const workoutPlan = athlete.assignedWorkout 
          ? workoutPlans.find(wp => wp.id === athlete.assignedWorkout.id.toString())
          : null;
        
        return {
          id: athlete.id.toString(),
          name: athlete.name,
          email: athlete.email || '',
          avatar: `https://i.pravatar.cc/150?img=${athlete.id}`,
          currentWorkout: athlete.assignedWorkout ? {
            id: athlete.assignedWorkout.id.toString(),
            name: athlete.assignedWorkout.name,
            description: athlete.assignedWorkout.description || '',
            exercises: workoutPlan ? workoutPlan.exercises : [],
            totalExercises: workoutPlan ? workoutPlan.exercises.length : 0,
            completedExercises: 0
          } : null,
          status: athlete.activeSessionId ? "active" : "not_started",
          progressPercentage: 0,
        };
      });
      
      setAthletes(formattedAthletes);
    } catch (error) {
      console.error('Error al cargar atletas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los atletas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener planes de entrenamiento desde la API
  const fetchWorkoutPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/workouts`);
      
      if (!response.ok) {
        throw new Error('Error al obtener los planes de entrenamiento');
      }
      
      const data = await response.json();
      
      // Transformar los datos del backend al formato que espera el frontend
      const formattedWorkoutPlans: WorkoutPlan[] = data.map((workout: any) => {
        // Mapear los ejercicios
        const exercises = workout.exercises.map((ex: any) => ({
          id: ex.exerciseId.toString(),
          name: ex.exercise.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight || 0,
          restTime: ex.restTime || 60,
          completed: 0
        }));
        
        return {
          id: workout.id.toString(),
          name: workout.name,
          description: workout.description || '',
          exercises: exercises,
          totalExercises: exercises.length,
          completedExercises: 0
        };
      });

      setWorkoutPlans(formattedWorkoutPlans);
    } catch (error) {
      console.error('Error al cargar planes de entrenamiento:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los planes de entrenamiento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/sessions/room/status`);
      
      if (!response.ok) {
        throw new Error('Error al obtener el estado de la sala');
      }
      
      const data = await response.json();
      setRoomStatus(data);
      setActiveSessions(data.sessions || []);
    } catch (error) {
      console.error('Error al cargar el estado de la sala:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el estado de la sala",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchWorkoutPlans();
  }, []);
  
  // Cargar atletas cuando cambien los planes de entrenamiento
  useEffect(() => {
    // Solo ejecutar si workoutPlans tiene datos
    if (workoutPlans.length > 0) {
      fetchAthletes();
      fetchRoomStatus();
    }
  }, [workoutPlans]);

  // Atletas
  const addAthlete = async (athlete: Athlete) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error('No se ha encontrado un token de autenticación.');
      }

      const response = await fetch(`${API_URL}/api/athletes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: athlete.name,
          email: athlete.email,
          assignedWorkoutId: athlete.currentWorkout?.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el atleta');
      }

      const newAthlete = await response.json();
      
      // Transformar el atleta recibido al formato del frontend
      const formattedAthlete: Athlete = {
        id: newAthlete.id.toString(),
        name: newAthlete.name,
        email: newAthlete.email || '',
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        currentWorkout: newAthlete.assignedWorkout ? {
          id: newAthlete.assignedWorkout.id.toString(),
          name: newAthlete.assignedWorkout.name,
          description: newAthlete.assignedWorkout.description || '',
          exercises: [],
          totalExercises: 0,
          completedExercises: 0
        } : null,
        status: "not_started",
        progressPercentage: 0,
      };

      setAthletes((prev) => [...prev, formattedAthlete]);
      
      toast({
        title: "Atleta añadido",
        description: `${formattedAthlete.name} ha sido añadido al sistema.`,
      });
    } catch (error) {
      console.error('Error al añadir atleta:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al añadir el atleta",
        variant: "destructive"
      });
    }
  };

  const removeAthlete = async (athleteId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error('No se ha encontrado un token de autenticación.');
      }

      const response = await fetch(`${API_URL}/api/athletes/${athleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el atleta');
      }

      const athlete = athletes.find((a) => a.id === athleteId);
      if (athlete) {
        setAthletes((prev) => prev.filter((a) => a.id !== athleteId));
        toast({
          title: "Atleta eliminado",
          description: `${athlete.name} ha sido eliminado del sistema.`,
        });
      }
    } catch (error) {
      console.error('Error al eliminar atleta:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar el atleta",
        variant: "destructive"
      });
    }
  };

  const updateAthlete = async (athlete: Athlete) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error('No se ha encontrado un token de autenticación.');
      }

      const response = await fetch(`${API_URL}/api/athletes/${athlete.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: athlete.name,
          email: athlete.email,
          assignedWorkoutId: athlete.currentWorkout?.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el atleta');
      }

      const updatedAthlete = await response.json();
      
      // Actualizar el atleta en el estado
      setAthletes((prev) =>
        prev.map((a) =>
          a.id === athlete.id
            ? {
                ...a,
                name: updatedAthlete.name,
                email: updatedAthlete.email || '',
              }
            : a
        )
      );
      
      toast({
        title: "Atleta actualizado",
        description: `${updatedAthlete.name} ha sido actualizado correctamente.`,
      });
    } catch (error) {
      console.error('Error al actualizar atleta:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar el atleta",
        variant: "destructive"
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

  const assignWorkoutToAthlete = async (athleteId: string, workoutPlanId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error('No se ha encontrado un token de autenticación.');
      }

      const response = await fetch(`${API_URL}/api/athletes/${athleteId}/assign-workout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ workoutId: workoutPlanId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al asignar la rutina');
      }

      const updatedAthlete = await response.json();
      
      // Actualizar el atleta en el estado
      setAthletes((prev) =>
        prev.map((a) =>
          a.id === athleteId
            ? {
                ...a,
                currentWorkout: updatedAthlete.assignedWorkout ? {
                  id: updatedAthlete.assignedWorkout.id.toString(),
                  name: updatedAthlete.assignedWorkout.name,
                  description: updatedAthlete.assignedWorkout.description || '',
                  exercises: [],
                  totalExercises: 0,
                  completedExercises: 0
                } : null,
                progressPercentage: 0,
                status: "not_started",
              }
            : a
        )
      );

      const workoutPlan = workoutPlans.find((w) => w.id === workoutPlanId);
      const athlete = athletes.find((a) => a.id === athleteId);

      if (workoutPlan && athlete) {
        toast({
          title: "Rutina asignada",
          description: `${workoutPlan.name} ha sido asignada a ${athlete.name}.`,
        });
      }
    } catch (error) {
      console.error('Error al asignar rutina:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al asignar la rutina",
        variant: "destructive"
      });
    }
  };

  // Planes de entrenamiento
  const addWorkoutPlan = async (workoutPlan: WorkoutPlan) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error('No se ha encontrado un token de autenticación.');
      }

      // Preparar los datos para el backend
      const workoutData = {
        name: workoutPlan.name,
        description: workoutPlan.description,
        exercises: workoutPlan.exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          restTime: ex.restTime
        }))
      };

      const response = await fetch(`${API_URL}/api/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el plan de entrenamiento');
      }

      const newWorkout = await response.json();
      
      // Transformar el workout recibido al formato del frontend
      const formattedWorkout: WorkoutPlan = {
        id: newWorkout.id.toString(),
        name: newWorkout.name,
        description: newWorkout.description || '',
        exercises: newWorkout.exercises.map((ex: any) => ({
          id: ex.exerciseId.toString(),
          name: ex.exercise.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight || 0,
          restTime: ex.restTime || 60,
          completed: 0
        })),
        totalExercises: newWorkout.exercises.length,
        completedExercises: 0
      };

      setWorkoutPlans((prev) => [...prev, formattedWorkout]);
      
      toast({
        title: "Plan creado",
        description: `El plan "${formattedWorkout.name}" ha sido creado exitosamente.`,
      });
    } catch (error) {
      console.error('Error al añadir plan de entrenamiento:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear el plan de entrenamiento",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateWorkoutPlan = async (workoutPlan: WorkoutPlan) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error('No se ha encontrado un token de autenticación.');
      }

      // Preparar los datos para el backend
      const workoutData = {
        name: workoutPlan.name,
        description: workoutPlan.description,
        exercises: workoutPlan.exercises.map(ex => ({
          exerciseId: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          restTime: ex.restTime
        }))
      };

      const response = await fetch(`${API_URL}/api/workouts/${workoutPlan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el plan de entrenamiento');
      }

      const updatedWorkout = await response.json();
      
      // Transformar el workout recibido al formato del frontend
      const formattedWorkout: WorkoutPlan = {
        id: updatedWorkout.id.toString(),
        name: updatedWorkout.name,
        description: updatedWorkout.description || '',
        exercises: updatedWorkout.exercises.map((ex: any) => ({
          id: ex.exerciseId.toString(),
          name: ex.exercise.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight || 0,
          restTime: ex.restTime || 60,
          completed: 0
        })),
        totalExercises: updatedWorkout.exercises.length,
        completedExercises: 0
      };

      setWorkoutPlans((prev) =>
        prev.map((plan) =>
          plan.id === workoutPlan.id ? formattedWorkout : plan
        )
      );

      // Actualizar el plan en atletas que lo estén usando
      setAthletes((prev) =>
        prev.map((athlete) => {
          if (athlete.currentWorkout && athlete.currentWorkout.id === workoutPlan.id) {
            // Mantener el progreso actual del atleta
            const updatedExercises = formattedWorkout.exercises.map(ex => {
              const existingEx = athlete.currentWorkout?.exercises.find(e => e.id === ex.id);
              return existingEx ? existingEx : { ...ex, completed: 0 };
            });

            const updatedWorkout = {
              ...formattedWorkout,
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
        description: `El plan "${formattedWorkout.name}" ha sido actualizado.`,
      });
    } catch (error) {
      console.error('Error al actualizar plan de entrenamiento:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar el plan de entrenamiento",
        variant: "destructive"
      });
      throw error;
    }
  };

  const removeWorkoutPlan = async (workoutPlanId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error('No se ha encontrado un token de autenticación.');
      }

      const response = await fetch(`${API_URL}/api/workouts/${workoutPlanId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el plan de entrenamiento');
      }

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
    } catch (error) {
      console.error('Error al eliminar plan de entrenamiento:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar el plan de entrenamiento",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Finalizar una sesión de entrenamiento
  const endSession = async (sessionId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/sessions/end/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al finalizar la sesión');
      }

      const endedSession = await response.json();
      
      // Actualizar el estado local
      setActiveSessions(prev => prev.filter(session => session.id !== parseInt(sessionId)));
      
      // Actualizar el estado del atleta
      setAthletes(prev => 
        prev.map(athlete => 
          athlete.id === endedSession.athlete.id.toString() 
            ? { ...athlete, status: "not_started", activeSessionId: null } 
            : athlete
        )
      );
      
      // Refrescar el estado de la sala
      await fetchRoomStatus();
      
      toast({
        title: "Sesión finalizada",
        description: `La sesión ha sido finalizada correctamente.`,
      });
    } catch (error) {
      console.error('Error al finalizar sesión:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al finalizar la sesión",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Añadir función para actualizar el orden de la sala
  const updateRoomOrder = async (sessionIds: number[]) => {
    try {
      const token = localStorage.getItem("authToken");
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/api/sessions/reorder`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ sessionsOrder: sessionIds })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el orden de la sala');
      }
      
      // Actualizar el estado local
      await fetchRoomStatus();
      
      return true;
    } catch (error) {
      console.error('Error al actualizar el orden de la sala:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar el orden de la sala",
        variant: "destructive"
      });
      return false;
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      
      const response = await fetch(`${API_URL}/api/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener estadísticas del dashboard');
      }
      
      const data = await response.json();
      setDashboardStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas del dashboard:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas del dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Configuración de WebSockets
  useEffect(() => {
    // Inicializar la conexión solo si no existe
    if (!socketRef.current) {
      socketRef.current = io(API_URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      
      // Configurar los manejadores de eventos
      socketRef.current.on('session:started', (session) => {
        console.log('Nueva sesión iniciada:', session);
        fetchRoomStatus();
        fetchAthletes();
      });
      
      socketRef.current.on('session:ended', (session) => {
        console.log('Sesión finalizada:', session);
        fetchRoomStatus();
        fetchAthletes();
      });
      
      socketRef.current.on('sessions:reordered', (sessions) => {
        console.log('Sesiones reordenadas:', sessions);
        fetchRoomStatus();
      });
      
      socketRef.current.on('connect', () => {
        console.log('Conectado al servidor de WebSockets');
      });
      
      socketRef.current.on('disconnect', (reason) => {
        console.log('Desconectado del servidor de WebSockets:', reason);
      });
    }
    
    // Limpiar al desmontar
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Sin dependencias para evitar reconexiones

  const value = {
    athletes,
    activeAthletes,
    workoutPlans,
    activeSessions,
    roomStatus,
    addAthlete,
    removeAthlete,
    updateAthlete,
    updateAthleteStatus,
    updateAthleteProgress,
    updateExerciseCompletion,
    assignWorkoutToAthlete,
    addWorkoutPlan,
    updateWorkoutPlan,
    removeWorkoutPlan,
    endSession,
    updateRoomOrder,
    loading,
    fetchAthletes,
    fetchWorkoutPlans,
    fetchRoomStatus,
    dashboardStats,
    fetchDashboardStats,
  };

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGym = (): GymContextType => {
  const context = useContext(GymContext);
  if (context === undefined) {
    throw new Error("useGym must be used within a GymProvider");
  }
  return context;
};
