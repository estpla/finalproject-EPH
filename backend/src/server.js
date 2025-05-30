const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createServer } = require("http");
const { setupSocketIO } = require("./sockets");
const routes = require("./routes");
const errorMiddleware = require("./middlewares/errorMiddleware");

// Inicializar Express
const app = express();
const httpServer = createServer(app);

// Configurar middleware
const corsOrigin = process.env.FRONTEND_URL || "http://localhost:8080";
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Configurar WebSockets
setupSocketIO(httpServer);

// Rutas API
app.use("/api", routes);

// Middleware de manejo de errores
app.use(errorMiddleware);

module.exports = httpServer;
