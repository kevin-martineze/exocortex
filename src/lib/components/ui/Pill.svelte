<script>
	let { label, selected = false, color = 'var(--accent-personal)', onclick } = $props();
</script>

<button
	type="button"
	class="pill"
	class:selected
	aria-pressed={selected}
	style:--pill-color={color}
	onclick={onclick}
>
	{label}
</button>

<style>
	.pill {
		display: inline-flex;
		align-items: center;
		padding: 9px 16px;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-input);
		background: var(--bg-ghost);
		color: var(--text-secondary);
		font-size: 14px;
		font-weight: 500;
		transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
	}
	.pill:hover {
		border-color: var(--border-hover);
		color: var(--text-primary);
	}
	.pill.selected {
		background: color-mix(in srgb, var(--pill-color) 16%, transparent);
		border-color: var(--pill-color);
		color: var(--pill-color);
		font-weight: 600;
	}
</style>
