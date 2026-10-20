<script>
	import Card from '../../ui/Card.svelte';
	import Checkbox from '../../ui/Checkbox.svelte';
	import EmptyState from '../../ui/EmptyState.svelte';

	/** @typedef {import('#lib/domain/types.js').Dependency} Dependency */
	/** @typedef {import('#lib/domain/types.js').ChecklistItem} ChecklistItem */

	/** @type {{ dependencies: Dependency[], checklist: ChecklistItem[], ontoggle: (id: string, done: boolean) => void }} */
	let { dependencies, checklist, ontoggle } = $props();

	let doneCount = $derived(checklist.filter((c) => c.done).length);
</script>

<div class="deploy-tab">
	<Card>
		<h2 class="card-title">Dependencias críticas</h2>
		{#each dependencies as dep (dep.id)}
			<div class="dep">
				<div class="dep-head">
					<span class="dep-name">{dep.name}</span>
					<span class="mono dep-version">{dep.version}</span>
				</div>
				<p class="dep-reason">{dep.reason}</p>
			</div>
		{:else}
			<EmptyState>Sin dependencias críticas registradas.</EmptyState>
		{/each}
	</Card>

	<Card>
		<div class="deploy-card-head">
			<h2 class="card-title">Checklist de deploy</h2>
			<span class="muted">{doneCount} de {checklist.length} listos</span>
		</div>
		{#each checklist as c (c.id)}
			<div class="check-item">
				<Checkbox checked={c.done} strike onchange={(v) => ontoggle(c.id, v)}>{c.text}</Checkbox>
			</div>
		{:else}
			<EmptyState>Sin checklist registrado.</EmptyState>
		{/each}
	</Card>
</div>

<style>
	.deploy-tab {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		align-items: start;
	}
	.card-title {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
	}
	.deploy-card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 14px;
	}
	.dep {
		padding: 12px 0;
		border-bottom: 1px solid var(--border-panel);
	}
	.dep:last-child {
		border-bottom: none;
	}
	.dep-head {
		display: flex;
		align-items: baseline;
		gap: 10px;
	}
	.dep-name {
		font-size: 14px;
		font-weight: 600;
	}
	.dep-version {
		font-size: 12.5px;
		color: var(--accent-personal);
	}
	.dep-reason {
		margin: 4px 0 0;
		font-size: 13px;
		line-height: 1.5;
		color: var(--text-secondary);
	}
	.check-item {
		padding: 9px 0;
	}
	@media (max-width: 760px) {
		.deploy-tab {
			grid-template-columns: 1fr;
		}
	}
</style>
