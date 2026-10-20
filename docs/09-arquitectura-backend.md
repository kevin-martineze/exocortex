# Arquitectura del backend

Cómo se organiza [exocortex-api](https://github.com/kevin-martineze/exocortex-api) (NestJS 12, TypeScript strict, ESM, MongoDB con Mongoose). Es la referencia obligatoria antes de crear un módulo o mover código. El contrato HTTP está en [07-api](07-api.md) y el modelo de datos en [06-modelo-datos](06-modelo-datos.md).

## Monolito modular por dominio

Un módulo Nest por dominio: `AuthModule`, `ProjectsModule`, `EnvironmentsModule`, `SecretsModule`, `DocsModule` y, más adelante, `GithubModule`. Cada módulo tiene tres capas:

```
HTTP ──▶ Controller ──▶ Service ──▶ Repository ──▶ Mongoose Model ──▶ MongoDB
```

| Capa | Hace | No hace |
|---|---|---|
| **Controller** | Rutas, DTOs de entrada, códigos HTTP, cookies, `@Public()` y `@CurrentUser()`. | Reglas de negocio. Tocar Mongoose. |
| **Service** | Reglas de negocio, hashing, JWT y orquestación entre repositorios. Lanza excepciones HTTP de Nest (`NotFoundException`, `ConflictException`…). | Importar `Model` o `@InjectModel`. Conocer `req`/`res`. |
| **Repository** | Única capa que usa el `Model` de Mongoose. Consultas, `select('+campo')`, operaciones atómicas. Devuelve documentos o `null`/`boolean`. | Lanzar excepciones HTTP. Reglas de negocio. |

Un servicio puede usar repositorios de otros módulos solo si ese módulo los exporta. Nunca usa el `Model` de otro módulo.

## Estructura

```
src/
  main.ts                    Crea la app, configureApp() y listen()
  app.module.ts              Config, Mongo, Throttler y módulos de dominio
  app.setup.ts               configureApp(): prefijo /api, cookies, ValidationPipe, CORS
  config/env.validation.ts   Esquema Joi de variables de entorno
  common/
    mongoose/to-json.plugin.ts   _id → id y sin __v en toda respuesta
  health/                    GET /api/health (público)
  auth/
    auth.module.ts
    auth.controller.ts
    auth.service.ts
    auth.guard.ts            Guard global (APP_GUARD): cookie exo_session + sessionVersion
    auth.constants.ts
    user.repository.ts
    schemas/user.schema.ts
    dto/
    decorators/              @Public(), @CurrentUser()
  <dominio>/                 Mismo patrón: module, controller, service, repository, schemas/, dto/
test/
  utils/create-test-app.ts   App de test: Mongo en memoria + configureApp + throttler desactivado
  <dominio>.e2e-spec.ts
```

## Reglas

1. **Tres capas siempre.** Controller → Service → Repository. Sin atajos, aunque el endpoint sea trivial.
2. **Validación en el borde.** Todo body pasa por un DTO con `class-validator`. El `ValidationPipe` global rechaza campos extra (`forbidNonWhitelisted`).
3. **Propiedad.** Toda consulta de un recurso del usuario filtra por `userId` en el repositorio. Si el recurso no es suyo, responde `404`.
4. **Operaciones de un solo uso, atómicas.** Si una operación debe pasar una sola vez (ej. completar una recuperación), el repositorio usa un `findOneAndUpdate` condicionado al estado esperado, no leer y después guardar.
5. **Secretos fuera de las respuestas.** Los campos sensibles (`authVerifier`, `recoveryVerifier`) llevan `select: false` en el schema, y ningún servicio los devuelve.
6. **Sin logs de cuerpos** en `/auth/*` ni en `/secrets`.
7. **Configuración solo por `ConfigService`.** Nada de leer `process.env` fuera de `config/` y de los tests.
8. **ESM:** imports relativos con extensión `.js`.
9. **Tests e2e por módulo** en `test/<dominio>.e2e-spec.ts` usando `createTestApp()`. Cubren cada endpoint con su caso feliz y sus errores (400, 401, 403, 404, 409).
10. **Comandos de verificación:** `pnpm build`, `pnpm lint` (oxlint), `pnpm test` y `pnpm test:e2e` (Vitest) deben pasar antes de cada commit.

## Cómo agregar un módulo de dominio

1. Schema en `schemas/` con los campos de [06-modelo-datos](06-modelo-datos.md) e índices.
2. Repository con los métodos de acceso que necesita el servicio, todos filtrando por `userId`.
3. DTOs en `dto/` para cada body.
4. Service con las reglas y las excepciones HTTP.
5. Controller con las rutas de [07-api](07-api.md).
6. Registrar el módulo en `app.module.ts`.
7. `test/<dominio>.e2e-spec.ts`.
8. Actualiza este documento y `07-api` si cambió algo del contrato.

## Estado

| Módulo | Estado |
|---|---|
| Base (config, Mongo, health, `configureApp`) | Hecho |
| `AuthModule` | Hecho. Pendiente: extraer `UserRepository`, hacer atómicos `recovery/complete` y `change-passphrase`, quitar el `ConfigService` sin usar de `AuthService`. |
| `ProjectsModule` | Pendiente |
| `EnvironmentsModule` + `SecretsModule` | Pendiente |
| `DocsModule` | Pendiente |
