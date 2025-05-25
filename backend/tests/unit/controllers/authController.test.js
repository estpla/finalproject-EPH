const authController = require("../../../src/controllers/authController");
const authService = require("../../../src/services/authService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock dependencies
jest.mock("../../../src/services/authService");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthController", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock request, response and next function
    mockReq = {
      body: {},
      user: {},
      cookies: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("login", () => {
    it("should return 400 if email or password is missing", async () => {
      mockReq.body = {};

      await authController.login(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Email y contraseña son requeridos",
      });
    });

    it("should return 401 if user is not found", async () => {
      mockReq.body = { email: "test@test.com", password: "password123" };
      authService.getUserByEmail.mockResolvedValue(null);

      await authController.login(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Credenciales inválidas",
      });
    });

    it("should return 401 if password is invalid", async () => {
      mockReq.body = { email: "test@test.com", password: "wrongpassword" };
      authService.getUserByEmail.mockResolvedValue({
        id: 1,
        email: "test@test.com",
        password: "hashedpassword",
      });
      bcrypt.compare.mockResolvedValue(false);

      await authController.login(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Credenciales inválidas",
      });
    });

    it("should successfully login and return user data with token", async () => {
      const mockUser = {
        id: 1,
        email: "test@test.com",
        password: "hashedpassword",
        name: "Test User",
        role: "user",
      };

      mockReq.body = { email: "test@test.com", password: "password123" };
      authService.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("mocktoken");

      await authController.login(mockReq, mockRes, mockNext);

      expect(mockRes.cookie).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
        token: "mocktoken",
      });
    });
  });

  describe("register", () => {
    it("should return 400 if required fields are missing", async () => {
      mockReq.body = {};

      await authController.register(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Email, contraseña y nombre son requeridos",
      });
    });

    it("should return 400 if email is already in use", async () => {
      mockReq.body = {
        email: "test@test.com",
        password: "password123",
        name: "Test User",
      };
      authService.getUserByEmail.mockResolvedValue({ id: 1 });

      await authController.register(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "El email ya está en uso",
      });
    });

    it("should successfully register a new user", async () => {
      const mockUser = {
        id: 1,
        email: "test@test.com",
        password: "hashedpassword",
        name: "Test User",
        role: "viewer",
      };

      mockReq.body = {
        email: "test@test.com",
        password: "password123",
        name: "Test User",
      };
      authService.getUserByEmail.mockResolvedValue(null);
      authService.createUser.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("mocktoken");

      await authController.register(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.cookie).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
        token: "mocktoken",
      });
    });
  });

  describe("logout", () => {
    it("should clear cookie and return success message", async () => {
      await authController.logout(mockReq, mockRes);

      expect(mockRes.clearCookie).toHaveBeenCalledWith("token");
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Sesión cerrada correctamente",
      });
    });
  });

  describe("getCurrentUser", () => {
    it("should return 404 if user is not found", async () => {
      mockReq.user = { id: 1 };
      authService.getUserById.mockResolvedValue(null);

      await authController.getCurrentUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Usuario no encontrado",
      });
    });

    it("should return user data without password", async () => {
      const mockUser = {
        id: 1,
        email: "test@test.com",
        password: "hashedpassword",
        name: "Test User",
        role: "user",
      };

      mockReq.user = { id: 1 };
      authService.getUserById.mockResolvedValue(mockUser);

      await authController.getCurrentUser(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
      });
    });
  });
});
