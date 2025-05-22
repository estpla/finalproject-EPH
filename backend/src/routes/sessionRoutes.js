const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middlewares/authMiddleware');

// Iniciar sesión de entrenamiento
router.post('/start', sessionController.startSession);

// Finalizar sesión de entrenamiento
router.post('/end/:sessionId', sessionController.endSession);

// Obtener sesiones activas (requiere autenticación)
router.get('/active', authMiddleware.verifyToken, sessionController.getActiveSessions);

// Obtener estado de la sala (endpoint público para monitor)
router.get('/room/status', sessionController.getRoomStatus);

// Reordenar sesiones activas
router.post('/reorder', authMiddleware.verifyToken, sessionController.reorderSessions);

module.exports = router;