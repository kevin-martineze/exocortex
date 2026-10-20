<script>
	/** @type {{ padding?: string, children?: import('svelte').Snippet, [key: string]: unknown }} */
	let { padding = 'md', children, ...rest } = $props();
</script>

<div class="card pad-{padding}" {...rest}>
	{@render children?.()}
</div>

<style>
	.card {
		background: var(--bg-panel);
		border: 1px solid var(--border-panel);
		border-radius: var(--radius-lg);
	}
	.pad-md {
		padding: 18px 20px;
	}
	.pad-lg {
		padding: 32px;
	}
</style>
