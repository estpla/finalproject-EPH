const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// Servicio para la lógica de negocio relacionada con autenticación
const authService = {
  // Obtener usuario por email
  async getUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email }
    });
  },
  
  // Obtener usuario por ID
  async getUserById(id) {
    return prisma.user.findUnique({
      where: { id: parseInt(id) }
    });
  },
  
  // Crear nuevo usuario
  async createUser({ email, password, name, role }) {
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      }
    });
  },
  
  // Verificar token JWT
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
};

module.exports = authService;