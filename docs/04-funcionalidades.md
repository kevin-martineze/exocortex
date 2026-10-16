# Ideas de funcionalidades

Brainstorm acumulado. Ninguna de estas está confirmada como parte del alcance — son candidatas a filtrar cuando se cierre la visión.

## Copiado y exportación (prioridad máxima)

Esta sección manda sobre las demás: si una funcionalidad no permite copiar/exportar su contenido fácilmente, está incompleta.

- **Copiar credencial individual** — botón de copiar junto a cada variable de entorno, sin necesidad de revelarla visualmente primero (se copia el valor real aunque en pantalla se vea enmascarada).
- **Copiar bloque `.env` completo** — un botón "copiar todo" que arma el `KEY=VALUE` línea por línea, listo para pegar en un archivo `.env`.
- **Copiar documento como Markdown** — cualquier doc/nota se copia en crudo (Markdown), no como texto renderizado, para poder pegarlo en otro lado tal cual.
- **Exportar un proyecto completo** — empaquetar docs + notas + env vars (opcional, con advertencia si incluye secretos) en un export portátil (ej. `.zip` o carpeta).
- **Exportar "todo"** — un export global de la mente completa, pensado como respaldo o migración, no solo como conveniencia puntual.
- **Riesgo a tener en cuenta:** los gestores de portapapeles del sistema (Universal Clipboard, Raycast, Paste, etc.) pueden persistir y sincronizar lo copiado a otros dispositivos. Vale la pena considerar un auto-clear del portapapeles después de N segundos cuando se copia una credencial — el mismo patrón que usan 1Password/Bitwarden.

## Por proyecto

- Estado/salud (activo, pausado, archivado) con indicador visual
- Entornos **con categorías libres** (no un enum fijo — QA, Testing, Pre-producción, Demo, etc., creadas sobre la marcha), cada uno con sus propios env vars y URL
- Variables de entorno enmascaradas por defecto (mostrar/ocultar), nunca en texto plano en el preview
- Enlaces rápidos: repo (GitHub/GitLab), tablero (Jira/Linear/Notion), CI/CD
- Stack tecnológico (tags: Node, NestJS, React, Svelte, etc.)
- Acciones rápidas: abrir en VS Code, abrir terminal aquí, ver PRs pendientes
- Preview de código (navegar archivos sin clonar/abrir el editor)
- Bitácora/notas tipo diario — decisiones, bloqueos, ideas sueltas
- Diagrama de arquitectura (Markdown + Mermaid embebido)

### Validado en prototipo interactivo — listo para implementar

- **Comandos frecuentes** — ej. "levantar en local", "correr migraciones", cada uno copiable en un clic.
- **Enlaces rápidos ad-hoc** — distintos de los 3 fijos (repo/board/cicd): Swagger, Grafana, Sentry, lo que aplique por proyecto.
- **Advertencias fijadas ("no tocar sin leer esto")** — banner visible en cualquier pestaña de la vista de proyecto, distinto de la bitácora normal, para gotchas críticos que no se deben perder entre notas viejas.
- **Dependencias críticas con versión fijada** — nombre + versión + razón (ej. "Node 20.x, no subir a 22: breaking change en el ORM").
- **Checklist de deploy** — pasos con checkbox antes de pushear a producción, visible en la vista de proyecto.
- **Health-check / estado del servicio** — indicador de si el servicio está operativo o caído, de un vistazo en el header de la vista de proyecto.

## Transversal (toda la app)

- Búsqueda global tipo command palette (⌘K) — salta a cualquier proyecto/doc/variable
- Favoritos/pinned — proyectos activos siempre arriba
- Timeline de actividad reciente
- Vista por rol (colaborador vs. director) con permisos/vistas distintas
- Integraciones: GitHub (PRs, issues), Notion (docs existentes), Slack (notificaciones)

## Preguntas abiertas que afectan el alcance

- ¿Es una app local (lee el filesystem directo, cero riesgo de exponer secretos) o tiene backend/sync para acceso remoto?
- ¿Cuántas de estas funcionalidades son "v1" vs. "algún día"?
