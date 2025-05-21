
import React from "react";
import { Exercise, WorkoutPlan } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Clock } from "lucide-react";

interface WorkoutPlanCardProps {
  workoutPlan: WorkoutPlan;
  onSelect?: (workoutPlanId: string) => void;
  showSelectButton?: boolean;
}

const ExerciseItem: React.FC<{ exercise: Exercise; index: number }> = ({
  exercise,
  index,
}) => {
  return (
    <div className="border-b border-border last:border-b-0 py-3">
      <div className="flex justify-between mb-1">
        <div className="font-medium flex items-center">
          <span className="text-muted-foreground mr-2">{index + 1}.</span>
          {exercise.name}
        </div>
        <Badge variant="outline">
          {exercise.sets} × {exercise.reps}
          {exercise.weight ? ` @ ${exercise.weight}kg` : ""}
        </Badge>
      </div>
      
      <div className="flex items-center text-xs text-muted-foreground mt-1">
        <Clock className="h-3 w-3 mr-1" />
        {exercise.restTime} seg de descanso
      </div>
      
      {exercise.notes && (
        <div className="text-xs italic text-muted-foreground mt-1">
          "{exercise.notes}"
        </div>
      )}
    </div>
  );
};

const WorkoutPlanCard: React.FC<WorkoutPlanCardProps> = ({
  workoutPlan,
  onSelect,
  showSelectButton = false,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5" /> {workoutPlan.name}
        </CardTitle>
        <CardDescription>
          {workoutPlan.exercises.length} ejercicios
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="exercises">
            <AccordionTrigger>Ejercicios</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {workoutPlan.exercises.map((exercise, index) => (
                  <ExerciseItem
                    key={exercise.id}
                    exercise={exercise}
                    index={index}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      
      {showSelectButton && (
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => onSelect && onSelect(workoutPlan.id)}
          >
            Seleccionar plan
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default WorkoutPlanCard;
