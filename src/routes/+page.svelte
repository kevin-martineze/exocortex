<script>
	import { getProjects, CLUSTERS } from '#lib/mockData';
	import Stars from '#lib/components/Stars.svelte';
	import ConstellationNode from '#lib/components/ConstellationNode.svelte';
	import ProjectPanel from '#lib/components/ProjectPanel.svelte';
	import CommandPalette from '#lib/components/CommandPalette.svelte';

	const projects = getProjects();

	// Líneas de conexión entre proyectos relacionados del mismo cluster (deduplicadas).
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

	let selected = $state(null);
	let paletteOpen = $state(false);

	function onKeydown(e) {
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			paletteOpen = true;
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

<div class="page cosmic-bg home">
	<Stars />

	<header class="topbar">
		<span class="wordmark">Exocortex</span>
		<button type="button" class="search-btn" onclick={() => (paletteOpen = true)}>
			<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
				<circle cx="11" cy="11" r="8"></circle>
				<path d="m21 21-4.3-4.3"></path>
			</svg>
			<span>Buscar</span>
			<kbd class="kbd">⌘K</kbd>
		</button>
	</header>

	<main class="constellation">
		<svg class="lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
			{#each edges as e (e.key)}
				<line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={e.color} />
			{/each}
		</svg>

		<span class="cluster-label" style:left="24%" style:color={CLUSTERS.personal.color}>Personal</span>
		<span class="cluster-label" style:left="73%" style:color={CLUSTERS.trabajo.color}>Trabajo formal</span>

		{#each projects as p, i (p.id)}
			<ConstellationNode
				project={p}
				variant={i}
				selected={selected?.id === p.id}
				onclick={() => (selected = p)}
			/>
		{/each}
	</main>

	<footer class="legend">
		<span class="legend-item"><span class="dot" style:background="#7cc58f"></span> Activo</span>
		<span class="legend-item"><span class="dot" style:background="#8a8798"></span> Pausado</span>
		<span class="legend-item"><span class="dot ring"></span> Bloqueado</span>
		<span class="legend-note">· brillo = contenido registrado</span>
	</footer>

	<a class="fab" href="/projects/new" aria-label="Agregar proyecto">+</a>

	{#if selected}
		<ProjectPanel project={selected} onclose={() => (selected = null)} />
	{/if}

	<CommandPalette open={paletteOpen} onclose={() => (paletteOpen = false)} />
</div>

<style>
	.home {
		position: relative;
		overflow: hidden;
	}
	.topbar {
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px 24px;
	}
	.wordmark {
		font-size: 17px;
		font-weight: 700;
		letter-spacing: 0.02em;
	}
	.search-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-input);
		background: var(--bg-ghost);
		color: var(--text-secondary);
		font-size: 13px;
		transition: border-color 0.15s ease, color 0.15s ease;
	}
	.search-btn:hover {
		border-color: #433e61;
		color: var(--text-primary);
	}
	.kbd {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--text-very-faint);
		border: 1px solid var(--border-panel);
		border-radius: 5px;
		padding: 1px 5px;
		background: var(--bg-panel);
	}
	.constellation {
		position: relative;
		flex: 1;
	}
	.lines {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.lines line {
		stroke-width: 1.5px;
		stroke-dasharray: 3 7;
		stroke-opacity: 0.35;
		vector-effect: non-scaling-stroke;
	}
	.cluster-label {
		position: absolute;
		top: 8%;
		transform: translateX(-50%);
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		opacity: 0.5;
	}
	.legend {
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 16px 24px;
		font-size: 12px;
		color: var(--text-faint);
	}
	.legend-item {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}
	.dot.ring {
		background: transparent;
		border: 2px solid #e06a6a;
	}
	.legend-note {
		color: var(--text-very-faint);
	}
	.fab {
		position: fixed;
		right: 24px;
		bottom: 24px;
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: var(--accent-personal);
		color: #05060c;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26px;
		font-weight: 700;
		line-height: 1;
		box-shadow: 0 8px 26px rgba(79, 209, 197, 0.35);
		z-index: 20;
		transition: filter 0.15s ease, transform 0.15s ease;
	}
	.fab:hover {
		filter: brightness(1.08);
		transform: scale(1.05);
	}
</style>
