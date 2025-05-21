
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
import { UserPlus } from "lucide-react";
import { Athlete } from "@/types";

const AddAthleteDialog = () => {
  const { addAthlete } = useGym();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  
  const handleAddAthlete = () => {
    if (!name.trim()) return;
    
    const newAthlete: Athlete = {
      id: `ath${Date.now()}`,
      name: name.trim(),
      email: email.trim(), // Adding email field
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      currentWorkout: null,
      status: "not_started",
      progressPercentage: 0,
    };
    
    addAthlete(newAthlete);
    setName("");
    setEmail("");
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Añadir atleta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir nuevo atleta</DialogTitle>
          <DialogDescription>
            Ingresa los datos del atleta para añadirlo al sistema.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del atleta"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
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
          <Button disabled={!name.trim()} onClick={handleAddAthlete}>
            Añadir atleta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAthleteDialog;
