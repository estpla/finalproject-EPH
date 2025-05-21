
import React from "react";
import AthleteCard from "./AthleteCard";
import { useGym } from "@/context/GymContext";

const ActiveAthletesView = () => {
  const { activeAthletes } = useGym();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {activeAthletes.length === 0 ? (
        <div className="col-span-full p-6 bg-muted/40 rounded-lg text-center">
          <h3 className="text-lg font-medium text-muted-foreground">
            No hay atletas activos en este momento
          </h3>
          <p className="text-sm text-muted-foreground">
            Añade un atleta y asígnale una rutina para comenzar.
          </p>
        </div>
      ) : (
        activeAthletes.map((athlete) => (
          <AthleteCard key={athlete.id} athlete={athlete} />
        ))
      )}
    </div>
  );
};

export default ActiveAthletesView;
