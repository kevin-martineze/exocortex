<script>
	import { STACK_OPTIONS } from '#lib/domain/constants';
	import Card from '../ui/Card.svelte';
	import Button from '../ui/Button.svelte';
	import Field from '../ui/Field.svelte';
	import Input from '../ui/Input.svelte';
	import Pill from '../ui/Pill.svelte';
	import Chip from '../ui/Chip.svelte';

	/** @typedef {import('#lib/domain/types.js').ProjectDraft} ProjectDraft */
	/** @typedef {import('#lib/domain/types.js').Cluster} Cluster */
	/** @typedef {import('#lib/domain/types.js').Role} Role */
	/** @typedef {import('#lib/domain/types.js').Status} Status */

	/** @type {{ onsubmit: (draft: ProjectDraft) => void }} */
	let { onsubmit } = $props();

	let title = $state('');
	/** @type {Cluster} */
	let cluster = $state('personal');
	/** @type {Role} */
	let role = $state('colaborador');
	/** @type {Status} */
	let status = $state('activo');
	/** @type {string[]} */
	let stack = $state([]);
	let repo = $state('');
	let board = $state('');
	let cicd = $state('');

	let canCreate = $derived(title.trim().length > 0);

	/** @param {string} item */
	function toggleStack(item) {
		stack = stack.includes(item) ? stack.filter((s) => s !== item) : [...stack, item];
	}

	function submit() {
		onsubmit({ title: title.trim(), cluster, role, status, stack, links: { repo, board, cicd } });
	}
</script>

<Card padding="lg">
	<h1 class="title">Nuevo proyecto</h1>
	<p class="sub text-secondary">Registro manual: agregas el proyecto y su contexto poco a poco.</p>

	<Field label="Título" id="title">
		<Input id="title" bind:value={title} placeholder="Nombre del proyecto" />
	</Field>

	<Field label="Cluster">
		<div class="pills">
			<Pill label="Personal" color="#4fd1c5" selected={cluster === 'personal'} onclick={() => (cluster = 'personal')} />
			<Pill
				label="Trabajo formal"
				color="#e0935a"
				selected={cluster === 'trabajo'}
				onclick={() => (cluster = 'trabajo')}
			/>
		</div>
	</Field>

	{#if cluster === 'trabajo'}
		<Field label="Rol">
			<div class="pills">
				<Pill
					label="Colaborador"
					selected={role === 'colaborador'}
					onclick={() => (role = 'colaborador')}
				/>
				<Pill label="Director" selected={role === 'director'} onclick={() => (role = 'director')} />
			</div>
		</Field>
	{/if}

	<Field label="Estado">
		<div class="pills">
			<Pill label="Activo" color="#7cc58f" selected={status === 'activo'} onclick={() => (status = 'activo')} />
			<Pill label="Pausado" color="#8a8798" selected={status === 'pausado'} onclick={() => (status = 'pausado')} />
			<Pill
				label="Archivado"
				color="#6b6680"
				selected={status === 'archivado'}
				onclick={() => (status = 'archivado')}
			/>
		</div>
	</Field>

	<Field label="Stack">
		<div class="chips">
			{#each STACK_OPTIONS as s}
				<Chip label={s} selected={stack.includes(s)} onclick={() => toggleStack(s)} />
			{/each}
		</div>
	</Field>

	<Field label="Repo" id="repo">
		<Input id="repo" bind:value={repo} placeholder="https://github.com/..." />
	</Field>
	<Field label="Tablero" id="board">
		<Input id="board" bind:value={board} placeholder="Jira / Linear / Notion" />
	</Field>
	<Field label="CI/CD" id="cicd">
		<Input id="cicd" bind:value={cicd} placeholder="URL del pipeline" />
	</Field>

	<div class="actions">
		<Button href="/">Cancelar</Button>
		<Button variant="primary" disabled={!canCreate} onclick={submit}>Crear proyecto</Button>
	</div>
</Card>

<style>
	.title {
		margin: 0 0 6px;
		font-size: 22px;
		font-weight: 700;
	}
	.sub {
		margin: 0 0 24px;
		font-size: 14px;
	}
	.pills {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		margin-top: 24px;
	}
</style>
