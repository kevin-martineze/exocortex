# Modelo de datos (MongoDB)

Colecciones del backend ([exocortex-api](https://github.com/kevin-martineze/exocortex-api)). Nombres de campo en inglés (convención de código), prosa en español. El contrato HTTP que expone estas colecciones está en [07-api.md](07-api.md).

## Decisiones de modelado

- **Listas cortas embebidas en `projects`.** Comandos, enlaces rápidos, advertencias fijadas, dependencias críticas, checklist de deploy y relaciones entre proyectos viven dentro del documento del proyecto. Son listas pequeñas que siempre se leen junto con el proyecto.
- **Colecciones propias para lo que crece o se cifra aparte:** `environments`, `secrets` y `docs` (docs + bitácora).
- **`notes` del mock desaparece.** Las notas libres de un proyecto son un doc más (`type: "doc"`), y la bitácora son docs con `type: "bitacora"`.
- **`locked` del mock se elimina.** No forma parte del alcance.
- **El preview de código no se guarda.** Se lee en vivo de la GitHub API (ver [stack](05-stack.md)); el `codeFiles` del mock es solo para maquetar.
- **IDs:** `_id` de Mongo en la base; las respuestas del API lo exponen como `id` (string). Los subdocumentos embebidos también tienen `_id` propio.
- **Timestamps:** `createdAt` / `updatedAt` automáticos (`timestamps: true` en Mongoose).

## Decisiones de cifrado

- **`secrets`**: cifrado de extremo a extremo (zero-knowledge) — ver [estructura](03-estructura.md). El backend solo almacena ciphertext.
- **`docs`**: texto plano. No son credenciales; cifrarlos complicaría la búsqueda full-text sin ganar protección relevante.
- **Token de GitHub** (en `integrations`): cifrado server-side (AWS KMS o clave en variable de entorno), no con el esquema E2E — es un token de servicio, no un secreto personal del usuario.

### Esquema de claves (patrón Bitwarden, con DEK envuelta)

Los secretos **no** se cifran con una clave derivada directamente de la passphrase. Se cifran con una **DEK** (data encryption key) aleatoria de 256 bits generada en el cliente durante el onboarding. Esa DEK se guarda en el servidor **envuelta dos veces**:

1. Con la **clave de la passphrase** (`Argon2id(passphrase, encryptionSalt)`).
2. Con la **clave del código de recuperación** (`Argon2id(recoveryCode, recoverySalt)`).

Consecuencias:

- **El código de recuperación sí recupera los secretos:** desenvuelve la DEK y permite fijar una passphrase nueva.
- **Cambiar la passphrase no re-cifra los secretos:** solo se vuelve a envolver la DEK.
- **El servidor nunca ve en claro** la passphrase, el código de recuperación, la DEK ni los secretos.

Para autenticarse, el cliente deriva por separado un `authHash` (`Argon2id(passphrase, authSalt)`) y lo envía al servidor. El servidor **no lo guarda tal cual**: guarda `argon2id(authHash)` con salt propio del servidor (`authVerifier`). Si roban la base, el valor guardado no sirve para iniciar sesión. Lo mismo aplica al código de recuperación (`recoveryVerifier`).

El código de recuperación sigue el mismo patrón que la passphrase: de él salen **dos** derivaciones con salts distintos. `recoveryAuthHash = Argon2id(código, recoveryAuthSalt)` lo autentica ante el servidor, y `Argon2id(código, recoverySalt)` es la clave que envuelve la DEK.

El código de recuperación es **de un solo uso**: al recuperar, el cliente genera uno nuevo y reenvía `recoveryAuthSalt`, `recoverySalt`, `wrappedKeyByRecovery` y `recoveryAuthHash`.

## Colecciones

### `users`
Un solo documento en la práctica (app personal, un usuario), modelado como colección para no cerrar la puerta a futuro.

```
{
  _id,
  email,
  kdfParams: { algorithm: "argon2id", memory, iterations, parallelism },

  // Autenticación de sesión
  authSalt,                 // salt del cliente para derivar authHash
  authVerifier,             // argon2id(authHash) calculado en el servidor

  // Cifrado de secretos
  encryptionSalt,           // salt del cliente para derivar la clave de la passphrase
  wrappedKeyByPassphrase: { ciphertext, iv },   // DEK cifrada (AES-GCM) con la clave de la passphrase

  // Recuperación
  recoveryAuthSalt,         // salt del cliente para derivar recoveryAuthHash
  recoverySalt,             // salt del cliente para derivar la clave que envuelve la DEK
  wrappedKeyByRecovery: { ciphertext, iv },     // DEK cifrada con la clave del código de recuperación
  recoveryVerifier,         // argon2id(recoveryAuthHash) calculado en el servidor

  sessionVersion: Number,   // sube al cambiar passphrase o recuperar; invalida todas las sesiones abiertas

  createdAt,
  updatedAt
}
```

`authVerifier` y `recoveryVerifier` usan `select: false`: nunca salen en una consulta salvo que se pidan explícitamente, y nunca se devuelven en una respuesta.

Todos los valores binarios viajan y se guardan en base64 estándar con padding, con longitudes fijas:

| Valor | Bytes | Largo en base64 |
|---|---|---|
| Salts (`authSalt`, `encryptionSalt`, `recoveryAuthSalt`, `recoverySalt`) | 16 | 24 |
| Hashes del cliente (`authHash`, `recoveryAuthHash`) | 32 | 44 |
| `iv` (AES-GCM) | 12 | 16 |
| DEK envuelta (`wrappedKey*.ciphertext`: 32 de clave + 16 de tag) | 48 | 64 |

### `projects`

```
{
  _id,
  userId,
  title,
  cluster: "personal" | "trabajo",
  role: "colaborador" | "director" | null,   // solo aplica a cluster "trabajo"
  status: "activo" | "pausado" | "archivado",
  stack: [String],          // tags libres: "Node", "NestJS", "Svelte", etc.
  links: {
    repo: String,
    board: String,          // Jira/Linear/Notion
    cicd: String
  },
  position: { x: Number, y: Number },   // posición en la constelación, en % (0–100)
  related: [ObjectId],      // otros proyectos del mismo cluster (líneas de la constelación)

  commands:     [{ _id, label, command }],
  quickLinks:   [{ _id, label, url }],
  warnings:     [{ _id, text }],
  dependencies: [{ _id, name, version, reason }],
  checklist:    [{ _id, text, done: Boolean }],

  health: {
    url: String | null,     // endpoint que se revisa; null = sin health-check
    up: Boolean | null,     // último resultado
    lastChecked: Date | null
  },

  createdAt,
  updatedAt
}
```

### `environments`
Entornos por proyecto — **categorías libres, no un enum fijo**. Dev/Staging/Prod son solo ejemplos; cada proyecto puede tener las que necesite (QA, Testing, Pre-producción, Demo, Sandbox de un cliente, etc.).

```
{
  _id,
  projectId,
  name: String,   // texto libre, ej. "QA", "Pre-producción"
  url: String,
  createdAt,
  updatedAt
}
```

### `secrets`
Cada secreto se cifra individualmente con la DEK (no el bloque completo), para poder copiar uno solo sin descifrar el resto.

```
{
  _id,
  projectId,
  environmentId,
  key,              // nombre de la variable, en claro (ej. "DATABASE_URL") — no es sensible por sí mismo
  ciphertext,       // valor cifrado (AES-GCM con la DEK), base64
  iv,               // vector de inicialización, único por secreto, base64
  createdAt,
  updatedAt
}
```

### `docs`
Documentación, notas y bitácora del proyecto — unificadas con un campo `type`.

```
{
  _id,
  projectId,
  type: "doc" | "bitacora",
  title,             // requerido en "doc"; opcional en "bitacora"
  entryDate,         // solo "bitacora": fecha de la entrada (YYYY-MM-DD)
  contentMarkdown,   // texto plano, copiable crudo tal cual
  createdAt,
  updatedAt
}
```

### `integrations`
Credenciales de servicios externos (GitHub por ahora), separadas de `secrets` porque su modelo de cifrado es distinto (server-side, no E2E).

```
{
  _id,
  userId,
  provider: "github",
  accessTokenEncrypted,   // cifrado server-side (KMS / env key), no con la passphrase
  scope,
  createdAt,
  updatedAt
}
```

## Carga del nodo (brillo en la constelación)

No se guarda. `GET /projects` la calcula por proyecto con una agregación: cantidad de docs, notas de bitácora, secretos y entornos (ver [estructura](03-estructura.md)).

## Índices

- `projects`: `{ userId: 1 }`
- `environments`: `{ projectId: 1 }`
- `secrets`: `{ environmentId: 1, key: 1 }` único (no se repite una variable dentro de un entorno), más `{ projectId: 1 }`
- `docs`: `{ projectId: 1, type: 1 }`; índice de texto en `title` + `contentMarkdown` para la búsqueda global
- `integrations`: `{ userId: 1, provider: 1 }` único

## Borrado en cascada

- Borrar un proyecto borra sus `environments`, `secrets` y `docs`, y lo quita de `related` en los demás proyectos.
- Borrar un entorno borra sus `secrets`.
