const express = require('express');
const router = express.Router();
const athleteController = require('../controllers/athleteController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', athleteController.getAllAthletes);
router.get('/:id', athleteController.getAthleteById);

// Rutas protegidas (requieren autenticación)
router.post('/', authMiddleware.verifyToken, athleteController.createAthlete);
router.put('/:id', authMiddleware.verifyToken, athleteController.updateAthlete);
router.delete('/:id', authMiddleware.verifyToken, athleteController.deleteAthlete);
router.post('/:id/assign-workout', authMiddleware.verifyToken, athleteController.assignWorkout);

module.exports = router;