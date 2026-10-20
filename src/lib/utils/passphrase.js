export function passphraseStrength(pass) {
	return {
		pct: Math.min(100, (pass.length / 14) * 100),
		color:
			pass.length >= 14
				? 'var(--accent-personal)'
				: pass.length >= 10
					? 'var(--accent-trabajo)'
					: 'var(--status-bloqueado)',
		label:
			pass.length === 0
				? 'Mínimo 10 caracteres'
				: pass.length < 10
					? 'Débil'
					: pass.length < 14
						? 'Aceptable'
						: 'Fuerte'
	};
}
