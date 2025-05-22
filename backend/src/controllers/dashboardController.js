const dashboardService = require('../services/dashboardService');

// Controlador para las operaciones relacionadas con el dashboard
const dashboardController = {
  // Obtener estadísticas para el dashboard
  async getDashboardStats(req, res, next) {
    try {
      const stats = await dashboardService.getDashboardStats();
      res.status(200).json(stats);
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      next(error);
    }
  }
};

module.exports = dashboardController;