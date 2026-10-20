<script>
	import { goto } from '$app/navigation';
	import AuthCard from '#lib/components/auth/AuthCard.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Input from '#lib/components/ui/Input.svelte';
	import Checkbox from '#lib/components/ui/Checkbox.svelte';
	import CopyButton from '#lib/components/ui/CopyButton.svelte';
	import { passphraseStrength } from '#lib/utils/passphrase';

	const RECOVERY_CODE = 'XQ7K-9F2M-PLR4-7TZD-88CY';

	let step = $state(1);
	let pass = $state('');
	let confirm = $state('');
	let saved = $state(false);

	let canContinue = $derived(pass.length >= 10 && pass === confirm);
	let strength = $derived(passphraseStrength(pass));
</script>

<AuthCard
	title={step === 1 ? 'Crea tu passphrase maestra' : 'Guarda tu código de recuperación'}
	subtitle={step === 1
		? 'Esta passphrase cifra tus secretos de extremo a extremo. Nunca se envía al servidor.'
		: 'Si olvidas tu passphrase, este código es la única forma de recuperar tus secretos. Guárdalo en un lugar seguro, como tu gestor de contraseñas.'}
>
	{#if step === 1}
		<Field label="Passphrase" id="passphrase">
			<Input
				id="passphrase"
				type="password"
				bind:value={pass}
				placeholder="Mínimo 10 caracteres"
			/>
		</Field>

		<Field label="Confirmar passphrase" id="confirm">
			<Input id="confirm" type="password" bind:value={confirm} placeholder="Repite tu passphrase" />
		</Field>

		<div class="strength">
			<div class="strength-head">
				<span class="text-faint">Fuerza</span>
				<span class="strength-label" style:color={strength.color}>{strength.label}</span>
			</div>
			<div class="strength-track">
				<div
					class="strength-fill"
					style:width={strength.pct + '%'}
					style:background={strength.color}
				></div>
			</div>
		</div>

		<div class="cta">
			<Button variant="primary" block disabled={!canContinue} onclick={() => (step = 2)}>
				Continuar
			</Button>
		</div>
	{:else}
		<div class="code-box">
			<code>{RECOVERY_CODE}</code>
			<CopyButton
				value={RECOVERY_CODE}
				toast="Código de recuperación"
				ariaLabel="Copiar código de recuperación"
			/>
		</div>

		<Checkbox bind:checked={saved}>Ya guardé mi código de recuperación</Checkbox>

		<div class="cta">
			<Button variant="primary" block disabled={!saved} onclick={() => goto('/')}>
				Entrar a mi mente
			</Button>
		</div>
	{/if}
</AuthCard>

<style>
	.cta {
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
</style>
