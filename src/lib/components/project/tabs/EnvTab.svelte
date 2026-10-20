<script>
	import Button from '../../ui/Button.svelte';
	import Input from '../../ui/Input.svelte';
	import SectionHeader from '../../ui/SectionHeader.svelte';
	import EmptyState from '../../ui/EmptyState.svelte';
	import EnvironmentCard from '../EnvironmentCard.svelte';

	/** @typedef {import('#lib/domain/types.js').Environment} Environment */

	/** @type {{ environments: Environment[], onaddenv: (name: string) => void }} */
	let { environments, onaddenv } = $props();

	let open = $state(false);
	let name = $state('');

	function add() {
		const n = name.trim();
		if (!n) return;
		onaddenv(n);
		name = '';
		open = false;
	}
</script>

<div class="env-tab">
	<SectionHeader title="Entornos">
		<Button onclick={() => (open = !open)}>+ Entorno</Button>
	</SectionHeader>

	{#if open}
		<div class="new-env">
			<Input style="flex: 1" placeholder="Nombre del entorno (ej. Demo)" bind:value={name} />
			<Button variant="primary" onclick={add}>Agregar</Button>
		</div>
	{/if}

	{#each environments as env (env.id)}
		<EnvironmentCard environment={env} />
	{:else}
		<EmptyState>Sin entornos todavía.</EmptyState>
	{/each}
</div>

<style>
	.env-tab {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.new-env {
		display: flex;
		gap: 10px;
	}
</style>
