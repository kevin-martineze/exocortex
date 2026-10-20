<script>
	let { label, selected = false, onclick } = $props();
</script>

<button
	type="button"
	class="chip"
	class:selected
	aria-pressed={selected}
	onclick={onclick}
>
	{label}
</button>

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		padding: 6px 13px;
		border-radius: 999px;
		border: 1px solid var(--border-input);
		background: var(--bg-ghost);
		color: var(--text-secondary);
		font-size: 13px;
		font-weight: 500;
		transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
	}
	.chip:hover {
		border-color: var(--border-hover);
		color: var(--text-primary);
	}
	.chip.selected {
		background: color-mix(in srgb, var(--accent-personal) 16%, transparent);
		border-color: var(--accent-personal);
		color: var(--accent-personal);
		font-weight: 600;
	}
</style>
