const errorMiddleware = require("../../../src/middlewares/errorMiddleware");

describe("errorMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("debe manejar errores de Prisma (código P)", () => {
    const err = { code: "P2002", message: "Prisma error" };
    errorMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error en la base de datos",
      message: "Prisma error",
      code: "P2002",
    });
  });

  it("debe manejar errores de validación", () => {
    const err = { name: "ValidationError", message: "Campo requerido" };
    errorMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error de validación",
      message: "Campo requerido",
    });
  });

  it("debe manejar errores genéricos", () => {
    const err = { message: "Algo salió mal", statusCode: 418 };
    errorMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({ error: "Algo salió mal" });
  });

  it("debe manejar errores sin mensaje ni statusCode", () => {
    const err = {};
    errorMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error interno del servidor",
    });
  });
});
