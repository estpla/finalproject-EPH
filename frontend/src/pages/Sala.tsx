
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useGym } from "@/context/GymContext";
import { GymProvider } from "@/context/GymContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Move, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Athlete } from "@/types";

const SalaContent = () => {
  const { athletes, updateAthleteStatus, activeAthletes } = useGym();
  const [floorAthletes, setFloorAthletes] = useState<Athlete[]>(activeAthletes);
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);

  const nonFloorAthletes = athletes.filter(
    (athlete) => !floorAthletes.some((a) => a.id === athlete.id)
  );

  const handleAddToFloor = (athlete: Athlete) => {
    setFloorAthletes([...floorAthletes, athlete]);
    if (athlete.status !== "active") {
      updateAthleteStatus(athlete.id, "active");
    }
  };

  const handleRemoveFromFloor = (id: string) => {
    setFloorAthletes(floorAthletes.filter((a) => a.id !== id));
    updateAthleteStatus(id, "not_started");
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(floorAthletes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFloorAthletes(items);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Sala</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Añadir Atleta a Sala
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Seleccionar Atleta</DialogTitle>
            </DialogHeader>
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
                      onClick={() => setSelectedAthlete(athlete.id)}
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
                            handleAddToFloor(athlete);
                            setSelectedAthlete(null);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <h2 className="text-xl font-semibold">Atletas en Sala</h2>
          <p className="text-sm text-muted-foreground">
            Arrastra y suelta para reordenar los atletas
          </p>
        </CardHeader>
        <CardContent>
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
                    floorAthletes.map((athlete, index) => (
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
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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
