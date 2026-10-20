<script>
	import { envBlock } from '#lib/domain/project';
	import { copyText } from '#lib/utils/clipboard';
	import Button from '../ui/Button.svelte';
	import Card from '../ui/Card.svelte';
	import EmptyState from '../ui/EmptyState.svelte';
	import SecretRow from './SecretRow.svelte';

	/** @typedef {import('#lib/domain/types.js').Environment} Environment */

	/** @type {{ environment: Environment }} */
	let { environment } = $props();
</script>

<Card>
	<div class="env-card-head">
		<h3 class="env-name">{environment.name}</h3>
		{#if environment.url}<span class="mono muted">{environment.url}</span>{/if}
		{#if environment.vars.length}
			<Button
				size="sm"
				style="margin-left: auto"
				onclick={() => copyText(envBlock(environment), `.env de ${environment.name}`)}
			>
				Copiar todo el .env de {environment.name}
			</Button>
		{/if}
	</div>
	{#if environment.vars.length}
		<div class="vars">
			{#each environment.vars as v (v.id)}
				<SecretRow secret={v} />
			{/each}
		</div>
	{:else}
		<EmptyState>Sin variables todavía en {environment.name}.</EmptyState>
	{/if}
</Card>

<style>
	.env-card-head {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 14px;
		flex-wrap: wrap;
	}
	.env-name {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
	}
	.vars {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
</style>
