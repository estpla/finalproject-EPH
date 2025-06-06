> Detalla en esta sección los prompts principales utilizados durante la creación del proyecto, que justifiquen el uso de asistentes de código en todas las fases del ciclo de vida del desarrollo. Esperamos un máximo de 3 por sección, principalmente los de creación inicial o los de corrección o adición de funcionalidades que consideres más relevantes.
> Puedes añadir adicionalmente la conversación completa como link o archivo adjunto si así lo consideras

## Índice

1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)
8. [Extra - Sprint planning](#8-extra---sprint-planning)
9. [Backend](#9-backend)
10. [Frontend](#10-frontend)
11. [Unit Testing](#11-unit-testing)
12. [Integración Continua](#12-integración-continua)

---

## 1. Descripción general del producto

**Prompt 1:**

Eres un experto en producto con experiencia en aplicaciones de gestión.
Tengo la idea de hacer una aplicación que debe gestionar que atletas se encuentran ahora mismo entrenando en la sala del gimnasio. Para estos atletas se debe de mostrar que ejercicios debe realizar durante su sesión, que pesos, repeticiones, etc.. Por otro lado, el gestor de la sala debe ir añadiendo o quitando estos atletas a la sala. Toda la información será mostrada en tiempo real en un monitor en la sala del gimnasio.
Como experto en producto con experiencia en aplicaciones de gestión, ¿cuáles serian las funcionalidades básica para una aplicación de este tipo?
Describelas en una lista, ordenalas de más alta a más baja prioridad.

**Prompt 2:**

Dame una descripción general de como sería el producto

**Prompt 3:**

Basándote en todo lo anterior, respondeme a estos 2 puntos:

- Objetivo. Propósito del producto. Qué valor aporta, qué soluciona, y para quién.
- Características y funcionalidades principales. Enumera y describe las características y funcionalidades específicas que tiene el producto para satisfacer las necesidades identificadas.

---

## 2. Arquitectura del Sistema

### **2.1. Diagrama de arquitectura:**

**Prompt 1:**

Realizame un diagrama C4 y respóndeme a lo siguiente:
Al utilizar este tipo de arquitectura elegida (cliente-servidor), dime porque es buena o mala elección, que beneficios aplica al proyecto y que sacrificios o deficits implica.

### **2.2. Descripción de componentes principales:**

**Prompt 1:**

Utilizando toda la información que tenemos hasta ahora.
Eres un experto en infraestructura de software.
Piensa que queremos utilizar una infraestructura de tipo cliente-servidor, y que queremos tener un backend y un frontend con 2 partes, una parte donde ver el estado de la sala y otra parte para la gestión de los datos (backoffice).
¿Qué componentes arquitectónicos crees que serían necesarios?
Ten en cuenta que va a ser para un MVP no muy grande y que las tecnologías que vamos a utilizar son las siguientes:

- Backend: NodeJS, Express, PostgreSQL, Prisma.
- Frontend: React, NextJS, Shadcn, Tailwindcss.

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros**

**Prompt 1:**

Con toda la información que tenemos hasta ahora, quiero que continuemos con una descripción a alto de nivel del proyecto.

**Prompt 2:**

Ahora continua con cual podría ser una estructura de ficheros para este.

### **2.4. Infraestructura y despliegue**

**Prompt 1:**

Eres un experto en infraestructura y despliegue de aplicaciones.
Pensando en este MVP dame 3 opciones de despliegue que podrian ser utilizadas para este proyecto.
De cada una de estas opciones dime porque es buena o mala opción, posibles precios y que beneficios o defectos tiene.

**Prompt 2:**

Vale, me quedo con la segunda opción. Quiero que me hagas un diagrama con como sería la infraestructura con la opcion de Render + Supabase y que expliques brevemente como sería el proceso de despliegue

### **2.5. Seguridad**

**Prompt 1:**

Listame que técnicas y prácticas de seguridad principales deberían de aplicararse en el proyecto y dame ejemplos de ello.

**Prompt 2:**

Generame un archivo security-checklist.md para integrar al repo o preparar middlewares de ejemplo (autenticación, rate limiting, validación)

### **2.6. Tests**

**Prompt 1:**

Continuando con el proyecto. Eres un experto en testing, tanto de backend como de frontend. Que tipos de test consideras que serían necesarios implementar para este MVP y dime los motivos para cada uno de ellos

---

### 3. Modelo de Datos

**Prompt 1:**

Con toda la información que tenemos hasta ahora. Eres un experto arquitecto de software. ¿Cuáles son las entidades esenciales del modelo de datos para mi aplicación? Dame algunos campos esenciales de cada una y cómo se relacionan entre sí. Dame esta información en formato mermaid.

**Prompt 2:**

Buen trabajo. Ahora eres un brillante arquitecto de software. Eres capaz de diseñar, explicar y diagramar los diferentes aspectos de un sistema de software.
Genérame un diagrama de mermaid con las entidades y relaciones que me has dado.

---

### 4. Especificación de la API

**Prompt 1:**

Siguiendo con el proyecto. Eres un experto en desarrollo de software.
¿Cuáles son los principales endpoints que debería de tener mi API? Dame un máximo de 3 endpoints.
Dame una descripción de cada uno de ellos y que campos recibe y que campos devuelve.
Dame un ejemplo de petición y de respuesta para cada uno de ellos.
El resultado lo quiero en formato OpenAPI.

---

### 5. Historias de Usuario

**Prompt 1:**

Actúa como Gestor de Producto y Analista de Negocio.
Genera tres historias de usuario, las tres relacionadas con los 3 endpoints principales.
Utiliza la siguiente plantilla para crear las historias de usuario:

```md
# User Story Title:

1. **como [rol de usuario]**,
2. **quiere** [acción que el usuario desea realizar],
3. **para que** [beneficio que el usuario espera obtener].

# Criterios de aceptación:

1. 1. [Detalle específico de la funcionalidad].
2. 2. [Detalle específico de la funcionalidad].
3. [Detalle específico de funcionalidad]

# Notas adicionales:

- [Cualquier consideración adicional]

# Historias de usuario relacionadas:

- [Relaciones con otras historias de usuario].
```

**Prompt 2:**

Dadas las historias de usuario anteriores, ¿qué requisitos técnicos serían necesarios?

---

### 6. Tickets de Trabajo

**Prompt 1:**

Actúa como Gestor de Producto y Analista de Negocio.
Dime de manera breve, y sin mucho detalle, cuales serían los 3 tickets de trabajo principales para el desarrollo del proyecto.
Quiero que me digas uno de backend, otro de frontend y otro relacionado con la base de datos.

**Prompt 2:**

Ahora que ya tenemos los 3 tickets de trabajo principales, quiero que les expandas en detalle a cada uno de ellos. Para ello quiero que te apoyes en la siguiente plantilla:

```md
1. Título claro y conciso
   Un breve resumen que refleje la esencia de la tarea. Debe ser lo suficientemente descriptivo como para que cualquier miembro del equipo entienda rápidamente de qué trata el ticket.

2. Descripción detallada

- Propósito: Explicación de por qué es necesaria la tarea y qué problema resuelve.
- Detalles específicos: Información adicional sobre requisitos específicos, restricciones o condiciones necesarias para realizar la tarea.

3. Criterios de aceptación

- Expectativas claras: Lista detallada de condiciones que deben cumplirse para que el trabajo del ticket se considere completo.
- Pruebas de validación: Pasos o pruebas específicas que deben realizarse para verificar que la tarea se ha completado correctamente.

4. Prioridad

- Nivel de urgencia: Una clasificación de la importancia y urgencia de la tarea, que ayuda a determinar el orden en que deben abordarse las tareas dentro del backlog.

5. Esfuerzo estimado

- Puntos de Historia o Tiempo Estimado: Una evaluación del tiempo o esfuerzo que se espera que lleve completar el ticket. Esto es esencial para la planificación del equipo y la gestión del tiempo.

6. Asignar

- Responsable: Quién o qué equipo será responsable de completar la tarea. Esto garantiza que todos los implicados entiendan quién está a cargo de cada parte del proyecto.

7. Etiquetas

- Categorización: Etiquetas que ayudan a categorizar el ticket por tipo (bug, mejora, tarea, etc.), por característica del producto (UI, backend, etc.), o por sprint/versión.

8. Comentarios y notas

- Colaboración: Espacio para que los miembros del equipo añadan información relevante, hagan preguntas o proporcionen actualizaciones sobre el progreso de la tarea.

9. Enlaces o referencias

- Documentación relacionada: Enlaces a documentos relacionados, diseños, especificaciones o tickets que proporcionan contexto adicional o información necesaria para la ejecución de la tarea.

10. Historial de cambios

- Seguimiento de cambios: Un registro de todos los cambios realizados en el ticket, incluyendo actualizaciones de estado, reasignaciones y modificaciones de detalles o prioridades.
```

---

### 7. Pull Requests

**Prompt 1:**

**Prompt 2:**

**Prompt 3:**

---

### 8. Extra - Sprint Planning

**Prompt 1:**

Ahora dame hora una planificación por sprint para el proyecto.

---

### 9. Backend

**Prompt 1:**

Eres un experto en proyectos Nodejs de backend. Basándote en toda la información que hay en el fichero README.md, quiero empezar la estructura del proyecto backend en la carpeta "backend/". Importante que tenga los siguientes componentes:

- Javascript
- Node.js
- Express
- Prisma
- Websockets
- Jest

Quiero que hagas una buena separación de ficheros/carpetas, mira en el fichero README.md para ello.

Crea aunque sea una ruta de ejemplo.

**Prompt 2:**

Continuemos ahora añadiendo las rutas de auth

**Prompt 3:**

Continuemos ahora con las rutas de atletas. Recuerda actualizar el fichero backend/README.md con los cambios que realices. README.md

**Prompt 4:**

Continuemos ahora con las rutas de workouts. Recuerda actualizar el fichero backend/README.md con los cambios que realices. README.md

---

### 10. Frontend

**Prompt 1:**

Model: https://lovable.dev/

Eres un experto en proyectos React de frontend. Basándote en toda la información que hay en el fichero README.md, quiero empezar la estructura del proyecto frontend en la carpeta "frontend/". 

Importante que tenga los siguientes componentes:

- Javascript
- React
- Tailwindcss
- Shadcn

Quiero que hagas una buena separación de ficheros/carpetas, mira en el fichero README.md para ello.

**Prompt 2:**

Continuemos con la parte de trabajar con los planes de entrenamiento. Si hace falta, apoyate en los siguientes endpoints:

### Endpoints de Workouts (Planes de entrenamiento)

- `GET /api/workouts` - Obtener todos los planes de entrenamiento
- `GET /api/workouts/:id` - Obtener un plan de entrenamiento por ID
- `POST /api/workouts` - Crear un nuevo plan de entrenamiento
- `PUT /api/workouts/:id` - Actualizar un plan de entrenamiento existente
- `DELETE /api/workouts/:id` - Eliminar un plan de entrenamiento

**Prompt 3:**

La parte de "Atletas" y "Rutinas", deben de estar en una especie de backoffice, ya que deben de estar protegido por un Login.

La parte de "Activos" si se debe mantener como ruta principal no protegida.

Por lo tanto necesitamos una pantalla de "Login" y "Registro", apoyate en los siguientes endpoints:

### Endpoints de autenticación

- POST /api/auth/login - Iniciar sesión de usuario
- POST /api/auth/register - Registrar nuevo usuario
- POST /api/auth/logout - Cerrar sesión de usuario
- GET /api/auth/me - Obtener usuario actual (requiere autenticación con JWT)

---

### 11. Unit Testing

**Prompt 1:**

Eres un experto en testing de backend. 
Quiero que añadamos test unitarios para todos los controllers @controllers y @services del backend services.
Para ello utilizaremos Jest. 
Crea un archivo de test para cada uno de los controllers y services.
Ves uno a uno y explica que test se van a realizar y como se van a realizar.

**Prompt 2:**

Añade tests unitarios para los websockets @index.js a la carpeta /backend/tests/units/sockets

**Prompt 3:**

Podrías sacar toda la cobertura de este test sessionService.test.js sessionService.js

El coverage me dice esto

-------------------------|---------|----------|---------|---------|-------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------|---------|----------|---------|---------|-------------------
sessionService.js      |   97.36 |    91.66 |    90.9 |   97.22 | 44
-------------------------|---------|----------|---------|---------|-------------------

---

### 12. Integración Continua

**Prompt 1:**

Eres un experto en integración continua.
Quiero una Github action que lance los tests del backend cada vez que se realiza una PR y muestre los resultado del coverage en una tabla en la PR.
Apoyate en el fihcero @backend/package.json 

**Prompt 2:**

He recibido el siguiente error:

```bash
FAIL tests/integration/routes.test.js
  ● Console
    console.error
      PrismaClientInitializationError: 
      Invalid `prisma.athlete.findMany()` invocation in
      /home/runner/work/finalproject-EPH/finalproject-EPH/backend/src/services/athleteService.js:8:27
      
        5 const athleteService = {
        6   // Obtener todos los atletas
        7   async getAllAthletes() {
      → 8     return prisma.athlete.findMany(
      error: Environment variable not found: DATABASE_URL.
        -->  schema.prisma:10
         | 
       9 |   provider = "postgresql"
      10 |   url      = env("DATABASE_URL")
         | 
```

Porque está tratando de utilizar los test de integración, pero solo debería utilizar los test unitarios.

---