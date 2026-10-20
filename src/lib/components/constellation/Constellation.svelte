<script>
	import { projectEdges } from '#lib/domain/project';
	import { PanZoom } from './panzoom.svelte.js';
	import ConstellationNode from './ConstellationNode.svelte';
	import EdgeLines from './EdgeLines.svelte';
	import ClusterLabel from './ClusterLabel.svelte';
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
		<EdgeLines {edges} />

		<ClusterLabel cluster="personal" x={24} scale={pz.view.scale} animate={pz.animate} />
		<ClusterLabel cluster="trabajo" x={73} scale={pz.view.scale} animate={pz.animate} />

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
