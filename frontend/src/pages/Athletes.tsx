
import React from "react";
import AllAthletesView from "@/components/AllAthletesView";
import { GymProvider } from "@/context/GymContext";

const Athletes = () => {
  return (
    <GymProvider>
      <div>
        <h1 className="text-3xl font-bold mb-6">Gestión de Atletas</h1>
        <AllAthletesView />
      </div>
    </GymProvider>
  );
};

export default Athletes;
