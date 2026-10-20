<script>
	import Icon from '../ui/Icon.svelte';

	/** @type {{ onclick: () => void }} */
	let { onclick } = $props();
</script>

<button type="button" class="search-btn" {onclick}>
	<Icon name="search" />
	<span>Buscar</span>
	<kbd class="kbd">⌘K</kbd>
</button>

<style>
	.search-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-input);
		background: var(--bg-ghost);
		color: var(--text-secondary);
		font-size: 13px;
		transition: border-color 0.15s ease, color 0.15s ease;
	}
	.search-btn:hover {
		border-color: var(--border-hover);
		color: var(--text-primary);
	}
	.kbd {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--text-very-faint);
		border: 1px solid var(--border-panel);
		border-radius: 5px;
		padding: 1px 5px;
		background: var(--bg-panel);
	}
</style>
