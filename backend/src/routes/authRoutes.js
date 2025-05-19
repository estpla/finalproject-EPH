const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

// Rutas protegidas
router.get('/me', authMiddleware.verifyToken, authController.getCurrentUser);

module.exports = router;