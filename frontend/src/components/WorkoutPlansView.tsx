
import React, { useEffect } from "react";
import { useGym } from "@/context/GymContext";
import { useAuth } from "@/context/AuthContext";
import WorkoutPlanCard from "./WorkoutPlanCard";
import WorkoutPlanDialog from "./WorkoutPlanDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { WorkoutPlan } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const WorkoutPlansView = () => {
  const { workoutPlans, removeWorkoutPlan, loading, fetchWorkoutPlans } = useGym();
  const { isAuthenticated } = useAuth();
  const [planToDelete, setPlanToDelete] = React.useState<WorkoutPlan | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeletePlan = async () => {
    if (planToDelete) {
      try {
        setIsDeleting(true);
        await removeWorkoutPlan(planToDelete.id);
      } catch (error) {
        console.error("Error al eliminar el plan:", error);
      } finally {
        setIsDeleting(false);
        setPlanToDelete(null);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Acceso Restringido</h2>
        <p className="text-muted-foreground mb-4">
          Debes iniciar sesión para acceder a la gestión de planes de entrenamiento.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Planes de entrenamiento</h2>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Planes de entrenamiento</h2>
        <WorkoutPlanDialog dialogTitle="Crear nuevo plan de entrenamiento" />
      </div>
      
      {workoutPlans.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <h3 className="text-xl font-medium text-muted-foreground mb-4">No hay planes de entrenamiento</h3>
          <p className="text-muted-foreground mb-6">Crea tu primer plan de entrenamiento para empezar.</p>
          <WorkoutPlanDialog 
            buttonText="Crear primer plan" 
            dialogTitle="Crear nuevo plan de entrenamiento" 
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workoutPlans.map((plan) => (
            <div key={plan.id} className="relative group">
              <WorkoutPlanCard
                workoutPlan={plan}
                showSelectButton={false}
              />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <WorkoutPlanDialog
                  workoutPlan={plan}
                  buttonText="Editar"
                  dialogTitle="Editar plan de entrenamiento"
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full"
                      onClick={() => setPlanToDelete(plan)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar plan de entrenamiento?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. El plan "{plan.name}" se eliminará permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        onClick={handleDeletePlan}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Eliminando..." : "Eliminar"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutPlansView;
