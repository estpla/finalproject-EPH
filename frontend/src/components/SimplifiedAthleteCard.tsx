
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
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-3 pb-2 flex flex-row items-center gap-2 border-b">
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={athlete.avatar || "https://i.pravatar.cc/150"}
              alt={athlete.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(
              athlete.status
            )} rounded-full border-2 border-background`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold truncate">{athlete.name}</h3>
          <Badge variant="secondary" className="text-xs">
            {athlete.currentWorkout?.name || "Sin rutina"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow flex flex-col">
        {athlete.currentWorkout && athlete.currentWorkout.exercises && athlete.currentWorkout.exercises.length > 0 ? (
          <div className="divide-y divide-border h-full">
            {athlete.currentWorkout.exercises.map((exercise) => (
              <div key={exercise.id} className="p-3 flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                      <line x1="6" y1="1" x2="6" y2="4"></line>
                      <line x1="10" y1="1" x2="10" y2="4"></line>
                      <line x1="14" y1="1" x2="14" y2="4"></line>
                    </svg>
                  </div>
                  <span className="font-medium">{exercise.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    {exercise.sets}x{exercise.reps}
                  </Badge>
                  <span className="font-bold text-right whitespace-nowrap">
                    {exercise.weight ? `${exercise.weight}kg` : "---"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center p-4 flex-grow flex items-center justify-center">
            Sin ejercicios asignados
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimplifiedAthleteCard;
