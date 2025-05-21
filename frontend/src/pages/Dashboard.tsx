
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Dumbbell, Activity, TrendingUp } from "lucide-react";
import { useGym } from "@/context/GymContext";
import { GymProvider } from "@/context/GymContext";

const DashboardContent = () => {
  const { athletes, workoutPlans } = useGym();
  
  // Calcular KPIs básicos
  const totalAthletes = athletes.length;
  const activeAthletes = athletes.filter(a => a.status === "active").length;
  const totalWorkouts = workoutPlans.length;
  const completionRate = athletes.length > 0 
    ? Math.round((athletes.filter(a => a.status === "finished").length / totalAthletes) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Atletas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-primary" />
              <div className="text-3xl font-bold">{totalAthletes}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Atletas Activos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <Activity className="h-8 w-8 text-green-500" />
              <div className="text-3xl font-bold">{activeAthletes}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rutinas Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <Dumbbell className="h-8 w-8 text-blue-500" />
              <div className="text-3xl font-bold">{totalWorkouts}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasa de Finalización
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-8 w-8 text-amber-500" />
              <div className="text-3xl font-bold">{completionRate}%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>Resumen de Atletas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Activos:</span>
                <span className="font-medium">{athletes.filter(a => a.status === "active").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">En descanso:</span>
                <span className="font-medium">{athletes.filter(a => a.status === "resting").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Finalizados:</span>
                <span className="font-medium">{athletes.filter(a => a.status === "finished").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sin comenzar:</span>
                <span className="font-medium">{athletes.filter(a => a.status === "not_started").length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>Rendimiento de Rutinas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {workoutPlans.slice(0, 4).map((plan) => (
                <div key={plan.id} className="flex justify-between">
                  <span className="text-muted-foreground truncate max-w-[70%]">{plan.name}:</span>
                  <span className="font-medium">{athletes.filter(a => a.currentWorkout?.id === plan.id).length} atletas</span>
                </div>
              ))}
              {workoutPlans.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No hay rutinas disponibles</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Wrap the dashboard in the GymProvider
const Dashboard = () => {
  return (
    <GymProvider>
      <DashboardContent />
    </GymProvider>
  );
};

export default Dashboard;
