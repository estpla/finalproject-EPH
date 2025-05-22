
import React from "react";
import { Athlete } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SimplifiedAthleteCardProps {
  athlete: Athlete;
}

const SimplifiedAthleteCard: React.FC<SimplifiedAthleteCardProps> = ({ athlete }) => {
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
          <Badge variant={athlete.status === "active" ? "default" : "outline"}>
            {athlete.currentWorkout?.name || "Sin rutina"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {athlete.currentWorkout && (
          <div className="space-y-3">
            {athlete.currentWorkout.exercises.slice(0, 4).map((exercise) => (
              <div key={exercise.id} className="flex justify-between items-center text-sm">
                <div className="font-medium truncate max-w-[60%]">
                  {exercise.name}
                  <div className="font-normal text-xs text-muted-foreground">
                    {exercise.sets}x{exercise.reps}
                  </div>
                </div>
                <div className="text-right font-bold">
                  {exercise.weight ? `${exercise.weight}kg` : "---"}
                </div>
              </div>
            ))}
            {athlete.currentWorkout.exercises.length > 4 && (
              <div className="text-xs text-center text-muted-foreground pt-2">
                +{athlete.currentWorkout.exercises.length - 4} ejercicios más
              </div>
            )}
          </div>
        )}
        {!athlete.currentWorkout && (
          <div className="text-sm text-muted-foreground text-center py-4">
            Sin rutina asignada
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimplifiedAthleteCard;
