# ✅ Security Checklist para MVP (Render + Supabase)

Este documento contiene un conjunto de buenas prácticas y técnicas de seguridad recomendadas para el desarrollo y despliegue del MVP de la aplicación de gestión de atletas en gimnasio.

---

## 🔐 1. Autenticación y Autorización

* [ ] Uso de tokens JWT con expiración breve (15–60 min).
* [ ] Tokens almacenados en cookies `httpOnly` (no localStorage).
* [ ] Middleware en backend para validar JWT y roles.
* [ ] Roles definidos claramente: `admin`, `coach`, `viewer`, etc.
* [ ] Autorización por rol en cada endpoint.

---

## 🛡️ 2. Seguridad en la Base de Datos

* [ ] Uso de ORM (Prisma) para evitar SQL injection.
* [ ] No interpolar directamente entradas del usuario.
* [ ] Usuario de DB con permisos mínimos.
* [ ] Migraciones controladas y seguras (Prisma Migrate).

---

## 🌐 3. Seguridad Web (Frontend y API)

* [ ] CORS configurado solo para dominios permitidos.
* [ ] Uso de rate limiting en rutas sensibles (login, etc.).
* [ ] Protección CSRF si se usan cookies.
* [ ] Validación del tipo de contenido recibido (`Content-Type`).
* [ ] Cabeceras de seguridad activadas (helmet en Express).

---

## 🧾 4. Validación de Datos

* [ ] Uso de librerías como `zod` o `joi` para validar `req.body`, `req.query`, etc.
* [ ] Validación de todos los inputs del usuario antes de ejecutar lógica.
* [ ] Rechazo explícito de entradas mal formateadas.

---

## 🔐 5. Gestión de Secrets y Variables de Entorno

* [ ] Uso de `.env` y variables de entorno en Render.
* [ ] Nunca exponer tokens secretos en el código.
* [ ] Rotación periódica de secretos si es necesario.

---

## 📋 6. Logs y Monitoreo

* [ ] Registro de intentos de acceso y errores con IP y userId.
* [ ] Evitar guardar datos sensibles en logs (tokens, contraseñas).
* [ ] Integración con herramientas de logging externo (Sentry, Logtail).

---

## 📦 7. Dependencias Seguras

* [ ] Revisión con `npm audit`.
* [ ] Evitar paquetes no mantenidos o sin reputación.
* [ ] Actualización regular de dependencias.

---

## 🔌 8. Seguridad en WebSocket

* [ ] Autenticación inicial en la conexión (token en `handshake`).
* [ ] Validación de permisos por evento.
* [ ] Cierre de sockets inactivos o sospechosos.

---

## 💾 9. Backups y Recuperación

* [ ] Verificación de backups automáticos en Supabase.
* [ ] Exportaciones periódicas (SQL dumps).

---

## 🚫 10. Prevención de Fugas de Información

* [ ] Desactivar cabeceras innecesarias (`X-Powered-By`, etc.).
* [ ] Manejo de errores genéricos (sin stack trace).
* [ ] No exponer estructuras internas de la API ni mensajes de error detallados al cliente.

---

> Última actualización: \[fecha actualizable automáticamente en integración continua]
