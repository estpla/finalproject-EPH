// Middleware para manejo centralizado de errores
function errorMiddleware(err, req, res, next) {
  console.error(err.stack);
  
  // Errores de Prisma
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({
      error: 'Error en la base de datos',
      message: err.message,
      code: err.code
    });
  }
  
  // Errores de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      message: err.message
    });
  }
  
  // Error genérico
  res.status(err.statusCode || 500).json({
    error: err.message || 'Error interno del servidor'
  });
}

module.exports = errorMiddleware;