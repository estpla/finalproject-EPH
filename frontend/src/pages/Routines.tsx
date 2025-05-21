
import React from "react";
import WorkoutPlansView from "@/components/WorkoutPlansView";
import { GymProvider } from "@/context/GymContext";

const Routines = () => {
  return (
    <GymProvider>
      <div>
        <h1 className="text-3xl font-bold mb-6">Gestión de Rutinas</h1>
        <WorkoutPlansView />
      </div>
    </GymProvider>
  );
};

export default Routines;
