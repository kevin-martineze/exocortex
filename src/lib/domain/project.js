import { CLUSTERS } from './constants.js';

/** @typedef {import('#lib/domain/types.js').Project} Project */
/** @typedef {import('#lib/domain/types.js').Environment} Environment */
/** @typedef {import('#lib/domain/types.js').BitacoraEntry} BitacoraEntry */
/** @typedef {import('#lib/domain/types.js').Edge} Edge */

// Carga de contenido 0-10: proxy de docs + notas + secretos + entornos.
// Determina el brillo del nodo en la constelación.
/** @param {Project} project @returns {number} */
export function projectLoad(project) {
	const varCount = project.environments.reduce((n, env) => n + env.vars.length, 0);
	const total = project.docs.length + project.bitacora.length + varCount + project.environments.length;
	return Math.max(0, Math.min(10, total));
}

// Resumen para los niveles de detalle de la constelación.
/**
 * @param {Project} project
 * @returns {{ docs: number, notas: number, entornos: number, secretos: number, warnings: number, checklistDone: number, checklistTotal: number, lastEntry: BitacoraEntry | null }}
 */
export function projectStats(project) {
	const envs = project.environments;
	const checklist = project.checklist;
	const bitacora = [...project.bitacora].sort((a, b) => b.date.localeCompare(a.date));
	return {
		docs: project.docs.length,
		notas: bitacora.length,
		entornos: envs.length,
		secretos: envs.reduce((n, e) => n + e.vars.length, 0),
		warnings: project.warnings.length,
		checklistDone: checklist.filter((c) => c.done).length,
		checklistTotal: checklist.length,
		lastEntry: bitacora[0] ?? null
	};
}

/** @param {Environment} environment @returns {string} */
export function envBlock(environment) {
	return environment.vars.map((v) => `${v.key}=${v.value}`).join('\n');
}

// Líneas de conexión entre proyectos relacionados del mismo cluster (deduplicadas).
/** @param {Project[]} projects @returns {Edge[]} */
export function projectEdges(projects) {
	/** @type {Edge[]} */
	const edges = [];
	/** @type {Set<string>} */
	const seen = new Set();
	for (const p of projects) {
		for (const relId of p.related) {
			const other = projects.find((x) => x.id === relId);
			if (!other) continue;
			const key = [p.id, other.id].sort().join('--');
			if (seen.has(key)) continue;
			seen.add(key);
			edges.push({
				key,
				x1: p.position.x,
				y1: p.position.y,
				x2: other.position.x,
				y2: other.position.y,
				color: CLUSTERS[p.cluster].color
			});
		}
	}
	return edges;
}
