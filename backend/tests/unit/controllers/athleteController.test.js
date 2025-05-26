const athleteController = require("../../../src/controllers/athleteController");
const athleteService = require("../../../src/services/athleteService");
const { PrismaClient } = require("@prisma/client");

// Mock de athleteService
jest.mock("../../../src/services/athleteService");

// Mock de Prisma
jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    workout: {
      findUnique: jest.fn(),
    },
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const prisma = new PrismaClient();

describe("Athlete Controller", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock de req, res y next
    req = {
      params: {},
      body: {},
    };

    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  describe("getAllAthletes", () => {
    it("debe retornar todos los atletas", async () => {
      // Mock de datos
      const mockAthletes = [
        { id: 1, name: "Atleta 1" },
        { id: 2, name: "Atleta 2" },
      ];

      // Configurar el mock
      athleteService.getAllAthletes.mockResolvedValue(mockAthletes);

      // Ejecutar el controlador
      await athleteController.getAllAthletes(req, res, next);

      // Verificar resultado
      expect(athleteService.getAllAthletes).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockAthletes);
    });

    it("debe manejar errores", async () => {
      // Configurar el mock para lanzar error
      const error = new Error("Error al obtener atletas");
      athleteService.getAllAthletes.mockRejectedValue(error);

      // Ejecutar el controlador
      await athleteController.getAllAthletes(req, res, next);

      // Verificar resultado
      expect(next).toHaveBeenCalledWith(error);
    });

    it("debe llamar a next en caso de error inesperado", async () => {
      athleteService.getAllAthletes.mockRejectedValue(new Error("fail"));
      await athleteController.getAllAthletes(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getAthleteById", () => {
    it("debe retornar un atleta por ID", async () => {
      // Mock de datos
      const mockAthlete = { id: 1, name: "Atleta 1" };
      req.params.id = "1";

      // Configurar el mock
      athleteService.getAthleteById.mockResolvedValue(mockAthlete);

      // Ejecutar el controlador
      await athleteController.getAthleteById(req, res, next);

      // Verificar resultado
      expect(athleteService.getAthleteById).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith(mockAthlete);
    });

    it("debe retornar 404 si el atleta no existe", async () => {
      // Configurar req
      req.params.id = "999";

      // Configurar el mock
      athleteService.getAthleteById.mockResolvedValue(null);

      // Ejecutar el controlador
      await athleteController.getAthleteById(req, res, next);

      // Verificar resultado
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Atleta no encontrado" });
    });

    it("debe llamar a next en caso de error inesperado", async () => {
      req.params.id = "1";
      athleteService.getAthleteById.mockRejectedValue(new Error("fail"));
      await athleteController.getAthleteById(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("createAthlete", () => {
    it("debe crear un nuevo atleta", async () => {
      // Mock de datos
      const athleteData = { name: "Nuevo Atleta", email: "nuevo@example.com" };
      const mockCreatedAthlete = { id: 3, ...athleteData };
      req.body = athleteData;

      // Configurar el mock
      athleteService.getAthleteByEmail.mockResolvedValue(null);
      athleteService.createAthlete.mockResolvedValue(mockCreatedAthlete);

      // Ejecutar el controlador
      await athleteController.createAthlete(req, res, next);

      // Verificar resultado
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedAthlete);
    });

    it("debe retornar 400 si falta el nombre", async () => {
      // Configurar req sin nombre
      req.body = { email: "nuevo@example.com" };

      // Ejecutar el controlador
      await athleteController.createAthlete(req, res, next);

      // Verificar resultado
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "El nombre del atleta es requerido",
      });
    });

    it("debe retornar 400 si el email ya está en uso", async () => {
      // Configurar req
      req.body = { name: "Nuevo Atleta", email: "existente@example.com" };

      // Configurar el mock para retornar un atleta existente
      athleteService.getAthleteByEmail.mockResolvedValue({
        id: 2,
        email: "existente@example.com",
      });

      // Ejecutar el controlador
      await athleteController.createAthlete(req, res, next);

      // Verificar resultado
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "El email ya está en uso",
      });
    });

    it("debe llamar a next en caso de error inesperado", async () => {
      req.body = { name: "Nuevo Atleta", email: "nuevo@example.com" };
      athleteService.getAthleteByEmail.mockRejectedValue(new Error("fail"));
      await athleteController.createAthlete(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
    
    it("debe crear un atleta sin email", async () => {
      const athleteData = { name: "Atleta Sin Email" };
      const mockCreatedAthlete = { id: 4, ...athleteData };
      req.body = athleteData;
      
      athleteService.createAthlete.mockResolvedValue(mockCreatedAthlete);
      
      await athleteController.createAthlete(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedAthlete);
      // Verificar que no se llamó a getAthleteByEmail
      expect(athleteService.getAthleteByEmail).not.toHaveBeenCalled();
    });
    
    it("debe crear un atleta con assignedWorkoutId", async () => {
      const athleteData = { 
        name: "Atleta Con Plan", 
        email: "plan@example.com",
        assignedWorkoutId: "5" // String para probar el parseInt
      };
      const mockCreatedAthlete = { 
        id: 5, 
        name: "Atleta Con Plan", 
        email: "plan@example.com",
        assignedWorkoutId: 5 // Número después de parseInt
      };
      req.body = athleteData;
      
      athleteService.getAthleteByEmail.mockResolvedValue(null);
      athleteService.createAthlete.mockResolvedValue(mockCreatedAthlete);
      
      await athleteController.createAthlete(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedAthlete);
      // Verificar que se llamó a createAthlete con el ID convertido a número
      expect(athleteService.createAthlete).toHaveBeenCalledWith(expect.objectContaining({
        assignedWorkoutId: 5 // Debe ser un número, no un string
      }));
    });
  });
  
  describe("updateAthlete", () => {
    it("debe actualizar un atleta existente", async () => {
      req.params.id = "1";
      req.body = {
        name: "Nuevo Nombre",
        email: "nuevo@email.com",
        assignedWorkoutId: 2,
      };
      const existingAthlete = {
        id: 1,
        name: "Viejo Nombre",
        email: "viejo@email.com",
      };
      const updatedAthlete = { id: 1, ...req.body };
      athleteService.getAthleteById.mockResolvedValue(existingAthlete);
      athleteService.getAthleteByEmail.mockResolvedValue(null);
      athleteService.updateAthlete.mockResolvedValue(updatedAthlete);
      await athleteController.updateAthlete(req, res, next);
      expect(res.json).toHaveBeenCalledWith(updatedAthlete);
    });

    it("debe retornar 404 si el atleta no existe", async () => {
      req.params.id = "999";
      athleteService.getAthleteById.mockResolvedValue(null);
      await athleteController.updateAthlete(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Atleta no encontrado" });
    });

    it("debe retornar 400 si el email ya está en uso por otro atleta", async () => {
      req.params.id = "1";
      req.body = { email: "usado@email.com" };
      const existingAthlete = { id: 1, email: "otro@email.com" };
      const athleteWithEmail = { id: 2, email: "usado@email.com" };
      athleteService.getAthleteById.mockResolvedValue(existingAthlete);
      athleteService.getAthleteByEmail.mockResolvedValue(athleteWithEmail);
      await athleteController.updateAthlete(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "El email ya está en uso por otro atleta",
      });
    });

    it("debe llamar a next en caso de error inesperado", async () => {
      req.params.id = "1";
      req.body = { name: "Nuevo Nombre", email: "nuevo@email.com" };
      athleteService.getAthleteById.mockRejectedValue(new Error("fail"));
      await athleteController.updateAthlete(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("debe actualizar un atleta sin cambiar el email", async () => {
      req.params.id = "1";
      const existingAthlete = {
        id: 1,
        name: "Nombre Original",
        email: "mismo@email.com"
      };
      req.body = {
        name: "Nombre Actualizado",
        email: "mismo@email.com" // Mismo email que ya tenía
      };
      const updatedAthlete = { id: 1, ...req.body };
      
      athleteService.getAthleteById.mockResolvedValue(existingAthlete);
      athleteService.updateAthlete.mockResolvedValue(updatedAthlete);
      
      await athleteController.updateAthlete(req, res, next);
      
      expect(res.json).toHaveBeenCalledWith(updatedAthlete);
      // Verificar que no se llamó a getAthleteByEmail
      expect(athleteService.getAthleteByEmail).not.toHaveBeenCalled();
    });

    it("debe actualizar un atleta sin proporcionar email", async () => {
      req.params.id = "1";
      const existingAthlete = {
        id: 1,
        name: "Nombre Original",
        email: "original@email.com"
      };
      req.body = {
        name: "Nombre Actualizado"
        // No incluimos email
      };
      const updatedAthlete = { 
        id: 1, 
        name: "Nombre Actualizado",
        email: "original@email.com" // Mantiene el email original
      };
      
      athleteService.getAthleteById.mockResolvedValue(existingAthlete);
      athleteService.updateAthlete.mockResolvedValue(updatedAthlete);
      
      await athleteController.updateAthlete(req, res, next);
      
      expect(res.json).toHaveBeenCalledWith(updatedAthlete);
      // Verificar que no se llamó a getAthleteByEmail
      expect(athleteService.getAthleteByEmail).not.toHaveBeenCalled();
    });
    
    it("debe actualizar un atleta con assignedWorkoutId", async () => {
      req.params.id = "1";
      const existingAthlete = {
        id: 1,
        name: "Nombre Original",
        email: "original@email.com",
        assignedWorkoutId: null
      };
      req.body = {
        assignedWorkoutId: "10" // String para probar el parseInt
      };
      const updatedAthlete = { 
        id: 1, 
        name: "Nombre Original",
        email: "original@email.com",
        assignedWorkoutId: 10 // Número después de parseInt
      };
      
      athleteService.getAthleteById.mockResolvedValue(existingAthlete);
      athleteService.updateAthlete.mockResolvedValue(updatedAthlete);
      
      await athleteController.updateAthlete(req, res, next);
      
      expect(res.json).toHaveBeenCalledWith(updatedAthlete);
      // Verificar que se llamó a updateAthlete con el ID convertido a número
      expect(athleteService.updateAthlete).toHaveBeenCalledWith("1", expect.objectContaining({
        assignedWorkoutId: 10 // Debe ser un número, no un string
      }));
    });
  });

  describe("deleteAthlete", () => {
    it("debe eliminar un atleta existente", async () => {
      req.params.id = "1";
      const existingAthlete = { id: 1 };
      athleteService.getAthleteById.mockResolvedValue(existingAthlete);
      athleteService.deleteAthlete.mockResolvedValue();
      await athleteController.deleteAthlete(req, res, next);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
    it("debe retornar 404 si el atleta no existe", async () => {
      req.params.id = "999";
      athleteService.getAthleteById.mockResolvedValue(null);
      await athleteController.deleteAthlete(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Atleta no encontrado" });
    });
    it("debe retornar 400 si el atleta tiene una sesión activa", async () => {
      req.params.id = "1";
      const existingAthlete = { id: 1, activeSessionId: 123 };
      athleteService.getAthleteById.mockResolvedValue(existingAthlete);
      await athleteController.deleteAthlete(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "No se puede eliminar un atleta con una sesión activa",
        activeSessionId: 123,
      });
    });
    it("debe llamar a next en caso de error inesperado", async () => {
      req.params.id = "1";
      athleteService.getAthleteById.mockRejectedValue(new Error("fail"));
      await athleteController.deleteAthlete(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("assignWorkout", () => {
    it("debe asignar un plan de entrenamiento a un atleta", async () => {
      req.params.id = "1";
      req.body = { workoutId: 2 };
      const existingAthlete = { id: 1 };
      const workout = { id: 2 };
      const updatedAthlete = { id: 1, assignedWorkoutId: 2 };
      athleteService.getAthleteById.mockResolvedValue(existingAthlete);
      prisma.workout.findUnique.mockResolvedValue(workout);
      athleteService.assignWorkout.mockResolvedValue(updatedAthlete);
      await athleteController.assignWorkout(req, res, next);
      expect(res.json).toHaveBeenCalledWith(updatedAthlete);
    });
    it("debe retornar 400 si falta el workoutId", async () => {
      req.params.id = "1";
      req.body = {};
      await athleteController.assignWorkout(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "El ID del plan de entrenamiento es requerido",
      });
    });
    it("debe retornar 404 si el atleta no existe", async () => {
      req.params.id = "999";
      req.body = { workoutId: 2 };
      athleteService.getAthleteById.mockResolvedValue(null);
      await athleteController.assignWorkout(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Atleta no encontrado" });
    });
    it("debe retornar 404 si el plan de entrenamiento no existe", async () => {
      req.params.id = "1";
      req.body = { workoutId: 999 };
      const existingAthlete = { id: 1 };
      athleteService.getAthleteById.mockResolvedValue(existingAthlete);
      prisma.workout.findUnique.mockResolvedValue(null);
      await athleteController.assignWorkout(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Plan de entrenamiento no encontrado",
      });
    });
    it("debe llamar a next en caso de error inesperado", async () => {
      req.params.id = "1";
      req.body = { workoutId: 2 };
      athleteService.getAthleteById.mockRejectedValue(new Error("fail"));
      await athleteController.assignWorkout(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
