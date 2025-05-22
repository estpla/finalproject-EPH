/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useGym } from "@/context/GymContext";
import { GymProvider } from "@/context/GymContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Move, Plus, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Athlete } from "@/types";
import { Badge } from "@/components/ui/badge";

const SalaContent = () => {
  const { 
    athletes, 
    updateAthleteStatus, 
    activeAthletes, 
    activeSessions, 
    roomStatus, 
    endSession,
    fetchRoomStatus,
    loading,
    workoutPlans,
    assignWorkoutToAthlete,
    updateRoomOrder
  } = useGym();
  const [floorAthletes, setFloorAthletes] = useState<Athlete[]>(activeAthletes);
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(30);
  const [dialogStep, setDialogStep] = useState<"athlete" | "workout">("athlete");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  // Efecto para actualizar el estado de la sala periódicamente
  useEffect(() => {
    fetchRoomStatus();
    
    const intervalId = setInterval(() => {
      fetchRoomStatus();
    }, refreshInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  // Actualizar floorAthletes cuando cambian las sesiones activas
  useEffect(() => {
    if (activeSessions && activeSessions.length > 0) {
      // Mapear las sesiones activas a atletas en el suelo
      const sessionAthletes = activeSessions.map((session: any) => {
        const athlete = athletes.find(a => a.id === session.athlete.id.toString());
        return athlete || {
          id: session.athlete.id.toString(),
          name: session.athlete.name,
          email: session.athlete.email || '',
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
          currentWorkout: session.workout ? {
            id: session.workout.id.toString(),
            name: session.workout.name,
            description: session.workout.description || '',
            exercises: [],
            totalExercises: 0,
            completedExercises: 0
          } : null,
          status: "active",
          progressPercentage: 0,
        };
      });
      
      setFloorAthletes(sessionAthletes as Athlete[]);
    }
  }, [activeSessions, athletes]);

  const nonFloorAthletes = athletes.filter(
    (athlete) => !floorAthletes.some((a) => a.id === athlete.id)
  );

  const handleAddToFloor = async (athleteId: string, workoutId: string) => {
    setIsStartingSession(true);
    try {
      // 1. Primero asignar el workout al atleta
      await assignWorkoutToAthlete(athleteId, workoutId);
      
      // 2. Luego iniciar la sesión
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/sessions/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ athleteId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al iniciar la sesión');
      }
      
      // 3. Actualizar el estado local
      const athlete = athletes.find(a => a.id === athleteId);
      if (athlete) {
        updateAthleteStatus(athleteId, "active");
        // Actualizar la lista de atletas en el suelo
        fetchRoomStatus();
      }
      
      // Cerrar el diálogo y resetear los estados
      setDialogOpen(false);
      setSelectedAthlete(null);
      setSelectedWorkout(null);
      setDialogStep("athlete");
      
    } catch (error) {
      console.error('Error al añadir atleta a la sala:', error);
    } finally {
      setIsStartingSession(false);
    }
  };

  const handleRemoveFromFloor = async (athleteId: string) => {
    // Buscar la sesión activa para este atleta
    const session = activeSessions.find(
      (s: any) => s.athlete.id.toString() === athleteId
    );
    
    // Actualizar el estado local inmediatamente para una mejor experiencia de usuario
    setFloorAthletes(floorAthletes.filter((a) => a.id !== athleteId));
    updateAthleteStatus(athleteId, "not_started");
    
    if (session) {
      // Si hay una sesión activa, finalizarla
      await endSession(session.id.toString());
    }
  };

  // Manejar el evento de fin de arrastre
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(floorAthletes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Actualizar el estado local primero para una experiencia más fluida
    setFloorAthletes(items);
    
    // Si no hay cambio en la posición, no hacemos nada
    if (result.source.index === result.destination.index) return;
    
    // Obtener los IDs de las sesiones en el nuevo orden
    const sessionIds = items.map(athlete => {
      // Buscar la sesión correspondiente a este atleta
      const session = activeSessions.find(
        (s: any) => s.athlete.id.toString() === athlete.id
      );
      return session ? session.id : null;
    }).filter(id => id !== null) as number[];
    
    // Si no hay sesiones activas, no hacemos nada
    if (sessionIds.length === 0) return;
    
    // Enviar el nuevo orden al backend
    setIsReordering(true);
    try {
      await updateRoomOrder(sessionIds);
      // No es necesario actualizar floorAthletes aquí porque ya lo hicimos arriba
      // y fetchRoomStatus se llama dentro de updateSalaOrder
    } catch (error) {
      console.error('Error al reordenar la sala:', error);
      // En caso de error, volvemos a cargar el estado actual desde el servidor
      fetchRoomStatus();
    } finally {
      setIsReordering(false);
    }
  };

  const handleRefresh = () => {
    fetchRoomStatus();
  };

  const handleSelectAthlete = (athleteId: string) => {
    setSelectedAthlete(athleteId);
    setDialogStep("workout");
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedAthlete(null);
    setSelectedWorkout(null);
    setDialogStep("athlete");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Sala</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setDialogStep("athlete");
                setSelectedAthlete(null);
                setSelectedWorkout(null);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Añadir Atleta a Sala
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {dialogStep === "athlete" ? "Seleccionar Atleta" : "Seleccionar Rutina"}
                </DialogTitle>
              </DialogHeader>
              
              {dialogStep === "athlete" ? (
                <ScrollArea className="h-[400px] pr-3">
                  {nonFloorAthletes.length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground">
                      No hay atletas disponibles para añadir
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {nonFloorAthletes.map((athlete) => (
                        <Card
                          key={athlete.id}
                          className={`cursor-pointer hover:border-primary transition-colors ${
                            selectedAthlete === athlete.id ? "border-primary" : ""
                          }`}
                          onClick={() => handleSelectAthlete(athlete.id)}
                        >
                          <CardContent className="p-4 flex justify-between items-center">
                            <div>
                              <div className="font-medium">{athlete.name}</div>
                              {athlete.status && (
                                <div className="text-sm text-muted-foreground">
                                  Estado: {athlete.status === "not_started" ? "Sin comenzar" : 
                                          athlete.status === "active" ? "Activo" :
                                          athlete.status === "resting" ? "Descansando" : 
                                          "Finalizado"}
                                </div>
                              )}
                            </div>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectAthlete(athlete.id);
                              }}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="font-medium">Atleta seleccionado:</div>
                    <div className="text-lg">{athletes.find(a => a.id === selectedAthlete)?.name}</div>
                  </div>
                  <ScrollArea className="h-[300px] pr-3">
                    {workoutPlans.length === 0 ? (
                      <div className="text-center p-4 text-muted-foreground">
                        No hay rutinas disponibles
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {workoutPlans.map((workout) => (
                          <Card
                            key={workout.id}
                            className={`cursor-pointer hover:border-primary transition-colors ${
                              selectedWorkout === workout.id ? "border-primary" : ""
                            }`}
                            onClick={() => setSelectedWorkout(workout.id)}
                          >
                            <CardContent className="p-4 flex justify-between items-center">
                              <div>
                                <div className="font-medium">{workout.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {workout.exercises.length} ejercicios
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedWorkout(workout.id);
                                }}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  <DialogFooter className="mt-4 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setDialogStep("athlete")}
                    >
                      Volver
                    </Button>
                    <Button 
                      disabled={!selectedWorkout || isStartingSession} 
                      onClick={() => selectedAthlete && selectedWorkout && handleAddToFloor(selectedAthlete, selectedWorkout)}
                    >
                      {isStartingSession ? "Iniciando..." : "Comenzar Sesión"}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Información del estado de la sala */}
      {roomStatus && (
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Estado de la Sala</h3>
                <p className="text-sm text-muted-foreground">
                  Atletas activos: {roomStatus.activeCount || 0}
                </p>
              </div>
              <Badge variant="outline" className="px-3 py-1">
                Actualización automática cada {refreshInterval} segundos
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <h2 className="text-xl font-semibold">Atletas en Sala</h2>
          <p className="text-sm text-muted-foreground">
            Arrastra y suelta para reordenar los atletas
          </p>
          {isReordering && (
            <Badge variant="outline" className="ml-2">
              Guardando nuevo orden...
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center p-8">
              <p className="text-lg text-muted-foreground">Cargando...</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="floor-athletes">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {floorAthletes.length === 0 ? (
                      <div className="text-center p-8 bg-muted/40 rounded-lg">
                        <p className="text-lg text-muted-foreground">
                          No hay atletas en sala
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Añade atletas para comenzar
                        </p>
                      </div>
                    ) : (
                      floorAthletes.map((athlete, index) => {
                        // Buscar la sesión correspondiente a este atleta
                        const session = activeSessions.find(
                          (s: any) => s.athlete.id.toString() === athlete.id
                        );
                        
                        return (
                          <Draggable
                            key={athlete.id}
                            draggableId={athlete.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="border rounded-lg p-4 bg-card flex justify-between items-center"
                              >
                                <div className="flex items-center">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="mr-3 p-1 rounded hover:bg-accent"
                                  >
                                    <Move className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{athlete.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {athlete.currentWorkout ? athlete.currentWorkout.name : "Sin rutina"}
                                    </div>
                                    {session && (
                                      <div className="mt-1">
                                        <Badge variant="secondary" className="text-xs">
                                          Sesión iniciada: {new Date(session.startedAt).toLocaleTimeString()}
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRemoveFromFloor(athlete.id)}
                                  >
                                    <X className="w-4 h-4" />
                                    <span className="ml-1 hidden sm:inline">Quitar</span>
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Sala = () => {
  return (
    <GymProvider>
      <SalaContent />
    </GymProvider>
  );
};

export default Sala;
