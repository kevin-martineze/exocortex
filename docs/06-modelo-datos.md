# Modelo de datos (MongoDB)

Borrador inicial de colecciones. Nombres de campo en inglés (convención de código), prosa en español.

## Decisiones de cifrado por colección

- **`secrets`**: cifrado de extremo a extremo (zero-knowledge) — ver [estructura](03-estructura.md). El backend solo almacena ciphertext.
- **`docs`**: texto plano. No son credenciales; cifrarlos complicaría búsqueda full-text sin ganar protección relevante.
- **Token de GitHub** (en `integrations`): cifrado server-side (ej. AWS KMS o clave en variable de entorno), no con el esquema E2E — es un token de servicio, no un secreto personal del usuario.

## Colecciones

### `users`
Un solo documento en la práctica (app personal, un usuario), pero modelado como colección para no cerrar la puerta a futuro.

```
{
  _id,
  email,
  authHash,        // derivado de la passphrase (Argon2id, salt+params propios) — NO es la clave de cifrado
  authSalt,
  kdfParams: { algorithm: "argon2id", memory, iterations, parallelism },
  encryptionSalt,  // salt separado para derivar la clave de cifrado de secretos (misma passphrase, derivación distinta a authHash)
  recoveryCodeHash,
  createdAt
}
```

Patrón tipo Bitwarden: la misma passphrase deriva **dos** valores distintos — uno para autenticar sesión (`authHash`, sí viaja al servidor) y otro para la clave de cifrado de secretos (nunca viaja al servidor). Así el servidor nunca ve ni almacena la clave real.

### `projects`

```
{
  _id,
  userId,
  title,
  cluster: "personal" | "trabajo",
  role: "colaborador" | "director" | null,   // solo aplica a cluster "trabajo"
  status: "activo" | "pausado" | "archivado",
  stack: [String],       // tags: "Node", "NestJS", "Svelte", etc.
  links: {
    repo: String,
    board: String,       // Jira/Linear/Notion
    cicd: String
  },
  position: { x: Number, y: Number },  // posición fija en la vista de constelación
  createdAt,
  updatedAt
}
```

### `environments`
Entornos por proyecto (dev/staging/prod), cada uno con su propia URL y sus propios secretos.

```
{
  _id,
  projectId,
  name: "dev" | "staging" | "prod",
  url,
  createdAt
}
```

### `secrets`
Cada secreto cifrado individualmente (no el bloque completo), para poder copiar uno solo sin descifrar el resto en memoria más de lo necesario.

```
{
  _id,
  projectId,
  environmentId,
  key,              // nombre de la variable, en claro (ej. "DATABASE_URL") — no es sensible por sí mismo
  ciphertext,       // valor cifrado (AES-GCM)
  iv,               // vector de inicialización, único por secreto
  createdAt,
  updatedAt
}
```

### `docs`
Documentación y notas/bitácora del proyecto — unificadas con un campo `type`.

```
{
  _id,
  projectId,
  type: "doc" | "bitacora",
  title,
  contentMarkdown,   // texto plano, copiable crudo tal cual (ver principio de copy/export)
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
  accessTokenEncrypted,   // cifrado server-side (KMS / env key), no con la passphrase del usuario
  scope,
  createdAt
}
```

## Pendiente

- Índices (ej. `projects.userId`, `secrets.projectId + environmentId`) — se definen al implementar, no es una decisión de alcance.
- Validación de esquema (Mongoose schemas) vive en el código del backend, no aquí.
