# Ideas de funcionalidades

Brainstorm acumulado. Ninguna de estas está confirmada como parte del alcance — son candidatas a filtrar cuando se cierre la visión.

## Por proyecto

- Estado/salud (activo, pausado, archivado) con indicador visual
- Entornos (dev/staging/prod) con sus propios env vars y URLs
- Variables de entorno enmascaradas por defecto (mostrar/ocultar), nunca en texto plano en el preview
- Enlaces rápidos: repo (GitHub/GitLab), tablero (Jira/Linear/Notion), CI/CD
- Stack tecnológico (tags: Node, NestJS, React, Svelte, etc.)
- Acciones rápidas: abrir en VS Code, abrir terminal aquí, ver PRs pendientes
- Preview de código (navegar archivos sin clonar/abrir el editor)
- Bitácora/notas tipo diario — decisiones, bloqueos, ideas sueltas
- Diagrama de arquitectura (Markdown + Mermaid embebido)

## Transversal (toda la app)

- Búsqueda global tipo command palette (⌘K) — salta a cualquier proyecto/doc/variable
- Favoritos/pinned — proyectos activos siempre arriba
- Timeline de actividad reciente
- Vista por rol (colaborador vs. director) con permisos/vistas distintas
- Integraciones: GitHub (PRs, issues), Notion (docs existentes), Slack (notificaciones)

## Preguntas abiertas que afectan el alcance

- ¿Es una app local (lee el filesystem directo, cero riesgo de exponer secretos) o tiene backend/sync para acceso remoto?
- ¿Cuántas de estas funcionalidades son "v1" vs. "algún día"?
