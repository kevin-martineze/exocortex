<script>
	// Posiciones pseudo-random pero deterministas (misma semilla = mismas estrellas).
	/** @param {number} seed @returns {() => number} */
	function mulberry32(seed) {
		return function () {
			seed |= 0;
			seed = (seed + 0x6d2b79f5) | 0;
			let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	const rand = mulberry32(20261015);
	const stars = Array.from({ length: 50 }, (_, i) => ({
		id: i,
		left: rand() * 100,
		top: rand() * 100,
		size: 1 + rand() * 2,
		opacity: 0.2 + rand() * 0.7
	}));
</script>

<div class="stars" aria-hidden="true">
	{#each stars as s (s.id)}
		<span
			class="star"
			style:left={s.left + '%'}
			style:top={s.top + '%'}
			style:width={s.size + 'px'}
			style:height={s.size + 'px'}
			style:opacity={s.opacity}
		></span>
	{/each}
</div>

<style>
	.stars {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.star {
		position: absolute;
		border-radius: 50%;
		background: #fff;
	}
</style>
