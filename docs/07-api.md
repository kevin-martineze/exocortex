# Contrato del API (exocortex-api)

API REST en NestJS que expone el [modelo de datos](06-modelo-datos.md). Repo: [exocortex-api](https://github.com/kevin-martineze/exocortex-api).

## Convenciones

- **Prefijo:** todas las rutas cuelgan de `/api`.
- **Formato:** JSON. Las respuestas exponen `id` (string), nunca `_id` ni `__v`.
- **Validación:** DTOs con `class-validator`. `ValidationPipe` global con `whitelist: true` y `forbidNonWhitelisted: true`.
- **Errores:** formato por defecto de Nest (`statusCode`, `message`, `error`).
- **Sesión:** JWT en la cookie `exo_session`: `httpOnly`, `Secure` (en producción), `SameSite=Strict`, `path=/`, 12 h. El payload es `{ sub, sv, typ: "session" }`, donde `sv` es el `sessionVersion` del usuario. Hay un guard global que verifica el JWT y además que `sv` coincida con el `sessionVersion` actual; las rutas públicas se marcan con `@Public()`.
- **CORS:** solo el origen del frontend (`FRONTEND_ORIGIN`), con `credentials: true`.
- **Rate limit:** `@nestjs/throttler` en las rutas `/auth/*`.
- **Logs:** nunca se registran los cuerpos de `/auth/*` ni de `/secrets`.
- **Propiedad:** toda ruta autenticada filtra por el `userId` de la sesión. Un recurso de otro usuario responde `404`, no `403`.

## Health

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Pública. `{ status: "ok", db: "up" \| "down" }`. |

## Auth

Flujo zero-knowledge, con detalle en [06-modelo-datos](06-modelo-datos.md#esquema-de-claves-patrón-bitwarden-con-dek-envuelta). Todo el Argon2id del lado del usuario corre en el cliente. El servidor solo verifica los `authHash` contra sus `authVerifier`.

| Método | Ruta | Pública | Body | Respuesta |
|---|---|---|---|---|
| GET | `/api/auth/status` | sí | — | `{ initialized: boolean }` |
| GET | `/api/auth/prelogin` | sí | — | `{ authSalt, kdfParams }`. `404` si no hay usuario. |
| POST | `/api/auth/setup` | sí | `email, kdfParams, authSalt, authHash, encryptionSalt, wrappedKeyByPassphrase, recoveryAuthSalt, recoverySalt, wrappedKeyByRecovery, recoveryAuthHash` | `201` + cookie + `{ id, email }`. `409` si ya existe un usuario. |
| POST | `/api/auth/login` | sí | `{ authHash }` | `200` + cookie + `{ encryptionSalt, wrappedKeyByPassphrase }`. `401` si no coincide o no hay usuario. |
| POST | `/api/auth/logout` | no | — | `204`. Borra la cookie. |
| GET | `/api/auth/me` | no | — | `{ id, email }` |
| GET | `/api/auth/recovery/prelogin` | sí | — | `{ recoveryAuthSalt, kdfParams }`. `404` si no hay usuario. |
| POST | `/api/auth/recovery/start` | sí | `{ recoveryAuthHash }` | `200` + `{ recoveryToken, recoverySalt, wrappedKeyByRecovery }`. `401` si no coincide. |
| POST | `/api/auth/recovery/complete` | sí | `recoveryToken`, más la passphrase nueva (`authSalt, authHash, encryptionSalt, wrappedKeyByPassphrase`) y el código de recuperación nuevo (`recoveryAuthSalt, recoverySalt, wrappedKeyByRecovery, recoveryAuthHash`) | `200` + cookie + `{ id, email }`. `401` si el token es inválido, venció o ya se usó. |
| POST | `/api/auth/change-passphrase` | no | `currentAuthHash`, más `authSalt, authHash, encryptionSalt, wrappedKeyByPassphrase` | `204` + cookie nueva. `403` si `currentAuthHash` no coincide. Cierra las demás sesiones. |

**Flujo de recuperación.** `recovery/start` verifica el código y recién entonces entrega la DEK envuelta. Con ella, el cliente desenvuelve la DEK, arma la passphrase y el código nuevos, y llama a `recovery/complete`.

El `recoveryToken` es un JWT `{ sub, rv, typ: "recovery" }` que dura 10 min. `rv` es una huella del `recoveryVerifier` actual: al completar, el verificador cambia y el token deja de servir, así que es de un solo uso.

`recovery/complete` y `change-passphrase` suben `sessionVersion`, lo que invalida todas las sesiones anteriores.

## Proyectos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/projects` | Lista con todos los campos más `load` (la carga del nodo). Query opcional: `cluster`, `status`. |
| POST | `/api/projects` | Crea un proyecto. Requiere `title` y `cluster`. `role` solo se acepta si `cluster = "trabajo"`. |
| GET | `/api/projects/:id` | Devuelve el detalle con las listas embebidas. |
| PATCH | `/api/projects/:id` | Edita `title, cluster, role, status, stack, links, position, related, health.url`. |
| DELETE | `/api/projects/:id` | `204`. Borra en cascada (ver modelo). |

### Listas embebidas

Siguen un mismo patrón para `:list` ∈ `commands | quick-links | warnings | dependencies | checklist`:

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/projects/:id/:list` | Agrega un ítem y devuelve el ítem creado. |
| PATCH | `/api/projects/:id/:list/:itemId` | Edita el ítem (en el checklist, también `done`). |
| DELETE | `/api/projects/:id/:list/:itemId` | `204` |
| PUT | `/api/projects/:id/:list/order` | `{ ids: [...] }` reordena la lista. |

Cada lista tiene su DTO:
- `commands`: `label`, `command`
- `quick-links`: `label`, `url`
- `warnings`: `text`
- `dependencies`: `name`, `version`, `reason`
- `checklist`: `text`, `done`

## Entornos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/projects/:id/environments` | Lista los entornos del proyecto. |
| POST | `/api/projects/:id/environments` | `{ name, url? }` |
| PATCH | `/api/environments/:envId` | `{ name?, url? }` |
| DELETE | `/api/environments/:envId` | `204`. Borra sus secretos. |

## Secretos

El servidor solo recibe y devuelve `key`, `ciphertext` e `iv`. Valida que `ciphertext` e `iv` sean base64, pero nunca intenta descifrarlos.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/environments/:envId/secrets` | `[{ id, key, ciphertext, iv }]` |
| POST | `/api/environments/:envId/secrets` | `{ key, ciphertext, iv }`. `409` si `key` ya existe en ese entorno. |
| POST | `/api/environments/:envId/secrets/bulk` | `{ secrets: [...] }`. Sirve para importar un `.env` pegado. Hace upsert por `key`. |
| PATCH | `/api/secrets/:id` | `{ key?, ciphertext?, iv? }` |
| DELETE | `/api/secrets/:id` | `204` |

## Docs y bitácora

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/projects/:id/docs?type=doc\|bitacora` | La bitácora sale ordenada por `entryDate` descendente. |
| POST | `/api/projects/:id/docs` | `{ type, title?, entryDate?, contentMarkdown }` |
| GET | `/api/docs/:docId` | Devuelve un doc. |
| PATCH | `/api/docs/:docId` | Edita `title`, `entryDate` o `contentMarkdown`. |
| DELETE | `/api/docs/:docId` | `204` |

## Después (fuera de la primera entrega)

- `GET /api/search?q=`: búsqueda global para ⌘K (proyectos más el índice de texto de docs).
- `GET /api/export` y `GET /api/projects/:id/export`: export portátil. Los secretos salen como ciphertext; el cliente los descifra si el usuario lo pide.
- `GithubModule`: OAuth, árbol de archivos y contenido en vivo.
- Health-check de proyectos: un job con `@nestjs/schedule` que revisa `health.url` y actualiza `up` y `lastChecked`.

## Orden de construcción

1. Base del proyecto: config, Mongo, health, validación, tests.
2. `AuthModule`.
3. `ProjectsModule` con las listas embebidas.
4. `EnvironmentsModule` y `SecretsModule`.
5. `DocsModule`.
6. Búsqueda, export, GitHub y health-check de proyectos.
