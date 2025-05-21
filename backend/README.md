# README - Backend GymFlow

Este documento explica cómo configurar y arrancar el proyecto backend de GymFlow.

## Requisitos previos

- Node.js (v14 o superior)
- Docker y Docker Compose
- Git

## Pasos para arrancar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/estpla/finalproject-EPH
cd finalproject-EPH/backend
```

### 2. Configurar variables de entorno

Copia el archivo .env.example a .env y modifica las variables según tu entorno:

```bash
cp .env.example .env
```

Edita el archivo .env con tus configuraciones. Para desarrollo local con Docker, asegúrate de que la URL de la base de datos sea:

```plaintext
DATABASE_URL="postgresql://username:password@localhost:5432/gymflow?schema=public"
```

### 3. Iniciar la base de datos con Docker Compose

Desde la carpeta raíz del proyecto, ejecuta:

```bash
docker-compose up -d
```

Esto iniciará:
- PostgreSQL en el puerto 5432
- pgAdmin en el puerto 5050 (accesible en http://localhost:5050)
    - Email: admin@gymflow.com
    - Contraseña: admin

### 4. Instalar dependencias

```bash
npm install
```

### 5. Configurar Prisma

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

### 6. Iniciar el servidor

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
/backend
├── src/
│   ├── controllers/         # Lógica de negocio
│   ├── routes/              # Rutas Express
│   ├── services/            # Lógica de dominio
│   ├── middlewares/         # Auth, errores, validaciones
│   ├── sockets/             # Configuración WebSocket
│   ├── utils/               # Funciones auxiliares
│   ├── prisma/              # Esquema y cliente de Prisma
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── index.js             # Punto de entrada principal
│   └── server.js            # Setup de Express, middleware, rutas
├── tests/                   # Carpeta para tests con Jest
│   ├── unit/                # Tests unitarios
│   ├── integration/         # Tests de integración
│   └── setup.js             # Configuración para tests
└── ...
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

### Error con Socket.IO no inicializado

Si recibes un error como "Socket.IO no ha sido inicializado":
1. Verifica que el archivo index.js inicialice correctamente Socket.IO después de que el servidor HTTP esté escuchando
2. Asegúrate de que el orden de inicialización sea: primero el servidor HTTP, luego Socket.IO

## Endpoints API
La API estará disponible en http://localhost:3000/api

### Endpoints de estado

- GET /api/status - Estado de la API

### Endpoints de sesiones

- GET /api/sessions/active - Obtener sesiones activas
- POST /api/sessions/start - Iniciar sesión
- POST /api/sessions/end/:sessionId - Finalizar sesión
- GET /api/sessions/room/status - Obtener estado de la sala

### Endpoints de atletas

- GET /api/athletes - Listar todos los atletas
- GET /api/athletes/:id - Obtener un atleta por ID
- POST /api/athletes - Crear un nuevo atleta (requiere autenticación)
- PUT /api/athletes/:id - Actualizar un atleta (requiere autenticación)
- DELETE /api/athletes/:id - Eliminar un atleta (requiere autenticación)
- POST /api/athletes/:id/assign-workout - Asignar un plan de entrenamiento a un atleta (requiere autenticación)

### Endpoints de autenticación

- POST /api/auth/login - Iniciar sesión de usuario
- POST /api/auth/register - Registrar nuevo usuario
- POST /api/auth/logout - Cerrar sesión de usuario
- GET /api/auth/me - Obtener usuario actual (requiere autenticación)

### Endpoints de Workouts (Planes de entrenamiento)

- `GET /api/workouts` - Obtener todos los planes de entrenamiento
- `GET /api/workouts/:id` - Obtener un plan de entrenamiento por ID
- `POST /api/workouts` - Crear un nuevo plan de entrenamiento
- `PUT /api/workouts/:id` - Actualizar un plan de entrenamiento existente
- `DELETE /api/workouts/:id` - Eliminar un plan de entrenamiento

Para más detalles sobre los endpoints disponibles, consulta la documentación de la API o el código en la carpeta routes.