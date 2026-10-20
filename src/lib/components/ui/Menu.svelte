<script>
	import Button from './Button.svelte';

	let { label, items } = $props();

	let open = $state(false);
	let wrapper;

	$effect(() => {
		if (!open) return;
		function onKeydown(e) {
			if (e.key === 'Escape') open = false;
		}
		window.addEventListener('keydown', onKeydown);
		return () => window.removeEventListener('keydown', onKeydown);
	});
</script>

<svelte:window
	onclick={(e) => {
		if (open && wrapper && !wrapper.contains(e.target)) open = false;
	}}
/>

<div class="menu" bind:this={wrapper}>
	<Button variant="ghost" onclick={() => (open = !open)}>{label}</Button>
	{#if open}
		<div class="dropdown" role="menu">
			{#each items as item (item.label)}
				<button
					class="menu-item"
					role="menuitem"
					onclick={() => {
						item.onselect();
						open = false;
					}}
				>
					{item.label}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.menu {
		position: relative;
	}
	.dropdown {
		position: absolute;
		right: 0;
		top: calc(100% + 6px);
		min-width: 210px;
		background: var(--bg-panel);
		border: 1px solid var(--border-panel);
		border-radius: var(--radius-md);
		padding: 6px;
		z-index: 50;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
	}
	.menu-item {
		display: block;
		width: 100%;
		text-align: left;
		padding: 9px 12px;
		border-radius: var(--radius-sm);
		font-size: 14px;
		color: var(--text-secondary);
	}
	.menu-item:hover {
		background: var(--bg-ghost);
		color: var(--text-primary);
	}
</style>
