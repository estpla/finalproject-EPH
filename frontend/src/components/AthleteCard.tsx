
import React, { useState } from "react";
import { Athlete } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGym } from "@/context/GymContext";
import { Trash2 } from "lucide-react";
import EditAthleteDialog from "./EditAthleteDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AthleteCardProps {
  athlete: Athlete;
}

const AthleteCard: React.FC<AthleteCardProps> = ({ athlete }) => {
  const { removeAthlete } = useGym();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const isActive = athlete.status === "active" || athlete.status === "resting";

  const handleDelete = () => {
    removeAthlete(athlete.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="h-full overflow-hidden border-l-4" style={{ borderLeftColor: `hsl(var(--${athlete.status === 'active' ? 'primary' : athlete.status === 'resting' ? 'destructive' : athlete.status === 'finished' ? 'accent' : 'muted-foreground'}))` }}>
        <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3">
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
              <Badge variant={isActive ? "default" : "outline"}>
                {getStatusText(athlete.status)}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <EditAthleteDialog athlete={athlete} />
            <Button
              size="icon"
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-sm text-muted-foreground">
            {athlete.email || "Sin correo electrónico"}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar atleta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará a <strong>{athlete.name}</strong> de la aplicación. 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AthleteCard;
