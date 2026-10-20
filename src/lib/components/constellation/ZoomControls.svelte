<script>
	import { MIN_SCALE, MAX_SCALE } from '#lib/utils/zoom';
	import Icon from '../ui/Icon.svelte';

	/** @type {{ scale: number, onzoomin: () => void, onzoomout: () => void, onreset: () => void }} */
	let { scale, onzoomin, onzoomout, onreset } = $props();
</script>

<div class="zoom-controls">
	<button type="button" class="zoom-btn" aria-label="Acercar" onclick={onzoomin} disabled={scale >= MAX_SCALE}>+</button>
	<span class="zoom-pct">{Math.round(scale * 100)}%</span>
	<button type="button" class="zoom-btn" aria-label="Alejar" onclick={onzoomout} disabled={scale <= MIN_SCALE}>−</button>
	<button type="button" class="zoom-btn" aria-label="Restablecer zoom" title="Restablecer zoom" onclick={onreset}>
		<Icon name="fit" />
	</button>
</div>

<style>
	.zoom-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.zoom-btn {
		width: 36px;
		height: 36px;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-input);
		background: var(--bg-ghost);
		color: var(--text-secondary);
		font-size: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: border-color 0.15s ease, color 0.15s ease;
	}
	.zoom-btn:hover {
		border-color: var(--border-hover);
		color: var(--text-primary);
	}
	.zoom-btn:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.zoom-pct {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--text-faint);
	}
</style>
