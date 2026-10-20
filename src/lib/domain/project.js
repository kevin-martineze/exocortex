import { CLUSTERS } from './constants.js';

// Carga de contenido 0-10: proxy de docs + notas + secretos + entornos.
// Determina el brillo del nodo en la constelación.
export function projectLoad(project) {
	const varCount = (project.environments || []).reduce(
		(n, env) => n + (env.vars?.length || 0),
		0
	);
	const total =
		(project.docs?.length || 0) +
		(project.bitacora?.length || 0) +
		varCount +
		(project.environments?.length || 0);
	return Math.max(0, Math.min(10, total));
}

// Resumen para los niveles de detalle de la constelación.
export function projectStats(project) {
	const envs = project.environments || [];
	const checklist = project.checklist || [];
	const bitacora = [...(project.bitacora || [])].sort((a, b) => b.date.localeCompare(a.date));
	return {
		docs: project.docs?.length || 0,
		notas: bitacora.length,
		entornos: envs.length,
		secretos: envs.reduce((n, e) => n + (e.vars?.length || 0), 0),
		warnings: project.warnings?.length || 0,
		checklistDone: checklist.filter((c) => c.done).length,
		checklistTotal: checklist.length,
		lastEntry: bitacora[0] ?? null
	};
}

export function envBlock(environment) {
	return (environment.vars || [])
		.map((v) => `${v.key}=${v.value}`)
		.join('\n');
}

// Líneas de conexión entre proyectos relacionados del mismo cluster (deduplicadas).
export function projectEdges(projects) {
	const edges = [];
	const seen = new Set();
	for (const p of projects) {
		for (const relId of p.related || []) {
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
