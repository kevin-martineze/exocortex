<script>
	let { label, color = '#9a95a8', dot = true } = $props();
</script>

<span class="badge" style:--badge-color={color}>
	{#if dot}<span class="dot" aria-hidden="true"></span>{/if}
	{label}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 500;
		color: var(--text-secondary);
		padding: 4px 10px;
		border: 1px solid var(--border-panel);
		border-radius: 999px;
		background: var(--bg-panel);
		white-space: nowrap;
	}
	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--badge-color);
	}
</style>
