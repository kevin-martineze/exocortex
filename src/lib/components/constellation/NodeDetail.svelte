<script>
	import { STATUS, ROLES } from '#lib/domain/constants';
	import { projectStats } from '#lib/domain/project';
	import { formatShortDate } from '#lib/utils/format';
	import { fade } from 'svelte/transition';

	/** @typedef {import('#lib/domain/types.js').Project} Project */

	/** @type {{ project: Project, level: 0 | 1 | 2 }} */
	let { project, level } = $props();

	let stats = $derived(projectStats(project));
</script>

{#if level >= 1}
	<div class="meta" transition:fade={{ duration: 150 }}>
		<div class="meta-status">
			<span class="status-dot" style:background={STATUS[project.status].color}></span>
			<span>{STATUS[project.status].label}{project.role ? ` · ${ROLES[project.role]}` : ''}</span>
		</div>
		<div class="meta-tags">
			{#each project.stack.slice(0, 3) as tag (tag)}
				<span class="tag">{tag}</span>
			{/each}
			{#if project.stack.length > 3}
				<span class="tag">+{project.stack.length - 3}</span>
			{/if}
		</div>
	</div>
{/if}

{#if level >= 2}
	<div class="node-card" transition:fade={{ duration: 150 }}>
		<div class="card-line">{stats.docs} docs · {stats.notas} notas · {stats.entornos} entornos · {stats.secretos} secretos</div>
		{#if project.health}
			<div class="card-line card-health">
				<span class="health-dot" style:background={project.health.up ? '#7cc58f' : '#e06a6a'}></span>
				<span>{project.health.up ? 'Operativo' : 'Caído'}{stats.warnings > 0 ? ` · ⚠ ${stats.warnings}` : ''}</span>
			</div>
		{/if}
		{#if stats.checklistTotal > 0}
			<div class="card-line">Checklist {stats.checklistDone}/{stats.checklistTotal}</div>
		{/if}
		{#if stats.lastEntry}
			<div class="card-line card-last">
				{formatShortDate(stats.lastEntry.date)} · {stats.lastEntry.text}
			</div>
		{/if}
	</div>
{/if}

<style>
	.meta {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.meta-status {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 11px;
		color: var(--text-secondary);
	}
	.status-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
	}
	.meta-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		justify-content: center;
		max-width: 200px;
	}
	.tag {
		font-size: 10.5px;
		padding: 1px 6px;
		border: 1px solid var(--border-panel);
		border-radius: 999px;
		background: var(--bg-panel);
		color: var(--text-secondary);
	}
	.node-card {
		display: flex;
		flex-direction: column;
		gap: 4px;
		max-width: 260px;
		padding: 10px 12px;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-panel);
		background: var(--bg-panel);
		font-size: 11.5px;
		color: var(--text-secondary);
		text-align: left;
	}
	.card-line {
		line-height: 1.4;
	}
	.card-health {
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}
	.health-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
	}
	.card-last {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
