<script>
	import { goto } from '$app/navigation';
	import { STACK_OPTIONS } from '#lib/domain/constants';
	import Card from '#lib/components/ui/Card.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Input from '#lib/components/ui/Input.svelte';
	import Pill from '#lib/components/ui/Pill.svelte';
	import Chip from '#lib/components/ui/Chip.svelte';

	let title = $state('');
	let cluster = $state('personal');
	let role = $state('colaborador');
	let status = $state('activo');
	let stack = $state([]);
	let repo = $state('');
	let board = $state('');
	let cicd = $state('');

	let canCreate = $derived(title.trim().length > 0);

	function toggleStack(item) {
		stack = stack.includes(item) ? stack.filter((s) => s !== item) : [...stack, item];
	}
</script>

<div class="page flat-bg new-page">
	<div class="new-card">
		<Card padding="lg">
			<h1 class="title">Nuevo proyecto</h1>
			<p class="sub text-secondary">Registro manual: agregas el proyecto y su contexto poco a poco.</p>

			<Field label="Título" id="title">
				<Input id="title" bind:value={title} placeholder="Nombre del proyecto" />
			</Field>

			<Field label="Cluster">
				<div class="pills">
					<Pill
						label="Personal"
						color="#4fd1c5"
						selected={cluster === 'personal'}
						onclick={() => (cluster = 'personal')}
					/>
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
					<Pill
						label="Pausado"
						color="#8a8798"
						selected={status === 'pausado'}
						onclick={() => (status = 'pausado')}
					/>
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
				<Button variant="primary" disabled={!canCreate} onclick={() => goto('/')}>
					Crear proyecto
				</Button>
			</div>
		</Card>
	</div>
</div>

<style>
	.new-page {
		align-items: center;
		padding: 48px 24px;
	}
	.new-card {
		width: 100%;
		max-width: 560px;
	}
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
