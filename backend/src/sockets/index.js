const { Server } = require("socket.io");

let io;

// Configuración de Socket.IO
function setupSocketIO(httpServer) {
  const corsOrigin = process.env.FRONTEND_URL || "http://localhost:8080";

  io = new Server(httpServer, {
    cors: {
      origin: corsOrigin,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // Evento cuando un cliente se une a la sala
    socket.on("join:room", (roomId) => {
      socket.join(roomId);
      console.log(`Cliente ${socket.id} se unió a la sala ${roomId}`);
    });

    // Evento cuando un cliente actualiza el progreso de un ejercicio
    socket.on("progress:update", async (data) => {
      try {
        // Aquí podríamos llamar al servicio para actualizar el progreso
        // y luego emitir el evento a todos los clientes en la sala
        io.emit("progress:updated", data);
      } catch (error) {
        console.error("Error al actualizar progreso:", error);
      }
    });

    // Desconexión del cliente
    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  return io;
}

module.exports = {
  setupSocketIO,
  get io() {
    if (!io) {
      throw new Error("Socket.IO no ha sido inicializado");
    }
    return io;
  },
};
