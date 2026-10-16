<script>
	import { goto } from '$app/navigation';

	let mode = $state('passphrase');
	let pass = $state('');
	let code = $state('');
</script>

<div class="auth-page cosmic-bg">
	<div class="auth-card">
		{#if mode === 'passphrase'}
			<h1 class="auth-title">Bienvenido de vuelta</h1>
			<p class="auth-sub">Introduce tu passphrase maestra para desbloquear tu mente.</p>

			<div class="field">
				<label class="label" for="pass">Passphrase</label>
				<input id="pass" class="input" type="password" bind:value={pass} placeholder="Tu passphrase" />
			</div>

			<button class="btn btn-primary full" disabled={!pass} onclick={() => goto('/')}>Desbloquear</button>

			<button class="link" onclick={() => (mode = 'recovery')}>¿Olvidaste tu passphrase?</button>
		{:else}
			<h1 class="auth-title">Recuperar acceso</h1>
			<p class="auth-sub">Introduce tu código de recuperación para restablecer la passphrase.</p>

			<div class="field">
				<label class="label" for="code">Código de recuperación</label>
				<input
					id="code"
					class="input mono"
					bind:value={code}
					placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
				/>
			</div>

			<button class="btn btn-primary full" disabled={!code} onclick={() => goto('/onboarding')}>
				Restablecer con código
			</button>

			<button class="link" onclick={() => (mode = 'passphrase')}>← Volver a passphrase</button>
		{/if}
	</div>
</div>

<style>
	.full {
		width: 100%;
		margin-top: 20px;
	}
	.link {
		display: block;
		margin: 16px auto 0;
		font-size: 13px;
		color: var(--text-faint);
	}
	.link:hover {
		color: var(--accent-personal);
	}
</style>
