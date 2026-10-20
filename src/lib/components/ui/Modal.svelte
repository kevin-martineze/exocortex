<script>
	/** @type {{ open?: boolean, onclose?: () => void, children?: import('svelte').Snippet }} */
	let { open = false, onclose, children } = $props();

	$effect(() => {
		if (!open) return;
		/** @param {KeyboardEvent} e */
		function onKeydown(e) {
			if (e.key === 'Escape') onclose?.();
		}
		window.addEventListener('keydown', onKeydown);
		return () => window.removeEventListener('keydown', onKeydown);
	});
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="backdrop" role="presentation" onclick={onclose}>
		<div class="modal" role="dialog" aria-modal="true" tabindex="-1" onclick={(e) => e.stopPropagation()}>
			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(3, 3, 8, 0.6);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 14vh 20px 20px;
		z-index: 900;
	}
	.modal {
		width: 100%;
		max-width: 560px;
		background: var(--bg-panel);
		border: 1px solid var(--border-panel);
		border-radius: var(--radius-lg);
		box-shadow: 0 24px 70px rgba(0, 0, 0, 0.6);
	}
</style>
