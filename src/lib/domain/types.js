/**
 * @typedef {'personal' | 'trabajo'} Cluster
 * @typedef {'activo' | 'pausado' | 'archivado'} Status
 * @typedef {'colaborador' | 'director'} Role
 * @typedef {{ id: string, key: string, value: string }} Secret
 * @typedef {{ id: string, name: string, url: string, vars: Secret[] }} Environment
 * @typedef {{ id: string, title: string, content: string }} Doc
 * @typedef {{ id: string, date: string, text: string }} BitacoraEntry
 * @typedef {{ id: string, path: string, snippet: string }} CodeFile
 * @typedef {{ id: string, label: string, command: string }} Command
 * @typedef {{ id: string, label: string, url: string }} QuickLink
 * @typedef {{ id: string, text: string }} Warning
 * @typedef {{ id: string, name: string, version: string, reason: string }} Dependency
 * @typedef {{ id: string, text: string, done: boolean }} ChecklistItem
 * @typedef {{ up: boolean, lastChecked: string }} Health
 * @typedef {{ repo: string, board: string, cicd: string }} ProjectLinks
 * @typedef {{
 *   id: string,
 *   title: string,
 *   cluster: Cluster,
 *   role: Role | null,
 *   status: Status,
 *   locked: boolean,
 *   stack: string[],
 *   links: ProjectLinks,
 *   position: { x: number, y: number },
 *   related: string[],
 *   notes?: string,
 *   docs: Doc[],
 *   bitacora: BitacoraEntry[],
 *   environments: Environment[],
 *   codeFiles: CodeFile[],
 *   commands: Command[],
 *   quickLinks: QuickLink[],
 *   warnings: Warning[],
 *   dependencies: Dependency[],
 *   checklist: ChecklistItem[],
 *   health: Health | null
 * }} Project
 * @typedef {{ title: string, cluster: Cluster, role: Role | null, status: Status, stack: string[], links: ProjectLinks }} ProjectDraft
 * @typedef {{ key: string, x1: number, y1: number, x2: number, y2: number, color: string }} Edge
 */

export {};
