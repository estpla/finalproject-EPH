
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Pencil } from "lucide-react";
import { useGym } from "@/context/GymContext";
import { WorkoutPlan } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface WorkoutPlanDialogProps {
  workoutPlan?: WorkoutPlan;
  buttonText?: string;
  dialogTitle: string;
}

const WorkoutPlanDialog: React.FC<WorkoutPlanDialogProps> = ({
  workoutPlan,
  buttonText,
  dialogTitle,
}) => {
  const { addWorkoutPlan, updateWorkoutPlan } = useGym();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(workoutPlan?.name || "");
  const [description, setDescription] = useState(workoutPlan?.description || "");
  const [exercises, setExercises] = useState(
    workoutPlan?.exercises || []
  );

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        id: "",
        name: "",
        sets: 3,
        reps: 10,
        weight: 0,
        restTime: 60,
        completed: 0,
      },
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedExercises = [...exercises];
    
    if (field === "name" && typeof value === "string") {
      // Si cambiamos el nombre, también actualizamos el ID si está vacío
      updatedExercises[index] = {
        ...updatedExercises[index],
        name: value,
        id: updatedExercises[index].id || uuidv4() // Asignar un ID único si no tiene
      };
    } else {
      updatedExercises[index] = {
        ...updatedExercises[index],
        [field]: field === "name" ? value : Number(value),
      };
    }
    
    setExercises(updatedExercises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del plan es obligatorio",
        variant: "destructive",
      });
      return;
    }
    
    // Validar que todos los ejercicios tengan un ID válido
    const invalidExercises = exercises.filter(ex => !ex.id);
    if (invalidExercises.length > 0) {
      toast({
        title: "Error",
        description: "Todos los ejercicios deben tener un nombre seleccionado",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const plan: WorkoutPlan = {
        id: workoutPlan?.id || uuidv4(),
        name,
        description,
        exercises,
        totalExercises: exercises.length,
        completedExercises: 0,
      };
      
      if (workoutPlan) {
        await updateWorkoutPlan(plan);
        toast({
          title: "Éxito",
          description: "Plan de entrenamiento actualizado correctamente",
        });
      } else {
        await addWorkoutPlan(plan);
        toast({
          title: "Éxito",
          description: "Plan de entrenamiento creado correctamente",
        });
      }
      
      setOpen(false);
      
      // Resetear el formulario si es un nuevo plan
      if (!workoutPlan) {
        setName("");
        setDescription("");
        setExercises([]);
      }
    } catch (error) {
      console.error("Error al guardar el plan:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el plan de entrenamiento",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {buttonText ? (
          <Button
            size="icon"
            variant="ghost"
            className="text-primary hover:bg-primary/10 hover:text-primary rounded-full"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        ) : workoutPlan ? (
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Añadir rutina
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              Configura los detalles del plan de entrenamiento y sus ejercicios.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del plan</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Plan de fuerza"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el objetivo y características del plan"
                className="resize-none"
              />
            </div>
            
            <div className="border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-medium">Ejercicios</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddExercise}
                >
                  <Plus className="h-4 w-4 mr-2" /> Añadir ejercicio
                </Button>
              </div>
              
              {exercises.length === 0 ? (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No hay ejercicios añadidos. Haz clic en "Añadir ejercicio" para comenzar.
                </div>
              ) : (
                <div className="space-y-4">
                  {exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 items-center border p-3 rounded-md"
                    >
                      <div className="col-span-12 sm:col-span-3">
                        <Label htmlFor={`exercise-${index}-name`} className="text-xs">
                          Ejercicio
                        </Label>
                        <Input
                          id={`exercise-${index}-name`}
                          value={exercise.name}
                          onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                          placeholder="Nombre del ejercicio"
                          required
                          minLength={1}
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <Label htmlFor={`exercise-${index}-sets`} className="text-xs">
                          Series
                        </Label>
                        <Input
                          id={`exercise-${index}-sets`}
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(e) =>
                            handleExerciseChange(index, "sets", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <Label htmlFor={`exercise-${index}-reps`} className="text-xs">
                          Reps
                        </Label>
                        <Input
                          id={`exercise-${index}-reps`}
                          type="number"
                          min="1"
                          value={exercise.reps}
                          onChange={(e) =>
                            handleExerciseChange(index, "reps", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <Label htmlFor={`exercise-${index}-weight`} className="text-xs">
                          Peso (kg)
                        </Label>
                        <Input
                          id={`exercise-${index}-weight`}
                          type="number"
                          min="0"
                          step="0.5"
                          value={exercise.weight}
                          onChange={(e) =>
                            handleExerciseChange(index, "weight", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-7 sm:col-span-2">
                        <Label htmlFor={`exercise-${index}-rest`} className="text-xs">
                          Descanso
                        </Label>
                        <Input
                          id={`exercise-${index}-rest`}
                          type="number"
                          min="0"
                          step="5"
                          value={exercise.restTime}
                          onChange={(e) =>
                            handleExerciseChange(index, "restTime", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-1 flex items-end justify-end h-full">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveExercise(index)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : workoutPlan ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutPlanDialog;
