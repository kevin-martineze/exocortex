<script>
	/** @type {{ children?: import('svelte').Snippet }} */
	let { children } = $props();
</script>

<p class="empty">{@render children?.()}</p>

<style>
	.empty {
		margin: 0;
		padding: 12px 0;
		font-size: 14px;
		color: var(--text-very-faint);
	}
</style>
