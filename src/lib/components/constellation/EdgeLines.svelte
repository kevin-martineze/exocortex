<script>
	/** @typedef {import('#lib/domain/types.js').Edge} Edge */

	/** @type {{ edges: Edge[] }} */
	let { edges } = $props();
</script>

<svg class="lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
	{#each edges as e (e.key)}
		<line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={e.color} />
	{/each}
</svg>

<style>
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
</style>
