<script>
	import { goto } from '$app/navigation';
	import { STACK_OPTIONS } from '#lib/domain/constants';
	import Pill from '#lib/components/Pill.svelte';
	import Chip from '#lib/components/Chip.svelte';

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
		<h1 class="title">Nuevo proyecto</h1>
		<p class="sub text-secondary">Registro manual: agregas el proyecto y su contexto poco a poco.</p>

		<div class="field">
			<label class="label" for="title">Título</label>
			<input id="title" class="input" bind:value={title} placeholder="Nombre del proyecto" />
		</div>

		<div class="field">
			<span class="label">Cluster</span>
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
		</div>

		{#if cluster === 'trabajo'}
			<div class="field">
				<span class="label">Rol</span>
				<div class="pills">
					<Pill
						label="Colaborador"
						selected={role === 'colaborador'}
						onclick={() => (role = 'colaborador')}
					/>
					<Pill label="Director" selected={role === 'director'} onclick={() => (role = 'director')} />
				</div>
			</div>
		{/if}

		<div class="field">
			<span class="label">Estado</span>
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
		</div>

		<div class="field">
			<span class="label">Stack</span>
			<div class="chips">
				{#each STACK_OPTIONS as s}
					<Chip label={s} selected={stack.includes(s)} onclick={() => toggleStack(s)} />
				{/each}
			</div>
		</div>

		<div class="field">
			<label class="label" for="repo">Repo</label>
			<input id="repo" class="input" bind:value={repo} placeholder="https://github.com/..." />
		</div>
		<div class="field">
			<label class="label" for="board">Tablero</label>
			<input id="board" class="input" bind:value={board} placeholder="Jira / Linear / Notion" />
		</div>
		<div class="field">
			<label class="label" for="cicd">CI/CD</label>
			<input id="cicd" class="input" bind:value={cicd} placeholder="URL del pipeline" />
		</div>

		<div class="actions">
			<a class="btn btn-ghost" href="/">Cancelar</a>
			<button class="btn btn-primary" disabled={!canCreate} onclick={() => goto('/')}>Crear proyecto</button>
		</div>
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
		background: var(--bg-panel);
		border: 1px solid var(--border-panel);
		border-radius: var(--radius-lg);
		padding: 32px;
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
