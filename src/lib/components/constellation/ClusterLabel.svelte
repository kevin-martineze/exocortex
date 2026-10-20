<script>
	import { CLUSTERS } from '#lib/domain/constants';

	/** @typedef {import('#lib/domain/types.js').Cluster} Cluster */

	/** @type {{ cluster: Cluster, x: number, scale: number, animate?: boolean }} */
	let { cluster, x, scale, animate = false } = $props();
</script>

<span
	class="cluster-label"
	class:animate
	style:left={x + '%'}
	style:color={CLUSTERS[cluster].color}
	style:transform={`translateX(-50%) scale(${1 / scale})`}
>
	{CLUSTERS[cluster].label}
</span>

<style>
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
</style>
