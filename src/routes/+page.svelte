<script>
	import { getProjects } from '#lib/data/mock-projects';
	import { CLUSTERS } from '#lib/domain/constants';
	import { projectEdges } from '#lib/domain/project';
	import { clampPan, zoomAt, detailLevel, STEP } from '#lib/utils/zoom';
	import Stars from '#lib/components/Stars.svelte';
	import ConstellationNode from '#lib/components/ConstellationNode.svelte';
	import ProjectPanel from '#lib/components/ProjectPanel.svelte';
	import CommandPalette from '#lib/components/CommandPalette.svelte';
	import ZoomControls from '#lib/components/ZoomControls.svelte';

	const projects = getProjects();

	const edges = projectEdges(projects);

	let selected = $state(null);
	let paletteOpen = $state(false);

	let viewport;
	let view = $state({ scale: 1, x: 0, y: 0 });
	let animate = $state(false);
	let dragging = $state(false);
	let level = $derived(detailLevel(view.scale));

	const pointers = new Map();
	let panStart = { x: 0, y: 0 };
	let panStartView = { scale: 1, x: 0, y: 0 };
	let pinchStart = { dist: 0, scale: 1 };

	function dist(a, b) {
		return Math.hypot(a.x - b.x, a.y - b.y);
	}

	function onWheel(e) {
		e.preventDefault();
		animate = false;
		const r = viewport.getBoundingClientRect();
		const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
		view = zoomAt(view, view.scale * Math.exp(-d * 0.0015), e.clientX - r.left, e.clientY - r.top, r.width, r.height);
	}

	$effect(() => {
		viewport.addEventListener('wheel', onWheel, { passive: false });
		return () => viewport.removeEventListener('wheel', onWheel);
	});

	function onPointerDown(e) {
		if (e.target.closest('.node')) return;
		animate = false;
		pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
		viewport.setPointerCapture(e.pointerId);
		if (pointers.size === 1) {
			panStart = { x: e.clientX, y: e.clientY };
			panStartView = view;
		} else if (pointers.size === 2) {
			const [a, b] = [...pointers.values()];
			pinchStart = { dist: dist(a, b), scale: view.scale };
		}
	}

	function onPointerMove(e) {
		if (!pointers.has(e.pointerId)) return;
		pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
		const r = viewport.getBoundingClientRect();
		if (pointers.size === 1) {
			const dx = e.clientX - panStart.x;
			const dy = e.clientY - panStart.y;
			if (Math.hypot(dx, dy) > 4) dragging = true;
			view = clampPan(
				{ scale: view.scale, x: panStartView.x + dx, y: panStartView.y + dy },
				r.width,
				r.height
			);
		} else if (pointers.size === 2) {
			const [a, b] = [...pointers.values()];
			const d = dist(a, b);
			const midX = (a.x + b.x) / 2;
			const midY = (a.y + b.y) / 2;
			view = zoomAt(view, pinchStart.scale * (d / pinchStart.dist), midX - r.left, midY - r.top, r.width, r.height);
		}
	}

	function onPointerUp(e) {
		pointers.delete(e.pointerId);
		if (pointers.size === 0) {
			dragging = false;
		} else if (pointers.size === 1) {
			const [remaining] = [...pointers.values()];
			panStart = { x: remaining.x, y: remaining.y };
			panStartView = view;
		}
	}

	function zoomBy(f) {
		const r = viewport.getBoundingClientRect();
		animate = true;
		view = zoomAt(view, view.scale * f, r.width / 2, r.height / 2, r.width, r.height);
	}
	function zoomIn() {
		zoomBy(STEP);
	}
	function zoomOut() {
		zoomBy(1 / STEP);
	}
	function resetZoom() {
		animate = true;
		view = { scale: 1, x: 0, y: 0 };
	}

	function onKeydown(e) {
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			paletteOpen = true;
			return;
		}
		if (paletteOpen || e.metaKey || e.ctrlKey || e.altKey) return;
		if (e.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
		if (e.key === '+' || e.key === '=') {
			e.preventDefault();
			zoomIn();
		} else if (e.key === '-') {
			e.preventDefault();
			zoomOut();
		} else if (e.key === '0') {
			e.preventDefault();
			resetZoom();
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

	<main
		class="constellation"
		class:dragging
		bind:this={viewport}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
	>
		<div class="world" class:animate style:transform={`translate(${view.x}px, ${view.y}px) scale(${view.scale})`}>
			<svg class="lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
				{#each edges as e (e.key)}
					<line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={e.color} />
				{/each}
			</svg>

			<span
				class="cluster-label"
				class:animate
				style:left="24%"
				style:color={CLUSTERS.personal.color}
				style:transform={`translateX(-50%) scale(${1 / view.scale})`}
			>
				Personal
			</span>
			<span
				class="cluster-label"
				class:animate
				style:left="73%"
				style:color={CLUSTERS.trabajo.color}
				style:transform={`translateX(-50%) scale(${1 / view.scale})`}
			>
				Trabajo formal
			</span>

			{#each projects as p, i (p.id)}
				<ConstellationNode
					project={p}
					variant={i}
					selected={selected?.id === p.id}
					onclick={() => (selected = p)}
					zoom={view.scale}
					level={level}
					animate={animate}
				/>
			{/each}
		</div>
	</main>

	<footer class="legend">
		<span class="legend-item"><span class="dot" style:background="#7cc58f"></span> Activo</span>
		<span class="legend-item"><span class="dot" style:background="#8a8798"></span> Pausado</span>
		<span class="legend-item"><span class="dot ring"></span> Bloqueado</span>
		<span class="legend-note">· brillo = contenido registrado</span>
		<span class="legend-note">· rueda: zoom · arrastrar: mover</span>
	</footer>

	<a class="fab" href="/projects/new" aria-label="Agregar proyecto">+</a>

	<div class="zoom-wrap" class:panel-open={!!selected}>
		<ZoomControls scale={view.scale} onzoomin={zoomIn} onzoomout={zoomOut} onreset={resetZoom} />
	</div>

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
		overflow: hidden;
		touch-action: none;
		cursor: grab;
	}
	.constellation.dragging {
		cursor: grabbing;
	}
	.world {
		position: absolute;
		inset: 0;
		transform-origin: 0 0;
	}
	.world.animate {
		transition: transform 200ms ease;
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
		transform-origin: 50% 0;
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		opacity: 0.5;
	}
	.cluster-label.animate {
		transition: transform 200ms ease;
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
	.zoom-wrap {
		position: absolute;
		right: 24px;
		bottom: 92px;
		z-index: 20;
		transition: right 200ms ease;
	}
	.zoom-wrap.panel-open {
		right: 384px;
	}
</style>
