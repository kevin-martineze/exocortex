<script>
	import { CLUSTERS, STATUS, ROLES } from '#lib/domain/constants';
	import { projectLoad, projectStats } from '#lib/domain/project';
	import { formatShortDate } from '#lib/utils/format';
	import { fade } from 'svelte/transition';

	/** @typedef {import('#lib/domain/types.js').Project} Project */

	/** @type {{ project: Project, selected?: boolean, variant?: number, onclick?: () => void, zoom?: number, level?: 0 | 1 | 2, animate?: boolean }} */
	let {
		project,
		selected = false,
		variant = 0,
		onclick,
		zoom = 1,
		level = 0,
		animate = false
	} = $props();

	let cluster = $derived(CLUSTERS[project.cluster]);
	let accent = $derived(cluster.color);
	let load = $derived(projectLoad(project));
	let stats = $derived(projectStats(project));

	// Misma fórmula que el prototipo: hasta 60% de blanco mezclado al tope de carga,
	// un halo (box-shadow) que crece en blur/spread/alpha con la carga.
	let loadPct = $derived(Math.round((load / 10) * 60));
	let coreColor = $derived(`color-mix(in srgb, ${accent} ${100 - loadPct}%, #ffffff ${loadPct}%)`);
	let glowBlur = $derived(14 + load * 5);
	let glowSpread = $derived(1 + Math.round(load * 0.7));
	let glowAlphaHex = $derived(
		Math.round((0.3 + load * 0.045) * 255)
			.toString(16)
			.padStart(2, '0')
	);

	let radius = $derived(project.role === 'director' ? 42 : 36);
	let coreBg = $derived(
		`radial-gradient(circle at 32% 28%, ${coreColor}, ${accent}55 60%, ${accent}22 100%)`
	);

	let shadow = $derived.by(() => {
		let s = `0 0 ${glowBlur}px ${glowSpread}px ${accent}${glowAlphaHex}`;
		if (project.locked) {
			s = `0 0 0 3px #05060c, 0 0 0 5px #e06a6a, ${s}`;
		}
		if (selected) {
			s += `, 0 0 0 2px ${accent}`;
		}
		return s;
	});

	let floatClass = $derived(['float-a', 'float-b', 'float-c'][variant % 3]);
</script>

<button
	type="button"
	class="node"
	class:paused={project.status === 'pausado'}
	class:animate={animate}
	aria-label={`${project.title}, ${cluster.label}${project.role ? ', ' + project.role : ''}, carga ${load} de 10`}
	style:left={project.position.x + '%'}
	style:top={project.position.y + '%'}
	style:transform={`translate(-50%, -${radius}px) scale(${1 / zoom})`}
	style:transform-origin={`50% ${radius}px`}
	onclick={onclick}
>
	<span class="float {floatClass}">
		<span
			class="core"
			style:width={radius * 2 + 'px'}
			style:height={radius * 2 + 'px'}
			style:background={coreBg}
			style:box-shadow={shadow}
		></span>
		<span class="node-label" style:color={cluster.labelColor}>{project.title}</span>

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
	</span>
</button>

<style>
	.node {
		position: absolute;
		background: none;
		padding: 0;
		display: block;
		cursor: pointer;
	}
	.node.animate {
		transition: transform 200ms ease;
	}
	.node.paused {
		opacity: 0.55;
	}
	.float {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.core {
		border-radius: 50%;
		transition: transform 0.18s ease;
	}
	.node:hover .core {
		transform: scale(1.08);
	}
	.node-label {
		font-size: 12.5px;
		font-weight: 500;
		max-width: 130px;
		text-align: center;
		line-height: 1.25;
		white-space: nowrap;
	}
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
	.float-a {
		animation: float-a 6s ease-in-out infinite;
	}
	.float-b {
		animation: float-b 7.5s ease-in-out 0.6s infinite;
	}
	.float-c {
		animation: float-c 9s ease-in-out 1.2s infinite;
	}
	@keyframes float-a {
		0%,
		100% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(0, -7px);
		}
	}
	@keyframes float-b {
		0%,
		100% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(5px, -5px);
		}
	}
	@keyframes float-c {
		0%,
		100% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(-5px, 4px);
		}
	}
</style>
