<script>
	import { goto } from '$app/navigation';
	import AuthCard from '#lib/components/auth/AuthCard.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Input from '#lib/components/ui/Input.svelte';
	import LinkButton from '#lib/components/ui/LinkButton.svelte';

	let mode = $state('passphrase');
	let pass = $state('');
	let code = $state('');
</script>

<AuthCard
	title={mode === 'passphrase' ? 'Bienvenido de vuelta' : 'Recuperar acceso'}
	subtitle={mode === 'passphrase'
		? 'Introduce tu passphrase maestra para desbloquear tu mente.'
		: 'Introduce tu código de recuperación para restablecer la passphrase.'}
>
	{#if mode === 'passphrase'}
		<Field label="Passphrase" id="pass">
			<Input id="pass" type="password" bind:value={pass} placeholder="Tu passphrase" />
		</Field>

		<div class="cta">
			<Button variant="primary" block disabled={!pass} onclick={() => goto('/')}>
				Desbloquear
			</Button>
		</div>

		<LinkButton onclick={() => (mode = 'recovery')}>¿Olvidaste tu passphrase?</LinkButton>
	{:else}
		<Field label="Código de recuperación" id="code">
			<Input
				id="code"
				mono
				bind:value={code}
				placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
			/>
		</Field>

		<div class="cta">
			<Button variant="primary" block disabled={!code} onclick={() => goto('/onboarding')}>
				Restablecer con código
			</Button>
		</div>

		<LinkButton onclick={() => (mode = 'passphrase')}>← Volver a passphrase</LinkButton>
	{/if}
</AuthCard>

<style>
	.cta {
		margin-top: 20px;
	}
</style>
