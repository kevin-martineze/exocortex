<script>
	/** @type {{ side?: import('svelte').Snippet, children?: import('svelte').Snippet }} */
	let { side, children } = $props();
</script>

<div class="two-pane">
	<div class="side">{@render side?.()}</div>
	<div class="pane">{@render children?.()}</div>
</div>

<style>
	.two-pane {
		display: flex;
		gap: 20px;
		align-items: flex-start;
	}
	.side {
		width: 240px;
		flex-shrink: 0;
	}
	.pane {
		flex: 1;
		min-width: 0;
		background: var(--bg-panel);
		border: 1px solid var(--border-panel);
		border-radius: var(--radius-lg);
		padding: 20px;
	}
	@media (max-width: 760px) {
		.two-pane {
			flex-direction: column;
		}
		.side {
			width: 100%;
		}
	}
</style>
