# Arquitectura del frontend

Cómo se organiza el código de este repo (SvelteKit, Svelte 5 con runes, JavaScript). Es la referencia obligatoria antes de crear o mover cualquier archivo en `src/`. Para el stack general, ver [05-stack](05-stack.md).

## Capas

Cada capa solo usa la de abajo. Nunca al revés, nunca saltándose una.

```
routes/              Páginas: componen componentes y cargan datos. Sin lógica de negocio.
   │
lib/components/      Presentación: reciben datos por props y avisan con callbacks.
   │
lib/state/           Estado compartido entre pantallas (runes en *.svelte.js).
   │
lib/api/             Acceso a datos: un adaptador mock hoy, HTTP contra exocortex-api después.
lib/crypto/          Derivación de claves y cifrado de secretos (ver 06-modelo-datos).
   │
lib/domain/          Constantes y reglas puras del dominio (clusters, estados, carga del nodo).
lib/utils/           Funciones puras sin dominio (zoom, portapapeles, fechas).
```

| Capa | Puede importar | No puede importar |
|---|---|---|
| `routes/` | components, state, api, domain, utils | `lib/data/` directo |
| `components/` | otros components, domain, utils, state (solo UI: toast) | api, data, crypto |
| `state/` | api, crypto, domain, utils | components |
| `api/` | data (solo el adaptador mock), domain | components, state |
| `domain/`, `utils/` | otros archivos de domain/utils | todo lo demás |

La consecuencia buscada: **cambiar el mock por el backend real solo toca `lib/api/`.**

## Estructura de carpetas

```
src/
  app.css                       Tokens, reset, base, fondos y utilidades mínimas
  app.html
  routes/
    +layout.svelte
    +page.svelte                Constelación (home)
    onboarding/+page.svelte
    unlock/+page.svelte
    projects/new/+page.svelte
    projects/[id]/+page.svelte
  lib/
    api/                        index.js (adaptador activo), mock.js, http.js
    crypto/
    data/                       mock-projects.js (solo lo importa api/mock.js)
    domain/                     constants.js, project.js
    state/                      toast.svelte.js, …
    utils/                      clipboard.js, zoom.js, format.js, passphrase.js
    assets/
    components/
      ui/                       Primitivas sin dominio
      constellation/            Vista de constelación
      project/                  Proyecto: header, panel, formulario, pestañas
        tabs/
      auth/                     Onboarding y desbloqueo
      search/                   Command palette y botón de búsqueda
```

## Inventario de componentes

### `ui/`: primitivas

No saben nada de proyectos ni de secretos. Cualquier botón, input o tarjeta de la app sale de aquí.

| Componente | Props | Notas |
|---|---|---|
| `Button` | `variant` (`'primary' \| 'ghost'`, default `'ghost'`), `size` (`'md' \| 'sm'`), `block`, `type` (default `'button'`), `href`, `disabled`, `onclick`, `children` | Con `href` se renderiza como `<a>`. |
| `IconButton` | `label` (aria-label, requerido), `title`, `onclick`, `children` | Botón cuadrado de 32 px. |
| `Icon` | `name` (`'search' \| 'close' \| 'copy' \| 'fit'`), `size` (default 15) | Todos los SVG inline de la app viven aquí. |
| `Input` | `value` (`$bindable`), `type`, `id`, `placeholder`, `mono`, `...rest` | |
| `Field` | `label`, `id`, `hint`, `children` | Label + control + hint. |
| `Checkbox` | `checked` (`$bindable`), `children` (texto) | |
| `Badge` | `label`, `color`, `dot` | |
| `Chip` | `label`, `selected`, `onclick` | Toggle redondo (stack). |
| `Pill` | `label`, `selected`, `color`, `onclick` | Opción de selección única (cluster, rol, estado). |
| `Card` | `padding` (`'md' \| 'lg'`), `children` | Superficie con `--bg-panel`, borde y `--radius-lg`. |
| `Tabs` | `tabs` (`[{ id, label }]`), `active` (`$bindable`) | |
| `NavList` | `items` (`[{ id, label }]`), `active` (`$bindable`), `mono`, `empty` | Lista lateral seleccionable. |
| `SplitPane` | snippets `side` y `children` | Lista lateral + panel; se apila bajo 760 px. |
| `Menu` | `label`, `items` (`[{ label, onselect }]`) | Botón ghost + dropdown. Cierra al elegir, con Escape o con clic fuera. |
| `Modal` | `open`, `onclose`, `children` | Escape y clic en el fondo cierran. |
| `Toast` | — | Lee `state/toast.svelte.js`. |
| `CopyButton` | `value`, `toast`, `ariaLabel` | `IconButton` + `Icon name="copy"`. |
| `EmptyState` | `children` | Texto atenuado para listas vacías. |
| `LinkButton` | `onclick`, `children` | Botón con apariencia de enlace. |
| `Fab` | `href`, `label` | Botón flotante circular. |

### `constellation/`

| Componente / módulo | Props | Responsabilidad |
|---|---|---|
| `Constellation` | `projects`, `selectedId`, `onselect`, `keyboard` (bool), `panelOpen` (bool) | Viewport con paneo y zoom: líneas, etiquetas de cluster, nodos y controles. |
| `panzoom.svelte.js` | — | Clase `PanZoom`: estado `view`, `animate`, `dragging`, `level`; handlers de rueda, pointer y teclado; `zoomIn`, `zoomOut`, `reset`. |
| `EdgeLines` | `edges` | SVG de líneas punteadas. |
| `ClusterLabel` | `cluster`, `x`, `scale`, `animate` | Etiqueta con contraescala. |
| `ConstellationNode` | `project`, `selected`, `variant`, `zoom`, `level`, `animate`, `onclick` | Círculo con brillo y halo, más la etiqueta. |
| `NodeDetail` | `project`, `level` | Metadatos (nivel 1) y mini-tarjeta (nivel 2). |
| `ZoomControls` | `scale`, `onzoomin`, `onzoomout`, `onreset` | |
| `Legend` | — | Leyenda inferior. |
| `HomeTopbar` | `onsearch` | Wordmark + `SearchButton`. |
| `Stars` | — | Fondo de estrellas. |

### `project/`

| Componente | Props | Responsabilidad |
|---|---|---|
| `ProjectHeader` | `project`, `addItems`, `onadd` | Volver, título, badges, salud y menú "Agregar contenido". |
| `ProjectBadges` | `project` | Cluster, rol y estado. Se usa en el header y en el panel. |
| `HealthBadge` | `health` | Operativo / caído, con pulso. |
| `WarningsBar` | `warnings`, `onadd` | Advertencias fijadas y el formulario para fijar una. |
| `ProjectPanel` | `project`, `onclose` | Panel lateral de la constelación. |
| `ProjectForm` | `onsubmit` | Formulario de nuevo proyecto. |
| `SecretRow` | `secret` (`{ key, value }`), `compact` | Clave, valor enmascarado y copiar. |
| `EnvironmentCard` | `environment` | Entorno con sus variables y "Copiar todo el .env". |
| `tabs/DocsTab` | `docs` | |
| `tabs/EnvTab` | `environments`, `onaddenv` | |
| `tabs/CodeTab` | `files` | |
| `tabs/NotesTab` | `entries` | Bitácora + copiar como Markdown. |
| `tabs/DeployTab` | `dependencies`, `checklist` | |
| `tabs/CommandsTab` | `commands`, `quickLinks` | |

### `auth/`

| Componente | Props | Responsabilidad |
|---|---|---|
| `AuthCard` | `title`, `subtitle`, `children` | Pantalla centrada con tarjeta. |
| `PassphraseStrength` | `value` | Barra de fuerza (usa `utils/passphrase.js`). |
| `RecoveryCodeBox` | `code` | Código + copiar. |
| `CreatePassphraseStep` | `oncontinue` | Paso 1 del onboarding. |
| `SaveRecoveryStep` | `code`, `ondone` | Paso 2 del onboarding. |
| `UnlockForm` | `onunlock`, `onforgot` | |
| `RecoveryForm` | `onrecover`, `onback` | |

### `search/`

| Componente | Props | Responsabilidad |
|---|---|---|
| `CommandPalette` | `open` (`$bindable`), `projects` | Búsqueda ⌘K. El atajo vive dentro del componente. |
| `SearchButton` | `onclick` | Botón "Buscar ⌘K". |

## Reglas

1. **Páginas delgadas.** Un `+page.svelte` no pasa de ~80 líneas. Si crece, falta un componente.
2. **Componentes acotados.** Fuera de `ui/`, un componente no pasa de ~150 líneas. Si crece, se parte.
3. **Datos por props.** Un componente nunca importa `api/` ni `data/`. Los datos le llegan por props, y los cambios salen por callbacks.
4. **Callbacks `on<verbo>`** en minúsculas (`onselect`, `onadd`, `onclose`). `$bindable` solo para valores de formulario y `open`.
5. **Estilos scoped.** Cada componente trae su `<style>`. `app.css` solo tiene tokens, reset, estilos base, fondos (`.cosmic-bg`, `.flat-bg`, `.page`) y utilidades mínimas (`.sr-only`, `.mono`, `.muted`, `.text-secondary`, `.text-faint`).
6. **Colores por token.** Los colores salen de variables CSS en `:root` (`app.css`) o de las constantes de `domain/constants.js`. Un color nuevo se agrega como token, no como hex dentro del componente.
7. **Sin duplicar markup.** Si el mismo bloque aparece en dos lugares, es un componente (ej. `SecretRow` en el panel y en la pestaña de entornos).
8. **Lógica pura fuera de la UI.** Cálculos sin DOM (zoom, carga del nodo, fuerza de passphrase, fechas) van en `domain/` o `utils/`, no dentro de un `.svelte`.
9. **Imports por alias** `#lib/...`, nunca rutas relativas largas (`../../`).
10. **Accesibilidad.** Todo botón solo-icono lleva `label`/`aria-label`; los diálogos llevan `role` y manejan Escape.

## Tipos (JSDoc)

El proyecto es JavaScript con `checkJs` activo. Los tipos se escriben en JSDoc y los verifica `svelte-check`.

- **Tipos del dominio** en `lib/domain/types.js` (`@typedef`): `Project`, `Environment`, `Secret`, `Doc`, `BitacoraEntry`, `CodeFile`, `Command`, `QuickLink`, `Warning`, `Dependency`, `ChecklistItem`, `Health`, `Cluster`, `Status`, `Role`. Se importan con `/** @typedef {import('#lib/domain/types.js').Project} Project */`.
- **Props de cada componente** tipadas en el `$props()`:
  ```js
  /** @type {{ label: string, color?: string, dot?: boolean }} */
  let { label, color = '#9a95a8', dot = true } = $props();
  ```
  Una prop es obligatoria solo si el componente no funciona sin ella. Todo lo que tiene default es opcional (`?`). Los snippets se tipan con `import('svelte').Snippet`, y los callbacks como funciones (`() => void`, `(name: string) => void`).
- **Datos normalizados.** Las listas de un proyecto siempre son arrays (pueden estar vacíos). La normalización ocurre al cargar los datos, no en cada componente con `?.`.
- **Prohibido:** `any`, `@ts-ignore`, `@ts-expect-error` y `@ts-nocheck`.

## Verificación

Toda tarea del frontend termina con las dos verificaciones en verde:

```bash
pnpm check   # svelte-check: 0 errores y 0 warnings
pnpm build
```

Además, cada pantalla que se toca se revisa en el navegador: el build no detecta los errores que solo aparecen en el cliente.

## Cómo agregar una pantalla o funcionalidad

1. ¿Necesita datos nuevos? Primero va el método en `lib/api/` (en mock y en http), después el estado en `lib/state/` si se comparte entre pantallas.
2. Arma la UI con primitivas de `ui/`. Si falta una primitiva, se crea en `ui/` y se documenta en la tabla de arriba.
3. Los componentes de dominio van en su carpeta (`project/`, `constellation/`…), con props explícitas.
4. La página solo compone y conecta callbacks con el estado o el api.
5. Actualiza este documento si agregaste un componente, una carpeta o una regla.

## Estado de la migración

La estructura anterior era la del prototipo: páginas monolíticas, componentes en una sola carpeta y clases globales (`.btn`, `.input`). La migración va por fases:

| Fase | Alcance | Estado |
|---|---|---|
| 1 | Carpetas `domain/`, `utils/`, `data/` y `state/`; primitivas de `ui/`; limpieza de `app.css` | Hecha |
| 1b | Tipos JSDoc del dominio y de las props; `pnpm check` en 0 | En curso |
| 2 | `constellation/` + home delgada | Pendiente |
| 3 | `project/` + páginas de proyecto delgadas | Pendiente |
| 4 | `auth/` + `search/` + onboarding/unlock delgadas | Pendiente |
| 5 | Capa `api/` + `state/` + funciones `load`; ninguna página importa datos directo | Pendiente |
