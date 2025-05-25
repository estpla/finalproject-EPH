const authMiddleware = require("../../../src/middlewares/authMiddleware");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");

describe("authMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {}, headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("verifyToken", () => {
    it("debe retornar 401 si no hay token", () => {
      authMiddleware.verifyToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Acceso no autorizado" });
    });

    it("debe retornar 401 si el token es inválido", () => {
      req.cookies.token = "badtoken";
      jwt.verify.mockImplementation(() => {
        throw new Error("invalid");
      });
      authMiddleware.verifyToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Token inválido" });
    });

    it("debe poner req.user y llamar next si el token es válido", () => {
      req.cookies.token = "goodtoken";
      const user = { id: 1, role: "admin" };
      jwt.verify.mockReturnValue(user);
      authMiddleware.verifyToken(req, res, next);
      expect(req.user).toEqual(user);
      expect(next).toHaveBeenCalled();
    });

    it("debe aceptar token en headers.authorization", () => {
      req.headers.authorization = "Bearer goodtoken";
      const user = { id: 2, role: "viewer" };
      jwt.verify.mockReturnValue(user);
      authMiddleware.verifyToken(req, res, next);
      expect(req.user).toEqual(user);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("checkRole", () => {
    it("debe retornar 401 si no hay usuario", () => {
      const middleware = authMiddleware.checkRole(["admin"]);
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Acceso no autorizado" });
    });

    it("debe retornar 403 si el rol no está permitido", () => {
      req.user = { id: 1, role: "viewer" };
      const middleware = authMiddleware.checkRole(["admin"]);
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "No tienes permiso para acceder a este recurso",
      });
    });

    it("debe llamar next si el rol está permitido", () => {
      req.user = { id: 1, role: "admin" };
      const middleware = authMiddleware.checkRole(["admin", "viewer"]);
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
