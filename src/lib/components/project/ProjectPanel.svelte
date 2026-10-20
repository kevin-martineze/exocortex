<script>
	import { copyText } from '#lib/utils/clipboard';
	import { envBlock } from '#lib/domain/project';
	import ProjectBadges from './ProjectBadges.svelte';
	import SecretRow from './SecretRow.svelte';
	import Button from '../ui/Button.svelte';
	import IconButton from '../ui/IconButton.svelte';
	import Icon from '../ui/Icon.svelte';

	/** @typedef {import('#lib/domain/types.js').Project} Project */

	/** @type {{ project: Project, onclose: () => void }} */
	let { project, onclose } = $props();

	let firstEnv = $derived(project.environments.find((e) => e.vars.length));
	let varRows = $derived(firstEnv ? firstEnv.vars.slice(0, 2) : []);

	function copyNotes() {
		copyText(project.notes ?? '', 'Notas');
	}
	function copyEnv() {
		if (!firstEnv) return;
		copyText(envBlock(firstEnv), 'Archivo .env');
	}
</script>

<aside class="panel" aria-label={`Detalle de ${project.title}`}>
	<header class="header">
		<div class="title-wrap">
			<h2 class="title">{project.title}</h2>
			<span class="close">
				<IconButton label="Cerrar panel" onclick={onclose}>
					<Icon name="close" />
				</IconButton>
			</span>
		</div>
		<div class="badges">
			<ProjectBadges {project} />
		</div>
	</header>

	<div class="body">
		{#if project.cluster === 'trabajo'}
			<h3 class="section-title">Variables de entorno</h3>
			{#if varRows.length}
				<div class="vars">
					{#each varRows as v (v.id)}
						<SecretRow secret={v} compact />
					{/each}
				</div>
				<Button block onclick={copyEnv}>Copiar todo el .env</Button>
			{:else}
				<p class="muted">Sin variables registradas todavía.</p>
			{/if}
		{:else}
			<h3 class="section-title">Notas</h3>
			<div class="notes">{project.notes ?? 'Sin notas todavía.'}</div>
			<Button block onclick={copyNotes}>Copiar como Markdown</Button>
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
	.notes {
		white-space: pre-line;
		font-size: 14px;
		line-height: 1.6;
		color: var(--text-secondary);
		margin-bottom: 16px;
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
