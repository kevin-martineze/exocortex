<script>
	import { toast } from '#lib/stores';
</script>

{#if $toast}
	<div class="toast" role="status" aria-live="polite">{$toast}</div>
{/if}

<style>
	.toast {
		position: fixed;
		bottom: 24px;
		left: 50%;
		transform: translateX(-50%);
		background: var(--bg-panel);
		border: 1px solid var(--border-panel);
		color: var(--text-primary);
		padding: 10px 18px;
		border-radius: var(--radius-md);
		font-size: 14px;
		box-shadow: 0 10px 34px rgba(0, 0, 0, 0.55);
		z-index: 1000;
		animation: toast-in 0.18s ease;
	}
	@keyframes toast-in {
		from {
			opacity: 0;
			transform: translate(-50%, 8px);
		}
		to {
			opacity: 1;
			transform: translate(-50%, 0);
		}
	}
</style>
