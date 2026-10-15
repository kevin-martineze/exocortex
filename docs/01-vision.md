# Visión y problema

## El problema

Kevin trabaja en múltiples proyectos a la vez — personales y de trabajo formal (como colaborador o director) — y la información de cada uno vive dispersa: repos distintos, docs en distintos lugares, variables de entorno en archivos sueltos, notas sin un hogar fijo. No existe un punto de entrada único e intuitivo para acceder a "todo lo que tengo en marcha".

## La idea

Un punto de entrada único — la "mente de Kevin" — desde el cual se accede a todo lo demás. Al entrar, la primera decisión es simple: **¿personal o trabajo formal?** A partir de ahí la app se va "alimentando": cada proyecto que se agrega queda disponible para consultar en el futuro, sin tener que recordar dónde quedó cada cosa.

Es, en esencia, un segundo cerebro (de ahí el nombre **Exocortex**) enfocado en proyectos de desarrollo: no reemplaza un gestor de tareas genérico, sino que centraliza el contexto técnico y organizativo de cada proyecto en un solo lugar navegable.

## Principios de diseño

- **Intuitivo antes que exhaustivo.** Si hay que pensar cómo navegar, ya falló.
- **Se alimenta con el tiempo.** No se llena todo de una vez; crece proyecto por proyecto.
- **Personal primero.** Es una herramienta para un solo usuario (Kevin), no un producto multiusuario desde el día uno.
- **Seguridad de secretos por defecto.** Si va a mostrar variables de entorno reales, el riesgo de exposición debe resolverse en el diseño, no como ocurrencia tardía.
- **Copiar y exportar es de primera clase.** Entrar a la mente y no poder sacar lo que necesitas (una credencial, un doc, un proyecto completo) de forma inmediata es un fallo del producto, no un detalle pendiente. Cada pieza de información debe poder copiarse o exportarse en uno o dos clics.
