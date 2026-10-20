<script>
	let { href, label } = $props();
</script>

<a class="fab" {href} aria-label={label}>+</a>

<style>
	.fab {
		position: fixed;
		right: 24px;
		bottom: 24px;
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: var(--accent-personal);
		color: var(--text-on-accent);
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
