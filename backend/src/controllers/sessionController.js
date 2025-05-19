const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const sessionService = require('../services/sessionService');
const socketModule = require('../sockets');

// Controlador para gestionar sesiones de entrenamiento
const sessionController = {
  // Iniciar una sesión de entrenamiento
  async startSession(req, res, next) {
    try {
      const { athleteId } = req.body;
      
      if (!athleteId) {
        return res.status(400).json({ error: 'Se requiere el ID del atleta' });
      }
      
      // Verificar si el atleta ya tiene una sesión activa
      const activeSession = await sessionService.getActiveSessionByAthleteId(athleteId);
      
      if (activeSession) {
        return res.status(400).json({ 
          error: 'El atleta ya tiene una sesión activa',
          session: activeSession
        });
      }
      
      // Crear nueva sesión
      const session = await sessionService.createSession(athleteId);
      
      // Notificar a todos los clientes conectados sobre la nueva sesión
      socketModule.io.emit('session:started', session);
      
      res.status(201).json(session);
    } catch (error) {
      next(error);
    }
  },
  
  // Finalizar una sesión de entrenamiento
  async endSession(req, res, next) {
    try {
      const { sessionId } = req.params;
      
      const session = await sessionService.endSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: 'Sesión no encontrada' });
      }
      
      // Notificar a todos los clientes conectados
      socketModule.io.emit('session:ended', session);
      
      res.json(session);
    } catch (error) {
      next(error);
    }
  },
  
  // Obtener todas las sesiones activas
  async getActiveSessions(req, res, next) {
    try {
      const sessions = await sessionService.getActiveSessions();
      res.json(sessions);
    } catch (error) {
      next(error);
    }
  },
  
  // Obtener el estado actual de la sala (para monitor)
  async getRoomStatus(req, res, next) {
    try {
      const roomStatus = await sessionService.getRoomStatus();
      res.json(roomStatus);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = sessionController;