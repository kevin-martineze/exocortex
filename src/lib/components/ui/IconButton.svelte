<script>
	let { label, title, onclick, children } = $props();
</script>

<button type="button" class="icon-btn" aria-label={label} {title} {onclick}>
	{@render children?.()}
</button>

<style>
	.icon-btn {
		width: 32px;
		height: 32px;
		padding: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		color: var(--text-secondary);
		transition: background 0.15s ease, color 0.15s ease;
	}
	.icon-btn:hover {
		background: var(--bg-ghost);
		color: var(--text-primary);
	}
</style>
