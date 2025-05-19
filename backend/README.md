# README - Backend GymFlow

Este documento explica cómo configurar y arrancar el proyecto backend de GymFlow.

## Requisitos previos

- Node.js (v14 o superior)
- Docker y Docker Compose
- Git

## Pasos para arrancar el proyecto

1. Clonar el repositorio

```bash
git clone <url-del-repositorio>cd finalproject-EPH/backend
```

2. Configurar variables de entorno

Copia el archivo .env.example a .env y modifica las variables según tu entorno:

```bash
cp .env.example .env
```

Edita el archivo .env con tus configuraciones. Para desarrollo local con Docker, asegúrate de que la URL de la base de datos sea:

```plaintext
DATABASE_URL="postgresql://username:password@localhost:5432/gymflow?schema=public"
```

3. Iniciar la base de datos con Docker Compose

Desde la carpeta raíz del proyecto, ejecuta:

```bash
docker-compose up -d
```

Esto iniciará:
- PostgreSQL en el puerto 5432
- pgAdmin en el puerto 5050 (accesible en http://localhost:5050)
    - Email: admin@gymflow.com
    - Contraseña: admin

4. Instalar dependencias

```bash
npm install
```

5. Configurar Prisma

Genera el cliente de Prisma:

```bash
npm run prisma:generate
```

Crea las migraciones iniciales:

```bash
npm run prisma:migrate
```

Carga los datos iniciales (seed):

```bash
npm run prisma:seed
```

6. Iniciar el servidor

Para desarrollo (con hot reload):

```bash
npm run dev
```

Para producción:

```bash
npm start
```

El servidor estará disponible en: http://localhost:3000

## Comandos útiles

### Prisma

- Generar cliente: npm run prisma:generate
- Crear migración: npm run prisma:migrate
- Cargar datos iniciales: npm run prisma:seed

### Servidor

- Iniciar en desarrollo: npm run dev
- Iniciar en producción: npm start

### Tests

- Ejecutar tests: npm test
- Ejecutar tests en modo watch: npm run test:watch

## Estructura del proyecto

```plaintext
/backend├── src/│   ├── controllers/         # Lógica de negocio│   ├── routes/              # Rutas Express│   ├── services/            # Lógica de dominio│   ├── middlewares/         # Auth, errores, validaciones│   ├── sockets/             # Configuración WebSocket│   ├── utils/               # Funciones auxiliares│   ├── prisma/              # Esquema y cliente de Prisma│   │   ├── schema.prisma│   │   └── seed.js│   ├── index.js             # Punto de entrada principal│   └── server.js            # Setup de Express, middleware, rutas├── tests/                   # Carpeta para tests con Jest│   ├── unit/                # Tests unitarios│   ├── integration/         # Tests de integración│   └── setup.js             # Configuración para tests└── ...
```

## Solución de problemas comunes

### Error de conexión a la base de datos

Si tienes problemas conectando a la base de datos, verifica:
1. Que Docker esté ejecutándose correctamente: docker ps
2. Que la URL en el archivo .env sea correcta
3. Reinicia los contenedores: docker-compose restart

### Error al ejecutar migraciones de Prisma

Si las migraciones fallan:
1. Elimina la carpeta prisma/migrations (si existe)
2. Reinicia el proceso: npm run prisma:migrate

## Endpoints API

La API estará disponible en http://localhost:3000/api

Endpoints principales:
- GET /api/status - Estado de la API
- GET /api/sessions/active - Sesiones activas
- POST /api/sessions/start - Iniciar sesión
- POST /api/sessions/end/:sessionId - Finalizar sesión

Para más detalles sobre los endpoints disponibles, consulta la documentación de la API o el código en la carpeta routes.
