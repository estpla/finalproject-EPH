import React from "react";
import { useGym } from "@/context/GymContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { Athlete } from "@/types";

interface EditAthleteDialogProps {
  athlete: Athlete;
}

const EditAthleteDialog: React.FC<EditAthleteDialogProps> = ({ athlete }) => {
  const { updateAthlete } = useGym();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(athlete.name);
  const [email, setEmail] = React.useState(athlete.email || "");
  
  React.useEffect(() => {
    // Actualizar los estados cuando cambia el atleta
    setName(athlete.name);
    setEmail(athlete.email || "");
  }, [athlete]);
  
  const handleUpdateAthlete = async () => {
    if (!name.trim()) return;
    
    const updatedAthlete: Athlete = {
      ...athlete,
      name: name.trim(),
      email: email.trim(),
    };
    
    await updateAthlete(updatedAthlete);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-primary hover:bg-primary/10 hover:text-primary rounded-full"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar atleta</DialogTitle>
          <DialogDescription>
            Modifica los datos del atleta.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Nombre
            </Label>
            <Input
              id="edit-name"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del atleta"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-email" className="text-right">
              Email
            </Label>
            <Input
              id="edit-email"
              type="email"
              className="col-span-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button disabled={!name.trim()} onClick={handleUpdateAthlete}>
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAthleteDialog;