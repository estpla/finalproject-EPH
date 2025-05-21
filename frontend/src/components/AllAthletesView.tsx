
import React, { useEffect } from "react";
import { useGym } from "@/context/GymContext";
import { useAuth } from "@/context/AuthContext";
import AthleteCard from "./AthleteCard";
import AddAthleteDialog from "./AddAthleteDialog";
import { Loader2 } from "lucide-react";

const AllAthletesView = () => {
  const { athletes, loading, fetchAthletes } = useGym();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Acceso Restringido</h2>
        <p className="text-muted-foreground mb-4">
          Debes iniciar sesión para acceder a la gestión de atletas.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Todos los atletas</h2>
        <AddAthleteDialog />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Cargando atletas...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {athletes.length === 0 ? (
            <div className="col-span-full p-6 bg-muted/40 rounded-lg text-center">
              <h3 className="text-lg font-medium text-muted-foreground">
                No hay atletas registrados
              </h3>
              <p className="text-sm text-muted-foreground">
                Añade atletas para comenzar a gestionar entrenamientos.
              </p>
            </div>
          ) : (
            athletes.map((athlete) => (
              <AthleteCard key={athlete.id} athlete={athlete} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AllAthletesView;
