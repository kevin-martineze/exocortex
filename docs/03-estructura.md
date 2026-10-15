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

## Decisiones pendientes

- **Vista por rol.** Si Kevin es "colaborador" en un proyecto, ¿ve menos que si es "director"? ¿Esto aplica incluso siendo él el único usuario, o es solo metadata informativa?
- **Local vs. con backend/sync.** Ver [visión](01-vision.md) — define directamente cómo se manejan los secretos (env vars) y si hay acceso remoto.
- **Qué entra como "proyecto".** ¿Cualquier repo, o solo los que Kevin decide registrar activamente?
