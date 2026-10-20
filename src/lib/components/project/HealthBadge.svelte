<script>
	/** @typedef {import('#lib/domain/types.js').Health} Health */

	/** @type {{ health: Health }} */
	let { health } = $props();
</script>

<span class="health" class:down={!health.up}>
	<span class="health-dot" aria-hidden="true"></span>
	{health.up ? 'Operativo' : 'Caído'} · {health.lastChecked}
</span>

<style>
	.health {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: 12px;
		font-weight: 500;
		color: var(--text-secondary);
		padding: 4px 10px;
		border: 1px solid var(--border-panel);
		border-radius: 999px;
		background: var(--bg-panel);
		white-space: nowrap;
	}
	.health-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--status-activo);
		animation: pulse 2s ease-in-out infinite;
	}
	.health.down .health-dot {
		background: var(--status-bloqueado);
		animation: none;
	}
	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(124, 197, 143, 0.6);
		}
		50% {
			box-shadow: 0 0 0 5px rgba(124, 197, 143, 0);
		}
	}
</style>
