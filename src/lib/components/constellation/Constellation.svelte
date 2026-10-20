<script>
	import { CLUSTERS } from '#lib/domain/constants';
	import { projectEdges } from '#lib/domain/project';
	import { PanZoom } from './panzoom.svelte.js';
	import ConstellationNode from './ConstellationNode.svelte';
	import ZoomControls from './ZoomControls.svelte';

	/** @typedef {import('#lib/domain/types.js').Project} Project */

	/** @type {{ projects: Project[], selectedId?: string | null, onselect: (project: Project) => void, keyboard?: boolean, panelOpen?: boolean }} */
	let { projects, selectedId = null, onselect, keyboard = true, panelOpen = false } = $props();

	const pz = new PanZoom();
	let edges = $derived(projectEdges(projects));
</script>

<svelte:window onkeydown={(e) => {
	if (keyboard) pz.handleKey(e);
}} />

<main
	class="constellation"
	class:dragging={pz.dragging}
	{@attach pz.attach}
	onpointerdown={pz.onpointerdown}
	onpointermove={pz.onpointermove}
	onpointerup={pz.onpointerup}
	onpointercancel={pz.onpointerup}
>
	<div
		class="world"
		class:animate={pz.animate}
		style:transform={`translate(${pz.view.x}px, ${pz.view.y}px) scale(${pz.view.scale})`}
	>
		<svg class="lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
			{#each edges as e (e.key)}
				<line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={e.color} />
			{/each}
		</svg>

		<span
			class="cluster-label"
			class:animate={pz.animate}
			style:left="24%"
			style:color={CLUSTERS.personal.color}
			style:transform={`translateX(-50%) scale(${1 / pz.view.scale})`}
		>
			{CLUSTERS.personal.label}
		</span>
		<span
			class="cluster-label"
			class:animate={pz.animate}
			style:left="73%"
			style:color={CLUSTERS.trabajo.color}
			style:transform={`translateX(-50%) scale(${1 / pz.view.scale})`}
		>
			{CLUSTERS.trabajo.label}
		</span>

		{#each projects as p, i (p.id)}
			<ConstellationNode
				project={p}
				variant={i}
				selected={selectedId === p.id}
				onclick={() => onselect(p)}
				zoom={pz.view.scale}
				level={pz.level}
				animate={pz.animate}
			/>
		{/each}
	</div>
</main>

<div class="zoom-wrap" class:panel-open={panelOpen}>
	<ZoomControls scale={pz.view.scale} onzoomin={pz.zoomIn} onzoomout={pz.zoomOut} onreset={pz.reset} />
</div>

<style>
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
