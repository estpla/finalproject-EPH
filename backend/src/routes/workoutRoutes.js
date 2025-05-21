const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', workoutController.getAllWorkouts);
router.get('/:id', workoutController.getWorkoutById);

// Rutas protegidas (solo para entrenadores y administradores)
router.post('/', authMiddleware.verifyToken, authMiddleware.checkRole(['admin', 'coach']), workoutController.createWorkout);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.checkRole(['admin', 'coach']), workoutController.updateWorkout);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.checkRole(['admin', 'coach']), workoutController.deleteWorkout);

module.exports = router;