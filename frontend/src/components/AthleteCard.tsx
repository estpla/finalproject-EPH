
import React from "react";
import { Athlete } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useGym } from "@/context/GymContext";
import { Clock, CheckCircle, XCircle, PauseCircle, PlayCircle, Dumbbell, Weight, List } from "lucide-react";

interface AthleteCardProps {
  athlete: Athlete;
}

const AthleteCard: React.FC<AthleteCardProps> = ({ athlete }) => {
  const { updateAthleteStatus, removeAthlete } = useGym();

  const getStatusColor = (status: Athlete["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "resting":
        return "bg-amber-500";
      case "finished":
        return "bg-blue-500";
      case "not_started":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: Athlete["status"]) => {
    switch (status) {
      case "active":
        return "Activo";
      case "resting":
        return "Descansando";
      case "finished":
        return "Finalizado";
      case "not_started":
        return "Sin comenzar";
      default:
        return "Desconocido";
    }
  };

  const getTimeSinceStart = () => {
    if (!athlete.startTime) return "N/A";

    const diffMs = Date.now() - athlete.startTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  };

  return (
    <Card className="h-full overflow-hidden border-l-4" style={{ borderLeftColor: `hsl(var(--${athlete.status === 'active' ? 'primary' : athlete.status === 'resting' ? 'destructive' : athlete.status === 'finished' ? 'accent' : 'muted-foreground'}))` }}>
      <CardHeader className="p-4 pb-0 flex flex-row items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={athlete.avatar || "https://i.pravatar.cc/150"}
              alt={athlete.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
              athlete.status
            )} rounded-full border-2 border-background`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold truncate">{athlete.name}</h3>
          <div className="flex items-center gap-2">
            <Badge variant={athlete.status === "active" ? "default" : "outline"}>
              {getStatusText(athlete.status)}
            </Badge>
            {athlete.startTime && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                {getTimeSinceStart()}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-medium">
              {athlete.currentWorkout ? athlete.currentWorkout.name : "Sin rutina asignada"}
            </div>
            <div className="text-xs text-muted-foreground">
              {athlete.progressPercentage}%
            </div>
          </div>
          <Progress value={athlete.progressPercentage} className="h-2" />
        </div>
        
        {athlete.currentWorkout && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <List className="w-4 h-4 text-primary" />
              <span>Ejercicios ({athlete.currentWorkout.completedExercises}/{athlete.currentWorkout.totalExercises})</span>
            </div>
            
            <div className="bg-muted/40 rounded-md p-2 max-h-[180px] overflow-y-auto">
              {athlete.currentWorkout.exercises.map((exercise, index) => (
                <div 
                  key={exercise.id} 
                  className={`p-2 text-sm ${index > 0 ? "border-t border-border/30" : ""} ${
                    exercise.completed === exercise.sets ? "text-muted-foreground" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Dumbbell className={`w-3.5 h-3.5 ${exercise.completed === exercise.sets ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`font-medium ${exercise.completed === exercise.sets ? "line-through" : ""}`}>
                        {exercise.name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {exercise.completed}/{exercise.sets}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 ml-4 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Weight className="w-3 h-3" />
                      {exercise.weight ? `${exercise.weight}kg` : "---"}
                    </div>
                    <div>
                      {exercise.reps} reps
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        {athlete.status === "not_started" && (
          <Button
            size="sm"
            className="flex-1"
            onClick={() => updateAthleteStatus(athlete.id, "active")}
          >
            <PlayCircle className="w-4 h-4 mr-1" /> Iniciar
          </Button>
        )}
        
        {athlete.status === "active" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateAthleteStatus(athlete.id, "resting")}
          >
            <PauseCircle className="w-4 h-4 mr-1" /> Descanso
          </Button>
        )}
        
        {athlete.status === "resting" && (
          <Button
            size="sm"
            onClick={() => updateAthleteStatus(athlete.id, "active")}
          >
            <PlayCircle className="w-4 h-4 mr-1" /> Reanudar
          </Button>
        )}
        
        {athlete.status !== "finished" && athlete.status !== "not_started" && (
          <Button
            size="sm"
            variant="outline"
            className="ml-2"
            onClick={() => updateAthleteStatus(athlete.id, "finished")}
          >
            <CheckCircle className="w-4 h-4 mr-1" /> Terminar
          </Button>
        )}
        
        <Button
          size="sm"
          variant="ghost"
          className={`${athlete.status !== "finished" && athlete.status !== "not_started" ? "ml-2" : "ml-auto"} text-destructive hover:text-destructive`}
          onClick={() => removeAthlete(athlete.id)}
        >
          <XCircle className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AthleteCard;
