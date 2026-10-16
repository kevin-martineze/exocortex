<script>
	import { goto } from '$app/navigation';
	import CopyButton from '#lib/components/CopyButton.svelte';

	const RECOVERY_CODE = 'XQ7K-9F2M-PLR4-7TZD-88CY';

	let step = $state(1);
	let pass = $state('');
	let confirm = $state('');
	let saved = $state(false);

	let canContinue = $derived(pass.length >= 10 && pass === confirm);
	let strengthPct = $derived(Math.min(100, (pass.length / 14) * 100));
	let strengthColor = $derived(
		pass.length >= 14 ? '#4fd1c5' : pass.length >= 10 ? '#e0935a' : '#e06a6a'
	);
	let strengthLabel = $derived(
		pass.length === 0
			? 'Mínimo 10 caracteres'
			: pass.length < 10
				? 'Débil'
				: pass.length < 14
					? 'Aceptable'
					: 'Fuerte'
	);
</script>

<div class="auth-page cosmic-bg">
	<div class="auth-card">
		{#if step === 1}
			<h1 class="auth-title">Crea tu passphrase maestra</h1>
			<p class="auth-sub">
				Esta passphrase cifra tus secretos de extremo a extremo. Nunca se envía al servidor.
			</p>

			<div class="field">
				<label class="label" for="passphrase">Passphrase</label>
				<input
					id="passphrase"
					class="input"
					type="password"
					bind:value={pass}
					placeholder="Mínimo 10 caracteres"
				/>
			</div>

			<div class="field">
				<label class="label" for="confirm">Confirmar passphrase</label>
				<input
					id="confirm"
					class="input"
					type="password"
					bind:value={confirm}
					placeholder="Repite tu passphrase"
				/>
			</div>

			<div class="strength">
				<div class="strength-head">
					<span class="text-faint">Fuerza</span>
					<span class="strength-label" style:color={strengthColor}>{strengthLabel}</span>
				</div>
				<div class="strength-track">
					<div
						class="strength-fill"
						style:width={strengthPct + '%'}
						style:background={strengthColor}
					></div>
				</div>
			</div>

			<button class="btn btn-primary full" disabled={!canContinue} onclick={() => (step = 2)}>
				Continuar
			</button>
		{:else}
			<h1 class="auth-title">Guarda tu código de recuperación</h1>
			<p class="auth-sub">
				Si olvidas tu passphrase, este código es la única forma de recuperar tus secretos. Guárdalo
				en un lugar seguro, como tu gestor de contraseñas.
			</p>

			<div class="code-box">
				<code>{RECOVERY_CODE}</code>
				<CopyButton
					value={RECOVERY_CODE}
					toast="Código de recuperación"
					ariaLabel="Copiar código de recuperación"
				/>
			</div>

			<label class="checkbox">
				<input type="checkbox" bind:checked={saved} />
				<span>Ya guardé mi código de recuperación</span>
			</label>

			<button class="btn btn-primary full" disabled={!saved} onclick={() => goto('/')}>
				Entrar a mi mente
			</button>
		{/if}
	</div>
</div>

<style>
	.full {
		width: 100%;
		margin-top: 20px;
	}
	.strength {
		margin: 4px 0;
	}
	.strength-head {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		margin-bottom: 6px;
	}
	.strength-label {
		font-weight: 600;
	}
	.strength-track {
		height: 6px;
		border-radius: 999px;
		background: var(--bg-input);
		border: 1px solid var(--border-input);
		overflow: hidden;
	}
	.strength-fill {
		height: 100%;
		border-radius: 999px;
		transition: width 0.2s ease, background 0.2s ease;
	}
	.code-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
		background: var(--bg-input);
		border: 1px solid var(--border-input);
		border-radius: var(--radius-md);
		padding: 14px 16px;
		margin-bottom: 20px;
	}
	.code-box code {
		font-size: 15px;
		letter-spacing: 0.05em;
		color: var(--text-primary);
	}
	.checkbox {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 14px;
		color: var(--text-secondary);
		cursor: pointer;
	}
	.checkbox input {
		accent-color: var(--accent-personal);
		width: 16px;
		height: 16px;
	}
</style>
