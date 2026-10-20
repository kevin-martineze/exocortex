<footer class="legend">
	<span class="legend-item"><span class="dot" style:background="#7cc58f"></span> Activo</span>
	<span class="legend-item"><span class="dot" style:background="#8a8798"></span> Pausado</span>
	<span class="legend-item"><span class="dot ring"></span> Bloqueado</span>
	<span class="legend-note">· brillo = contenido registrado</span>
	<span class="legend-note">· rueda: zoom · arrastrar: mover</span>
</footer>

<style>
	.legend {
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 16px 24px;
		font-size: 12px;
		color: var(--text-faint);
	}
	.legend-item {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}
	.dot.ring {
		background: transparent;
		border: 2px solid #e06a6a;
	}
	.legend-note {
		color: var(--text-very-faint);
	}
</style>
