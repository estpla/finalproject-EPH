
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { WorkoutPlan, Exercise } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Plus } from "lucide-react";

// Schema para validar el formulario
const workoutFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  exercises: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "El nombre del ejercicio es obligatorio"),
      sets: z.coerce.number().min(1, "Mínimo 1 serie"),
      reps: z.coerce.number().min(1, "Mínimo 1 repetición"),
      weight: z.coerce.number().optional(),
      restTime: z.coerce.number().min(1, "Tiempo de descanso requerido"),
      notes: z.string().optional(),
    })
  ).min(1, "Añade al menos un ejercicio"),
});

type WorkoutFormValues = z.infer<typeof workoutFormSchema>;

interface WorkoutPlanFormProps {
  initialData?: WorkoutPlan;
  onSubmit: (data: WorkoutPlan) => void;
  onCancel: () => void;
}

const WorkoutPlanForm: React.FC<WorkoutPlanFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  // Preparar valores iniciales
  const defaultValues: WorkoutFormValues = {
    name: initialData?.name || "",
    exercises: initialData?.exercises.map(exercise => ({
      ...exercise,
      weight: exercise.weight || 0,
      notes: exercise.notes || ""
    })) || [
      {
        id: uuidv4(),
        name: "",
        sets: 3,
        reps: 10,
        weight: 0,
        restTime: 60,
        notes: "",
      },
    ],
  };

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues,
  });

  // Añadir un nuevo ejercicio
  const addExercise = () => {
    const exercises = form.getValues("exercises");
    form.setValue("exercises", [
      ...exercises,
      {
        id: uuidv4(),
        name: "",
        sets: 3,
        reps: 10,
        weight: 0,
        restTime: 60,
        notes: "",
      },
    ]);
  };

  // Eliminar un ejercicio
  const removeExercise = (index: number) => {
    const exercises = form.getValues("exercises");
    if (exercises.length > 1) {
      form.setValue(
        "exercises",
        exercises.filter((_, i) => i !== index)
      );
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = (data: WorkoutFormValues) => {
    const completedWorkout: WorkoutPlan = {
      id: initialData?.id || uuidv4(),
      name: data.name,
      exercises: data.exercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        restTime: ex.restTime,
        notes: ex.notes,
        completed: 0, // Inicialmente ninguna serie completada
      })),
      totalExercises: data.exercises.length,
      completedExercises: 0,
    };
    onSubmit(completedWorkout);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del plan</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Plan de fuerza" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Ejercicios</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addExercise}
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir ejercicio
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Series</TableHead>
                <TableHead>Reps</TableHead>
                <TableHead>Peso (kg)</TableHead>
                <TableHead>Descanso (seg)</TableHead>
                <TableHead>Notas</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.watch("exercises").map((exercise, index) => (
                <TableRow key={exercise.id}>
                  <TableCell>
                    <Input
                      {...form.register(`exercises.${index}.name`)}
                      placeholder="Nombre del ejercicio"
                    />
                    {form.formState.errors.exercises?.[index]?.name && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors.exercises[index]?.name?.message}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      {...form.register(`exercises.${index}.sets`)}
                      min="1"
                    />
                    {form.formState.errors.exercises?.[index]?.sets && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors.exercises[index]?.sets?.message}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      {...form.register(`exercises.${index}.reps`)}
                      min="1"
                    />
                    {form.formState.errors.exercises?.[index]?.reps && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors.exercises[index]?.reps?.message}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      {...form.register(`exercises.${index}.weight`)}
                      min="0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      {...form.register(`exercises.${index}.restTime`)}
                      min="1"
                    />
                    {form.formState.errors.exercises?.[index]?.restTime && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors.exercises[index]?.restTime?.message}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Input
                      {...form.register(`exercises.${index}.notes`)}
                      placeholder="Notas opcionales"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExercise(index)}
                      disabled={form.watch("exercises").length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {form.formState.errors.exercises?.message && (
            <p className="text-sm text-destructive mt-2">
              {form.formState.errors.exercises.message}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? "Actualizar plan" : "Crear plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WorkoutPlanForm;
