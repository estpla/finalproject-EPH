const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

// Controlador para gestionar la autenticación
const authController = {
  // Iniciar sesión
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }
      
      // Buscar usuario por email
      const user = await authService.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      
      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      
      // Generar token JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      // Configurar cookie con el token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 1 día
      });
      
      // Responder con datos del usuario (sin contraseña)
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Registrar nuevo usuario
  async register(req, res, next) {
    try {
      const { email, password, name, role = 'viewer' } = req.body;
      
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, contraseña y nombre son requeridos' });
      }
      
      // Verificar si el email ya está en uso
      const existingUser = await authService.getUserByEmail(email);
      
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está en uso' });
      }
      
      // Crear nuevo usuario
      const user = await authService.createUser({ email, password, name, role });
      
      // Generar token JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      // Configurar cookie con el token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 1 día
      });
      
      // Responder con datos del usuario (sin contraseña)
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Cerrar sesión
  async logout(req, res) {
    // Eliminar cookie
    res.clearCookie('token');
    res.json({ message: 'Sesión cerrada correctamente' });
  },
  
  // Obtener usuario actual
  async getCurrentUser(req, res, next) {
    try {
      // El middleware de autenticación ya ha verificado el token
      // y ha añadido el usuario a req.user
      const user = await authService.getUserById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      // Responder con datos del usuario (sin contraseña)
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({ user: userWithoutPassword });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;