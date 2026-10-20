<script>
	import CopyButton from '../ui/CopyButton.svelte';

	/** @typedef {import('#lib/domain/types.js').Secret} Secret */

	/** @type {{ secret: Secret, compact?: boolean }} */
	let { secret, compact = false } = $props();
</script>

<div class="var-row" class:compact>
	<span class="key mono">{secret.key}</span>
	<span class="value mono">••••••••••</span>
	<CopyButton value={secret.value} toast="Variable de entorno" ariaLabel={`Copiar ${secret.key}`} />
</div>

<style>
	.var-row {
		display: flex;
		align-items: center;
		gap: 10px;
		background: var(--bg-input);
		border: 1px solid var(--border-input);
		border-radius: var(--radius-sm);
		padding: 9px 12px;
	}
	.var-row.compact {
		gap: 8px;
		padding: 8px 10px;
	}
	.key {
		flex: 1;
		min-width: 0;
		font-size: 13px;
		color: var(--text-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.value {
		font-size: 13px;
		color: var(--text-very-faint);
		letter-spacing: 1px;
	}
	.var-row.compact .key,
	.var-row.compact .value {
		font-size: 12.5px;
	}
</style>
