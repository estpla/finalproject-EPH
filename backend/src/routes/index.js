const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const athleteRoutes = require('./athleteRoutes');
const sessionRoutes = require('./sessionRoutes');
const workoutRoutes = require('./workoutRoutes');

// Rutas principales
router.use('/auth', authRoutes);
router.use('/athletes', athleteRoutes);
router.use('/sessions', sessionRoutes);
router.use('/workouts', workoutRoutes);

// Ruta de prueba para verificar que la API está funcionando
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API funcionando correctamente' });
});

module.exports = router;