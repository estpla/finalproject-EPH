const express = require('express');
const router = express.Router();

// Importar rutas específicas
const sessionRoutes = require('./sessionRoutes');
//const athleteRoutes = require('./athleteRoutes');
//const workoutRoutes = require('./workoutRoutes');
//const progressRoutes = require('./progressRoutes');
//const authRoutes = require('./authRoutes');

// Configurar rutas
router.use('/sessions', sessionRoutes);
//router.use('/athletes', athleteRoutes);
//router.use('/workouts', workoutRoutes);
//router.use('/progress', progressRoutes);
//router.use('/auth', authRoutes);

// Ruta de prueba/estado
router.get('/status', (req, res) => {
  res.json({ status: 'API funcionando correctamente' });
});

module.exports = router;