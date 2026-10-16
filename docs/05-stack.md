# Stack técnico

## Decisiones tomadas

- **Frontend: SvelteKit.** No Svelte+Vite puro — se aprovecha el routing y la estructura de proyecto ya resueltos, natural para una app con varias vistas (Personal/Trabajo formal, por proyecto, docs, env vars).
- **Backend: NestJS.**
- **Base de datos: MongoDB.**
- **Alcance de dispositivos (v1): web responsive.** Una sola app web que funciona bien en desktop y mobile por navegador — sin PWA instalable ni apps nativas por ahora. Cubre "acceso desde cualquier dispositivo" sin el trabajo adicional de service workers o desarrollo nativo.
- **Preview de código: integración con GitHub API.** OAuth con GitHub; se lee el árbol de archivos y su contenido en vivo vía la API — no se clona ni se guarda copia del código en el backend.
- **Hosting: AWS, instancia EC2 con Docker.** Backend (NestJS) y MongoDB corren como contenedores Docker (docker-compose) en una instancia EC2 — no servicios managed como Fargate/ECS o MongoDB Atlas. Kevin administra el servidor directamente (deploy, backups de Mongo, TLS).

## Arquitectura y patrones

- **Repos separados.** No monorepo. Los tipos/DTOs compartidos se sincronizan a mano o se publican como paquete si llega a doler.
  - **Frontend (SvelteKit):** este mismo repo — [exocortex](https://github.com/kevin-martineze/exocortex).
  - **Backend (NestJS):** [exocortex-api](https://github.com/kevin-martineze/exocortex-api).
- **Backend: monolito modular por dominio.** Un módulo Nest por dominio (`AuthModule`, `ProjectsModule`, `SecretsModule`, `DocsModule`, `GithubModule`), cada uno con capas Controller → Service → Repository. El Repository envuelve los schemas de Mongoose, aislando la persistencia.
- **Validación:** DTOs + `class-validator`.
- **API: REST.** Sin GraphQL — un solo frontend consumidor (propio) no justifica la complejidad de un schema GraphQL.
- **Frontend:** Svelte stores para estado de UI; capa de cliente API separada de los componentes (nada de fetch directo embebido en componentes).
- **Derivación de clave para cifrado de secretos: Argon2id vía WASM** (ej. `argon2-browser`) en el cliente, en vez de PBKDF2 nativo — más resistente a fuerza bruta si el ciphertext es robado, a cambio de una dependencia WASM en el cliente.
