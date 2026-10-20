<script>
	import { MIN_SCALE, MAX_SCALE } from '#lib/utils/zoom';

	let { scale, onzoomin, onzoomout, onreset } = $props();
</script>

<div class="zoom-controls">
	<button type="button" class="zoom-btn" aria-label="Acercar" onclick={onzoomin} disabled={scale >= MAX_SCALE}>+</button>
	<span class="zoom-pct">{Math.round(scale * 100)}%</span>
	<button type="button" class="zoom-btn" aria-label="Alejar" onclick={onzoomout} disabled={scale <= MIN_SCALE}>−</button>
	<button type="button" class="zoom-btn" aria-label="Restablecer zoom" title="Restablecer zoom" onclick={onreset}>
		<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5"/></svg>
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
		border-color: #433e61;
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
