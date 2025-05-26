const authService = require('../../../src/services/authService');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock de Prisma
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    }
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

// Mock de bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

// Mock de jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

const prisma = new PrismaClient();

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });
  
  describe('getUserByEmail', () => {
    it('debe retornar un usuario por email', async () => {
      // Mock de datos
      const mockUser = { id: 1, email: 'usuario@example.com', name: 'Usuario' };
      
      // Configurar el mock
      prisma.user.findUnique.mockResolvedValue(mockUser);
      
      // Ejecutar el servicio
      const result = await authService.getUserByEmail('usuario@example.com');
      
      // Verificar resultado
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'usuario@example.com' }
      });
    });
  });
  
  describe('getUserById', () => {
    it('debe retornar un usuario por ID', async () => {
      // Mock de datos
      const mockUser = { id: 1, email: 'usuario@example.com', name: 'Usuario' };
      
      // Configurar el mock
      prisma.user.findUnique.mockResolvedValue(mockUser);
      
      // Ejecutar el servicio
      const result = await authService.getUserById(1);
      
      // Verificar resultado
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });
  });
  
  describe('createUser', () => {
    it('debe crear un nuevo usuario con contraseña hasheada', async () => {
      // Mock de datos
      const userData = { 
        email: 'nuevo@example.com', 
        password: 'password123', 
        name: 'Nuevo Usuario',
        role: 'user'
      };
      const mockCreatedUser = { id: 1, ...userData, password: 'hashed_password' };
      
      // Configurar el mock
      prisma.user.create.mockResolvedValue(mockCreatedUser);
      
      // Ejecutar el servicio
      const result = await authService.createUser(userData);
      
      // Verificar resultado
      expect(result).toEqual(mockCreatedUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: userData.email,
          password: 'hashed_password',
          name: userData.name,
          role: userData.role
        })
      });
    });
  });
  
  describe('verifyToken', () => {
    it('debe verificar un token JWT válido', () => {
      // Mock de datos
      const mockDecodedToken = { id: 1, email: 'usuario@example.com', role: 'user' };
      
      // Configurar el mock
      jwt.verify.mockReturnValue(mockDecodedToken);
      
      // Ejecutar el servicio
      const result = authService.verifyToken('valid_token');
      
      // Verificar resultado
      expect(result).toEqual(mockDecodedToken);
      expect(jwt.verify).toHaveBeenCalledWith('valid_token', 'test_secret');
    });
    
    it('debe retornar null para un token inválido', () => {
      // Configurar el mock para lanzar error
      jwt.verify.mockImplementation(() => {
        throw new Error('Token inválido');
      });
      
      // Ejecutar el servicio
      const result = authService.verifyToken('invalid_token');
      
      // Verificar resultado
      expect(result).toBeNull();
      expect(jwt.verify).toHaveBeenCalledWith('invalid_token', 'test_secret');
    });
  });
});