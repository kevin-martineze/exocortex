# Estructura de navegación

Borrador inicial — sujeto a cambios mientras se cierra el alcance.

```
Mente de Kevin (entrada única)
├── Personal
│   └── [lista de proyectos personales]
└── Trabajo formal
    └── [proyectos donde Kevin es colaborador o director]
        ├── Documentación
        ├── Variables de entorno (enmascaradas por defecto)
        ├── Preview de código
        └── Notas / docs del proyecto
```

## Decisiones tomadas

- **Con backend/sync, no local.** Acceso desde cualquier dispositivo. Esto implica que los secretos (env vars) viven cifrados en el backend, nunca en texto plano — ver detalle abajo.
- **Secretos con cifrado de extremo a extremo (zero-knowledge).** El backend solo almacena el valor cifrado; nunca tiene la clave para leerlo en claro. El cliente deriva la clave de una passphrase maestra que Kevin controla y que nunca se envía al servidor. Al configurar la cuenta se genera un **código de recuperación** (mostrado una sola vez) como respaldo si se pierde la passphrase — es responsabilidad de Kevin guardarlo en un lugar seguro (ej. su gestor de contraseñas). Sin passphrase ni código de recuperación, los secretos son irrecuperables por diseño.
- **Registro manual de proyectos, por ahora.** Nada de autodetección de repos — cada proyecto se agrega activamente. Mantiene la mente libre de ruido (forks, repos de prueba) acorde al principio "se alimenta con el tiempo". Queda abierto revisar autodetección (con opción de ignorar/ocultar) más adelante si el registro manual resulta tedioso.
- **Rol como metadata, no como permisos.** Cada proyecto de trabajo formal tiene un rol asignado (colaborador o director) como campo informativo al registrarlo. No cambia qué se ve ni oculta información — Kevin siempre ve todos sus proyectos completos, con su rol correspondiente visible.
- **Navegación principal: vista de constelación.** La pantalla de entrada ("la mente de Kevin") es un espacio con nodos ("moléculas") flotando, uno por proyecto, agrupados en dos clusters visuales (Personal / Trabajo formal) con líneas tenues conectando proyectos relacionados dentro del mismo cluster — inspirado en el graph view de Obsidian. Click en un nodo abre un panel lateral con el detalle del proyecto (env vars o notas según el tipo, con copy/export de un clic). **Nunca es el único mecanismo de navegación**: siempre coexiste con un command palette (⌘K) que filtra todos los proyectos por nombre, para no sacrificar "intuitivo antes que exhaustivo" cuando la mente crezca a decenas de proyectos. Validado con un prototipo interactivo.

## Decisiones pendientes

Ninguna por ahora — alcance inicial y stack cerrados. Próximo paso: modelo de datos en MongoDB y arranque de implementación.
