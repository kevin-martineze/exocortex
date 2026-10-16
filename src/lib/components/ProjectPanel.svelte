<script>
	import { copyText, envBlock } from '#lib/copy';
	import { CLUSTERS, STATUS, ROLES } from '#lib/mockData';
	import Badge from './Badge.svelte';
	import CopyButton from './CopyButton.svelte';

	let { project, onclose } = $props();

	let cluster = $derived(CLUSTERS[project.cluster]);
	let status = $derived(STATUS[project.status]);

	let firstEnv = $derived(project.environments?.find((e) => e.vars?.length));
	let varRows = $derived(firstEnv ? firstEnv.vars.slice(0, 2) : []);

	function copyNotes() {
		copyText(project.notes ?? '', 'Notas');
	}
	function copyEnv() {
		copyText(envBlock(firstEnv), 'Archivo .env');
	}
</script>

<aside class="panel" aria-label={`Detalle de ${project.title}`}>
	<header class="header">
		<div class="title-wrap">
			<h2 class="title">{project.title}</h2>
			<button type="button" class="btn-icon close" aria-label="Cerrar panel" onclick={onclose}>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
					<path d="M18 6 6 18M6 6l12 12"></path>
				</svg>
			</button>
		</div>
		<div class="badges">
			<Badge label={cluster.label} color={cluster.color} />
			{#if project.role}
				<Badge label={ROLES[project.role]} />
			{/if}
			<Badge label={status.label} color={status.color} />
			{#if project.locked}
				<Badge label="Bloqueado" color="#e06a6a" />
			{/if}
		</div>
	</header>

	<div class="body">
		{#if project.cluster === 'trabajo'}
			<h3 class="section-title">Variables de entorno</h3>
			{#if varRows.length}
				<div class="vars">
					{#each varRows as v (v.id)}
						<div class="var-row">
							<span class="key mono">{v.key}</span>
							<span class="value mono">••••••••••</span>
							<CopyButton value={v.value} toast="Variable de entorno" ariaLabel={`Copiar ${v.key}`} />
						</div>
					{/each}
				</div>
				<button type="button" class="btn btn-ghost block" onclick={copyEnv}>Copiar todo el .env</button>
			{:else}
				<p class="muted">Sin variables registradas todavía.</p>
			{/if}
		{:else}
			<h3 class="section-title">Notas</h3>
			<div class="notes">{project.notes ?? 'Sin notas todavía.'}</div>
			<button type="button" class="btn btn-ghost block" onclick={copyNotes}>Copiar como Markdown</button>
		{/if}
	</div>

	<footer class="footer">
		<a class="view-link" href={`/projects/${project.id}`}>Ver proyecto completo →</a>
	</footer>
</aside>

<style>
	.panel {
		position: fixed;
		top: 0;
		right: 0;
		width: 360px;
		max-width: 100vw;
		height: 100vh;
		background: var(--bg-panel);
		border-left: 1px solid var(--border-panel);
		display: flex;
		flex-direction: column;
		z-index: 800;
		animation: slide-in 0.22s ease;
	}
	@keyframes slide-in {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}
	.header {
		padding: 20px 20px 16px;
		border-bottom: 1px solid var(--border-panel);
	}
	.title-wrap {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
	}
	.title {
		margin: 0;
		font-size: 18px;
		font-weight: 600;
	}
	.close {
		flex-shrink: 0;
	}
	.badges {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 12px;
	}
	.body {
		padding: 20px;
		overflow-y: auto;
		flex: 1;
	}
	.section-title {
		margin: 0 0 14px;
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-faint);
	}
	.vars {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 14px;
	}
	.var-row {
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--bg-input);
		border: 1px solid var(--border-input);
		border-radius: var(--radius-sm);
		padding: 8px 10px;
	}
	.key {
		flex: 1;
		min-width: 0;
		font-size: 12.5px;
		color: var(--text-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.value {
		font-size: 12.5px;
		color: var(--text-very-faint);
		letter-spacing: 1px;
	}
	.notes {
		white-space: pre-line;
		font-size: 14px;
		line-height: 1.6;
		color: var(--text-secondary);
		margin-bottom: 16px;
	}
	.block {
		width: 100%;
	}
	.footer {
		padding: 16px 20px;
		border-top: 1px solid var(--border-panel);
	}
	.view-link {
		font-size: 14px;
		font-weight: 600;
		color: var(--accent-personal);
	}
	.view-link:hover {
		text-decoration: underline;
	}
</style>
