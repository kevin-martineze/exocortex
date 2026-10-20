/** @typedef {import('#lib/domain/types.js').Cluster} Cluster */
/** @typedef {import('#lib/domain/types.js').Status} Status */
/** @typedef {import('#lib/domain/types.js').Role} Role */

/** @type {Record<Cluster, { label: string, color: string, labelColor: string }>} */
export const CLUSTERS = {
	personal: { label: 'Personal', color: '#4fd1c5', labelColor: '#9ce8de' },
	trabajo: { label: 'Trabajo formal', color: '#e0935a', labelColor: '#f0b98b' }
};

/** @type {Record<Status, { label: string, color: string }>} */
export const STATUS = {
	activo: { label: 'Activo', color: '#7cc58f' },
	pausado: { label: 'Pausado', color: '#8a8798' },
	archivado: { label: 'Archivado', color: '#6b6680' }
};

/** @type {Record<Role, string>} */
export const ROLES = {
	colaborador: 'Colaborador',
	director: 'Director'
};

/** @type {string[]} */
export const STACK_OPTIONS = ['Node', 'NestJS', 'Svelte', 'SvelteKit', 'React', 'MongoDB', 'PostgreSQL', 'Docker', 'Kafka', 'Python', 'Raspberry Pi', 'MQTT'];

/** @type {{ id: string, label: string }[]} */
export const PROJECT_TABS = [
	{ id: 'docs', label: 'Docs' },
	{ id: 'env', label: 'Variables de entorno' },
	{ id: 'code', label: 'Preview de código' },
	{ id: 'deploy', label: 'Deploy' },
	{ id: 'notas', label: 'Notas' },
	{ id: 'comandos', label: 'Comandos y enlaces' }
];

/** @type {{ label: string, tab: string }[]} */
export const ADD_CONTENT_ITEMS = [
	{ label: 'Variable de entorno', tab: 'env' },
	{ label: 'Documento (Markdown)', tab: 'docs' },
	{ label: 'Nota de bitácora', tab: 'notas' },
	{ label: 'Comando frecuente', tab: 'comandos' },
	{ label: 'Enlace rápido', tab: 'comandos' }
];
