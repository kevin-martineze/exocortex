<script>
	/** @type {{ tabs: { id: string, label: string }[], active?: string }} */
	let { tabs, active = $bindable() } = $props();
</script>

<div role="tablist" class="tabs">
	{#each tabs as t (t.id)}
		<button
			class="tab"
			class:active={active === t.id}
			role="tab"
			aria-selected={active === t.id}
			onclick={() => (active = t.id)}
		>
			{t.label}
		</button>
	{/each}
</div>

<style>
	.tabs {
		display: flex;
		gap: 4px;
		border-bottom: 1px solid var(--border-panel);
		margin-bottom: 24px;
		overflow-x: auto;
	}
	.tab {
		padding: 10px 14px;
		font-size: 14px;
		color: var(--text-faint);
		border-bottom: 2px solid transparent;
		white-space: nowrap;
	}
	.tab:hover {
		color: var(--text-primary);
	}
	.tab.active {
		color: var(--text-primary);
		border-bottom-color: var(--accent-personal);
	}
</style>
