const jwt = require('jsonwebtoken');

const authMiddleware = {
  // Verificar token JWT
  verifyToken(req, res, next) {
    // Obtener token de cookies o headers
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado' });
    }
    
    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  },
  
  // Verificar rol de usuario
  checkRole(roles = []) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Acceso no autorizado' });
      }
      
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'No tienes permiso para acceder a este recurso' });
      }
      
      next();
    };
  }
};

module.exports = authMiddleware;