<script>
	/** @type {{ onclick?: (e: MouseEvent) => void, children?: import('svelte').Snippet }} */
	let { onclick, children } = $props();
</script>

<button type="button" class="link" {onclick}>{@render children?.()}</button>

<style>
	.link {
		display: block;
		margin: 16px auto 0;
		font-size: 13px;
		color: var(--text-faint);
	}
	.link:hover {
		color: var(--accent-personal);
	}
</style>
