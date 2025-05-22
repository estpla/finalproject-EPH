const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para obtener estadísticas del dashboard
router.get('/stats', authMiddleware.verifyToken, dashboardController.getDashboardStats);

module.exports = router;