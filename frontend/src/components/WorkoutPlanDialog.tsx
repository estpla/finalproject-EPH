
import React from "react";
import { WorkoutPlan } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import WorkoutPlanForm from "./WorkoutPlanForm";
import { useGym } from "@/context/GymContext";

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
  const [open, setOpen] = React.useState(false);
  const { addWorkoutPlan, updateWorkoutPlan } = useGym();

  const handleSubmit = (data: WorkoutPlan) => {
    if (workoutPlan) {
      updateWorkoutPlan(data);
    } else {
      addWorkoutPlan(data);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={workoutPlan ? "outline" : "default"}>
          {!workoutPlan && <Plus className="h-4 w-4 mr-2" />}
          {buttonText || "Nuevo plan"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <WorkoutPlanForm
          initialData={workoutPlan}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutPlanDialog;
