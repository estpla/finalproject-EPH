// Punto de entrada principal de la aplicación
require('dotenv').config();
const server = require('./server');

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor GymFlow ejecutándose en el puerto ${PORT}`);
});
