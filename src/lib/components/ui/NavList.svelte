<script>
	import EmptyState from './EmptyState.svelte';

	let { items, active = $bindable(), mono = false, empty = '' } = $props();
</script>

{#if items.length}
	<div class="nav-list">
		{#each items as item (item.id)}
			<button
				class="nav-item"
				class:active={active === item.id}
				class:mono
				onclick={() => (active = item.id)}
			>
				{item.label}
			</button>
		{/each}
	</div>
{:else}
	<EmptyState>{empty}</EmptyState>
{/if}

<style>
	.nav-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.nav-item {
		text-align: left;
		padding: 9px 12px;
		border-radius: var(--radius-sm);
		font-size: 14px;
		color: var(--text-secondary);
	}
	.nav-item:hover {
		background: var(--bg-ghost);
	}
	.nav-item.active {
		background: var(--bg-ghost);
		color: var(--text-primary);
	}
	@media (max-width: 760px) {
		.nav-list {
			flex-direction: row;
			flex-wrap: wrap;
		}
	}
</style>
